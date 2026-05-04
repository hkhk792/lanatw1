/**
 * GET /api/health — 用於確認「此網域是否走 Vercel Serverless」。
 * 若瀏覽器或 curl 拿到的是 HTML 而非 JSON，表示網域未指到本專案或僅靜態託管。
 */
function getEnv(name) {
  const v = process.env[name];
  return typeof v === "string" && v.trim() ? v.trim() : "";
}

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const hasSupabase = Boolean(getEnv("SUPABASE_URL") && getEnv("SUPABASE_SERVICE_ROLE_KEY"));
  const hasAirtable = Boolean(
    getEnv("AIRTABLE_TOKEN") && getEnv("AIRTABLE_BASE_ID") && getEnv("AIRTABLE_ORDERS_TABLE") && getEnv("AIRTABLE_ITEMS_TABLE")
  );
  const backend = getEnv("ORDER_BACKEND", "").toLowerCase();

  const siteCode = getEnv("SITE_CODE");

  return res.status(200).json({
    ok: true,
    message: "Vercel API route is active",
    siteCode: siteCode || null,
    orderBackendHint:
      backend === "supabase" || (!backend && hasSupabase)
        ? "supabase"
        : backend === "airtable" || (!backend && hasAirtable)
          ? "airtable"
          : "none",
    supabaseEnvPresent: hasSupabase,
  });
}
