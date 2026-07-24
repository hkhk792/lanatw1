#!/usr/bin/env node
/**
 * Restore deploy/ops/dumps/latest.json into DATABASE_URL (direct Postgres).
 * Assumes schema already applied (full_apply + migrations).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dumpPath = process.argv[2] || path.join(root, "deploy", "ops", "dumps", "latest.json");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    if (!process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

loadEnvFile(path.join(root, "deploy", "ops", ".env"));
loadEnvFile(path.join(root, ".env.ops.local"));

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL required");
  process.exit(1);
}
if (!fs.existsSync(dumpPath)) {
  console.error("Dump not found:", dumpPath);
  process.exit(1);
}

const dump = JSON.parse(fs.readFileSync(dumpPath, "utf8"));
const sql = postgres(databaseUrl, { max: 1, prepare: false });

function sqlLiteral(v) {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "NULL";
  if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
  if (typeof v === "object") return `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;
  return `'${String(v).replace(/'/g, "''")}'`;
}

async function truncateAll() {
  await sql.unsafe(`
    TRUNCATE TABLE
      public.order_items,
      public.orders,
      public.inventory,
      public.checkout_phone_otps
    RESTART IDENTITY CASCADE
  `);
}

async function insertRows(table, rows, columns) {
  if (!rows?.length) return 0;
  for (const row of rows) {
    const cols = columns.filter((c) => row[c] !== undefined);
    const values = cols.map((c) => sqlLiteral(row[c])).join(", ");
    await sql.unsafe(
      `INSERT INTO public.${table} (${cols.join(", ")}) VALUES (${values}) ON CONFLICT DO NOTHING`
    );
  }
  return rows.length;
}

try {
  console.log("Restoring from", dumpPath, dump.counts);
  await truncateAll();

  await insertRows("inventory", dump.inventory, [
    "product_id",
    "title",
    "on_hand",
  ]);

  await insertRows("orders", dump.orders, [
    "id",
    "order_number",
    "status",
    "batch_date",
    "customer_name",
    "phone",
    "shipping_address",
    "pickup_store_code",
    "line_id",
    "notes",
    "subtotal_twd",
    "shipping_twd",
    "total_twd",
    "country",
    "payment_method",
    "site_code",
    "created_at",
  ]);

  await insertRows("order_items", dump.order_items, [
    "id",
    "order_id",
    "product_id",
    "product_model",
    "variant",
    "quantity",
    "unit_price_twd",
    "line_total_twd",
    "image_url",
  ]);

  if (dump.checkout_phone_otps?.length) {
    await insertRows("checkout_phone_otps", dump.checkout_phone_otps, [
      "id",
      "phone",
      "code_hash",
      "expires_at",
      "attempts",
      "created_at",
    ]);
  }

  const check = await sql`
    SELECT
      (SELECT count(*)::int FROM public.orders) AS orders,
      (SELECT count(*)::int FROM public.order_items) AS items,
      (SELECT count(*)::int FROM public.inventory) AS inv
  `;
  console.log("Restored counts:", check[0]);
} finally {
  await sql.end({ timeout: 5 });
}
