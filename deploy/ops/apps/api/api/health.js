/**
 * GET /api/health — 確認 API 進程與資料庫連線狀態。
 */
import { getEnv, prefersDirectPostgres } from "./_lib/db.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const hasPg = prefersDirectPostgres();
  const hasAirtable = Boolean(
    getEnv("AIRTABLE_TOKEN") &&
      getEnv("AIRTABLE_BASE_ID") &&
      getEnv("AIRTABLE_ORDERS_TABLE") &&
      getEnv("AIRTABLE_ITEMS_TABLE")
  );
  const backend = getEnv("ORDER_BACKEND", "").toLowerCase();

  return res.status(200).json({
    ok: true,
    message: "Ops API route is active",
    host: "ops",
    siteCode: getEnv("SITE_CODE") || null,
    orderBackendHint:
      backend === "postgres" || backend === "supabase" || (!backend && hasPg)
        ? "postgres"
        : backend === "airtable" || (!backend && hasAirtable)
          ? "airtable"
          : "none",
    databaseUrlPresent: hasPg,
  });
}
