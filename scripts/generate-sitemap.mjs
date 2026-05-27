import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://sp2spods.com";

/** 与 src/lib/seoRoutes.ts 中 SITEMAP_PATHS 保持同步 */
const paths = [
  "/",
  "/product/lanna",
  "/product/bullet",
  "/product/pro",
  "/product/atomizer",
  "/product/diya",
  "/product/diya-7500",
  "/product/jupiter-6500",
  "/product/vapor-storm-5000",
  "/product/vapor-storm-gen5-pods",
  "/product/lana-e-liquid-30ml",
  "/product/sp2s-silicone-sleeve",
  "/product/lana-pods",
  "/product/diya-pods",
  "/product/sp2s-gen1-pods",
  "/product/sp2s-universal-pods",
  "/product/sp2s-empty-shell-standard",
  "/product/sp2s-empty-shell-pro",
  "/product/venus-host",
  "/product/mohoo-tokyo-box",
  "/product/mohoo-tokyo-box-host",
  "/product/hebat-gen6",
];

const lastmod = new Date().toISOString().slice(0, 10);

const urls = paths
  .map(
    (p) => `  <url>
    <loc>${SITE}${p === "/" ? "/" : p}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
  </url>`
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
writeFileSync(join(outDir, "sitemap.xml"), xml, "utf8");
console.log(`Wrote sitemap.xml (${paths.length} URLs)`);
