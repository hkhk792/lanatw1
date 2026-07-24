import {
  listOrdersWithItems,
  updateOrderStatus,
} from "../_lib/ordersDb.js";

const ALLOWED_STATUS = ["待确认", "已发出", "已取消", "异常"];

function getEnv(name) {
  const v = process.env[name];
  return typeof v === "string" && v.trim() ? v.trim() : "";
}

function unauthorized(res) {
  return res.status(401).json({ error: "未授權" });
}

function checkAuth(req) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  const secret = getEnv("ADMIN_SECRET");
  return Boolean(secret && token === secret);
}

function parseBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string" && req.body.trim()) return JSON.parse(req.body);
  return null;
}

export default async function handler(req, res) {
  if (!checkAuth(req)) {
    return unauthorized(res);
  }

  try {
    if (req.method === "GET") {
      const siteCode =
        typeof req.query?.siteCode === "string"
          ? req.query.siteCode.trim()
          : Array.isArray(req.query?.siteCode)
            ? String(req.query.siteCode[0] ?? "").trim()
            : "";

      const orders = await listOrdersWithItems({ siteCode });
      return res.status(200).json({ orders });
    }

    if (req.method === "PATCH") {
      const body = parseBody(req);
      const orderId = body?.orderId;
      const status = body?.status;

      if (!orderId || typeof orderId !== "string") {
        return res.status(400).json({ error: "缺少 orderId" });
      }
      if (!status || !ALLOWED_STATUS.includes(status)) {
        return res.status(400).json({ error: "狀態不合法" });
      }

      const order = await updateOrderStatus(orderId, status);
      if (!order) {
        return res.status(404).json({ error: "訂單不存在" });
      }

      return res.status(200).json({ ok: true, order });
    }

    res.setHeader("Allow", "GET, PATCH");
    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (e) {
    return res.status(500).json({
      error: e instanceof Error ? e.message : "伺服器錯誤",
    });
  }
}
