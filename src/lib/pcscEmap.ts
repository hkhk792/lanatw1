import { SHOP_SITE_URL } from "@/lib/domains";

/** postMessage / URL 回传类型（与 api/cvs/pcsc-callback 一致） */
export const PCSC_EMAP_MESSAGE = "sp2s-pcsc-cvs-store" as const;

/** 7-11 门市名称／店号查询（仅供查阅，无法自动带回结帐页） */
export const PCSC_PUBLIC_STORE_LOOKUP_URL =
  "https://emap.pcsc.com.tw/mobilemap/Name/Default.aspx";

/**
 * Presco C2C 电子地图（社群常用、无需向 7-11 单独申请 eshopid 亦可测试）。
 * 勿直接使用 mobilemap/default.aspx?url=…，未签约物流常会回 E0014「系统忙碌」。
 */
const PRESCO_C2C_MAP = "https://emap.presco.com.tw/c2cemap.ashx";
const DEFAULT_ESHOP_ID = "870";
const DEFAULT_SERVICE_TYPE = "1";

export type PcscSelectedStore = {
  storeId: string;
  storeName: string;
  storeAddress: string;
};

function isLocalDevHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".local")
  );
}

/** 选店完成后 POST 回传的网址（须为 https 正式域或本地开发） */
export function getPcscCallbackUrl(): string {
  if (typeof window === "undefined") {
    return `${SHOP_SITE_URL}/api/cvs/pcsc-callback`;
  }
  if (isLocalDevHost(window.location.hostname)) {
    return `${window.location.origin}/api/cvs/pcsc-callback`;
  }
  return `${window.location.origin}/api/cvs/pcsc-callback`;
}

/** Presco 选店地图（选店后会 POST 至 callback） */
export function buildPrescoEmapUrl(callbackUrl: string): string {
  const params = new URLSearchParams({
    eshopid: DEFAULT_ESHOP_ID,
    servicetype: DEFAULT_SERVICE_TYPE,
    url: callbackUrl,
  });
  return `${PRESCO_C2C_MAP}?${params.toString()}`;
}

/**
 * 开启 7-11 选店（同页跳转，避免弹窗与 Cookie 被挡）。
 * 选店完成后会回到结帐页并自动填入门市。
 */
export function openPcscStoreSelector(): void {
  const callbackUrl = getPcscCallbackUrl();
  const mapUrl = buildPrescoEmapUrl(callbackUrl);
  sessionStorage.setItem(
    "sp2s-checkout-before-cvs-map",
    `${window.location.pathname}${window.location.search}`
  );
  window.location.assign(mapUrl);
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
