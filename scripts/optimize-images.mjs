/**
 * 將 src/assets 內 PNG/JPEG 轉為 WebP（可選降寬），體積未明顯變小則保留原檔。
 * 完成後更新 src 內 @/assets/... 引用。
 *
 * 使用: npm run optimize:images
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ASSETS = path.join(ROOT, "src", "assets");
const SRC = path.join(ROOT, "src");

const MIN_INPUT_BYTES = 12 * 1024; // 小於此略過（如極小 logo）
const MIN_SAVING_RATIO = 0.93; // WebP 須小於原檔 93% 才替換
const MAX_WIDTH = 1600; // 超過此寬度先縮放再編碼
const WEBP_QUALITY = 82;
const WEBP_EFFORT = 5;

/** 由長到短替換，避免 product-1 誤傷 product-11 */
function sortReplacements(map) {
  return [...map.entries()].sort((a, b) => b[0].length - a[0].length);
}

function walkSourceFiles(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith(".")) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === "dist" || ent.name === "assets") continue;
      walkSourceFiles(p, acc);
    } else if (/\.(tsx?|jsx?|css)$/.test(ent.name)) {
      acc.push(p);
    }
  }
  return acc;
}

async function convertOne(absPath, baseName, ext) {
  const stat = fs.statSync(absPath);
  if (stat.size < MIN_INPUT_BYTES) {
    return { skipped: true, reason: "small file" };
  }

  const tmpOut = path.join(ASSETS, `${baseName}.webp.tmp`);
  const finalOut = path.join(ASSETS, `${baseName}.webp`);

  let pipeline = sharp(absPath, { failOn: "none" });
  const meta = await pipeline.metadata();
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = sharp(absPath, { failOn: "none" }).resize({
      width: MAX_WIDTH,
      withoutEnlargement: true,
      fit: "inside",
    });
  }

  await pipeline
    .webp({
      quality: WEBP_QUALITY,
      effort: WEBP_EFFORT,
      smartSubsample: true,
    })
    .toFile(tmpOut);

  const newStat = fs.statSync(tmpOut);
  const ratio = newStat.size / stat.size;
  if (ratio >= MIN_SAVING_RATIO) {
    fs.unlinkSync(tmpOut);
    return { skipped: true, reason: "webp not smaller enough", ratio };
  }

  fs.renameSync(tmpOut, finalOut);
  fs.unlinkSync(absPath);
  const oldName = `${baseName}${ext}`;
  const newName = `${baseName}.webp`;
  return {
    skipped: false,
    oldName,
    newName,
    before: stat.size,
    after: newStat.size,
    ratio,
  };
}

async function main() {
  if (!fs.existsSync(ASSETS)) {
    console.error("Missing", ASSETS);
    process.exit(1);
  }

  const files = fs.readdirSync(ASSETS).filter((f) => /\.(png|jpe?g)$/i.test(f));
  /** @type {Map<string, string>} */
  const replacements = new Map();

  console.log(`Found ${files.length} raster files in src/assets\n`);

  for (const file of files) {
    const abs = path.join(ASSETS, file);
    const ext = path.extname(file).toLowerCase();
    const baseName = path.basename(file, ext);
    try {
      const result = await convertOne(abs, baseName, ext);
      if (result.skipped) {
        console.log(`— ${file}  ${result.reason ?? ""} ${result.ratio != null ? `(ratio ${result.ratio.toFixed(2)})` : ""}`);
      } else {
        replacements.set(result.oldName, result.newName);
        const pct = ((1 - result.after / result.before) * 100).toFixed(1);
        console.log(`✓ ${result.oldName} → ${result.newName}  ${(result.before / 1024).toFixed(0)}KB → ${(result.after / 1024).toFixed(0)}KB (−${pct}%)`);
      }
    } catch (e) {
      console.error(`✗ ${file}`, e);
      process.exitCode = 1;
    }
  }

  if (replacements.size === 0) {
    console.log("\nNo files replaced; skipping source edits.");
    return;
  }

  const sourceFiles = walkSourceFiles(SRC);
  let totalEdits = 0;
  const pairs = sortReplacements(replacements);

  for (const file of sourceFiles) {
    let text = fs.readFileSync(file, "utf8");
    const orig = text;
    for (const [oldName, newName] of pairs) {
      const needle = `@/assets/${oldName}`;
      const repl = `@/assets/${newName}`;
      if (text.includes(needle)) {
        text = text.split(needle).join(repl);
      }
    }
    if (text !== orig) {
      fs.writeFileSync(file, text, "utf8");
      totalEdits++;
      console.log(`  edit: ${path.relative(ROOT, file)}`);
    }
  }

  console.log(`\nUpdated ${totalEdits} source file(s), ${replacements.size} asset(s) converted.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
