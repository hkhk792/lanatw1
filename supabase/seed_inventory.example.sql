-- 建議：直接執行 seed_inventory_all.sql（涵蓋主站 + Pinky 目錄的 product_id）。
-- 下列為最小示例；product_id 必須與購物車 addToCart 的字串完全一致。

-- INSERT INTO public.inventory (product_id, title, on_hand) VALUES
--   ('lana-pods', 'LANA 3 顆裝', 500),
--   ('diya-pods', 'DIYA 叮啞煙彈', 300)
-- ON CONFLICT (product_id) DO UPDATE
--   SET title = excluded.title,
--       on_hand = excluded.on_hand;
