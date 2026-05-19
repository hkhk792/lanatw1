import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { buy10Get1PoolSummaries } from "@/lib/cartBuy10Get1";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { flushHomeScrollPosition } from "@/lib/homeScrollRestore";

const formatTwd = (n: number) => `NT$${n.toLocaleString("zh-TW")}`;

const CartSheet = () => {
  const {
    lines,
    itemCount,
    subtotalTwd,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const navigate = useNavigate();

  const buy10Summaries = useMemo(() => buy10Get1PoolSummaries(lines), [lines]);

  const promoLabel = (productId: string) => {
    if (productId === "sp2s-universal-pods") return "SP2S 煙彈";
    if (productId === "lana-pods") return "LANA 煙彈";
    return productId;
  };

  const handleGoCheckout = () => {
    if (lines.length === 0) return;
    closeCart();
    navigate("/checkout");
  };

  const goToProduct = (productId: string) => {
    closeCart();
    flushHomeScrollPosition();
    if (productId === "cartoon") navigate("/product/cartoon");
    else if (productId === "lanna") navigate("/product/lanna");
    else if (productId === "bullet") navigate("/product/bullet");
    else if (productId === "pro") navigate("/product/pro");
    else if (productId === "atomizer") navigate("/product/atomizer");
    else if (productId === "diya") navigate("/product/diya");
    else if (productId === "diya-7500") navigate("/product/diya-7500");
    else if (productId === "jupiter-6500-set") navigate("/product/jupiter-6500");
    else if (productId === "vapor-storm-5000") navigate("/product/vapor-storm-5000");
    else if (productId === "venus-host") navigate("/product/venus-host");
    else if (productId === "mohoo-tokyo-box") navigate("/product/mohoo-tokyo-box");
    else if (productId === "hebat-gen6") navigate("/product/hebat-gen6");
    else if (productId === "lana-pods") navigate("/product/lana-pods");
    else if (productId === "showcase-gear" || productId === "sp2s-silicone-sleeve")
      navigate("/product/sp2s-silicone-sleeve");
    else if (productId === "showcase-gen5" || productId === "vstorm-gen5-pods")
      navigate("/product/vapor-storm-gen5-pods");
    else if (productId === "diya-pods") navigate("/product/diya-pods");
    else if (productId === "sp2s-gen1-pods") navigate("/product/sp2s-gen1-pods");
    else if (productId === "sp2s-universal-pods") navigate("/product/sp2s-universal-pods");
    else if (productId === "sp2s-empty-shell-standard") navigate("/product/sp2s-empty-shell-standard");
    else if (productId === "sp2s-empty-shell-pro") navigate("/product/sp2s-empty-shell-pro");
    else if (productId === "showcase-e-liquid" || productId === "lana-e-liquid-30ml")
      navigate("/product/lana-e-liquid-30ml");
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? null : closeCart())}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 bg-white p-0 text-gray-900 sm:max-w-md"
      >
        <SheetHeader className="border-b border-gray-100 px-6 py-4 text-left">
          <SheetTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <ShoppingCart className="h-5 w-5" />
            購物車
            <span className="text-sm font-normal text-gray-500">（{itemCount} 顆）</span>
          </SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-12 text-center text-gray-500">
            <ShoppingCart className="h-12 w-12 text-gray-300" />
            <p>購物車目前是空的</p>
            <button
              type="button"
              onClick={closeCart}
              className="mt-2 border border-neutral-900 bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              繼續選購
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="space-y-4">
                {lines.map((line) => (
                  <li
                    key={line.lineId}
                    className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3"
                  >
                    <button
                      type="button"
                      onClick={() => goToProduct(line.productId)}
                      className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white"
                    >
                      {line.imageUrl ? (
                        <img
                          src={line.imageUrl}
                          alt={line.title}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                          商品
                        </div>
                      )}
                    </button>
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <button
                          type="button"
                          onClick={() => goToProduct(line.productId)}
                          className="line-clamp-2 text-left text-sm font-medium text-gray-900 hover:text-neutral-600"
                        >
                          {line.title}
                        </button>
                        <p className="mt-1 text-xs text-gray-500">款式：{line.variant}</p>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="inline-flex items-center overflow-hidden rounded-lg border border-gray-300 bg-white">
                          <button
                            type="button"
                            aria-label="减少数量"
                            onClick={() =>
                              updateQuantity(line.lineId, Math.max(1, line.quantity - 1))
                            }
                            className="px-2 py-1.5 text-gray-700 hover:bg-gray-100"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-8 px-2 text-center text-sm font-medium">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="增加数量"
                            onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
                            className="px-2 py-1.5 text-gray-700 hover:bg-gray-100"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">
                            {formatTwd(line.priceTwd * line.quantity)}
                          </span>
                          <button
                            type="button"
                            aria-label="移除"
                            onClick={() => removeFromCart(line.lineId)}
                            className="grid h-7 w-7 place-items-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
                {buy10Summaries.map((s) => (
                  <li
                    key={`gift-${s.productId}`}
                    className="flex gap-3 rounded-xl border border-emerald-200/90 bg-emerald-50/60 p-3"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-emerald-200/80 bg-white">
                      {s.poolImageUrl ? (
                        <img
                          src={s.poolImageUrl}
                          alt="贈品"
                          className="h-full w-full object-contain opacity-90"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-emerald-800">
                          贈
                        </div>
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <p className="text-sm font-medium text-emerald-950">
                          贈品 · 買十送一（{promoLabel(s.productId)}）
                        </p>
                        <p className="mt-1 text-xs text-emerald-900/90">
                          付費 {s.paidQty} 顆 → 贈 {s.giftUnits} 顆，實際到手 {s.totalPieces} 顆
                        </p>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="rounded-full border border-emerald-300 bg-white px-2 py-0.5 text-xs font-medium text-emerald-900">
                          × {s.giftUnits}
                        </span>
                        <span className="text-sm font-semibold text-emerald-900">免費</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-100 bg-white px-6 py-4">
              {buy10Summaries.length > 0 && (
                <p className="mb-3 text-[11px] leading-relaxed text-emerald-900/90">
                  買十送一：贈品口味以門市／客服為準；小計為付費顆數金額，贈品不計價。
                </p>
              )}
              <div className="flex items-baseline justify-between text-gray-700">
                <span className="text-sm">小計</span>
                <span className="text-xl font-bold text-gray-900">{formatTwd(subtotalTwd)}</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">運費於結帳頁計算</p>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={clearCart}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  清空
                </button>
                <button
                  type="button"
                  onClick={handleGoCheckout}
                  className="flex-1 rounded-lg bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
                >
                  前往結帳
                </button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
