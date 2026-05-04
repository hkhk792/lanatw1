import { createClient } from "@supabase/supabase-js";

const EXPORT_STATUSES = ["待确认", "已发出"];

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

function createSupabaseAdmin() {
  const url = getEnv("SUPABASE_URL");
  const key = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function csvEscape(value) {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function formatItems(items) {
  if (!items?.length) return "";
  return items
    .map((i) => {
      const v = String(i.variant ?? "").trim();
      return `${i.product_model}${v ? `（${v}）` : ""} ×${i.quantity}`;
    })
    .join("；");
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!checkAuth(req)) {
    return unauthorized(res);
  }

  const batchDate =
    typeof req.query?.batchDate === "string"
      ? req.query.batchDate.trim()
      : typeof req.query?.batchDate === "object" && req.query.batchDate?.[0]
        ? String(req.query.batchDate[0]).trim()
        : "";

  if (!/^\d{4}-\d{2}-\d{2}$/.test(batchDate)) {
    return res.status(400).json({ error: "batchDate 格式須為 YYYY-MM-DD" });
  }

  try {
    const supabase = createSupabaseAdmin();

    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        order_number,
        customer_name,
        phone,
        country,
        line_id,
        shipping_address,
        pickup_store_code,
        notes,
        subtotal_twd,
        shipping_twd,
        total_twd,
        payment_method,
        status,
        order_items (
          product_model,
          variant,
          quantity
        )
      `
      )
      .eq("batch_date", batchDate)
      .in("status", EXPORT_STATUSES)
      .order("created_at", { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const header = [
      "订单号",
      "买家姓名",
      "电话",
      "国家或地区",
      "LINE ID",
      "收货地址",
      "收货门市号",
      "订单备注",
      "小计TWD",
      "运费TWD",
      "合计TWD",
      "付款方式",
      "商品规格",
      "状态",
    ];
    const lines = [header.map(csvEscape).join(",")];

    for (const o of data ?? []) {
      const spec = formatItems(o.order_items);
      const pay = String(o.payment_method ?? "").trim() === "cod" ? "貨到付款" : String(o.payment_method ?? "");
      lines.push(
        [
          o.order_number,
          o.customer_name,
          o.phone,
          o.country,
          o.line_id,
          o.shipping_address,
          o.pickup_store_code,
          o.notes,
          String(o.subtotal_twd ?? ""),
          String(o.shipping_twd ?? ""),
          String(o.total_twd ?? ""),
          pay,
          spec,
          o.status,
        ]
          .map(csvEscape)
          .join(",")
      );
    }

    const csv = `\ufeff${lines.join("\n")}\n`;
    const filename = `出貨單_${batchDate}.csv`;

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
    return res.status(200).send(csv);
  } catch (e) {
    return res.status(500).json({
      error: e instanceof Error ? e.message : "匯出失敗",
    });
  }
}
