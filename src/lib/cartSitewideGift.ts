import type { CartLine } from "@/contexts/CartContext";

/**
 * 全場買 10 送 1：購物車件數每湊滿 10 件，
 * 結帳後可請客戶私訊 LINE 客服自選 1 份贈品。
 *
 * 件數 = 購物車內所有商品數量合計（站點目前無其他自動贈品活動，
 * 購物車列即為付費列）。
 */
export const SITEWIDE_GIFT_THRESHOLD = 10;

export type SitewideGiftEligibility = {
  /** 購物車內所有付費商品的件數合計 */
  paidQty: number;
  /** 已可向 LINE 客服領取的贈品份數 */
  eligibleGifts: number;
  /** 達到下一份贈品還差幾件（已達門檻時為下一倍數的差額） */
  qtyToNextGift: number;
  /** 下一份贈品需累積到的總件數 */
  nextGiftAtQty: number;
};

export function sitewideGiftEligibility(
  lines: readonly CartLine[]
): SitewideGiftEligibility {
  const paidQty = lines.reduce((sum, l) => sum + Math.max(0, l.quantity), 0);
  const eligibleGifts = Math.floor(paidQty / SITEWIDE_GIFT_THRESHOLD);
  const nextGiftAtQty = (eligibleGifts + 1) * SITEWIDE_GIFT_THRESHOLD;
  const qtyToNextGift = Math.max(0, nextGiftAtQty - paidQty);

  return { paidQty, eligibleGifts, qtyToNextGift, nextGiftAtQty };
}
