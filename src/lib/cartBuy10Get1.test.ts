import { describe, expect, it } from "vitest";
import {
  buy10Get1PoolSummaries,
  buildCheckoutOrderItems,
  BUY10_GIFT_SUFFIX,
} from "./cartBuy10Get1";
import type { CartLine } from "@/contexts/CartContext";

const line = (qty: number): CartLine => ({
  lineId: "1",
  productId: "sp2s-universal-pods",
  title: "SP2S",
  variant: "西瓜",
  quantity: qty,
  priceTwd: 350,
  imageUrl: "/x.webp",
});

describe("buy10Get1PoolSummaries (pods 5+1)", () => {
  it("gives 0 gifts below 5 paid units", () => {
    expect(buy10Get1PoolSummaries([line(4)])).toEqual([]);
  });

  it("gives 1 gift at 5 paid units", () => {
    const s = buy10Get1PoolSummaries([line(5)]);
    expect(s).toHaveLength(1);
    expect(s[0].giftUnits).toBe(1);
    expect(s[0].totalPieces).toBe(6);
  });

  it("gives 2 gifts at 10 paid units", () => {
    expect(buy10Get1PoolSummaries([line(10)])[0].giftUnits).toBe(2);
  });

  it("still rounds down (9 paid → 1 gift)", () => {
    expect(buy10Get1PoolSummaries([line(9)])[0].giftUnits).toBe(1);
  });
});

describe("buildCheckoutOrderItems", () => {
  it("appends zero-priced gift line", () => {
    const items = buildCheckoutOrderItems([line(5)]);
    expect(items).toHaveLength(2);
    expect(items[1].productId).toBe(`sp2s-universal-pods${BUY10_GIFT_SUFFIX}`);
    expect(items[1].lineTotalTwd).toBe(0);
    expect(items[1].variant).toContain("買五送一");
  });
});
