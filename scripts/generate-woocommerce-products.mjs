import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "exports", "woocommerce-products-real-images.csv");
const STOCK_FIX_OUT = path.join(ROOT, "exports", "woocommerce-stock-fix.csv");
const LEGACY_OUT = path.join(ROOT, "exports", "woocommerce-products-variable.csv");
const DESKTOP_OUT = path.join(process.env.USERPROFILE ?? "", "Desktop", "woocommerce-real-images.csv");
const DESKTOP_STOCK_FIX_OUT = path.join(process.env.USERPROFILE ?? "", "Desktop", "woocommerce-stock-fix.csv");
const PRODUCT_PHOTOS_DIR = path.join(ROOT, "public", "product-photos");
const IMAGE_BASE_URL = "https://sp2s.cfd/wp-content/uploads/2026/05/";

const HEADERS = [
  "Type",
  "SKU",
  "Name",
  "Published",
  "Is featured?",
  "Visibility in catalog",
  "Regular price",
  "In stock?",
  "Stock status",
  "Manage stock?",
  "Stock",
  "Backorders allowed?",
  "Attribute 1 name",
  "Attribute 1 value(s)",
  "Attribute 1 default",
  "Attribute 1 visible",
  "Attribute 1 global",
  "Attribute 1 variation",
  "Images",
  "Parent",
  "Short description",
];

const STOCK_FIX_HEADERS = [
  "Type",
  "SKU",
  "Name",
  "Published",
  "In stock?",
  "Stock",
  "Backorders allowed?",
  "Parent",
];

const COD_DESCRIPTION =
  "台灣現貨，支援貨到付款；下單前可透過 LINE ID 聯繫確認口味、規格與庫存。";

const TRADITIONAL_MAP = new Map(
  Object.entries({
    凉: "涼",
    净: "淨",
    冻: "凍",
    冲: "衝",
    划: "劃",
    卫: "衛",
    压: "壓",
    号: "號",
    咸: "鹹",
    啤: "啤",
    园: "園",
    坚: "堅",
    奶: "奶",
    宝: "寶",
    广: "廣",
    弹: "彈",
    彩: "彩",
    復: "複",
    极: "極",
    标: "標",
    欢: "歡",
    气: "氣",
    没: "沒",
    泉: "泉",
    润: "潤",
    炼: "煉",
    烟: "煙",
    盐: "鹽",
    绿: "綠",
    芦: "蘆",
    苹: "蘋",
    荣: "榮",
    蓝: "藍",
    蔷: "薔",
    货: "貨",
    软: "軟",
    过: "過",
    选: "選",
    酿: "釀",
    链: "鍊",
    铁: "鐵",
    香: "香",
  }),
);

function file(rel) {
  return path.join(ROOT, rel);
}

function read(rel) {
  return fs.readFileSync(file(rel), "utf8");
}

function toTraditional(value) {
  return String(value)
    .split("")
    .map((ch) => TRADITIONAL_MAP.get(ch) ?? ch)
    .join("");
}

