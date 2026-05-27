/** postMessage / URL 回传类型（与 api/cvs/pcsc-callback 一致） */
export const PCSC_EMAP_MESSAGE = "sp2s-pcsc-cvs-store" as const;

export type PcscSelectedStore = {
  storeId: string;
  storeName: string;
  storeAddress: string;
};

export function getPcscCallbackUrl(): string {
  return `${window.location.origin}/api/cvs/pcsc-callback`;
}

/** 7-11 电子地图：手机用 mobilemap，桌面用 ecmap（皆需带 url 回调） */
export function buildPcscEmapUrl(callbackUrl: string): string {
  const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  const base = mobile
    ? "https://emap.pcsc.com.tw/mobilemap/default.aspx"
    : "https://emap.pcsc.com.tw/ecmap/default.aspx";
  return `${base}?url=${encodeURIComponent(callbackUrl)}`;
}

export function openPcscStoreSelector(): Window | null {
  const mapUrl = buildPcscEmapUrl(getPcscCallbackUrl());
  return window.open(
    mapUrl,
    "pcscEmap",
    "noopener,noreferrer,width=1024,height=720,scrollbars=yes,resizable=yes"
  );
}

export function parsePcscStoreFromSearchParams(
  params: URLSearchParams
): PcscSelectedStore | null {
  const storeId = params.get("cvs_storeid")?.trim();
  if (!storeId) return null;
  return {
    storeId,
    storeName: params.get("cvs_storename")?.trim() ?? "",
    storeAddress: params.get("cvs_storeaddress")?.trim() ?? "",
  };
}

export function formatShippingAddressFromStore(store: PcscSelectedStore): string {
  return [store.storeName, store.storeAddress].filter(Boolean).join(" · ");
}

export function isPcscStoreMessage(data: unknown): data is {
  type: typeof PCSC_EMAP_MESSAGE;
  store: PcscSelectedStore;
} {
  if (!data || typeof data !== "object") return false;
  const d = data as { type?: string; store?: PcscSelectedStore };
  return (
    d.type === PCSC_EMAP_MESSAGE &&
    Boolean(d.store?.storeId?.trim())
  );
}
