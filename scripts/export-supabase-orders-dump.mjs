#!/usr/bin/env node
/**
 * Export public orders schema data from Supabase REST → JSON dump for ops restore.
 * Usage: node scripts/export-supabase-orders-dump.mjs
 * Requires: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in env or .env.secrets.manual
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    if (!process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

loadEnvFile(path.join(root, ".env.secrets.manual"));
loadEnvFile(path.join(root, ".env.sp2s3.production"));

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sb = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function fetchAll(table, orderCol = null) {
  const pageSize = 1000;
  let from = 0;
  const rows = [];
  for (;;) {
    let q = sb.from(table).select("*").range(from, from + pageSize - 1);
    if (orderCol) q = q.order(orderCol, { ascending: true });
    const { data, error } = await q;
    if (error) throw new Error(`${table}: ${error.message}`);
    rows.push(...(data || []));
    if (!data || data.length < pageSize) break;
    from += pageSize;
  }
  return rows;
}

const outDir = path.join(root, "deploy", "ops", "dumps");
fs.mkdirSync(outDir, { recursive: true });

const inventory = await fetchAll("inventory", "product_id");
const orders = await fetchAll("orders", "created_at");
const orderItems = await fetchAll("order_items", null);
let otps = [];
try {
  otps = await fetchAll("checkout_phone_otps", null);
} catch {
  otps = [];
}

const dump = {
  exportedAt: new Date().toISOString(),
  source: url,
  counts: {
    inventory: inventory.length,
    orders: orders.length,
    order_items: orderItems.length,
    checkout_phone_otps: otps.length,
  },
  inventory,
  orders,
  order_items: orderItems,
  checkout_phone_otps: otps,
};

const outFile = path.join(outDir, `supabase-orders-${Date.now()}.json`);
fs.writeFileSync(outFile, JSON.stringify(dump, null, 2), "utf8");
fs.writeFileSync(path.join(outDir, "latest.json"), JSON.stringify(dump, null, 2), "utf8");
console.log("Wrote", outFile);
console.log(dump.counts);
