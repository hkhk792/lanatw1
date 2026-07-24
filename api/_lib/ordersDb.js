import { getSql } from "../_lib/db.js";

const ORDER_SELECT_COLS = `
  o.id,
  o.order_number,
  o.site_code,
  o.status,
  o.batch_date,
  o.customer_name,
  o.phone,
  o.shipping_address,
  o.pickup_store_code,
  o.line_id,
  o.notes,
  o.subtotal_twd,
  o.shipping_twd,
  o.total_twd,
  o.country,
  o.payment_method,
  o.created_at
`;

/**
 * Attach nested order_items to order rows (Supabase-style shape).
 * @param {Array<Record<string, unknown>>} orders
 */
export async function attachOrderItems(orders) {
  if (!orders?.length) return [];
  const sql = getSql();
  const ids = orders.map((o) => o.id);
  const items = await sql`
    SELECT
      order_id,
      product_model,
      variant,
      quantity,
      line_total_twd,
      unit_price_twd,
      product_id,
      image_url
    FROM public.order_items
    WHERE order_id = ANY(${ids}::uuid[])
    ORDER BY product_model ASC, variant ASC
  `;

  const byOrder = new Map();
  for (const it of items) {
    const key = String(it.order_id);
    if (!byOrder.has(key)) byOrder.set(key, []);
    byOrder.get(key).push({
      product_model: it.product_model,
      variant: it.variant,
      quantity: it.quantity,
      line_total_twd: it.line_total_twd,
      unit_price_twd: it.unit_price_twd,
      product_id: it.product_id,
      image_url: it.image_url,
    });
  }

  return orders.map((o) => ({
    ...o,
    order_items: byOrder.get(String(o.id)) ?? [],
  }));
}

/**
 * @param {{ siteCode?: string }} opts
 */
export async function listOrdersWithItems({ siteCode = "" } = {}) {
  const sql = getSql();
  const orders = siteCode
    ? await sql.unsafe(
        `SELECT ${ORDER_SELECT_COLS}
         FROM public.orders o
         WHERE o.site_code = $1
         ORDER BY o.batch_date DESC NULLS LAST, o.created_at DESC`,
        [siteCode]
      )
    : await sql.unsafe(
        `SELECT ${ORDER_SELECT_COLS}
         FROM public.orders o
         ORDER BY o.batch_date DESC NULLS LAST, o.created_at DESC`
      );
  return attachOrderItems(orders);
}

/**
 * @param {string} orderId
 * @param {string} status
 */
export async function updateOrderStatus(orderId, status) {
  const sql = getSql();
  const rows = await sql`
    UPDATE public.orders
    SET status = ${status}
    WHERE id = ${orderId}::uuid
    RETURNING
      id,
      order_number,
      site_code,
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
      created_at
  `;
  if (!rows[0]) return null;
  const [withItems] = await attachOrderItems(rows);
  return withItems;
}

/**
 * @param {{ batchDate: string; siteCode?: string }} opts
 */
export async function listOrdersForExport({ batchDate, siteCode = "" }) {
  const sql = getSql();
  const statuses = ["待确认", "已发出"];
  const orders = siteCode
    ? await sql`
        SELECT
          id,
          order_number,
          site_code,
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
          created_at
        FROM public.orders
        WHERE batch_date = ${batchDate}::date
          AND status = ANY(${statuses})
          AND site_code = ${siteCode}
        ORDER BY created_at ASC
      `
    : await sql`
        SELECT
          id,
          order_number,
          site_code,
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
          created_at
        FROM public.orders
        WHERE batch_date = ${batchDate}::date
          AND status = ANY(${statuses})
        ORDER BY created_at ASC
      `;
  return attachOrderItems(orders);
}

/**
 * Call place_order RPC. payload is camelCase JSON matching existing frontend.
 * @param {Record<string, unknown>} payload
 * @param {string | null} pSiteCode
 */
export async function placeOrderRpc(payload, pSiteCode) {
  const sql = getSql();
  const rows = await sql`
    SELECT public.place_order(
      ${sql.json(payload)}::jsonb,
      ${pSiteCode}
    ) AS result
  `;
  return rows[0]?.result;
}
