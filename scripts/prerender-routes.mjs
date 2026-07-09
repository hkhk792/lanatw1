import { getSitemapPaths } from "./sitemap-paths.mjs";

/** Public indexable routes for post-build prerender (same set as sitemap). */
export function getPrerenderRoutes() {
  return getSitemapPaths();
}
