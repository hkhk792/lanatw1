/**
 * Reads WooCommerce-style `cloudways_products_export.csv` from repo root
 * and writes `src/data/pinkyImportedCloudwaysDetails.generated.ts`.
 *
 * Run: npm run gen:pinky-cloudways
 * Optional: CLOUDWAYS_CSV=/path/to/file.csv
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "src", "data", "pinkyImportedCatalog.ts");
const OUT_PATH = path.join(ROOT, "src", "data", "pinkyImportedCloudwaysDetails.generated.ts");
const DEFAULT_CSV = path.join(ROOT, "cloudways_products_export.csv");

function parseCatalogItems(ts) {
  const items = [];
  const re = /id:\s*"([^"]+)",\s*title:\s*"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(ts)) !== null) {
    const title = m[2].replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    items.push({ id: m[1], title });
  }
  if (!items.length) throw new Error("Could not parse any catalog items from pinkyImportedCatalog.ts");
  return items;
}

/** RFC4180-ish CSV row parser */
function parseCsvRows(text) {
  const rows = [];
  let row = [];
  let field = "";
  let i = 0;
  let inQuotes = false;
  const s = text.replace(/^\uFEFF/, "");
  while (i < s.length) {
    const ch = s[i];
    if (inQuotes) {
      if (ch === '"') {
        if (s[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += ch;
      i++;
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (ch === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (ch === "\r") {
      i++;
      continue;
    }
    if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
      continue;
    }
    field += ch;
    i++;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function norm(s) {
  return String(s ?? "")
    .replace(/\uFEFF/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function headerIndex(headers) {
  const map = new Map();
  headers.forEach((h, idx) => {
    map.set(norm(h), idx);
  });
  return map;
}

function colIdx(map, candidates) {
  for (const c of candidates) {
    const key = norm(c);
    if (map.has(key)) return map.get(key);
  }
  for (const [k, v] of map.entries()) {
    for (const c of candidates) {
      if (k.includes(norm(c))) return v;
    }
  }
  return -1;
}

function collectMetaFlavorValues(rowObj) {
  const vals = [];
  for (const k of Object.keys(rowObj)) {
    const kl = k.toLowerCase();
    if (!kl.startsWith("meta:")) continue;
    if (!/口味|flavor|variant|顏色|颜色|規格|规格/.test(kl) && !/pa_/.test(kl)) continue;
    const raw = rowObj[k];
    if (!raw) continue;
    String(raw)
      .split(/[,，|｜\/、]/)
      .map((x) => x.trim())
      .filter(Boolean)
      .forEach((x) => vals.push(x));
  }
  return vals;
}

function collectAttributeFlavorValues(rowObj, headersLower) {
  const vals = [];
  for (const h of headersLower.keys()) {
    if (!/attribute\s*\d+\s*value/.test(h)) continue;
    const raw = rowObj[h];
    if (!raw) continue;
    String(raw)
      .split(/[,，|｜\/、]/)
      .map((x) => x.trim())
      .filter(Boolean)
      .forEach((x) => vals.push(x));
  }
  return vals;
}

function splitFlavorBlob(text) {
  if (!text) return [];
  const t = String(text)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return t
    .split(/[,，、|｜\/\n\r]+/)
    .map((x) => x.replace(/^[\-\*•\d\.\s]+/, "").trim())
    .filter((x) => x.length >= 1 && x.length <= 40);
}

function catalogMatchesRow(catalogTitle, productName, categories, variationName = "") {
  const t = norm(catalogTitle).replace(/\s+/g, "");
  const p = norm(productName).replace(/\s+/g, "");
  const c = norm(categories).replace(/\s+/g, "");
  const v = norm(variationName).replace(/\s+/g, "");
  const bundle = `${p}${c}${v}`;
  if (!t || !bundle) return false;
  if (bundle.includes(t)) return true;
  if (p.length >= 4 && t.includes(p)) return true;
  if (v.length >= 4 && t.includes(v)) return true;
  const stripPromo = norm(catalogTitle)
    .replace(/\s+/g, "")
    .replace(/買\d+送[^，。\s]*/g, "")
    .replace(/加價\d+元送[^，。\s]*/g, "")
    .trim();
  if (stripPromo.length >= 4 && bundle.includes(stripPromo.replace(/\s+/g, ""))) return true;
  return false;
}

function main() {
  const catalogSrc = fs.readFileSync(CATALOG_PATH, "utf8");
  const catalogItems = parseCatalogItems(catalogSrc);
  const byId = Object.fromEntries(catalogItems.map((it) => [it.id, { flavors: [] }]));

  const csvPath = process.env.CLOUDWAYS_CSV || DEFAULT_CSV;
  if (!fs.existsSync(csvPath)) {
    console.warn(`[gen-pinky-cloudways] CSV not found: ${csvPath}`);
    console.warn("Write cloudways_products_export.csv at repo root, then run: npm run gen:pinky-cloudways");
    writeOut(byId);
    return;
  }

  const csvText = fs.readFileSync(csvPath, "utf8");
  const rows = parseCsvRows(csvText);
  if (rows.length < 2) {
    console.warn("[gen-pinky-cloudways] CSV has no data rows.");
    writeOut(byId);
    return;
  }
  const headers = rows[0].map((h) => h.trim());
  const hMap = headerIndex(headers);
  const headersLower = new Map(headers.map((h) => [norm(h), h]));

  const idxType = colIdx(hMap, ["type"]);
  const idxName = colIdx(hMap, ["name", "post_title", "product name", "title", "名稱", "名称"]);
  const idxParent = colIdx(hMap, ["parent"]);
  const idxId = colIdx(hMap, ["id"]);
  const idxCats = colIdx(hMap, ["categories", "product categories"]);
  const idxShort = colIdx(hMap, ["short description", "summary"]);

  if (idxName < 0) {
    throw new Error("[gen-pinky-cloudways] CSV missing a Name/title column.");
  }

  const rowObjects = [];
  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r];
    const o = {};
    headers.forEach((h, i) => {
      o[norm(h)] = cells[i] ?? "";
    });
    rowObjects.push(o);
  }

  const idToRow = new Map();
  if (idxId >= 0) {
    const idHeaderKey = norm(headers[idxId]);
    for (const o of rowObjects) {
      const rawId = String(o[idHeaderKey] ?? "").trim();
      if (rawId) idToRow.set(rawId, o);
    }
  }

  const flavorBuckets = Object.fromEntries(catalogItems.map((it) => [it.id, new Set()]));

  for (const o of rowObjects) {
    const typeRaw = idxType >= 0 ? o[norm(headers[idxType])] : "";
    const type = norm(typeRaw);
    const name = o[norm(headers[idxName])] || "";
    const cats = idxCats >= 0 ? o[norm(headers[idxCats])] : "";
    const short = idxShort >= 0 ? o[norm(headers[idxShort])] : "";

    const flavorsFromAttrs = collectAttributeFlavorValues(o, headersLower);
    const flavorsFromMeta = collectMetaFlavorValues(o);
    const flavorsFromShort =
      type === "simple" || type === "variable" || type === "" ? splitFlavorBlob(short) : [];

    const parentId = idxParent >= 0 ? String(o[norm(headers[idxParent])] || "").trim() : "";
    let productLabel = name;
    if (type === "variation" && parentId && idToRow.has(parentId)) {
      const pr = idToRow.get(parentId);
      const pname = idxName >= 0 ? pr[norm(headers[idxName])] : "";
      if (pname) productLabel = pname;
    }

    const flavorCandidates = [...flavorsFromAttrs, ...flavorsFromMeta, ...flavorsFromShort];
    if (!flavorCandidates.length) continue;

    for (const { id, title } of catalogItems) {
      if (!catalogMatchesRow(title, productLabel, cats, type === "variation" ? name : "")) continue;
      flavorCandidates.forEach((f) => {
        const x = f.trim();
        if (x.length >= 1 && x.length <= 48) flavorBuckets[id].add(x);
      });
    }
  }

  for (const id of Object.keys(byId)) {
    byId[id].flavors = [...flavorBuckets[id]].sort((a, b) => a.localeCompare(b, "zh-Hant"));
  }

  writeOut(byId);
  console.log(`[gen-pinky-cloudways] Wrote ${OUT_PATH} (${csvPath})`);
}

function writeOut(byId) {
  const lines = Object.keys(byId).sort();
  const body = lines
    .map((id) => {
      const flavors = byId[id].flavors.map((f) => JSON.stringify(f)).join(", ");
      return `  ${JSON.stringify(id)}: { flavors: [${flavors}] }`;
    })
    .join(",\n");

  const ts = `// AUTO-GENERATED by scripts/gen-pinky-cloudways-details.mjs — do not edit by hand.
// Source: cloudways_products_export.csv (run \`npm run gen:pinky-cloudways\` after updating the CSV).

export type PinkyImportedCloudwaysDetail = {
  flavors: readonly string[];
};

export const pinkyImportedCloudwaysDetailsById: Record<string, PinkyImportedCloudwaysDetail> = {
${body}
};
`;
  fs.writeFileSync(OUT_PATH, ts, "utf8");
}

main();
