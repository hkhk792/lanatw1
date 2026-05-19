import type { CartLine } from "@/contexts/CartContext";
import { resolveCartLineImageUrl } from "@/lib/cartProductImages";

/** 買十送一（SP2S／LANA 煙彈）：每付費 10 顆送 1 顆贈品，實際到手 = 付費顆數 + floor(付費/10)。 */
export const BUY10_GET1_PRODUCT_IDS = new Set<string>(["sp2s-universal-pods", "lana-pods"]);

const PAY_FOR = 10;
export const BUY10_GIFT_SUFFIX = "::buy10-gift";

export type Buy10Get1PoolSummary = {
  productId: string;
  productTitle: string;
  paidQty: number;
  giftUnits: number;
  totalPieces: number;
  poolImageUrl: string;
};

export function buy10Get1PoolSummaries(lines: readonly CartLine[]): Buy10Get1PoolSummary[] {
  const pools = new Map<string, CartLine[]>();
  for (const line of lines) {
    if (!BUY10_GET1_PRODUCT_IDS.has(line.productId)) continue;
    const arr = pools.get(line.productId) ?? [];
    arr.push(line);
    pools.set(line.productId, arr);
  }

  const out: Buy10Get1PoolSummary[] = [];
  for (const [productId, pool] of pools) {
    const paidQty = pool.reduce((s, l) => s + l.quantity, 0);
    const giftUnits = Math.floor(paidQty / PAY_FOR);
    if (giftUnits <= 0) continue;
    const productTitle = pool[0]?.title ?? "";
    const poolImageUrl =
      pool
        .map((l) => resolveCartLineImageUrl(l.productId, l.imageUrl))
        .find((url) => url.length > 0) ?? "";
    out.push({
      productId,
      productTitle,
      paidQty,
      giftUnits,
      totalPieces: paidQty + giftUnits,
      poolImageUrl,
    });
  }
  return out;
}

export function totalBuy10GiftPieces(lines: readonly CartLine[]): number {
  return buy10Get1PoolSummaries(lines).reduce((s, p) => s + p.giftUnits, 0);
}

export type CheckoutOrderItem = {
  productModel: string;
  variant: string;
  quantity: number;
  unitPriceTwd: number;
  lineTotalTwd: number;
  productId: string;
  imageUrl: string;
};

export function isBuy10GiftProductId(productId: string): boolean {
  return productId.endsWith(BUY10_GIFT_SUFFIX);
}

/** 結帳 API：付費列 + 每池一筆贈品列（單價／小計皆 0） */
export function buildCheckoutOrderItems(lines: readonly CartLine[]): CheckoutOrderItem[] {
  const paidItems: CheckoutOrderItem[] = lines.map((line) => ({
    productModel: line.title,
    variant: line.variant,
    quantity: line.quantity,
    unitPriceTwd: line.priceTwd,
    lineTotalTwd: line.priceTwd * line.quantity,
    productId: line.productId,
    imageUrl: resolveCartLineImageUrl(line.productId, line.imageUrl),
  }));

  const giftItems: CheckoutOrderItem[] = buy10Get1PoolSummaries(lines).map((s) => ({
    productModel: s.productTitle,
    variant: "買十送一贈品（口味隨機或依活動／客服，與付費品同系列）",
    quantity: s.giftUnits,
    unitPriceTwd: 0,
    lineTotalTwd: 0,
    productId: `${s.productId}${BUY10_GIFT_SUFFIX}`,
    imageUrl: s.poolImageUrl,
  }));

  return [...paidItems, ...giftItems];
}
