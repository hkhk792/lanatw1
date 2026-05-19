/**
 * 將站內商品主圖打包成單一 ZIP（exports/product-photos-export.zip）。
 * 來源：public/product-photos/（全站商品圖已合併於此，扁平目錄）。
 */
import fs, { createWriteStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ZipArchive } from "archiver";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "exports");
const outZip = path.join(outDir, "product-photos-export.zip");
const photosDir = path.join(root, "public", "product-photos");

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

const total = countFilesInDir(photosDir);

fs.mkdirSync(outDir, { recursive: true });
if (fs.existsSync(outZip)) fs.unlinkSync(outZip);

const output = createWriteStream(outZip);
const archive = new ZipArchive({ zlib: { level: 6 } });

await new Promise((resolve, reject) => {
  output.on("close", resolve);
  archive.on("error", reject);
  archive.pipe(output);

  if (fs.existsSync(photosDir)) {
    archive.directory(photosDir, "product-photos");
  } else {
    console.warn("skip missing: public/product-photos");
  }

  archive.finalize();
});

console.log(`Wrote ${outZip} (${total} files).`);
