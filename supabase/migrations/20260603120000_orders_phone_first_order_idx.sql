-- 加速首單包郵 customer_has_prior_orders 手機比對
CREATE INDEX IF NOT EXISTS orders_site_norm_phone_active_idx
  ON public.orders (
    site_code,
    public.normalize_tw_mobile(phone)
  )
  WHERE coalesce(trim(status), '') NOT IN ('已取消', '取消', 'cancelled', 'canceled');
