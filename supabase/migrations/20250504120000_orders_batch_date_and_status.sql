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
