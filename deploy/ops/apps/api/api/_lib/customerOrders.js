import { getSql, getSiteCode } from "./supabaseAdmin.js";
import { normalizeLineId, normalizeTaiwanMobile } from "./phoneTaiwan.js";

/**
 * @param {{ phone?: string; lineId?: string; siteCode?: string }} params
 */
export async function customerHasPriorOrders({ phone, lineId, siteCode }) {
  const sql = getSql();
  const site = siteCode || getSiteCode();
  const phoneNorm = normalizeTaiwanMobile(phone || "");
  const lineNorm = normalizeLineId(lineId || "");

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
