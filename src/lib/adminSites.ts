/**
 * 后台「站点」筛选项：含尚无订单的站，避免下拉只出现 sp2s-1 / sp2s-2。
 * 可通过 VITE_ADMIN_SITE_CODES（逗号分隔）覆盖/追加。
 */
const DEFAULT_ADMIN_SITE_CODES = [
  "lanatw1",
  "sp2s-1",
  "sp2s-2",
  "sp2s-4",
  "sp2s-5",
] as const;

function parseEnvSiteCodes(): string[] {
  const raw = import.meta.env.VITE_ADMIN_SITE_CODES as string | undefined;
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function mergeAdminSiteCodes(fromOrders: Iterable<string | undefined | null>): string[] {
  const merged = new Set<string>([...DEFAULT_ADMIN_SITE_CODES, ...parseEnvSiteCodes()]);
  for (const sc of fromOrders) {
    const v = sc?.trim();
    if (v) merged.add(v);
  }
  return Array.from(merged).sort();
}
