import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { shopSiteUrl } from "./shop-site-env.mjs";
import { getSitemapPaths } from "./sitemap-paths.mjs";

const SITE = shopSiteUrl();
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const paths = getSitemapPaths();
const lastmod = new Date().toISOString().slice(0, 10);

const urls = paths
  .map(
    (p) => `  <url>
    <loc>${SITE}${p === "/" ? "/" : p}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
  </url>`,
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(join(root, "public/sitemap.xml"), xml, "utf8");

const robots = `User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /
Disallow: /admin2589
Disallow: /checkout
Disallow: /order-complete

Sitemap: ${SITE}/sitemap.xml
`;
writeFileSync(join(root, "public/robots.txt"), robots, "utf8");

console.log(`Wrote sitemap.xml + robots.txt for ${SITE} (${paths.length} URLs)`);
