/**
 * GET /api/health
 * Vercel (no DATABASE_URL): proxy to ops.
 * Ops server (DATABASE_URL set): local status.
 */
import { getEnv, prefersDirectPostgres } from "./_lib/db.js";
import { proxyToOps } from "./_lib/proxyToOps.js";

function localHealth(req, res) {
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
    supabaseEnvPresent: false,
  });
}

export default async function handler(req, res) {
  if (!prefersDirectPostgres()) {
    return proxyToOps(req, res);
  }
  return localHealth(req, res);
}
