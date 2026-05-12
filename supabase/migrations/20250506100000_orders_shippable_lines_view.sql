-- Read-only view: one row per order line, headers duplicated per row —便于在 Supabase Table Editor 按单号筛发货明细。
-- Depends on orders.country / orders.payment_method（20250505120000_orders_country_payment.sql）。
DROP VIEW IF EXISTS public.orders_shippable_lines CASCADE;

CREATE OR REPLACE VIEW public.orders_shippable_lines AS
SELECT
  o.id AS order_id,
  o.order_number,
  o.status,
  o.batch_date,
  o.customer_name,
  o.phone,
  o.shipping_address,
  o.pickup_store_code,
  o.line_id,
  o.notes AS order_notes,
  o.subtotal_twd,
  o.shipping_twd,
  o.total_twd,
  o.country,
  o.payment_method,
  i.id AS order_item_id,
  i.product_id,
  i.product_model,
  i.variant,
  i.quantity,
  i.unit_price_twd,
  i.line_total_twd,
  i.image_url,
  o.created_at
FROM
  public.orders o
  INNER JOIN public.order_items i ON i.order_id = o.id;

COMMENT ON VIEW public.orders_shippable_lines IS 'Flattened orders × lines for shipping lookups in Dashboard (do not INSERT/UPDATE here—edit orders / order_items).';
