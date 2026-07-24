import { createClient } from "@supabase/supabase-js";
import { getEnv, getSql, prefersDirectPostgres } from "./db.js";
import { getSiteCode } from "./siteCode.js";
import { normalizeLineId, normalizeTaiwanMobile } from "./phoneTaiwan.js";

function createSupabaseAdmin() {
  const url = getEnv("SUPABASE_URL");
  const key = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    throw new Error("Supabase is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * @param {{ phone?: string; lineId?: string; siteCode?: string }} params
 */
export async function customerHasPriorOrders({ phone, lineId, siteCode }) {
  const site = siteCode || getSiteCode();
  const phoneNorm = normalizeTaiwanMobile(phone || "");
  const lineNorm = normalizeLineId(lineId || "");

  if (prefersDirectPostgres()) {
    const sql = getSql();
    const rows = await sql`
      SELECT public.customer_has_prior_orders(
        ${phoneNorm},
        ${lineNorm},
        ${site}
      ) AS result
    `;
    const data = rows[0]?.result;
    return {
      hasPriorOrders: Boolean(data?.hasPriorOrders),
      matchedByPhone: Boolean(data?.matchedByPhone),
      matchedByLineId: Boolean(data?.matchedByLineId),
    };
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.rpc("customer_has_prior_orders", {
    p_phone: phoneNorm,
    p_line_id: lineNorm,
    p_site_code: site,
  });
  if (error) throw new Error(error.message);
  return {
    hasPriorOrders: Boolean(data?.hasPriorOrders),
    matchedByPhone: Boolean(data?.matchedByPhone),
    matchedByLineId: Boolean(data?.matchedByLineId),
  };
}
