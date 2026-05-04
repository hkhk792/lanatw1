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
