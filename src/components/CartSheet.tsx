import { useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";

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

  const handleCheckout = () => {
    if (lines.length === 0) return;
    toast.success("訂單已提交", {
      description: `共 ${itemCount} 件 · 合計 ${formatTwd(subtotalTwd)}`,
    });
    clearCart();
    closeCart();
  };

  const goToProduct = (productId: string) => {
    closeCart();
    if (productId === "cartoon") navigate("/product/cartoon");
    else if (productId === "lanna") navigate("/product/lanna");
    else if (productId === "bullet") navigate("/product/bullet");
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
            <span className="text-sm font-normal text-gray-500">（{itemCount} 件）</span>
          </SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-12 text-center text-gray-500">
            <ShoppingCart className="h-12 w-12 text-gray-300" />
            <p>購物車目前是空的</p>
            <button
              type="button"
              onClick={closeCart}
              className="mt-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
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
                          className="line-clamp-2 text-left text-sm font-medium text-gray-900 hover:text-blue-600"
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
              </ul>
            </div>

            <div className="border-t border-gray-100 bg-white px-6 py-4">
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
                  onClick={handleCheckout}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
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
