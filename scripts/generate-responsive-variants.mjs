/**
 * 為首屏／詳情主圖／橫幅生成 r640 WebP，並寫入 src/lib/responsiveImageVariants.generated.ts
 * - 商品圖：public/product-photos/
 * - 門市／引導圖：src/assets/
 * 使用: node scripts/generate-responsive-variants.mjs
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PRODUCT_PHOTOS = path.join(ROOT, "public", "product-photos");
const SITE_ASSETS = path.join(ROOT, "src", "assets");
const OUT_TS = path.join(ROOT, "src", "lib", "responsiveImageVariants.generated.ts");

const PRODUCT_BASE_NAMES = ["sp2s-gen1-pods-catalog", "atomizer-host-gemini", "diya-pods-showcase"];
const SITE_BASE_NAMES = ["huan-taiwan-vape-banner", "line-welcome-gate"];

const WEBP_Q = 82;

function toPascalExport(base) {
  return base
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

async function processBase(base, assetsDir, useProductPhoto) {
  const src = path.join(assetsDir, `${base}.webp`);
  if (!fs.existsSync(src)) {
    console.warn("skip (missing):", base, "in", path.relative(ROOT, assetsDir));
    return null;
  }

  const meta = await sharp(src).metadata();
  const W = meta.width ?? 1;
  const H = meta.height ?? 1;
  const exportName = toPascalExport(base);
  /** @type {{ file: string; w: number; suffix: string }[]} */
  const parts = [];

  const w640 = Math.min(640, W);
  if (w640 < W) {
    const r640Path = path.join(assetsDir, `${base}.r640.webp`);
    await sharp(src)
      .resize({ width: w640, withoutEnlargement: true })
      .webp({ quality: WEBP_Q, effort: 5, smartSubsample: true })
      .toFile(r640Path);
    parts.push({ file: `${base}.r640.webp`, w: w640, suffix: "R640" });
  }

  parts.push({ file: `${base}.webp`, w: W, suffix: "Full" });

  if (useProductPhoto) {
    const srcSetInner = parts
      .map((p) => `\${productPhoto("${p.file}")} ${p.w}w`)
      .join(", ");
    return {
      block: `export const ${exportName} = {
  src: productPhoto("${base}.webp"),
  srcSet: \`${srcSetInner}\`,
  width: ${W},
  height: ${H},
} as const;
`,
      log: `✓ [product] ${base} ${parts.map((p) => p.file).join(", ")}`,
    };
  }

  const importLines = parts.map((p) => {
    const id = `${exportName}_${p.suffix}`;
    return `import ${id} from "@/assets/${p.file}";`;
  });
  const srcSetInner = parts
    .map((p) => "${" + `${exportName}_${p.suffix}` + "} " + p.w + "w")
    .join(", ");

  return {
    importLines,
    block: `export const ${exportName} = {
  src: ${exportName}_Full,
  srcSet: \`${srcSetInner}\`,
  width: ${W},
  height: ${H},
} as const;
`,
    log: `✓ [site] ${base} ${parts.map((p) => p.file).join(", ")}`,
  };
}

async function main() {
  const importLines = ['import { productPhoto } from "@/lib/productPhotos";'];
  const exportBlocks = [];

  for (const base of PRODUCT_BASE_NAMES) {
    const result = await processBase(base, PRODUCT_PHOTOS, true);
    if (!result) continue;
    exportBlocks.push(result.block);
    console.log(result.log);
  }

  for (const base of SITE_BASE_NAMES) {
    const result = await processBase(base, SITE_ASSETS, false);
    if (!result) continue;
    importLines.push(...result.importLines);
    exportBlocks.push(result.block);
    console.log(result.log);
  }

  const ts = `/* eslint-disable */
// AUTO-GENERATED — run: node scripts/generate-responsive-variants.mjs

${importLines.join("\n")}

${exportBlocks.join("\n")}
`;

  fs.mkdirSync(path.dirname(OUT_TS), { recursive: true });
  fs.writeFileSync(OUT_TS, ts, "utf8");
  console.log("\nWrote", path.relative(ROOT, OUT_TS));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
