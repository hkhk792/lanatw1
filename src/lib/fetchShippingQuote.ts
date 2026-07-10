import { normalizeTaiwanMobile } from "@/lib/phoneTaiwan";

export type ShippingQuote = {
  phone: string;
  isFirstOrder: boolean;
  hasPriorOrders: boolean;
  shippingTwd: number;
};

type FetchShippingQuoteOptions = {
  forceRefresh?: boolean;
};

const inFlight = new Map<string, Promise<ShippingQuote>>();

/** 向後台取得運費報價；金額以 API 回傳為準，不做 session 快取。 */
export async function fetchShippingQuote(
  phone: string,
  subtotalTwd: number,
  { forceRefresh = false }: FetchShippingQuoteOptions = {}
): Promise<ShippingQuote> {
  const phoneNorm = normalizeTaiwanMobile(phone);
  if (!phoneNorm) {
    throw new Error("請輸入有效的台灣手機號碼");
  }

  const cacheKey = `${phoneNorm}:${subtotalTwd}`;
  if (!forceRefresh) {
    const pending = inFlight.get(cacheKey);
    if (pending) return pending;
  }

  const task = (async () => {
    const res = await fetch("/api/checkout/customer-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phoneNorm, subtotalTwd }),
    });
    const data = (await res.json().catch(() => null)) as {
      phone?: string;
      isFirstOrder?: boolean;
      hasPriorOrders?: boolean;
      shippingTwd?: number;
      error?: string;
    } | null;
    if (!res.ok) {
      throw new Error(data?.error || "無法查詢運費");
    }
    return {
      phone: data?.phone || phoneNorm,
      isFirstOrder: Boolean(data?.isFirstOrder),
      hasPriorOrders: Boolean(data?.hasPriorOrders),
      shippingTwd: Number(data?.shippingTwd) || 0,
    };
  })();

  if (!forceRefresh) {
    inFlight.set(cacheKey, task);
  }

  try {
    return await task;
  } finally {
    if (!forceRefresh) {
      inFlight.delete(cacheKey);
    }
  }
}
