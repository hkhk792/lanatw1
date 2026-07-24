/**
 * GET /api/health — 確認 API 進程與資料庫連線狀態。
 */
import { getEnv, hasDatabase, prefersDirectPostgres } from "./_lib/db.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const hasPg = prefersDirectPostgres();
  const hasAnyDb = hasDatabase();
  const hasAirtable = Boolean(
    getEnv("AIRTABLE_TOKEN") &&
      getEnv("AIRTABLE_BASE_ID") &&
      getEnv("AIRTABLE_ORDERS_TABLE") &&
      getEnv("AIRTABLE_ITEMS_TABLE")
  );
  const backend = getEnv("ORDER_BACKEND", "").toLowerCase();

  return res.status(200).json({
    ok: true,
    message: hasPg ? "Ops API route is active" : "Vercel API route is active",
    host: hasPg ? "ops" : "vercel",
    siteCode: getEnv("SITE_CODE") || null,
    orderBackendHint:
      backend === "postgres" || (!backend && hasPg)
        ? "postgres"
        : backend === "supabase" || (!backend && hasAnyDb && !hasPg)
          ? "supabase"
          : backend === "airtable" || (!backend && hasAirtable)
            ? "airtable"
            : "none",
    databaseUrlPresent: hasPg,
    supabaseEnvPresent: Boolean(getEnv("SUPABASE_URL") && getEnv("SUPABASE_SERVICE_ROLE_KEY")),
  });
}
