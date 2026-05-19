import { createSupabaseAdmin, getSiteCode } from "./supabaseAdmin.js";
import { normalizeLineId, normalizeTaiwanMobile } from "./phoneTaiwan.js";

/**
 * @param {{ phone?: string; lineId?: string; siteCode?: string }} params
 */
export async function customerHasPriorOrders({ phone, lineId, siteCode }) {
  const supabase = createSupabaseAdmin();
  const site = siteCode || getSiteCode();
  const phoneNorm = normalizeTaiwanMobile(phone || "");
  const lineNorm = normalizeLineId(lineId || "");

  const { data, error } = await supabase.rpc("customer_has_prior_orders", {
    p_phone: phoneNorm,
    p_line_id: lineNorm,
    p_site_code: site,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    hasPriorOrders: Boolean(data?.hasPriorOrders),
    matchedByPhone: Boolean(data?.matchedByPhone),
    matchedByLineId: Boolean(data?.matchedByLineId),
  };
}
