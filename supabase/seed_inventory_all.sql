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
  ('sp2s-universal-pods', 'SP2S 通用煙彈', 99999),
  ('sp2s-empty-shell-standard', 'SP2S 空倉標準版', 99999),
  ('sp2s-empty-shell-pro', 'SP2S 空倉 Pro', 99999),
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
