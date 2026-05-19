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
