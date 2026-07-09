import { getCachedFirstOrderStatus, setCachedFirstOrderStatus } from "@/lib/firstOrderStatusCache";
import { normalizeTaiwanMobile } from "@/lib/phoneTaiwan";

const inFlight = new Map<string, Promise<boolean>>();

/** 查詢此手機是否首單（可免運）；結果快取 5 分鐘，並合併進行中的請求。 */
export async function fetchFirstOrderStatus(phone: string): Promise<boolean> {
  const phoneNorm = normalizeTaiwanMobile(phone);
  if (!phoneNorm) {
    throw new Error("請輸入有效的台灣手機號碼");
  }

  const cached = getCachedFirstOrderStatus(phoneNorm);
  if (cached !== null) return cached;

  const pending = inFlight.get(phoneNorm);
  if (pending) return pending;

  const task = (async () => {
    const res = await fetch("/api/checkout/customer-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phoneNorm }),
    });
    const data = (await res.json().catch(() => null)) as {
      isFirstOrder?: boolean;
      error?: string;
    } | null;
    if (!res.ok) {
      throw new Error(data?.error || "無法查詢首單資格");
    }
    const isFirst = Boolean(data?.isFirstOrder);
    setCachedFirstOrderStatus(phoneNorm, isFirst);
    return isFirst;
  })();

  inFlight.set(phoneNorm, task);
  try {
    return await task;
  } finally {
    inFlight.delete(phoneNorm);
  }
}
