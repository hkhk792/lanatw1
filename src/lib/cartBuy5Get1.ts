import type { CartLine } from "@/contexts/CartContext";

/**
 * 買五送一（SP2S／LANA 煙彈）：每付費 5 顆送 1 顆贈品，實際到手 = 付費顆數 + floor(付費/5)。
 * 同 productId 可混口味合併計算贈品；小計仍為付費列加總，贈品以 NT$0 獨立列顯示／寫入訂單。
 */
export const BUY5_GET1_PRODUCT_IDS = new Set<string>(["sp2s-universal-pods", "lana-pods"]);

const PAY_FOR = 5;

export type Buy5Get1PoolSummary = {
  productId: string;
  /** 同池第一列品名（贈品列標題用） */
  productTitle: string;
  paidQty: number;
  /** floor(paidQty / 5) */
  giftUnits: number;
  /** paidQty + giftUnits */
  totalPieces: number;
  poolImageUrl: string;
};

export function buy5Get1PoolSummaries(lines: readonly CartLine[]): Buy5Get1PoolSummary[] {
  const pools = new Map<string, CartLine[]>();
  for (const line of lines) {
    if (!BUY5_GET1_PRODUCT_IDS.has(line.productId)) continue;
    const arr = pools.get(line.productId) ?? [];
    arr.push(line);
    pools.set(line.productId, arr);
  }

  const out: Buy5Get1PoolSummary[] = [];
  for (const [productId, pool] of pools) {
    const paidQty = pool.reduce((s, l) => s + l.quantity, 0);
    const giftUnits = Math.floor(paidQty / PAY_FOR);
    if (giftUnits <= 0) continue;
    const productTitle = pool[0]?.title ?? "";
    const poolImageUrl = pool.find((l) => l.imageUrl)?.imageUrl ?? "";
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

/** 全部活動池贈品顆數加總（用於購物車「含贈共幾顆」） */
export function totalBuy5GiftPieces(lines: readonly CartLine[]): number {
  return buy5Get1PoolSummaries(lines).reduce((s, p) => s + p.giftUnits, 0);
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

/** 結帳 API：付費列 + 每池一筆贈品列（單價／小計皆 0） */
export function buildCheckoutOrderItems(lines: readonly CartLine[]): CheckoutOrderItem[] {
  const paidItems: CheckoutOrderItem[] = lines.map((line) => ({
    productModel: line.title,
    variant: line.variant,
    quantity: line.quantity,
    unitPriceTwd: line.priceTwd,
    lineTotalTwd: line.priceTwd * line.quantity,
    productId: line.productId,
    imageUrl: line.imageUrl ?? "",
  }));

  const giftItems: CheckoutOrderItem[] = buy5Get1PoolSummaries(lines).map((s) => ({
    productModel: s.productTitle,
    variant: "買五送一贈品（口味隨機或依活動／客服，與付費品同系列）",
    quantity: s.giftUnits,
    unitPriceTwd: 0,
    lineTotalTwd: 0,
    productId: `${s.productId}::buy5-gift`,
    imageUrl: s.poolImageUrl,
  }));

  return [...paidItems, ...giftItems];
}
