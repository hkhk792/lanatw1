-- =============================================================================
-- 在 Supabase：SQL Editor → 新建查询 → 整份粘贴 → Run
--
-- 作用：下架以下 meeL 拋棄式 SKU（从 public.inventory 删除库存行）：
--   meel-boost-10000、meeL MAX 6000 奶茶杯、meel-marbo-9000
--
-- 与前台同步：已从 src/data/pinkyImportedCatalog.ts 一次性专区移除。
-- 可重复执行。
-- =============================================================================

DELETE FROM public.inventory
WHERE product_id IN (
  'meel-boost-10000',
  'meel-max-6000',
  'meel-marbo-9000'
);

SELECT product_id, title, on_hand
FROM public.inventory
WHERE product_id IN (
  'meel-boost-10000',
  'meel-max-6000',
  'meel-marbo-9000'
);
