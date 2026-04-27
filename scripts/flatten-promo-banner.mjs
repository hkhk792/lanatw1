/**
 * 將橫幅 PNG 壓平到與 index.css --background 相近的底色（hsl 0 0% 2% → rgb ~5,5,5），
 * 去除透明／抗鋸齒造成的四角白邊。
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const targets = [
  path.join(root, "src/assets/huan-promo-banner.png"),
  path.join(root, "public/huan-promo-banner.png"),
];

const BG = { r: 5, g: 5, b: 5 };

async function flattenOne(absPath) {
  if (!fs.existsSync(absPath)) {
    console.warn("skip (missing):", absPath);
    return;
  }
  const tmp = absPath + ".tmp.png";
  await sharp(absPath)
    .ensureAlpha()
    .flatten({ background: BG })
    .png({ compressionLevel: 9 })
    .toFile(tmp);
  fs.renameSync(tmp, absPath);
  console.log("flattened:", path.relative(root, absPath));
}

for (const p of targets) {
  await flattenOne(p);
}
