-- =============================================================================
-- 在 Supabase：SQL Editor → 新建查询 → 整份粘贴 → Run
--
-- 作用：删除本脚本涉及的订单/库存相关对象后，按「当前商城后台 + 下单 API」
--       需要的结构一次性重建。表少、字段带中文注释，便于在控制台里看懂。
--
-- ⚠️ 会删除 public 下的：orders_shippable_lines 视图、order_items、orders、
--    inventory、订单号序列、place_order、assign_order_number 等。
--    执行前请确认你已自行备份数据。
-- =============================================================================

-- ----- 先拆依赖（顺序勿随意改） -----
DROP VIEW IF EXISTS public.orders_shippable_lines CASCADE;

DROP TRIGGER IF EXISTS tr_orders_assign_number ON public.orders;

DROP FUNCTION IF EXISTS public.assign_order_number () CASCADE;

DROP FUNCTION IF EXISTS public.place_order (jsonb) CASCADE;

DROP FUNCTION IF EXISTS public.place_order (jsonb, text) CASCADE;

DROP TABLE IF EXISTS public.order_items CASCADE;

DROP TABLE IF EXISTS public.orders CASCADE;

DROP TABLE IF EXISTS public.inventory CASCADE;

DROP SEQUENCE IF EXISTS public.order_number_seq CASCADE;

-- ----- 1) 库存：一行一个商品 SKU，与前台购物车 productId 一致 -----
CREATE TABLE public.inventory (
  product_id text PRIMARY KEY,
  title text,
  on_hand integer NOT NULL DEFAULT 0 CHECK (on_hand >= 0)
);

COMMENT ON TABLE public.inventory IS '商品库存：下单时由 place_order 扣减 on_hand。';

COMMENT ON COLUMN public.inventory.product_id IS '商品 ID，须与网站购物车里的 productId 一致。';

COMMENT ON COLUMN public.inventory.title IS '商品标题（可选，仅方便人工查看）。';

COMMENT ON COLUMN public.inventory.on_hand IS '当前可售库存数量（非负整数）。';

-- ----- 2) 订单主表 -----
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  order_number text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT '待确认',
  batch_date date NOT NULL,
  customer_name text NOT NULL,
  phone text NOT NULL,
  shipping_address text NOT NULL,
  pickup_store_code text NOT NULL,
  line_id text NOT NULL,
  notes text NOT NULL DEFAULT '',
  subtotal_twd integer NOT NULL CHECK (subtotal_twd >= 0),
  shipping_twd integer NOT NULL CHECK (shipping_twd >= 0),
  total_twd integer NOT NULL CHECK (total_twd >= 0),
  country text NOT NULL DEFAULT '台灣',
  payment_method text NOT NULL DEFAULT 'cod',
  site_code text NOT NULL DEFAULT 'default',
  created_at timestamptz NOT NULL DEFAULT now (),
  CONSTRAINT orders_status_check CHECK (
    status IN (
      '待确认',
      '已发出',
      '已取消',
      '异常'
    )
  )
);

COMMENT ON TABLE public.orders IS '订单主表：一笔订单一行；明细在 order_items。';

COMMENT ON COLUMN public.orders.order_number IS '对外订单号，如 SP2S-000001；通常由触发器自动生成。';

COMMENT ON COLUMN public.orders.status IS '订单状态：待确认 | 已发出 | 已取消 | 异常。';

COMMENT ON COLUMN public.orders.batch_date IS '截单批次日期（台北时区 16:30 为界，由 place_order 写入）。';

COMMENT ON COLUMN public.orders.customer_name IS '收货人姓名。';

COMMENT ON COLUMN public.orders.phone IS '联系电话。';

COMMENT ON COLUMN public.orders.shipping_address IS '收货地址（可含超商说明）。';

COMMENT ON COLUMN public.orders.pickup_store_code IS '收货门市代码等。';

COMMENT ON COLUMN public.orders.line_id IS '买家 LINE ID。';

COMMENT ON COLUMN public.orders.notes IS '订单备注。';

COMMENT ON COLUMN public.orders.subtotal_twd IS '商品小计（新台币整数）。';

COMMENT ON COLUMN public.orders.shipping_twd IS '运费（新台币整数）。';

COMMENT ON COLUMN public.orders.total_twd IS '订单合计（新台币整数）。';

COMMENT ON COLUMN public.orders.country IS '国家/地区。';

COMMENT ON COLUMN public.orders.payment_method IS '付款方式代码，例如 cod。';

COMMENT ON COLUMN public.orders.site_code IS '站点标识，与部署环境变量 SITE_CODE 对齐；单站可保留 default。';

COMMENT ON COLUMN public.orders.created_at IS '写入时间（服务器时区带时区）。';

-- ----- 3) 订单明细 -----
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  order_id uuid NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
  product_id text NOT NULL,
  product_model text NOT NULL,
  variant text NOT NULL DEFAULT '',
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price_twd integer NOT NULL CHECK (unit_price_twd >= 0),
  line_total_twd integer NOT NULL CHECK (line_total_twd >= 0),
  image_url text NOT NULL DEFAULT ''
);

CREATE INDEX idx_order_items_order_id ON public.order_items (order_id);

COMMENT ON TABLE public.order_items IS '订单明细：一笔订单多行，每行一件商品。';

COMMENT ON COLUMN public.order_items.order_id IS '所属订单 orders.id。';

COMMENT ON COLUMN public.order_items.product_id IS '商品 ID（与 inventory、购物车一致）。';

COMMENT ON COLUMN public.order_items.product_model IS '商品型号/品名（不含口味等时写在 variant）。';

COMMENT ON COLUMN public.order_items.variant IS '规格/口味等。';

COMMENT ON COLUMN public.order_items.quantity IS '购买数量。';

COMMENT ON COLUMN public.order_items.unit_price_twd IS '单价（新台币整数）。';

COMMENT ON COLUMN public.order_items.line_total_twd IS '行小计（新台币整数）。';

COMMENT ON COLUMN public.order_items.image_url IS '商品图 URL，可为空字符串。';

-- ----- 4) 订单号序列 + 插入前自动填 order_number -----
CREATE SEQUENCE public.order_number_seq;

CREATE FUNCTION public.assign_order_number ()
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

CREATE TRIGGER tr_orders_assign_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_order_number ();

-- ----- 5) 下单 RPC（与 api/orders.js 一致：payload + p_site_code）-----
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

COMMENT ON FUNCTION public.place_order (jsonb, text) IS '原子下单：校验金额、扣库存、写 orders + order_items；由服务端 service_role 调用。';

REVOKE ALL ON FUNCTION public.place_order (jsonb, text) FROM PUBLIC;

-- service_role is Supabase-only; self-hosted Node connects as DB owner
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    GRANT EXECUTE ON FUNCTION public.place_order (jsonb, text) TO service_role;
  END IF;
END $$;

-- ----- 6) 只读视图：一行 = 一单里的一件货（方便在控制台当「宽表」看）-----
CREATE VIEW public.orders_shippable_lines AS
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

COMMENT ON VIEW public.orders_shippable_lines IS '订单×明细展开：勿在此视图 INSERT/UPDATE；改状态请改 orders。';

-- ----- 7) RLS：无面向 anon 的策略，仅 service_role / 控制台 postgres 可用 -----
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 跑完后请自行插入库存，否则下单会报 insufficient_stock。
-- 推荐：supabase/insert_inventory_zh.sql（全量 UPSERT，简体说明）
-- 或：supabase/seed_inventory_all.sql（与上者 SKU 列表同步维护）
-- =============================================================================
