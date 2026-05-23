-- =============================================================================
-- 在 Supabase：SQL Editor → 新建查询 → 整份粘贴 → Run
--
-- 作用：下架 MAX-G 一代通用系列（product_id = max-g-gen1）
--       从 public.inventory 删除库存行，下单时将因无库存记录而无法扣减（等同停售）。
--
-- 与前台同步：已从 src/data/pinkyImportedCatalog.ts 及首页烟弹／主机板块移除。
-- 可重复执行：若已无该 SKU，DELETE 不影响其他数据。
-- =============================================================================

DELETE FROM public.inventory
WHERE product_id = 'max-g-gen1';

-- 执行后应返回 0 或 1 行；下列查询无结果即表示已下架成功
SELECT product_id, title, on_hand
FROM public.inventory
WHERE product_id = 'max-g-gen1';