function cleanFlavor(value) {
  return toTraditional(value)
    .replace(/^[\s\-–—_]+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function unique(values) {
  const seen = new Set();
  const out = [];
  for (const value of values.map(cleanFlavor).filter(Boolean)) {
    if (seen.has(value)) continue;
    seen.add(value);
    out.push(value);
  }
  return out;
}

function parseStrings(block) {
  return [...block.matchAll(/"((?:\\"|[^"])*)"/g)].map((m) => m[1].replace(/\\"/g, '"'));
}

function extractConstStrings(content, constName) {
  const match = content.match(new RegExp(`const\\s+${constName}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*(?:as const)?;`));
  return match ? unique(parseStrings(match[1])) : [];
}

function extractOptionGroups(content, groupKey = "options") {
  const values = [];
  const regex = new RegExp(`${groupKey}:\\s*\\[([\\s\\S]*?)\\]`, "g");
  for (const match of content.matchAll(regex)) {
    values.push(...parseStrings(match[1]));
  }
  return unique(values);
}

function extractNamedOptions(content) {
  return unique([...content.matchAll(/name:\s*"([^"]+)"/g)].map((m) => m[1]));
}

function extractPinkyCatalog() {
  const catalog = read("src/data/pinkyImportedCatalog.ts");
  const details = read("src/data/pinkyImportedCloudwaysDetails.generated.ts");

  const products = [...catalog.matchAll(/\{\s*id:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*category:\s*"([^"]+)"/g)].map(
    ([, id, title, category]) => ({
      id,
      sku: id,
      name: toTraditional(title),
      price: category === "拋棄式／大口數系列" ? 269 : 299,
      image: `${id}.jpg`,
      flavors: [],
    }),
  );

  const detailById = new Map();
  for (const match of details.matchAll(/"([^"]+)":\s*\{\s*flavors:\s*\[([\s\S]*?)\]\s*\}/g)) {
    detailById.set(match[1], unique(parseStrings(match[2])));
  }

  return products.map((product) => ({
    ...product,
    flavors: detailById.get(product.id) ?? ["標準款"],
  }));
}

function localProducts() {
  const page = (rel) => read(`src/pages/${rel}`);
  const sp2sUniversal = read("src/data/sp2sUniversalPods.ts");

  return [
    {
      sku: "sp2s-universal-pods",
      name: "SP2S 煙彈（一代通用）",
      price: 280,
      image: "sp2s-pod-hero.png",
      flavors: unique([...sp2sUniversal.matchAll(/name:\s*"([^"]+)"/g)].map((m) => m[1])),
      variantImage(flavor, index) {
        return `sp2s-pod-${String(index + 1).padStart(2, "0")}.webp`;
      },
    },
    {
      sku: "cartoon",
      name: "卡通限量版一代通配主機 多種配色可選",
      price: 550,
      image: "product-12.webp",
      flavors: extractConstStrings(page("ProductDetail.tsx"), "flavorOptions"),
      variantImages: {
        "多拉 A 夢": "wps1.webp",
        "航海王魯夫 - 藍": "16.webp",
        火影忍者卡卡西: "kakashi-main.webp",
        "航海王索隆 - 綠": "zoro-green-main.webp",
        庫洛米: "kuromi-main.webp",
        "KT 貓": "kt-main.webp",
        蠟筆小新: "product-12.webp",
      },
    },
    {
      sku: "bullet",
      name: "SP2S 一代通用主機 sp2s 電子煙主機",
      price: 450,
      image: "product-3.webp",
      flavors: extractNamedOptions(page("BulletDetail.tsx")),
    },
    {
      sku: "pro",
      name: "SP2S Pro 二代旗艦霧化主機 智慧感應 · LED 炫彩",
      price: 450,
      image: "product-4.webp",
      flavors: extractNamedOptions(page("Sp2sProDetail.tsx")),
    },
    {
      sku: "atomizer",
      name: "原子棒一代通配主機 可調功率 · 曲線輸出",
      price: 290,
      image: "atomizer-host-gemini.webp",
      flavors: extractNamedOptions(page("AtomizerDetail.tsx")),
    },
    {
      sku: "lanna",
      name: "lana皮革主機一代通配 多種配色可選",
      price: 500,
      image: "lana-premium-device.webp",
      flavors: extractConstStrings(page("LannaDetail.tsx"), "variantOptions"),
    },
    {
      sku: "diya",
      name: "DIYA 叮啞霧化桿：2.5ML 大容量兼容／一代通用",
      price: 320,
      image: "product-6.webp",
      flavors: extractNamedOptions(page("DiyaDetail.tsx")),
    },
    {
      sku: "sp2s-gen1-pods",
      name: "SP2S 一代通用煙彈",
      price: 290,
      image: "sp2s-gen1-pods-catalog.webp",
      flavors: extractConstStrings(page("Sp2sGen1PodsDetail.tsx"), "FLAVOR_NAMES"),
    },
    {
      sku: "lana-pods",
      name: "lana煙彈 3 顆裝（一代通配主機）",
      price: 220,
      image: "product-7.webp",
      flavors: extractConstStrings(page("LanaPodsDetail.tsx"), "FLAVOR_NAMES"),
    },
    {
      sku: "diya-pods",
      name: "DIYA 叮啞電子煙彈一盒三入 通用一代主機",
      price: 199,
      image: "diya-pods-showcase.webp",
      flavors: extractConstStrings(page("DiyaPodsDetail.tsx"), "FLAVOR_NAMES"),
    },
    {
      sku: "vstorm-gen5-pods",
      name: "Vapor Storm 風暴五代煙彈（五代主機通用）",
      price: 129,
      image: "showcase-gen5-pods.webp",
      flavors: extractOptionGroups(page("VaporStormGen5PodsDetail.tsx")),
    },
    {
      sku: "lana-e-liquid-30ml",
      name: "拉娜 LANA 煙油小瓶裝（30ml）",
      price: 350,
      image: "showcase-e-liquid.webp",
      flavors: extractOptionGroups(page("LanaEliquid30mlDetail.tsx")),
    },
    {
      sku: "venus-host",
      name: "VENUS金星主機可充電霧化電子煙主機（台灣現貨）",
      price: 219,
      image: "disposable-vapengin-venus.webp",
      flavors: extractOptionGroups(page("VenusHostDetail.tsx")),
    },
    {
      sku: "mohoo-tokyo-box",
      name: "TOKYO MOHOO BOX 東京魔盒煙彈（多種口味台灣現貨）",
      price: 399,
      image: "disposable-mohoo-tokyo.webp",
      flavors: extractOptionGroups(page("MohooTokyoBoxDetail.tsx")),
    },
    {
      sku: "jupiter-6500-set",
      name: "JUPITER 木星套裝 6500 口（換彈拋棄式電子煙，台灣現貨）",
      price: 480,
      image: "disposable-flare-nimmbox-go.webp",
      flavors: extractOptionGroups(page("Jupiter6500SetDetail.tsx")),
    },
    {
      sku: "vapor-storm-5000",
      name: "VAPOR STORM 風暴 5000 口拋棄式飛霧發光一次性電子煙桿",
      price: 229,
      image: "disposable-vapor-storm-cf5000.webp",
      flavors: extractOptionGroups(page("VaporStorm5000Detail.tsx")),
    },
    {
      sku: "hebat-gen6",
      name: "HEBAT 喜貝六代 10000 口拋棄式一次性電子煙（15ml 台灣現貨）",
      price: 269,
      image: "disposable-hebat-hb10000.webp",
      flavors: extractOptionGroups(page("HebatGen6Detail.tsx")),
    },
    {
      sku: "diya-7500",
      name: "DIYA 叮啞拋棄式 7500 口大容量可充電一次性電子煙",
      price: 209,
      image: "disposable-diya-7500.webp",
      flavors: extractOptionGroups(page("Diya7500DisposableDetail.tsx")),
    },
    {
      sku: "sp2s-silicone-sleeve",
      name: "電子煙配件 思博瑞 SP2S 主機矽膠保護套（多色可選）",
      price: 120,
      image: "showcase-vape-gear.webp",
      flavors: extractOptionGroups(page("Sp2sSiliconeSleeveDetail.tsx")),
    },
    {
      sku: "sp2s-empty-shell-standard",
      name: "SP2／SP2S 一代空殼（一般版白芯）正版空殼 · 參考灌滿 2.3ml",
      price: 35,
      image: "standard-white-core.png",
      flavors: ["空殼單規格"],
    },
    {
      sku: "sp2s-empty-shell-pro",
      name: "SP2S 一代空殼（Pro 版盒裝殼）正版空殼 · 參考灌滿 2.3ml",
      price: 35,
      image: "pro-shell.png",
      flavors: ["空殼單規格"],
    },
  ];
}

const actualPhotoFiles = new Set(
  fs
    .readdirSync(PRODUCT_PHOTOS_DIR)
    .filter((name) => /\.(?:jpe?g|png|webp)$/i.test(name)),
);

function assertPhotoExists(filename, productSku) {
  if (!actualPhotoFiles.has(filename)) {
    throw new Error(`Missing image for ${productSku}: public/product-photos/${filename}`);
  }
  return filename;
}

function imageUrl(filename) {
  assertPhotoExists(filename, filename);
  return `${IMAGE_BASE_URL}${encodeURIComponent(filename)}`;
}

function productImage(product) {
  return imageUrl(assertPhotoExists(product.image, product.sku));
}

function variationImage(product, flavor, index) {
  const filename =
    product.variantImage?.(flavor, index) ??
    product.variantImages?.[flavor] ??
    product.image;

  return imageUrl(assertPhotoExists(filename, `${product.sku} / ${flavor}`));
}

function csvValue(value) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function row(values) {
  return HEADERS.map((header) => csvValue(values[header])).join(",");
}

function variationSku(parentSku, index) {
  return `${parentSku}-${String(index + 1).padStart(3, "0")}`;
}

function buildRows(products) {
  const rows = [HEADERS.join(",")];
  for (const product of products) {
    const name = toTraditional(product.name);
    const flavors = unique(product.flavors.length ? product.flavors : ["標準款"]);
    rows.push(
      row({
        Type: "variable",
        SKU: product.sku,
        Name: name,
        Published: 1,
        "Is featured?": 0,
        "Visibility in catalog": "visible",
        "Regular price": "",
        "In stock?": 1,
        "Stock status": "instock",
        "Manage stock?": 0,
        Stock: 999,
        "Backorders allowed?": 0,
        "Attribute 1 name": "口味",
        "Attribute 1 value(s)": flavors.join(", "),
        "Attribute 1 default": flavors[0],
        "Attribute 1 visible": 1,
        "Attribute 1 global": 0,
        "Attribute 1 variation": 1,
        Images: productImage(product),
        Parent: "",
        "Short description": COD_DESCRIPTION,
      }),
    );

    flavors.forEach((flavor, index) => {
      rows.push(
        row({
          Type: "variation",
          SKU: variationSku(product.sku, index),
          Name: `${name} - ${flavor}`,
          Published: 1,
          "Is featured?": 0,
          "Visibility in catalog": "visible",
          "Regular price": product.price,
          "In stock?": 1,
          "Stock status": "instock",
          "Manage stock?": 0,
          Stock: 999,
          "Backorders allowed?": 0,
          "Attribute 1 name": "口味",
          "Attribute 1 value(s)": flavor,
          "Attribute 1 default": "",
          "Attribute 1 visible": 1,
          "Attribute 1 global": 0,
          "Attribute 1 variation": 1,
          Images: variationImage(product, flavor, index),
          Parent: product.sku,
          "Short description": COD_DESCRIPTION,
        }),
      );
    });
  }
  return rows;
}

function buildStockFixRows(products) {
  const rows = [STOCK_FIX_HEADERS.join(",")];
  for (const product of products) {
    const name = toTraditional(product.name);
    const flavors = unique(product.flavors.length ? product.flavors : ["標準款"]);
    rows.push(
      STOCK_FIX_HEADERS.map((header) =>
        csvValue(
          {
            Type: "variable",
            SKU: product.sku,
            Name: name,
            Published: 1,
            "In stock?": 1,
            Stock: 999,
            "Backorders allowed?": 0,
            Parent: "",
          }[header],
        ),
      ).join(","),
    );

    flavors.forEach((flavor, index) => {
      rows.push(
        STOCK_FIX_HEADERS.map((header) =>
          csvValue(
            {
              Type: "variation",
              SKU: variationSku(product.sku, index),
              Name: `${name} - ${flavor}`,
              Published: 1,
              "In stock?": 1,
              Stock: 999,
              "Backorders allowed?": 0,
              Parent: product.sku,
            }[header],
          ),
        ).join(","),
      );
    });
  }
  return rows;
}

const products = [...extractPinkyCatalog(), ...localProducts()];
const rows = buildRows(products);
const stockFixRows = buildStockFixRows(products);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, `\uFEFF${rows.join("\n")}\n`, "utf8");
fs.writeFileSync(STOCK_FIX_OUT, `\uFEFF${stockFixRows.join("\n")}\n`, "utf8");
let legacyUpdated = false;
let desktopUpdated = false;
let desktopStockFixUpdated = false;
try {
  fs.copyFileSync(OUT, LEGACY_OUT);
  legacyUpdated = true;
} catch (error) {
  console.warn(`Skip updating locked file ${path.relative(ROOT, LEGACY_OUT)}: ${error.code ?? error.message}`);
}
if (process.env.USERPROFILE) {
  try {
    fs.copyFileSync(OUT, DESKTOP_OUT);
    desktopUpdated = true;
    fs.copyFileSync(STOCK_FIX_OUT, DESKTOP_STOCK_FIX_OUT);
    desktopStockFixUpdated = true;
  } catch (error) {
    console.warn(`Skip writing Desktop copy: ${error.code ?? error.message}`);
  }
}

const variationCount = products.reduce((sum, product) => sum + unique(product.flavors).length, 0);
console.log(`Wrote ${path.relative(ROOT, OUT)}`);
console.log(`Wrote ${path.relative(ROOT, STOCK_FIX_OUT)}`);
if (legacyUpdated) console.log(`Also updated ${path.relative(ROOT, LEGACY_OUT)}`);
if (desktopUpdated) console.log(`Also wrote ${DESKTOP_OUT}`);
if (desktopStockFixUpdated) console.log(`Also wrote ${DESKTOP_STOCK_FIX_OUT}`);
console.log(`Products: ${products.length}`);
console.log(`Variations: ${variationCount}`);
console.log(`Rows including header: ${rows.length}`);
