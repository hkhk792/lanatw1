import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Indexable public paths — shared by sitemap.xml and post-build prerender. */
export function getSitemapPaths() {
  const seoRoutesSrc = readFileSync(join(root, "src/lib/seoRoutes.ts"), "utf8");
  const catalogSrc = readFileSync(join(root, "src/data/pinkyImportedCatalog.ts"), "utf8");

  const staticBlock =
    seoRoutesSrc.match(/export const STATIC_SEO_ROUTES[\s\S]*?^};/m)?.[0] ?? "";

  const productPaths = [
    ...new Set(
      [...staticBlock.matchAll(/path:\s*"([^"]+)"/g)]
        .map((m) => m[1])
        .filter((p) => p.startsWith("/"))
        .filter(
          (p) =>
            !p.startsWith("/checkout") &&
            !p.startsWith("/order-complete") &&
            !p.startsWith("/admin"),
        ),
    ),
  ];

  const catalogIds = [...catalogSrc.matchAll(/\{\s*id:\s*"([^"]+)"/g)].map((m) => m[1]);
  const catalogExclude = new Set(["tokyo-magic-box-host"]);
  const catalogPaths = catalogIds
    .filter((id) => !catalogExclude.has(id))
    .map((id) => `/catalog/${id}`);

  const knowledgeSrc = readFileSync(join(root, "src/data/knowledgeArticles.ts"), "utf8");
  const categoryBases = {
    guide: "/guide",
    blog: "/blog",
    compare: "/compare",
    flavor: "/flavors",
    brand: "/brands",
  };
  const knowledgeArticlePaths = [
    ...knowledgeSrc.matchAll(
      /slug:\s*"([^"]+)"[\s\S]*?category:\s*"(guide|blog|compare|flavor|brand)"/g,
    ),
  ].map((m) => `${categoryBases[m[2]]}/${m[1]}`);

  const paths = [...productPaths, ...catalogPaths, ...knowledgeArticlePaths];
  if (!paths.includes("/")) paths.unshift("/");
  paths.sort((a, b) => (a === "/" ? -1 : b === "/" ? 1 : a.localeCompare(b)));
  return paths;
}
