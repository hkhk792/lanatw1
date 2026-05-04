import { createClient } from "@supabase/supabase-js";

const AIRTABLE_API_BASE = "https://api.airtable.com/v0";

function getEnv(name, fallback = "") {
  const value = process.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function getRequiredEnv(name) {
  const value = getEnv(name);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function parseJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string" && req.body.trim()) {
    return JSON.parse(req.body);
  }
  return null;
}

function chunk(items, size) {
  const parts = [];
  for (let i = 0; i < items.length; i += size) {
    parts.push(items.slice(i, i + size));
  }
  return parts;
}

async function airtableRequest({ method, token, baseId, tableName, body }) {
  const url = `${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(tableName)}`;
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error?.message || "Airtable request failed";
    throw new Error(message);
  }
  return data;
}

function createSupabaseAdmin() {
  const url = getRequiredEnv("SUPABASE_URL");
  const key = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function mapSupabaseOrderError(message) {
  const m = String(message || "");
  if (m.includes("insufficient_stock:")) {
    const sku = m.split("insufficient_stock:")[1]?.trim() || "";
    return {
      status: 409,
      error: sku ? `庫存不足（${sku}），請調整數量或聯繫客服。` : "庫存不足，請調整數量或聯繫客服。",
    };
  }
  if (m.includes("subtotal mismatch") || m.includes("total mismatch")) {
    return { status: 400, error: "訂單金額驗證失敗，請重新整理頁面後再試。" };
  }
  if (m.includes("missing required customer fields") || m.includes("items required")) {
    return { status: 400, error: "請填寫完整訂單資料。" };
  }
  if (m.includes("invalid line item")) {
    return { status: 400, error: "購物車資料異常，請重新整理頁面後再試。" };
  }
  return { status: 500, error: m || "建立訂單失敗" };
}

async function placeOrderSupabase(payload) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.rpc("place_order", { payload });

  if (error) {
    const mapped = mapSupabaseOrderError(error.message);
    const err = new Error(mapped.error);
    err.status = mapped.status;
    throw err;
  }

  if (!data || data.ok !== true) {
    throw new Error("建立訂單失敗");
  }

  return {
    orderRecordId: data.orderId,
    orderNumber: data.orderNumber,
  };
}

