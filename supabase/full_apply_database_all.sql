-- =============================================================================
-- ALL-IN-ONE（当前仓库）：订单表 + 库存 + place_order + 视图 + 库存种子
-- Supabase → SQL Editor → 粘贴全文 → Run（UTF-8）
-- 含：full_apply_orders_and_admin.sql + seed_inventory_all.sql
-- =============================================================================

-- =============================================================================
-- obsidian-vapor-zen：订单 + 库存 + 后台 /api/admin 所需对象（一次贴完执行）
-- 用法：Supabase Dashboard → SQL Editor → New query → 全选粘贴 → Run
-- 说明：由 supabase/migrations/*.sql 按序合并；可与分文件迁移二选一，勿重复执行冲突段落。
-- 執行後務必跑 seed_inventory_all.sql，否則 place_order 會因 inventory 無列而一直「庫存不足」。
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 20250504000000_orders_inventory.sql
-- -----------------------------------------------------------------------------
-- Minimal orders + inventory for transactional checkout (single warehouse).
-- Apply in Supabase: SQL Editor → New query → paste → Run.
-- Or use Supabase CLI: supabase db push

-- Inventory: keyed by product_id (must match website CartLine.productId)
CREATE TABLE IF NOT EXISTS public.inventory (
  product_id text PRIMARY KEY,
  title text,
  on_hand integer NOT NULL DEFAULT 0 CHECK (on_hand >= 0)
);

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT '待出貨',
  customer_name text NOT NULL,
  phone text NOT NULL,
  shipping_address text NOT NULL,
  pickup_store_code text NOT NULL,
  line_id text NOT NULL,
  notes text NOT NULL DEFAULT '',
  subtotal_twd integer NOT NULL CHECK (subtotal_twd >= 0),
  shipping_twd integer NOT NULL CHECK (shipping_twd >= 0),
  total_twd integer NOT NULL CHECK (total_twd >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
  product_id text NOT NULL,
  product_model text NOT NULL,
  variant text NOT NULL DEFAULT '',
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price_twd integer NOT NULL CHECK (unit_price_twd >= 0),
  line_total_twd integer NOT NULL CHECK (line_total_twd >= 0),
  image_url text NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items (order_id);

CREATE SEQUENCE IF NOT EXISTS public.order_number_seq;

CREATE OR REPLACE FUNCTION public.assign_order_number ()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := 'SP2S-' || lpad(nextval('public.order_number_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_orders_assign_number ON public.orders;

CREATE TRIGGER tr_orders_assign_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE PROCEDURE public.assign_order_number ();

-- Atomic: deduct inventory, insert order + lines; rollback all on any failure
CREATE OR REPLACE FUNCTION public.place_order (payload jsonb)
  RETURNS jsonb
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $$
DECLARE
  v_order_id uuid;
  v_order_number text;
  v_item jsonb;
  v_product_id text;
  v_qty integer;
  v_rows integer;
  v_expected_subtotal bigint := 0;
  v_client_subtotal integer;
  v_client_shipping integer;
  v_client_total integer;
BEGIN
  IF payload IS NULL THEN
    RAISE EXCEPTION 'invalid payload';
  END IF;

  -- Required header fields
  IF coalesce(trim(payload ->> 'customerName'), '') = ''
    OR coalesce(trim(payload ->> 'phone'), '') = ''
    OR coalesce(trim(payload ->> 'shippingAddress'), '') = ''
    OR coalesce(trim(payload ->> 'pickupStoreCode'), '') = ''
    OR coalesce(trim(payload ->> 'lineId'), '') = '' THEN
    RAISE EXCEPTION 'missing required customer fields';
  END IF;

  v_client_subtotal := coalesce((payload ->> 'subtotalTwd')::integer, -1);
  v_client_shipping := coalesce((payload ->> 'shippingTwd')::integer, -1);
  v_client_total := coalesce((payload ->> 'totalTwd')::integer, -1);

  IF v_client_subtotal < 0 OR v_client_shipping < 0 OR v_client_total < 0 THEN
    RAISE EXCEPTION 'invalid amounts';
  END IF;

  IF payload -> 'items' IS NULL OR jsonb_typeof(payload -> 'items') != 'array' OR jsonb_array_length(payload -> 'items') = 0 THEN
    RAISE EXCEPTION 'items required';
  END IF;

  -- Expected subtotal from lines (integer TWD)
  SELECT coalesce(sum(((elem ->> 'lineTotalTwd')::bigint)), 0)
    INTO v_expected_subtotal
  FROM jsonb_array_elements(payload -> 'items') AS elems(elem);

  IF v_expected_subtotal != v_client_subtotal THEN
    RAISE EXCEPTION 'subtotal mismatch';
  END IF;

  IF v_client_total != v_client_subtotal + v_client_shipping THEN
    RAISE EXCEPTION 'total mismatch';
  END IF;

  -- Deduct inventory per line (same transaction)
  FOR v_item IN
    SELECT elem
    FROM jsonb_array_elements(payload -> 'items') AS elems(elem)
    LOOP
      v_product_id := trim(v_item ->> 'productId');
      v_qty := coalesce((v_item ->> 'quantity')::integer, 0);

      IF v_product_id = '' OR v_qty IS NULL OR v_qty <= 0 THEN
        RAISE EXCEPTION 'invalid line item';
      END IF;

      UPDATE public.inventory
      SET on_hand = on_hand - v_qty
      WHERE product_id = v_product_id
        AND on_hand >= v_qty;

      GET DIAGNOSTICS v_rows = ROW_COUNT;

      IF v_rows = 0 THEN
        RAISE EXCEPTION 'insufficient_stock:%', v_product_id;
      END IF;
    END LOOP;

  INSERT INTO public.orders (
    status,
    customer_name,
    phone,
    shipping_address,
    pickup_store_code,
    line_id,
    notes,
    subtotal_twd,
    shipping_twd,
    total_twd
  )
  VALUES (
    '待出貨',
    trim(payload ->> 'customerName'),
    trim(payload ->> 'phone'),
    trim(payload ->> 'shippingAddress'),
    trim(payload ->> 'pickupStoreCode'),
    trim(payload ->> 'lineId'),
    coalesce(trim(payload ->> 'notes'), ''),
    v_client_subtotal,
    v_client_shipping,
    v_client_total
  )
  RETURNING
    id,
    order_number INTO v_order_id,
    v_order_number;

  INSERT INTO public.order_items (
    order_id,
    product_id,
    product_model,
    variant,
    quantity,
    unit_price_twd,
    line_total_twd,
    image_url
  )
  SELECT
    v_order_id,
    trim(elem ->> 'productId'),
    trim(elem ->> 'productModel'),
    coalesce(trim(elem ->> 'variant'), ''),
    (elem ->> 'quantity')::integer,
    (elem ->> 'unitPriceTwd')::integer,
    (elem ->> 'lineTotalTwd')::integer,
    coalesce(trim(elem ->> 'imageUrl'), '')
  FROM jsonb_array_elements(payload -> 'items') AS elems(elem);

  RETURN jsonb_build_object(
    'ok', TRUE,
    'orderId', v_order_id,
    'orderNumber', v_order_number
  );
END;
$$;

REVOKE ALL ON FUNCTION public.place_order (jsonb) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.place_order (jsonb) TO service_role;

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- No policies for anon/authenticated: only service_role / dashboard admin bypasses RLS.

-- -----------------------------------------------------------------------------
-- 20250504120000_orders_batch_date_and_status.sql
-- -----------------------------------------------------------------------------
-- Orders: batch_date (Taipei 16:30 cut-off) + status workflow
-- Run in Supabase SQL Editor after the initial inventory migration.

-- 1) Column: batch_date (截單批次日期，依台北時間 16:30 分界)
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS batch_date date;

-- 2) Backfill existing rows where batch_date is null (use order created_at in Taipei)
UPDATE public.orders
SET
  batch_date = CASE WHEN (
    EXTRACT(
      hour
      FROM
        (created_at AT TIME ZONE 'Asia/Taipei')
    ) < 16
  )
  OR (
    EXTRACT(
      hour
      FROM
        (created_at AT TIME ZONE 'Asia/Taipei')
    ) = 16
    AND EXTRACT(
      minute
      FROM
        (created_at AT TIME ZONE 'Asia/Taipei')
    ) < 30
  ) THEN ((created_at AT TIME ZONE 'Asia/Taipei'))::date
  ELSE (((created_at AT TIME ZONE 'Asia/Taipei'))::date + 1)
END
WHERE
  batch_date IS NULL;

-- If still null (no rows), allow NOT NULL only when safe
ALTER TABLE public.orders
  ALTER COLUMN batch_date SET DEFAULT (CURRENT_DATE);

UPDATE public.orders
SET
  batch_date = CURRENT_DATE
WHERE
  batch_date IS NULL;

ALTER TABLE public.orders
  ALTER COLUMN batch_date SET NOT NULL;

ALTER TABLE public.orders
  ALTER COLUMN batch_date DROP DEFAULT;

-- 3) Status: 待确认 / 已发出 / 已取消 / 异常
UPDATE public.orders
SET
  status = '待确认'
WHERE
  status IN ('待出貨', '待发货');

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders
  ALTER COLUMN status SET DEFAULT '待确认';

ALTER TABLE public.orders
ADD CONSTRAINT orders_status_check CHECK (
  status IN (
    '待确认',
    '已发出',
    '已取消',
    '异常'
  )
);

-- 4) Replace place_order: compute batch_date from DB now() in Asia/Taipei
CREATE OR REPLACE FUNCTION public.place_order (payload jsonb)
  RETURNS jsonb
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $$
DECLARE
  v_order_id uuid;
  v_order_number text;
  v_batch_date date;
  v_taipei timestamp WITHOUT TIME ZONE;
  v_item jsonb;
  v_product_id text;
  v_qty integer;
  v_rows integer;
  v_expected_subtotal bigint := 0;
  v_client_subtotal integer;
  v_client_shipping integer;
  v_client_total integer;
BEGIN
  IF payload IS NULL THEN
    RAISE EXCEPTION 'invalid payload';
  END IF;

  -- 台北時間：16:30（含）前 → 當天批次；之後 → 次日批次
  v_taipei := (now() AT TIME ZONE 'Asia/Taipei');

  IF (EXTRACT(hour FROM v_taipei) < 16) OR (
    EXTRACT(hour FROM v_taipei) = 16
    AND EXTRACT(minute FROM v_taipei) < 30
  ) THEN
    v_batch_date := v_taipei::date;
  ELSE
    v_batch_date := (v_taipei::date + 1);
  END IF;

  IF coalesce(trim(payload ->> 'customerName'), '') = ''
  OR coalesce(trim(payload ->> 'phone'), '') = ''
  OR coalesce(trim(payload ->> 'shippingAddress'), '') = ''
  OR coalesce(trim(payload ->> 'pickupStoreCode'), '') = ''
  OR coalesce(trim(payload ->> 'lineId'), '') = '' THEN
    RAISE EXCEPTION 'missing required customer fields';
  END IF;

  v_client_subtotal := coalesce((payload ->> 'subtotalTwd')::integer, -1);
  v_client_shipping := coalesce((payload ->> 'shippingTwd')::integer, -1);
  v_client_total := coalesce((payload ->> 'totalTwd')::integer, -1);

  IF v_client_subtotal < 0 OR v_client_shipping < 0 OR v_client_total < 0 THEN
    RAISE EXCEPTION 'invalid amounts';
  END IF;

  IF payload -> 'items' IS NULL OR jsonb_typeof(payload -> 'items') != 'array' OR jsonb_array_length(payload -> 'items') = 0 THEN
    RAISE EXCEPTION 'items required';
  END IF;

  SELECT
    coalesce(sum(((elem ->> 'lineTotalTwd')::bigint)), 0) INTO v_expected_subtotal
  FROM
    jsonb_array_elements(payload -> 'items') AS elems(elem);

  IF v_expected_subtotal != v_client_subtotal THEN
    RAISE EXCEPTION 'subtotal mismatch';
  END IF;

  IF v_client_total != v_client_subtotal + v_client_shipping THEN
    RAISE EXCEPTION 'total mismatch';
  END IF;

  FOR v_item IN
    SELECT
      elem
    FROM
      jsonb_array_elements(payload -> 'items') AS elems(elem)
    LOOP
      v_product_id := trim(v_item ->> 'productId');
      v_qty := coalesce((v_item ->> 'quantity')::integer, 0);

      IF v_product_id = '' OR v_qty IS NULL OR v_qty <= 0 THEN
        RAISE EXCEPTION 'invalid line item';
      END IF;

      UPDATE public.inventory
      SET
        on_hand = on_hand - v_qty
      WHERE
        product_id = v_product_id
        AND on_hand >= v_qty;

      GET DIAGNOSTICS v_rows = ROW_COUNT;

      IF v_rows = 0 THEN
        RAISE EXCEPTION 'insufficient_stock:%', v_product_id;
      END IF;
    END LOOP;

  INSERT INTO public.orders (
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
    total_twd
  )
  VALUES (
    '待确认',
    v_batch_date,
    trim(payload ->> 'customerName'),
    trim(payload ->> 'phone'),
    trim(payload ->> 'shippingAddress'),
    trim(payload ->> 'pickupStoreCode'),
    trim(payload ->> 'lineId'),
    coalesce(trim(payload ->> 'notes'), ''),
    v_client_subtotal,
    v_client_shipping,
    v_client_total
  )
  RETURNING
    id,
    order_number INTO v_order_id,
    v_order_number;

  INSERT INTO public.order_items (
    order_id,
    product_id,
    product_model,
    variant,
    quantity,
    unit_price_twd,
    line_total_twd,
    image_url
  )
  SELECT
    v_order_id,
    trim(elem ->> 'productId'),
    trim(elem ->> 'productModel'),
    coalesce(trim(elem ->> 'variant'), ''),
    (elem ->> 'quantity')::integer,
    (elem ->> 'unitPriceTwd')::integer,
    (elem ->> 'lineTotalTwd')::integer,
    coalesce(trim(elem ->> 'imageUrl'), '')
  FROM
    jsonb_array_elements(payload -> 'items') AS elems(elem);

  RETURN jsonb_build_object(
    'ok',
    TRUE,
    'orderId',
    v_order_id,
    'orderNumber',
    v_order_number,
    'batchDate',
    v_batch_date
  );
END;
$$;

-- -----------------------------------------------------------------------------
-- 20250505120000_orders_country_payment.sql
-- -----------------------------------------------------------------------------
-- Checkout: country + payment_method (matches storefront form)
-- Run in Supabase SQL Editor after prior migrations.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS country text NOT NULL DEFAULT '台灣';

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'cod';

CREATE OR REPLACE FUNCTION public.place_order (payload jsonb)
  RETURNS jsonb
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $$
DECLARE
  v_order_id uuid;
  v_order_number text;
  v_batch_date date;
  v_taipei timestamp WITHOUT TIME ZONE;
  v_item jsonb;
  v_product_id text;
  v_qty integer;
  v_rows integer;
  v_expected_subtotal bigint := 0;
  v_client_subtotal integer;
  v_client_shipping integer;
  v_client_total integer;
  v_country text;
  v_payment text;
BEGIN
  IF payload IS NULL THEN
    RAISE EXCEPTION 'invalid payload';
  END IF;

  v_taipei := (now() AT TIME ZONE 'Asia/Taipei');

  IF (EXTRACT(hour FROM v_taipei) < 16) OR (
    EXTRACT(hour FROM v_taipei) = 16
    AND EXTRACT(minute FROM v_taipei) < 30
  ) THEN
    v_batch_date := v_taipei::date;
  ELSE
    v_batch_date := (v_taipei::date + 1);
  END IF;

  IF coalesce(trim(payload ->> 'customerName'), '') = ''
  OR coalesce(trim(payload ->> 'phone'), '') = ''
  OR coalesce(trim(payload ->> 'shippingAddress'), '') = ''
  OR coalesce(trim(payload ->> 'pickupStoreCode'), '') = ''
  OR coalesce(trim(payload ->> 'lineId'), '') = '' THEN
    RAISE EXCEPTION 'missing required customer fields';
  END IF;

  v_client_subtotal := coalesce((payload ->> 'subtotalTwd')::integer, -1);
  v_client_shipping := coalesce((payload ->> 'shippingTwd')::integer, -1);
  v_client_total := coalesce((payload ->> 'totalTwd')::integer, -1);

  IF v_client_subtotal < 0 OR v_client_shipping < 0 OR v_client_total < 0 THEN
    RAISE EXCEPTION 'invalid amounts';
  END IF;

  IF payload -> 'items' IS NULL OR jsonb_typeof(payload -> 'items') != 'array' OR jsonb_array_length(payload -> 'items') = 0 THEN
    RAISE EXCEPTION 'items required';
  END IF;

  SELECT
    coalesce(sum(((elem ->> 'lineTotalTwd')::bigint)), 0) INTO v_expected_subtotal
  FROM
    jsonb_array_elements(payload -> 'items') AS elems(elem);

  IF v_expected_subtotal != v_client_subtotal THEN
    RAISE EXCEPTION 'subtotal mismatch';
  END IF;

  IF v_client_total != v_client_subtotal + v_client_shipping THEN
    RAISE EXCEPTION 'total mismatch';
  END IF;

  v_country := coalesce(nullif(trim(payload ->> 'country'), ''), '台灣');
  v_payment := coalesce(nullif(trim(payload ->> 'paymentMethod'), ''), 'cod');

  FOR v_item IN
    SELECT
      elem
    FROM
      jsonb_array_elements(payload -> 'items') AS elems(elem)
    LOOP
      v_product_id := trim(v_item ->> 'productId');
      v_qty := coalesce((v_item ->> 'quantity')::integer, 0);

      IF v_product_id = '' OR v_qty IS NULL OR v_qty <= 0 THEN
        RAISE EXCEPTION 'invalid line item';
      END IF;

      UPDATE public.inventory
      SET
        on_hand = on_hand - v_qty
      WHERE
        product_id = v_product_id
        AND on_hand >= v_qty;

      GET DIAGNOSTICS v_rows = ROW_COUNT;

      IF v_rows = 0 THEN
        RAISE EXCEPTION 'insufficient_stock:%', v_product_id;
      END IF;
    END LOOP;

  INSERT INTO public.orders (
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
    payment_method
  )
  VALUES (
    '待确认',
    v_batch_date,
    trim(payload ->> 'customerName'),
    trim(payload ->> 'phone'),
    trim(payload ->> 'shippingAddress'),
    trim(payload ->> 'pickupStoreCode'),
    trim(payload ->> 'lineId'),
    coalesce(trim(payload ->> 'notes'), ''),
    v_client_subtotal,
    v_client_shipping,
    v_client_total,
    v_country,
    v_payment
  )
  RETURNING
    id,
    order_number INTO v_order_id,
    v_order_number;

  INSERT INTO public.order_items (
    order_id,
    product_id,
    product_model,
    variant,
    quantity,
    unit_price_twd,
    line_total_twd,
    image_url
  )
  SELECT
    v_order_id,
    trim(elem ->> 'productId'),
    trim(elem ->> 'productModel'),
    coalesce(trim(elem ->> 'variant'), ''),
    (elem ->> 'quantity')::integer,
    (elem ->> 'unitPriceTwd')::integer,
    (elem ->> 'lineTotalTwd')::integer,
    coalesce(trim(elem ->> 'imageUrl'), '')
  FROM
    jsonb_array_elements(payload -> 'items') AS elems(elem);

  RETURN jsonb_build_object(
    'ok',
    TRUE,
    'orderId',
    v_order_id,
    'orderNumber',
    v_order_number,
    'batchDate',
    v_batch_date
  );
END;
$$;

-- -----------------------------------------------------------------------------
-- 20250506100000_orders_shippable_lines_view.sql
-- -----------------------------------------------------------------------------
-- Read-only view: one row per order line, headers duplicated per row —便于在 Supabase Table Editor 按单号筛发货明细。
-- Depends on orders.country / orders.payment_method（20250505120000_orders_country_payment.sql）。
-- 若库中已有旧版视图定义，REPLACE 可能因列顺序/增列报 42P16；先 DROP 再建。
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

-- -----------------------------------------------------------------------------
-- 20250507120000_orders_site_code.sql
-- -----------------------------------------------------------------------------
-- 站群：orders.site_code（每個前台部署在 Vercel 設 SITE_CODE；庫存仍共用 inventory，不按站拆分）
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS site_code text NOT NULL DEFAULT 'default';

COMMENT ON COLUMN public.orders.site_code IS '站點標識，與 Vercel 環境變數 SITE_CODE 對齊；單一商城可保留 default。';

CREATE OR REPLACE FUNCTION public.place_order (payload jsonb)
  RETURNS jsonb
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $$
DECLARE
  v_order_id uuid;
  v_order_number text;
  v_batch_date date;
  v_taipei timestamp WITHOUT TIME ZONE;
  v_item jsonb;
  v_product_id text;
  v_qty integer;
  v_rows integer;
  v_expected_subtotal bigint := 0;
  v_client_subtotal integer;
  v_client_shipping integer;
  v_client_total integer;
  v_country text;
  v_payment text;
  v_site_code text;
BEGIN
  IF payload IS NULL THEN
    RAISE EXCEPTION 'invalid payload';
  END IF;

  v_taipei := (now() AT TIME ZONE 'Asia/Taipei');

  IF (EXTRACT(hour FROM v_taipei) < 16) OR (
    EXTRACT(hour FROM v_taipei) = 16
    AND EXTRACT(minute FROM v_taipei) < 30
  ) THEN
    v_batch_date := v_taipei::date;
  ELSE
    v_batch_date := (v_taipei::date + 1);
  END IF;

  IF coalesce(trim(payload ->> 'customerName'), '') = ''
  OR coalesce(trim(payload ->> 'phone'), '') = ''
  OR coalesce(trim(payload ->> 'shippingAddress'), '') = ''
  OR coalesce(trim(payload ->> 'pickupStoreCode'), '') = ''
  OR coalesce(trim(payload ->> 'lineId'), '') = '' THEN
    RAISE EXCEPTION 'missing required customer fields';
  END IF;

  v_client_subtotal := coalesce((payload ->> 'subtotalTwd')::integer, -1);
  v_client_shipping := coalesce((payload ->> 'shippingTwd')::integer, -1);
  v_client_total := coalesce((payload ->> 'totalTwd')::integer, -1);

  IF v_client_subtotal < 0 OR v_client_shipping < 0 OR v_client_total < 0 THEN
    RAISE EXCEPTION 'invalid amounts';
  END IF;

  IF payload -> 'items' IS NULL OR jsonb_typeof(payload -> 'items') != 'array' OR jsonb_array_length(payload -> 'items') = 0 THEN
    RAISE EXCEPTION 'items required';
  END IF;

  SELECT
    coalesce(sum(((elem ->> 'lineTotalTwd')::bigint)), 0) INTO v_expected_subtotal
  FROM
    jsonb_array_elements(payload -> 'items') AS elems(elem);

  IF v_expected_subtotal != v_client_subtotal THEN
    RAISE EXCEPTION 'subtotal mismatch';
  END IF;

  IF v_client_total != v_client_subtotal + v_client_shipping THEN
    RAISE EXCEPTION 'total mismatch';
  END IF;

  v_country := coalesce(nullif(trim(payload ->> 'country'), ''), '台灣');
  v_payment := coalesce(nullif(trim(payload ->> 'paymentMethod'), ''), 'cod');
  v_site_code := coalesce(
    nullif(trim(payload ->> 'siteCode'), ''),
    nullif(trim(payload ->> 'site_code'), ''),
    'default'
  );

  FOR v_item IN
    SELECT
      elem
    FROM
      jsonb_array_elements(payload -> 'items') AS elems(elem)
    LOOP
      v_product_id := trim(v_item ->> 'productId');
      v_qty := coalesce((v_item ->> 'quantity')::integer, 0);

      IF v_product_id = '' OR v_qty IS NULL OR v_qty <= 0 THEN
        RAISE EXCEPTION 'invalid line item';
      END IF;

      UPDATE public.inventory
      SET
        on_hand = on_hand - v_qty
      WHERE
        product_id = v_product_id
        AND on_hand >= v_qty;

      GET DIAGNOSTICS v_rows = ROW_COUNT;

      IF v_rows = 0 THEN
        RAISE EXCEPTION 'insufficient_stock:%', v_product_id;
      END IF;
    END LOOP;

  INSERT INTO public.orders (
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
    site_code
  )
  VALUES (
    '待确认',
    v_batch_date,
    trim(payload ->> 'customerName'),
    trim(payload ->> 'phone'),
    trim(payload ->> 'shippingAddress'),
    trim(payload ->> 'pickupStoreCode'),
    trim(payload ->> 'lineId'),
    coalesce(trim(payload ->> 'notes'), ''),
    v_client_subtotal,
    v_client_shipping,
    v_client_total,
    v_country,
    v_payment,
    v_site_code
  )
  RETURNING
    id,
    order_number INTO v_order_id,
    v_order_number;

  INSERT INTO public.order_items (
    order_id,
    product_id,
    product_model,
    variant,
    quantity,
    unit_price_twd,
    line_total_twd,
    image_url
  )
  SELECT
    v_order_id,
    trim(elem ->> 'productId'),
    trim(elem ->> 'productModel'),
    coalesce(trim(elem ->> 'variant'), ''),
    (elem ->> 'quantity')::integer,
    (elem ->> 'unitPriceTwd')::integer,
    (elem ->> 'lineTotalTwd')::integer,
    coalesce(trim(elem ->> 'imageUrl'), '')
  FROM
    jsonb_array_elements(payload -> 'items') AS elems(elem);

  RETURN jsonb_build_object(
    'ok',
    TRUE,
    'orderId',
    v_order_id,
    'orderNumber',
    v_order_number,
    'batchDate',
    v_batch_date
  );
END;
$$;

-- 在 order_number 后插入 site_code 会改变列序；PostgreSQL 不允许 REPLACE 视为「status 改名为 site_code」。
DROP VIEW IF EXISTS public.orders_shippable_lines CASCADE;

CREATE OR REPLACE VIEW public.orders_shippable_lines AS
SELECT
  o.id AS order_id,
  o.order_number,
  o.site_code,
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

-- -----------------------------------------------------------------------------
-- 20250508100000_place_order_p_site_code.sql
-- -----------------------------------------------------------------------------
-- 修复：部分环境下 RPC 的 jsonb payload 未带上 siteCode，导致始终写入 default。
-- 改为显式第二参数 p_site_code（由 api/orders.js 传入 Vercel SITE_CODE）。
DROP FUNCTION IF EXISTS public.place_order (jsonb);

DROP FUNCTION IF EXISTS public.place_order (jsonb, text);

CREATE FUNCTION public.place_order (payload jsonb, p_site_code text DEFAULT NULL)
  RETURNS jsonb
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $$
DECLARE
  v_order_id uuid;
  v_order_number text;
  v_batch_date date;
  v_taipei timestamp WITHOUT TIME ZONE;
  v_item jsonb;
  v_product_id text;
  v_qty integer;
  v_rows integer;
  v_expected_subtotal bigint := 0;
  v_client_subtotal integer;
  v_client_shipping integer;
  v_client_total integer;
  v_country text;
  v_payment text;
  v_site_code text;
BEGIN
  IF payload IS NULL THEN
    RAISE EXCEPTION 'invalid payload';
  END IF;

  v_taipei := (now() AT TIME ZONE 'Asia/Taipei');

  IF (EXTRACT(hour FROM v_taipei) < 16) OR (
    EXTRACT(hour FROM v_taipei) = 16
    AND EXTRACT(minute FROM v_taipei) < 30
  ) THEN
    v_batch_date := v_taipei::date;
  ELSE
    v_batch_date := (v_taipei::date + 1);
  END IF;

  IF coalesce(trim(payload ->> 'customerName'), '') = ''
  OR coalesce(trim(payload ->> 'phone'), '') = ''
  OR coalesce(trim(payload ->> 'shippingAddress'), '') = ''
  OR coalesce(trim(payload ->> 'pickupStoreCode'), '') = ''
  OR coalesce(trim(payload ->> 'lineId'), '') = '' THEN
    RAISE EXCEPTION 'missing required customer fields';
  END IF;

  v_client_subtotal := coalesce((payload ->> 'subtotalTwd')::integer, -1);
  v_client_shipping := coalesce((payload ->> 'shippingTwd')::integer, -1);
  v_client_total := coalesce((payload ->> 'totalTwd')::integer, -1);

  IF v_client_subtotal < 0 OR v_client_shipping < 0 OR v_client_total < 0 THEN
    RAISE EXCEPTION 'invalid amounts';
  END IF;

  IF payload -> 'items' IS NULL OR jsonb_typeof(payload -> 'items') != 'array' OR jsonb_array_length(payload -> 'items') = 0 THEN
    RAISE EXCEPTION 'items required';
  END IF;

  SELECT
    coalesce(sum(((elem ->> 'lineTotalTwd')::bigint)), 0) INTO v_expected_subtotal
  FROM
    jsonb_array_elements(payload -> 'items') AS elems(elem);

  IF v_expected_subtotal != v_client_subtotal THEN
    RAISE EXCEPTION 'subtotal mismatch';
  END IF;

  IF v_client_total != v_client_subtotal + v_client_shipping THEN
    RAISE EXCEPTION 'total mismatch';
  END IF;

  v_country := coalesce(nullif(trim(payload ->> 'country'), ''), '台灣');
  v_payment := coalesce(nullif(trim(payload ->> 'paymentMethod'), ''), 'cod');
  -- 优先使用服务端传入的 p_site_code（与 Vercel SITE_CODE 对齐）
  v_site_code := coalesce(
    nullif(trim(p_site_code), ''),
    nullif(trim(payload ->> 'siteCode'), ''),
    nullif(trim(payload ->> 'site_code'), ''),
    'default'
  );

  FOR v_item IN
    SELECT
      elem
    FROM
      jsonb_array_elements(payload -> 'items') AS elems(elem)
    LOOP
      v_product_id := trim(v_item ->> 'productId');
      v_qty := coalesce((v_item ->> 'quantity')::integer, 0);

      IF v_product_id = '' OR v_qty IS NULL OR v_qty <= 0 THEN
        RAISE EXCEPTION 'invalid line item';
      END IF;

      UPDATE public.inventory
      SET
        on_hand = on_hand - v_qty
      WHERE
        product_id = v_product_id
        AND on_hand >= v_qty;

      GET DIAGNOSTICS v_rows = ROW_COUNT;

      IF v_rows = 0 THEN
        RAISE EXCEPTION 'insufficient_stock:%', v_product_id;
      END IF;
    END LOOP;

  INSERT INTO public.orders (
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
    site_code
  )
  VALUES (
    '待确认',
    v_batch_date,
    trim(payload ->> 'customerName'),
    trim(payload ->> 'phone'),
    trim(payload ->> 'shippingAddress'),
    trim(payload ->> 'pickupStoreCode'),
    trim(payload ->> 'lineId'),
    coalesce(trim(payload ->> 'notes'), ''),
    v_client_subtotal,
    v_client_shipping,
    v_client_total,
    v_country,
    v_payment,
    v_site_code
  )
  RETURNING
    id,
    order_number INTO v_order_id,
    v_order_number;

  INSERT INTO public.order_items (
    order_id,
    product_id,
    product_model,
    variant,
    quantity,
    unit_price_twd,
    line_total_twd,
    image_url
  )
  SELECT
    v_order_id,
    trim(elem ->> 'productId'),
    trim(elem ->> 'productModel'),
    coalesce(trim(elem ->> 'variant'), ''),
    (elem ->> 'quantity')::integer,
    (elem ->> 'unitPriceTwd')::integer,
    (elem ->> 'lineTotalTwd')::integer,
    coalesce(trim(elem ->> 'imageUrl'), '')
  FROM
    jsonb_array_elements(payload -> 'items') AS elems(elem);

  RETURN jsonb_build_object(
    'ok',
    TRUE,
    'orderId',
    v_order_id,
    'orderNumber',
    v_order_number,
    'batchDate',
    v_batch_date
  );
END;
$$;

REVOKE ALL ON FUNCTION public.place_order (jsonb, text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.place_order (jsonb, text) TO service_role;

COMMENT ON VIEW public.orders_shippable_lines IS 'Flattened orders × lines for shipping lookups in Dashboard (do not INSERT/UPDATE here—edit orders / order_items).';

-- =============================================================================
-- 完成：public.inventory | public.orders | public.order_items
--       public.orders_shippable_lines (VIEW)
--       public.place_order(jsonb, text) — 與 api/orders.js 呼叫一致
-- =============================================================================


-- 庫存種子：與購物車 line.productId 一致（見各商品頁 *_PRODUCT_ID 與 pinkyImportedCatalog.id）
-- 在 migrations / full_apply 之後於 SQL Editor 執行一次即可解除「一直庫存不足」。
-- 可重複執行：ON CONFLICT 會覆寫 title 並把 on_hand 設為下列值（依實際營運請自行改數字）。

INSERT INTO public.inventory (product_id, title, on_hand)
VALUES
  -- 主站商品詳情頁
  ('atomizer', '原子棒主機', 99999),
  ('bullet', 'SP2S 思博瑞一代', 99999),
  ('cartoon', '卡通限量版主機', 99999),
  ('diya', 'DIYA 叮啞主機', 99999),
  ('diya-7500', 'DIYA 7500', 99999),
  ('diya-pods', 'DIYA 叮啞煙彈', 99999),
  ('hebat-gen6', 'Hebat Gen6', 99999),
  ('jupiter-6500-set', 'Jupiter 6500 套裝', 99999),
  ('lana-e-liquid-30ml', 'LANA 30ml 煙油', 99999),
  ('lana-pods', 'LANA 一代煙彈', 99999),
  ('lanna', 'LANNA 主機', 99999),
  ('mohoo-tokyo-box', '魔盒 Tokyo Box', 99999),
  ('pro', 'SP2S Pro', 99999),
  ('sp2s-gen1-pods', 'SP2S 一代煙彈', 99999),
  ('sp2s-silicone-sleeve', 'SP2S 矽膠套', 99999),
  ('vapor-storm-5000', 'Vapor Storm 5000', 99999),
  ('vstorm-gen5-pods', 'Vapor Storm Gen5 煙彈', 99999),
  ('venus-host', 'Venus 主機', 99999),
  -- Pinky 進口精選（src/data/pinkyImportedCatalog.ts）
  ('relx-pod-pro2-pods', 'RELX POD PRO 2 菸彈', 99999),
  ('relx-infinity-pro2-host', 'RELX Infinity Pro 2 主機', 99999),
  ('relx-phantom-gen5-host', 'RELX 幻影五代主機', 99999),
  ('relx-ga8000', 'RELX GA8000', 99999),
  ('ilia-gen4-6500', 'ILIA 4代6500', 99999),
  ('meel-boost-10000', 'meeL BOOST 10000', 99999),
  ('meel-max-6000', 'meeL MAX 6000', 99999),
  ('meel-marbo-9000', 'MEEL 馬博 9000', 99999),
  ('max-g-gen1', 'MAX-G 一代', 99999),
  ('ilia-gen1', 'ILIA 一代', 99999),
  ('tutx-gen1', 'TUTX 一代', 99999),
  ('luckin-gen1', 'Luckin 一代', 99999),
  ('sars-gen1', '殺小 SARS 一代', 99999),
  ('ilia-gen5', 'ILIA 五代', 99999),
  ('ice-bear-gen5', '冰熊 五代', 99999),
  ('tisic-cola-bottle', 'TISIC 可樂瓶', 99999),
  ('tisic-black-cat', 'TISIC 黑騎士', 99999),
  ('kis5-gen1', 'Kis5 一代', 99999),
  ('kis5-disposable-6500', 'Kis5 6500', 99999),
  ('mehai-gen1', '魅嗨一代', 99999),
  ('mehai-gen5', '魅嗨五代', 99999),
  ('infinity-series', '無限', 99999),
  ('universal-sleeve', '通用保護套', 99999),
  ('marbo-9000', 'MARBO 9000', 99999),
  ('obi-disposable-8000', 'OBI 8000', 99999),
  ('chill-disposable-8800', 'CHILL 8800', 99999),
  ('relx-smash-go-12k', 'RELX Smash Go 12K', 99999),
  ('dot-plus-8000', 'Dot Plus 8000', 99999),
  ('mistx-6500', 'MistX 6500', 99999),
  ('meha-titan-15000-host', 'meha 泰坦 15000 主機', 99999)
ON CONFLICT (product_id) DO UPDATE
SET
  title = excluded.title,
  on_hand = excluded.on_hand;
