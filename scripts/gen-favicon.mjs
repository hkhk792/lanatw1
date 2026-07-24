import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");

function letterFromEnv() {
  const site = (process.env.VITE_SHOP_SITE_URL || process.env.SITE_CODE || "").toLowerCase();
  const brand = (process.env.VITE_SHOP_JSON_LD_BRAND || "").toUpperCase();
  if (site.includes("lanatw1") || site.includes("lana") || brand === "LANA") return "L";
  return "S";
}

function buildSvg(letter) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="16" fill="#0c0c0c" stroke="#b8963e" stroke-width="1" stroke-opacity="0.45"/>
  <text x="16" y="21.5" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="14" font-weight="700" fill="#d4af37">${letter}</text>
</svg>
`;
}

/** Minimal ICO from a square PNG buffer (single 32x32). */
function pngToIco(pngBuf) {
  const size = 32;
  const offset = 6 + 16;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // ICO
  header.writeUInt16LE(1, 4); // count

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size === 256 ? 0 : size, 0);
  entry.writeUInt8(size === 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(pngBuf.length, 8);
  entry.writeUInt32LE(offset, 12);

  return Buffer.concat([header, entry, pngBuf]);
}

const letter = letterFromEnv();
const svg = buildSvg(letter);
const svgPath = path.join(publicDir, "favicon.svg");
fs.writeFileSync(svgPath, svg, "utf8");

const png32 = await sharp(Buffer.from(svg)).resize(32, 32).png().toBuffer();
const png48 = await sharp(Buffer.from(svg)).resize(48, 48).png().toBuffer();
fs.writeFileSync(path.join(publicDir, "favicon-32.png"), png32);
fs.writeFileSync(path.join(publicDir, "favicon-48.png"), png48);
fs.writeFileSync(path.join(publicDir, "favicon.ico"), pngToIco(png32));

console.log(`[gen-favicon] wrote favicon.svg/.ico/.png letter=${letter}`);