async function placeOrderAirtable(payload) {
  const token = getRequiredEnv("AIRTABLE_TOKEN");
  const baseId = getRequiredEnv("AIRTABLE_BASE_ID");
  const ordersTable = getRequiredEnv("AIRTABLE_ORDERS_TABLE");
  const itemsTable = getRequiredEnv("AIRTABLE_ITEMS_TABLE");

  const {
    customerName,
    phone,
    shippingAddress,
    pickupStoreCode,
    lineId,
    notes,
    subtotalTwd,
    shippingTwd,
    totalTwd,
    items,
  } = payload;

  const fOrderStatus = getEnv("AIRTABLE_ORDER_STATUS_FIELD", "訂單狀態");
  const fOrderNumber = getEnv("AIRTABLE_ORDER_NUMBER_FIELD", "訂單編號");
  const fCustomerName = getEnv("AIRTABLE_CUSTOMER_NAME_FIELD", "姓名");
  const fPhone = getEnv("AIRTABLE_PHONE_FIELD", "手機號碼");
  const fShippingAddress = getEnv("AIRTABLE_SHIPPING_ADDRESS_FIELD", "收貨地址");
  const fPickupStoreCode = getEnv("AIRTABLE_PICKUP_STORE_CODE_FIELD", "收貨門市號");
  const fLineId = getEnv("AIRTABLE_LINE_ID_FIELD", "LINE ID");
  const fOrderNotes = getEnv("AIRTABLE_ORDER_NOTES_FIELD", "訂單備註");
  const fSubtotal = getEnv("AIRTABLE_SUBTOTAL_FIELD", "商品小計 TWD");
  const fShipping = getEnv("AIRTABLE_SHIPPING_FIELD", "運費 TWD");
  const fTotal = getEnv("AIRTABLE_TOTAL_FIELD", "訂單合計 TWD");

  const fItemProductModel = getEnv("AIRTABLE_ITEM_PRODUCT_MODEL_FIELD", "商品型號");
  const fItemQuantity = getEnv("AIRTABLE_ITEM_QUANTITY_FIELD", "數量");
  const fItemVariant = getEnv("AIRTABLE_ITEM_VARIANT_FIELD", "規格/口味");
  const fItemUnitPrice = getEnv("AIRTABLE_ITEM_UNIT_PRICE_FIELD", "單價 TWD");
  const fItemLineTotal = getEnv("AIRTABLE_ITEM_LINE_TOTAL_FIELD", "行小計 TWD");
  const fItemProductId = getEnv("AIRTABLE_ITEM_PRODUCT_ID_FIELD", "productId");
  const fItemImageUrl = getEnv("AIRTABLE_ITEM_IMAGE_URL_FIELD", "圖片 URL");
  const fItemOrderLink = getEnv("AIRTABLE_ITEM_ORDER_LINK_FIELD", "所屬訂單");
  const defaultStatus = getEnv("AIRTABLE_ORDER_DEFAULT_STATUS", "待出貨");

  const orderFields = {
    [fOrderStatus]: defaultStatus,
    [fCustomerName]: String(customerName).trim(),
    [fPhone]: String(phone).trim(),
    [fShippingAddress]: String(shippingAddress).trim(),
    [fPickupStoreCode]: String(pickupStoreCode).trim(),
    [fLineId]: String(lineId).trim(),
    [fOrderNotes]: String(notes || "").trim(),
    [fSubtotal]: Number(subtotalTwd) || 0,
    [fShipping]: Number(shippingTwd) || 0,
    [fTotal]: Number(totalTwd) || 0,
  };

  const createdOrder = await airtableRequest({
    method: "POST",
    token,
    baseId,
    tableName: ordersTable,
    body: { fields: orderFields },
  });

  const orderRecordId = createdOrder.id;
  const itemRecords = items.map((item) => ({
    fields: {
      [fItemProductModel]: String(item.productModel || "").trim(),
      [fItemQuantity]: Number(item.quantity) || 0,
      [fItemVariant]: String(item.variant || "").trim(),
      [fItemUnitPrice]: Number(item.unitPriceTwd) || 0,
      [fItemLineTotal]: Number(item.lineTotalTwd) || 0,
      [fItemProductId]: String(item.productId || "").trim(),
      [fItemImageUrl]: String(item.imageUrl || "").trim(),
      [fItemOrderLink]: [orderRecordId],
    },
  }));

  for (const group of chunk(itemRecords, 10)) {
    await airtableRequest({
      method: "POST",
      token,
      baseId,
      tableName: itemsTable,
      body: { records: group },
    });
  }

  return {
    orderRecordId,
    orderNumber: createdOrder?.fields?.[fOrderNumber] || orderRecordId,
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const payload = parseJsonBody(req);
    if (!payload) return res.status(400).json({ error: "Invalid JSON payload" });

    const {
      customerName,
      phone,
      shippingAddress,
      pickupStoreCode,
      lineId,
      notes,
      subtotalTwd,
      shippingTwd,
      totalTwd,
      items,
    } = payload;

    if (
      !customerName ||
      !phone ||
      !shippingAddress ||
      !pickupStoreCode ||
      !lineId ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({ error: "Missing required order fields" });
    }

    const backend = getEnv("ORDER_BACKEND", "").toLowerCase();
    const hasSupabase = Boolean(getEnv("SUPABASE_URL") && getEnv("SUPABASE_SERVICE_ROLE_KEY"));
    const hasAirtable = Boolean(
      getEnv("AIRTABLE_TOKEN") && getEnv("AIRTABLE_BASE_ID") && getEnv("AIRTABLE_ORDERS_TABLE") && getEnv("AIRTABLE_ITEMS_TABLE")
    );

    let result;
    if (backend === "supabase" || (!backend && hasSupabase)) {
      if (!hasSupabase) {
        return res.status(503).json({ error: "Supabase is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)." });
      }
      result = await placeOrderSupabase(payload);
    } else if (backend === "airtable" || (!backend && hasAirtable)) {
      if (!hasAirtable) {
        return res.status(503).json({ error: "Airtable is not configured." });
      }
      result = await placeOrderAirtable(payload);
    } else {
      return res.status(503).json({
        error:
          "Order backend not configured. Set Supabase (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY) or Airtable variables, or set ORDER_BACKEND=supabase|airtable.",
      });
    }

    return res.status(200).json({
      ok: true,
      orderRecordId: result.orderRecordId,
      orderNumber: result.orderNumber,
    });
  } catch (error) {
    const status = error && typeof error.status === "number" ? error.status : 500;
    return res.status(status).json({
      error: error instanceof Error ? error.message : "Failed to create order",
    });
  }
}
