import { customerHasPriorOrders } from "../_lib/customerOrders.js";
import { normalizeTaiwanMobile } from "../_lib/phoneTaiwan.js";
import { getSiteCode } from "../_lib/supabaseAdmin.js";
import { prefersDirectPostgres } from "../_lib/db.js";
import { proxyToOps } from "../_lib/proxyToOps.js";

const FREE_SHIPPING_THRESHOLD = 1500;
const STANDARD_SHIPPING_FEE = 70;

function parseJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string" && req.body.trim()) {
    return JSON.parse(req.body);
  }
  return null;
}

function quoteShippingTwd(subtotalTwd, isFirstOrder) {
  if (subtotalTwd >= FREE_SHIPPING_THRESHOLD) return 0;
  if (isFirstOrder) return 0;
  return STANDARD_SHIPPING_FEE;
}

export default async function handler(req, res) {
  if (!prefersDirectPostgres()) {
    return proxyToOps(req, res);
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const body = parseJsonBody(req);
    const phone = normalizeTaiwanMobile(body?.phone || "");
    const subtotalTwd = Math.max(0, Number(body?.subtotalTwd) || 0);

    if (!phone) {
      return res.status(400).json({ error: "請提供有效的台灣手機號碼。" });
    }

    const prior = await customerHasPriorOrders({
      phone,
      lineId: "",
      siteCode: getSiteCode(),
    });

    const isFirstOrder = !prior.hasPriorOrders;
    const shippingTwd = quoteShippingTwd(subtotalTwd, isFirstOrder);

    return res.status(200).json({
      ok: true,
      phone,
      subtotalTwd,
      isFirstOrder,
      hasPriorOrders: prior.hasPriorOrders,
      matchedByPhone: prior.matchedByPhone,
      shippingTwd,
      totalTwd: subtotalTwd + shippingTwd,
    });
  } catch (error) {
    const status = error && typeof error.status === "number" ? error.status : 500;
    return res.status(status).json({
      error: error instanceof Error ? error.message : "查詢失敗",
    });
  }
}
