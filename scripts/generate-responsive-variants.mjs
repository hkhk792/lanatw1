/**
 * 為首屏／詳情主圖／橫幅生成 r640、（必要時）r1280 WebP，並寫入 src/lib/responsiveImageVariants.generated.ts
 * 使用: node scripts/generate-responsive-variants.mjs
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ASSETS = path.join(ROOT, "src", "assets");
const OUT_TS = path.join(ROOT, "src", "lib", "responsiveImageVariants.generated.ts");

const BASE_NAMES = [
  "sp2s-gen1-pods-catalog",
  "huan-taiwan-vape-banner",
  "line-welcome-gate",
  "atomizer-host-gemini",
  "diya-pods-showcase",
];

const WEBP_Q = 82;

function toPascalExport(base) {
  return base
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

async function main() {
  /** @type {string[]} */
  const importLines = [];
  /** @type {string[]} */
  const exportBlocks = [];

  for (const base of BASE_NAMES) {
    const src = path.join(ASSETS, `${base}.webp`);
    if (!fs.existsSync(src)) {
      console.warn("skip (missing):", base);
      continue;
    }
    const meta = await sharp(src).metadata();
    const W = meta.width ?? 1;
    const H = meta.height ?? 1;

    const exportName = toPascalExport(base);
    /** @type {{ file: string; w: number; suffix: string }[]} */
    const parts = [];

    const w640 = Math.min(640, W);
    if (w640 < W) {
      const r640Path = path.join(ASSETS, `${base}.r640.webp`);
      await sharp(src)
        .resize({ width: w640, withoutEnlargement: true })
        .webp({ quality: WEBP_Q, effort: 5, smartSubsample: true })
        .toFile(r640Path);
      parts.push({ file: `${base}.r640.webp`, w: w640, suffix: "R640" });
    }

    const midW = Math.min(1280, W);
    if (W > 640 && midW < W) {
      const r1280Path = path.join(ASSETS, `${base}.r1280.webp`);
      await sharp(src)
        .resize({ width: midW, withoutEnlargement: true })
        .webp({ quality: WEBP_Q, effort: 5, smartSubsample: true })
        .toFile(r1280Path);
      parts.push({ file: `${base}.r1280.webp`, w: midW, suffix: "R1280" });
    }

    parts.push({ file: `${base}.webp`, w: W, suffix: "Full" });

    for (const p of parts) {
      const id = `${exportName}_${p.suffix}`;
      importLines.push(`import ${id} from "@/assets/${p.file}";`);
    }

    const srcSetInner = parts.map((p) => "${" + `${exportName}_${p.suffix}` + "} " + p.w + "w").join(", ");

    exportBlocks.push(`export const ${exportName} = {
  src: ${exportName}_Full,
  srcSet: \`${srcSetInner}\`,
  width: ${W},
  height: ${H},
} as const;
`);

    console.log("✓", base, parts.map((p) => `${p.file} (${p.w}w)`).join(", "));
  }

  const dedupImports = [...new Set(importLines)].sort();
  const ts = `/* eslint-disable */
// AUTO-GENERATED — run: node scripts/generate-responsive-variants.mjs

${dedupImports.join("\n")}

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
