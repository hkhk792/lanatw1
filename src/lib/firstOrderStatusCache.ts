const CACHE_KEY = "sp2s-first-order-status-v1";
const TTL_MS = 5 * 60 * 1000;

type Entry = {
  phone: string;
  isFirstOrder: boolean;
  at: number;
};

function readAll(): Record<string, Entry> {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, Entry>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, Entry>) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    /* quota / private mode */
  }
}

export function getCachedFirstOrderStatus(phone: string): boolean | null {
  const entry = readAll()[phone];
  if (!entry || Date.now() - entry.at > TTL_MS) return null;
  return entry.isFirstOrder;
}

export function setCachedFirstOrderStatus(phone: string, isFirstOrder: boolean) {
  const all = readAll();
  all[phone] = { phone, isFirstOrder, at: Date.now() };
  writeAll(all);
}
