-- Example: seed on_hand for each product_id that exists in your storefront CartContext.
-- product_id must match the string used in addToCart (e.g. "lana-pods", "diya-pods").
-- Run in Supabase SQL Editor after migrations.

-- INSERT INTO public.inventory (product_id, title, on_hand) VALUES
--   ('lana-pods', 'LANA 3 顆裝', 500),
--   ('diya-pods', 'DIYA 叮啞煙彈', 300)
-- ON CONFLICT (product_id) DO UPDATE
--   SET title = excluded.title,
--       on_hand = excluded.on_hand;
