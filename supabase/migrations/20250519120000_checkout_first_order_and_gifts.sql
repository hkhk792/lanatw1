-- 首單包郵查詢、簡訊 OTP、place_order 贈品不扣庫存
CREATE TABLE IF NOT EXISTS public.checkout_phone_otps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  code_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS checkout_phone_otps_phone_created_idx
  ON public.checkout_phone_otps (phone, created_at DESC);

ALTER TABLE public.checkout_phone_otps ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.checkout_phone_otps FROM PUBLIC;
REVOKE ALL ON TABLE public.checkout_phone_otps FROM anon;
REVOKE ALL ON TABLE public.checkout_phone_otps FROM authenticated;
GRANT ALL ON TABLE public.checkout_phone_otps TO service_role;

CREATE OR REPLACE FUNCTION public.normalize_tw_mobile (raw text)
  RETURNS text
  LANGUAGE sql
  IMMUTABLE
  AS $$
  SELECT CASE
    WHEN regexp_replace(coalesce(raw, ''), '\D', '', 'g') ~ '^09\d{8}$' THEN regexp_replace(raw, '\D', '', 'g')
    WHEN regexp_replace(coalesce(raw, ''), '\D', '', 'g') ~ '^9\d{8}$' THEN '0' || regexp_replace(raw, '\D', '', 'g')
    WHEN regexp_replace(coalesce(raw, ''), '\D', '', 'g') ~ '^8869\d{8}$' THEN '0' || substr(regexp_replace(raw, '\D', '', 'g'), 4)
    ELSE ''
  END;
$$;

CREATE OR REPLACE FUNCTION public.normalize_line_id (raw text)
  RETURNS text
  LANGUAGE sql
  IMMUTABLE
  AS $$
  SELECT lower(trim(both '@' from coalesce(raw, '')));
$$;

CREATE OR REPLACE FUNCTION public.customer_has_prior_orders (
  p_phone text,
  p_line_id text,
  p_site_code text DEFAULT 'default'
)
  RETURNS jsonb
  LANGUAGE plpgsql
  STABLE
  SECURITY DEFINER
  SET search_path = public
  AS $$
DECLARE
  v_phone text;
  v_line text;
  v_site text;
  v_by_phone boolean := FALSE;
  v_by_line boolean := FALSE;
BEGIN
  v_phone := public.normalize_tw_mobile(p_phone);
  v_line := public.normalize_line_id(p_line_id);
  v_site := coalesce(nullif(trim(p_site_code), ''), 'default');

  IF v_phone <> '' THEN
    SELECT EXISTS (
      SELECT 1
      FROM public.orders o
      WHERE o.site_code = v_site
        AND coalesce(trim(o.status), '') NOT IN ('已取消', '取消', 'cancelled', 'canceled')
        AND public.normalize_tw_mobile(o.phone) = v_phone
      LIMIT 1
    ) INTO v_by_phone;
  END IF;

  IF v_line <> '' THEN
    SELECT EXISTS (
      SELECT 1
      FROM public.orders o
      WHERE o.site_code = v_site
        AND coalesce(trim(o.status), '') NOT IN ('已取消', '取消', 'cancelled', 'canceled')
        AND public.normalize_line_id(o.line_id) = v_line
      LIMIT 1
    ) INTO v_by_line;
  END IF;

  RETURN jsonb_build_object(
    'hasPriorOrders',
    v_by_phone OR v_by_line,
    'matchedByPhone',
    v_by_phone,
    'matchedByLineId',
    v_by_line
  );
END;
$$;

REVOKE ALL ON FUNCTION public.customer_has_prior_orders (text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.customer_has_prior_orders (text, text, text) TO service_role;

CREATE OR REPLACE FUNCTION public.place_order (payload jsonb, p_site_code text DEFAULT NULL)
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
  v_line_total integer;
  v_rows integer;
  v_expected_subtotal bigint := 0;
  v_client_subtotal integer;
  v_client_shipping integer;
  v_client_total integer;
  v_country text;
  v_payment text;
  v_site_code text;
  v_standard_shipping integer;
  v_first_order_free boolean;
  v_prior jsonb;
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

  v_site_code := coalesce(
    nullif(trim(p_site_code), ''),
    nullif(trim(payload ->> 'siteCode'), ''),
    nullif(trim(payload ->> 'site_code'), ''),
    'default'
  );

  v_standard_shipping := CASE
    WHEN v_client_subtotal >= 1500 THEN 0
    ELSE 70
  END;

  v_first_order_free := coalesce((payload ->> 'firstOrderFreeShipping')::boolean, FALSE);

  IF v_client_shipping = 0 AND v_client_subtotal < 1500 THEN
    IF NOT v_first_order_free THEN
      RAISE EXCEPTION 'shipping mismatch';
    END IF;

    v_prior := public.customer_has_prior_orders(
      payload ->> 'phone',
      payload ->> 'lineId',
      v_site_code
    );

    IF coalesce((v_prior ->> 'hasPriorOrders')::boolean, TRUE) THEN
      RAISE EXCEPTION 'first_order_shipping_not_eligible';
    END IF;
  ELSIF v_client_shipping != v_standard_shipping THEN
    RAISE EXCEPTION 'shipping mismatch';
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
      v_line_total := coalesce((v_item ->> 'lineTotalTwd')::integer, 0);

      IF v_product_id = '' OR v_qty IS NULL OR v_qty <= 0 THEN
        RAISE EXCEPTION 'invalid line item';
      END IF;

      -- 促銷贈品列不扣庫存（productId 含 ::buy10-gift 或 ::buy5-gift，或小計為 0 的贈品行）
      IF v_product_id LIKE '%::buy10-gift'
        OR v_product_id LIKE '%::buy5-gift'
        OR (v_line_total = 0 AND v_product_id LIKE '%-gift%') THEN
          CONTINUE;
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
