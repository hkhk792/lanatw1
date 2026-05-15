/**
 * 將站內商品相關圖檔打包成單一 ZIP（exports/product-photos-export.zip）。
 * 含：public/pinky-imported、sp2s-universal-pods、sp2s-empty-shells、promo 買五送一；
 *     src/assets 中排除門市／文章等非商品圖示與橫幅。
 */
import fs, { createWriteStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ZipArchive } from "archiver";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "exports");
const outZip = path.join(outDir, "product-photos-export.zip");

/** 首頁／門市／文章等，非商品主圖 */
const ASSET_DENY = new Set([
  "airport-vape-article-hero.webp",
  "diy-liquid-mixing-workbench-hero.webp",
  "huan-icon-711.webp",
  "huan-icon-store.webp",
  "huan-icon-support.webp",
  "huan-icon-truck.webp",
  "huan-promo-banner.webp",
  "huan-taiwan-vape-banner.webp",
  "huan-taiwan-vape-banner.r640.webp",
  "line-welcome-gate.webp",
]);

function countFilesInDir(dir) {
  if (!fs.existsSync(dir)) return 0;
  let n = 0;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) n += countFilesInDir(full);
    else n += 1;
  }
  return n;
}

const pinkyDir = path.join(root, "public", "pinky-imported");
const podsDir = path.join(root, "public", "sp2s-universal-pods");
const shellsDir = path.join(root, "public", "sp2s-empty-shells");
const promoFile = path.join(root, "public", "promo", "entry-buy5-splash.png");
const assetsDir = path.join(root, "src", "assets");

let assetCount = 0;
for (const name of fs.readdirSync(assetsDir)) {
  if (!/\.(webp|png|jpe?g)$/i.test(name)) continue;
  if (ASSET_DENY.has(name)) continue;
  assetCount += 1;
}

const promoCount = fs.existsSync(promoFile) ? 1 : 0;
const total =
  countFilesInDir(pinkyDir) +
  countFilesInDir(podsDir) +
  countFilesInDir(shellsDir) +
  promoCount +
  assetCount;

fs.mkdirSync(outDir, { recursive: true });
if (fs.existsSync(outZip)) fs.unlinkSync(outZip);

const output = createWriteStream(outZip);
const archive = new ZipArchive({ zlib: { level: 6 } });

await new Promise((resolve, reject) => {
  output.on("close", resolve);
  archive.on("error", reject);
  archive.pipe(output);

  if (fs.existsSync(pinkyDir)) archive.directory(pinkyDir, "pinky-imported");
  else console.warn("skip missing: public/pinky-imported");

  if (fs.existsSync(podsDir)) archive.directory(podsDir, "sp2s-universal-pods");
  else console.warn("skip missing: public/sp2s-universal-pods");

  if (fs.existsSync(shellsDir)) archive.directory(shellsDir, "sp2s-empty-shells");
  else console.warn("skip missing: public/sp2s-empty-shells");

  if (fs.existsSync(promoFile)) {
    archive.file(promoFile, { name: "promo/entry-buy5-splash.png" });
  }

  for (const name of fs.readdirSync(assetsDir)) {
    if (!/\.(webp|png|jpe?g)$/i.test(name)) continue;
    if (ASSET_DENY.has(name)) continue;
    archive.file(path.join(assetsDir, name), { name: `src-assets/${name}` });
  }

  archive.finalize();
});

console.log(`Wrote ${outZip} (${total} files).`);
