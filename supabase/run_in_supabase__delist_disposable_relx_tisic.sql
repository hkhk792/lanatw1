-- =============================================================================
-- 在 Supabase：SQL Editor → 新建查询 → 整份粘贴 → Run
--
-- 作用：下架以下拋棄式 SKU（从 public.inventory 删除库存行）：
--   relx-ga8000、relx-smash-go-12k、tisic-cola-bottle
--
-- 与前台同步：已从 src/data/pinkyImportedCatalog.ts 一次性专区移除。
-- TISIC新版 黑騎士/萌貓派對（tisic-black-cat）仍上架，前台单价已改为 NT$420。
-- 可重复执行：不存在的 SKU 会被跳过，不影响其他数据。
-- =============================================================================

DELETE FROM public.inventory
WHERE product_id IN (
  'relx-ga8000',
  'relx-smash-go-12k',
  'tisic-cola-bottle'
);

SELECT product_id, title, on_hand
FROM public.inventory
WHERE product_id IN (
  'relx-ga8000',
  'relx-smash-go-12k',
  'tisic-cola-bottle'
);
