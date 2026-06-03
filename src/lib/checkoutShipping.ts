/** 滿額免運門檻（非首單） */
export const FREE_SHIPPING_THRESHOLD_TWD = 1500;
export const STANDARD_SHIPPING_FEE_TWD = 70;

export function standardShippingTwd(subtotalTwd: number): number {
  return subtotalTwd >= FREE_SHIPPING_THRESHOLD_TWD ? 0 : STANDARD_SHIPPING_FEE_TWD;
}

export function resolveShippingTwd(
  subtotalTwd: number,
  firstOrderFreeShipping: boolean
): number {
  if (firstOrderFreeShipping) return 0;
  return standardShippingTwd(subtotalTwd);
}

/** 結帳右側顯示用：查詢中（isFirstOrder 為 null）時維持 NT$70，避免與「免運」來回跳動 */
export function displayShippingTwdForCheckout(
  subtotalTwd: number,
  isFirstOrder: boolean | null
): number {
  if (subtotalTwd >= FREE_SHIPPING_THRESHOLD_TWD) return 0;
  if (isFirstOrder === true) return 0;
  return STANDARD_SHIPPING_FEE_TWD;
}
