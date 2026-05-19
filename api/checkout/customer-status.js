import { customerHasPriorOrders } from "../_lib/customerOrders.js";
import { normalizeTaiwanMobile } from "../_lib/phoneTaiwan.js";
import { getSiteCode } from "../_lib/supabaseAdmin.js";

function parseJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string" && req.body.trim()) {
    return JSON.parse(req.body);
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const body = parseJsonBody(req);
    const phone = normalizeTaiwanMobile(body?.phone || "");

    if (!phone) {
      return res.status(400).json({ error: "請提供有效的台灣手機號碼。" });
    }

    const prior = await customerHasPriorOrders({
      phone,
      lineId: "",
      siteCode: getSiteCode(),
    });

    return res.status(200).json({
      ok: true,
      phone,
      isFirstOrder: !prior.hasPriorOrders,
      hasPriorOrders: prior.hasPriorOrders,
      matchedByPhone: prior.matchedByPhone,
    });
  } catch (error) {
    const status = error && typeof error.status === "number" ? error.status : 500;
    return res.status(status).json({
      error: error instanceof Error ? error.message : "查詢失敗",
    });
  }
}
