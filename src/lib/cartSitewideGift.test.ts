import { describe, expect, it } from "vitest";
import { sitewideGiftEligibility, SITEWIDE_GIFT_THRESHOLD } from "./cartSitewideGift";
import type { CartLine } from "@/contexts/CartContext";

const line = (productId: string, qty: number, lineId = productId): CartLine => ({
  lineId,
  productId,
  title: productId,
  variant: "default",
  quantity: qty,
  priceTwd: 100,
  imageUrl: "/x.webp",
});

describe("sitewideGiftEligibility", () => {
  it("empty cart -> 0 gifts, need 10 more", () => {
    const e = sitewideGiftEligibility([]);
    expect(e.paidQty).toBe(0);
    expect(e.eligibleGifts).toBe(0);
    expect(e.qtyToNextGift).toBe(SITEWIDE_GIFT_THRESHOLD);
    expect(e.nextGiftAtQty).toBe(SITEWIDE_GIFT_THRESHOLD);
  });

  it("below threshold -> 0 gifts, qtyToNext is remainder to 10", () => {
    const e = sitewideGiftEligibility([line("a", 3), line("b", 4, "b")]);
    expect(e.paidQty).toBe(7);
    expect(e.eligibleGifts).toBe(0);
    expect(e.qtyToNextGift).toBe(3);
  });

  it("exactly 10 -> 1 gift, next at 20", () => {
    const e = sitewideGiftEligibility([line("a", 10)]);
    expect(e.eligibleGifts).toBe(1);
    expect(e.qtyToNextGift).toBe(10);
    expect(e.nextGiftAtQty).toBe(20);
  });

  it("20 across mixed products -> 2 gifts", () => {
    const e = sitewideGiftEligibility([
      line("sp2s-universal-pods", 12),
      line("bullet", 5, "bullet"),
      line("diya", 3, "diya"),
    ]);
    expect(e.paidQty).toBe(20);
    expect(e.eligibleGifts).toBe(2);
    expect(e.qtyToNextGift).toBe(10);
  });

  it("25 paid -> still 2 gifts (rounds down)", () => {
    const e = sitewideGiftEligibility([line("a", 25)]);
    expect(e.eligibleGifts).toBe(2);
    expect(e.qtyToNextGift).toBe(5);
    expect(e.nextGiftAtQty).toBe(30);
  });

  it("ignores negative/zero quantities defensively", () => {
    const weird = [line("a", 10), { ...line("b", 0, "b"), quantity: -5 }];
    const e = sitewideGiftEligibility(weird);
    expect(e.paidQty).toBe(10);
    expect(e.eligibleGifts).toBe(1);
  });
});
