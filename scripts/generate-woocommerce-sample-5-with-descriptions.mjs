import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SOURCE = path.join(
  process.env.USERPROFILE ?? "",
  "Desktop",
  "woocommerce-real-images.csv",
);
const OUT_EXPORTS = path.join(ROOT, "exports", "woocommerce-sample-5-full.csv");
const OUT_DESKTOP = path.join(
  process.env.USERPROFILE ?? "",
  "Desktop",
  "woocommerce-product-descriptions-5.csv",
);

const COD =
  "台灣現貨，支援貨到付款；下單前可透過 LINE ID 聯繫確認口味、規格與庫存。";

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
        continue;
      }
      if (c === '"') {
        quoted = false;
        continue;
      }
      cell += c;
      continue;
    }
    if (c === '"') {
      quoted = true;
      continue;
    }
    if (c === ",") {
      row.push(cell);
      cell = "";
      continue;
    }
    if (c === "\n" || (c === "\r" && text[i + 1] === "\n")) {
      if (c === "\r") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    if (c === "\r") continue;
    cell += c;
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function rowToCsv(headers, values) {
  return headers.map((h) => csvEscape(values[h] ?? "")).join(",");
}

function buildDescription(name, sku, flavors, typeHint) {
  const flavorSample = flavors
    .slice(0, 8)
    .join("、");
  const flavorMore =
    flavors.length > 8 ? `等共 ${flavors.length} 款` : "";
  const flavorLine = flavors.length
    ? `<p><strong>可選規格</strong>：${flavorSample}${flavorMore}（請於下單頁「口味」下拉選擇）。</p>`
    : "";

  return `<h2>${name}</h2>
<p>台灣現貨發貨。${typeHint}</p>
${flavorLine}
<ul>
<li>商品編號 SKU：${sku}</li>
<li>配送：台灣本島，支援<strong>貨到付款</strong></li>
<li>客服：下單前可透過 <strong>LINE ID</strong> 確認口味／配色與庫存</li>
</ul>
<p>${COD}</p>
<p>※ 未滿 18 歲請勿購買；請依當地法規使用電子煙相關產品。</p>`;
}

function typeHintFromName(name) {
  if (/拋棄|一次性|\d+口/.test(name))
    return "大口數一次性拋棄式，開箱即用，口味請在規格中選擇。";
  if (/主機|Host|host/i.test(name))
    return "可充電霧化主機（菸彈／煙彈通常需另購），請依相容型號選購。";
  if (/菸彈|煙彈|烟弹|POD|pod/i.test(name))
    return "替換式菸彈，請搭配相容主機使用，單顆或多顆裝依規格為準。";
  if (/空殼/.test(name)) return "一代空殼，可自行灌油使用，請依說明操作。";
  if (/保護套|配件|矽膠/.test(name)) return "主機保護配件，多色可選。";
  if (/煙油/.test(name)) return "瓶裝煙油，請依尼古丁濃度與口味選擇。";
  return "電子煙相關商品，規格與口味請於下單頁選擇。";
}

const sourcePath = fs.existsSync(SOURCE)
  ? SOURCE
  : path.join(ROOT, "exports", "woocommerce-products-real-images.csv");

const parsed = parseCsv(fs.readFileSync(sourcePath, "utf8").replace(/^\uFEFF/, ""));
const headers = parsed[0];
const idx = Object.fromEntries(headers.map((h, i) => [h, i]));

const products = new Map();
for (const r of parsed.slice(1)) {
  const type = r[idx.Type];
  const sku = r[idx.SKU];
  if (type === "variable") {
    products.set(sku, { variable: r, variations: [], flavors: [] });
  }
}
for (const r of parsed.slice(1)) {
  if (r[idx.Type] !== "variation") continue;
  const parent = r[idx.Parent];
  const bucket = products.get(parent);
  if (!bucket) continue;
  bucket.variations.push(r);
  const flavor = r[idx["Attribute 1 value(s)"]];
  if (flavor) bucket.flavors.push(flavor);
}

const allSkus = [...products.keys()];
// 固定種子洗牌，方便你重跑結果一致；若要真隨機可改 Date.now()
let seed = 20260516;
function rand() {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
}
const shuffled = [...allSkus].sort(() => rand() - 0.5);
const picked = shuffled.slice(0, 5);

const outHeaders = [...headers];
const descIdx = outHeaders.indexOf("Description");
if (descIdx === -1) {
  const shortIdx = outHeaders.indexOf("Short description");
  outHeaders.splice(shortIdx >= 0 ? shortIdx : outHeaders.length, 0, "Description");
}

const outRows = [outHeaders.join(",")];

for (const sku of picked) {
  const { variable, variations, flavors } = products.get(sku);
  const name = variable[idx.Name];
  const desc = buildDescription(name, sku, flavors, typeHintFromName(name));

  const varObj = Object.fromEntries(headers.map((h, i) => [h, variable[i] ?? ""]));
  varObj.Description = desc;
  outRows.push(rowToCsv(outHeaders, varObj));

  for (const v of variations) {
    const vObj = Object.fromEntries(headers.map((h, i) => [h, v[i] ?? ""]));
    vObj.Description = "";
    outRows.push(rowToCsv(outHeaders, vObj));
  }
}

const body = `\uFEFF${outRows.join("\n")}\n`;
fs.mkdirSync(path.dirname(OUT_EXPORTS), { recursive: true });
fs.writeFileSync(OUT_EXPORTS, body, "utf8");

let desktopOk = false;
try {
  fs.writeFileSync(OUT_DESKTOP, body, "utf8");
  desktopOk = true;
} catch (e) {
  console.warn(`Desktop write failed: ${e.message}`);
}

console.log(`Source: ${sourcePath}`);
console.log(`Picked 5 SKUs: ${picked.join(", ")}`);
console.log(`Wrote ${OUT_EXPORTS}`);
if (desktopOk) console.log(`Wrote ${OUT_DESKTOP}`);
console.log(`Total rows (incl. header): ${outRows.length}`);
