import { createClient } from "@supabase/supabase-js";

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

function createSupabaseAdmin() {
  const url = getEnv("SUPABASE_URL");
  const key = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default async function handler(req, res) {
  if (!checkAuth(req)) {
    return unauthorized(res);
  }

  try {
    const supabase = createSupabaseAdmin();

    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          id,
          order_number,
          status,
          batch_date,
          customer_name,
          phone,
          shipping_address,
          pickup_store_code,
          line_id,
          notes,
          subtotal_twd,
          shipping_twd,
          total_twd,
          country,
          payment_method,
          created_at,
          order_items (
            product_model,
            variant,
            quantity,
            line_total_twd
          )
        `
        )
        .order("batch_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ orders: data ?? [] });
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

      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId)
        .select(
          `
          id,
          order_number,
          status,
          batch_date,
          customer_name,
          phone,
          shipping_address,
          pickup_store_code,
          line_id,
          notes,
          subtotal_twd,
          shipping_twd,
          total_twd,
          country,
          payment_method,
          created_at,
          order_items (
            product_model,
            variant,
            quantity,
            line_total_twd
          )
        `
        )
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ ok: true, order: data });
    }

    res.setHeader("Allow", "GET, PATCH");
    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (e) {
    return res.status(500).json({
      error: e instanceof Error ? e.message : "伺服器錯誤",
    });
  }
}
