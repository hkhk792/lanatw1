-- Helpers used by place_order / customer status (production defs)
CREATE OR REPLACE FUNCTION public.normalize_line_id(raw text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  SELECT lower(trim(both '@' from coalesce(raw, '')));
$function$;

CREATE OR REPLACE FUNCTION public.normalize_tw_mobile(raw text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
AS $function$
  SELECT CASE
    WHEN regexp_replace(coalesce(raw, ''), '\D', '', 'g') ~ '^09\d{8}$' THEN regexp_replace(raw, '\D', '', 'g')
    WHEN regexp_replace(coalesce(raw, ''), '\D', '', 'g') ~ '^9\d{8}$' THEN '0' || regexp_replace(raw, '\D', '', 'g')
    WHEN regexp_replace(coalesce(raw, ''), '\D', '', 'g') ~ '^8869\d{8}$' THEN '0' || substr(regexp_replace(raw, '\D', '', 'g'), 4)
    ELSE ''
  END;
$function$;

CREATE OR REPLACE FUNCTION public.customer_has_prior_orders(p_phone text, p_line_id text, p_site_code text DEFAULT 'default'::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_phone text;
  v_line text;
  v_by_phone boolean := FALSE;
  v_by_line boolean := FALSE;
BEGIN
  v_phone := public.normalize_tw_mobile(p_phone);
  v_line := public.normalize_line_id(p_line_id);

  IF v_phone <> '' THEN
    SELECT EXISTS (
      SELECT 1
      FROM public.orders o
      WHERE coalesce(trim(o.status), '') NOT IN ('已取消', '取消', 'cancelled', 'canceled')
        AND public.normalize_tw_mobile(o.phone) = v_phone
      LIMIT 1
    ) INTO v_by_phone;
  END IF;

  IF v_line <> '' THEN
    SELECT EXISTS (
      SELECT 1
      FROM public.orders o
      WHERE coalesce(trim(o.status), '') NOT IN ('已取消', '取消', 'cancelled', 'canceled')
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
$function$;

CREATE TABLE IF NOT EXISTS public.checkout_phone_otps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  code_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_site_norm_phone_active_idx
  ON public.orders (
    site_code,
    public.normalize_tw_mobile(phone)
  )
  WHERE coalesce(trim(status), '') NOT IN ('已取消', '取消', 'cancelled', 'canceled');

-- Align sequence after restore (restore script also sets this)
SELECT setval('public.order_number_seq', GREATEST(32, (SELECT COALESCE(MAX(substring(order_number from '[0-9]+$')::bigint), 0) FROM public.orders)));
