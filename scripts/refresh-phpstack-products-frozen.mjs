/**
 * Refreshes `src/data/phpstackProductsFrozen.json` from the live Cloudways PHP shop.
 * Requires env: PHPSTACK_SHOP_USER, PHPSTACK_SHOP_PASS
 *
 *   set PHPSTACK_SHOP_USER=lala
 *   set PHPSTACK_SHOP_PASS=secret
 *   node scripts/refresh-phpstack-products-frozen.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "src", "data", "phpstackProductsFrozen.json");

const BASE = process.env.PHPSTACK_SHOP_BASE || "https://phpstack-1307667-5128656.cloudwaysapps.com";
const USER = process.env.PHPSTACK_SHOP_USER || "";
const PASS = process.env.PHPSTACK_SHOP_PASS || "";

async function main() {
  if (!USER || !PASS) {
    console.error("Set PHPSTACK_SHOP_USER and PHPSTACK_SHOP_PASS.");
    process.exit(1);
  }

  const loginRes = await fetch(`${BASE}/api.php?action=login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username: USER, password: PASS }).toString(),
  });
  const loginJson = await loginRes.json();
  if (loginJson.status !== "success") {
    console.error("Login failed:", loginJson);
    process.exit(1);
  }

  const setCookies = loginRes.headers.getSetCookie?.() ?? [];
  const cookieHeader =
    setCookies.length > 0
      ? setCookies.map((c) => c.split(";")[0]).join("; ")
      : (loginRes.headers.get("set-cookie") || "").split(";")[0];

  const headers = { Cookie: cookieHeader };

  const brRes = await fetch(`${BASE}/api.php?action=getBrands`, { headers });
  const brJson = await brRes.json();
  if (brJson.status !== "success") {
    console.error("getBrands failed:", brJson);
    process.exit(1);
  }

  const out = [];
  for (const info of brJson.brands) {
    const bid = info.id;
    if (bid === 0) continue;
    const pRes = await fetch(`${BASE}/api.php?action=getProducts&brand_id=${bid}`, { headers });
    const pJson = await pRes.json();
    if (pJson.status !== "success") continue;
    for (const pr of pJson.products || []) {
      out.push({
        brand_id: bid,
        brand_name: info.name,
        product_id: pr.id,
        product_name: pr.name,
      });
    }
  }

  fs.writeFileSync(OUT, JSON.stringify(out, null, 0), "utf8");
  console.log(`Wrote ${OUT}, ${out.length} products`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
