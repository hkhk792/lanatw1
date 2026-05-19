import { describe, expect, it } from "vitest";
import { getCartProductImageById, resolveCartLineImageUrl } from "./cartProductImages";

describe("resolveCartLineImageUrl", () => {
  it("keeps valid product-photos absolute path", () => {
    expect(
      resolveCartLineImageUrl("diya-pods", "/product-photos/product-8.webp")
    ).toBe("/product-photos/product-8.webp");
  });

  it("fixes relative product-photos path without leading slash", () => {
    expect(resolveCartLineImageUrl("diya-pods", "product-photos/product-8.webp")).toBe(
      "/product-photos/product-8.webp"
    );
  });

  it("falls back from stale vite /assets/ path", () => {
    expect(resolveCartLineImageUrl("diya-pods", "/assets/product-8-abc123.webp")).toBe(
      "/product-photos/product-8.webp"
    );
  });

  it("resolves sp2s-gen1-pods by product id", () => {
    expect(getCartProductImageById("sp2s-gen1-pods")).toContain("sp2s-gen1-pods-catalog");
  });
});
