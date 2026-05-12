import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { requestHomeScrollRestore } from "@/lib/homeScrollRestore";
import { useCart } from "@/contexts/CartContext";
import { SelectVariantDialog } from "@/components/SelectVariantDialog";
import { BrandSp2s } from "@/components/BrandSp2s";
import {
  SP2S_UNIVERSAL_POD_PRICE_TWD,
  SP2S_UNIVERSAL_POD_PRODUCT_ID,
  SP2S_UNIVERSAL_PODS_FLAVORS,
  sp2sUniversalPodImageByIndex,
} from "@/data/sp2sUniversalPods";
import { ORDER_MODEL_SP2S_UNIVERSAL_PODS } from "@/lib/orderProductModels";

const DEFAULT_SITE_TITLE = "SP2S — 品味精髓 | 奢華蒸氣工坊";

const Sp2sUniversalPodsDetail = () => {
  const navigate = useNavigate();
  const { addToCart, itemCount, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState(SP2S_UNIVERSAL_PODS_FLAVORS[0]!.name);
  const [variantPromptOpen, setVariantPromptOpen] = useState(false);

  const activeIndex = useMemo(
    () => SP2S_UNIVERSAL_PODS_FLAVORS.find((f) => f.name === selectedFlavor)?.index ?? 1,
    [selectedFlavor]
  );

  const heroSrc = useMemo(() => sp2sUniversalPodImageByIndex(activeIndex), [activeIndex]);

  useEffect(() => {
    document.title = `${ORDER_MODEL_SP2S_UNIVERSAL_PODS}｜口味選購`;
    return () => {
      document.title = DEFAULT_SITE_TITLE;
    };
  }, []);

  const buildCartPayload = () => {
    if (!selectedFlavor) return null;
    return {
      productId: SP2S_UNIVERSAL_POD_PRODUCT_ID,
      title: ORDER_MODEL_SP2S_UNIVERSAL_PODS,
      variant: selectedFlavor,
      priceTwd: SP2S_UNIVERSAL_POD_PRICE_TWD,
      quantity,
      imageUrl: sp2sUniversalPodImageByIndex(activeIndex),
    };
  };

  const handleAddToCart = () => {
    if (!selectedFlavor) {
      setVariantPromptOpen(true);
      return;
    }
    const payload = buildCartPayload();
    if (!payload) return;
    addToCart(payload);
    toast.success("已加入購物車", { description: `【${selectedFlavor}】x${quantity}` });
  };

  const handleBuyNow = () => {
    if (!selectedFlavor) {
      setVariantPromptOpen(true);
      return;
    }
    const payload = buildCartPayload();
    if (!payload) return;
    addToCart(payload);
    openCart();
  };

  const goHome = () => {
    requestHomeScrollRestore();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SelectVariantDialog
        open={variantPromptOpen}
        onOpenChange={setVariantPromptOpen}
        message="請先選擇口味，再加入購物車或立即購買。"
      />

      <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <p className="max-w-[70%] truncate text-sm font-semibold tracking-wide text-gray-800">
            <BrandSp2s className="font-semibold text-gray-800" /> 煙彈 · {selectedFlavor}
          </p>
          <button
            type="button"
            onClick={openCart}
            className="relative inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
          >
            <ShoppingCart className="h-5 w-5" />
            購物車
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      <main className="container mx-auto max-w-6xl px-4 py-8">
        <button
          type="button"
          onClick={goHome}
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          返回首頁
        </button>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              <img
                key={heroSrc}
                src={heroSrc}
                alt={`${ORDER_MODEL_SP2S_UNIVERSAL_PODS} — ${selectedFlavor}`}
                className="mx-auto block h-[min(92vw,28rem)] w-full max-w-lg object-contain object-center transition-opacity duration-300 sm:h-[26rem] lg:h-[28rem]"
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="mt-3 text-center text-xs text-gray-500">切換口味即更換對應包裝示意圖（共 32 款）。</p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <Link to="/" className="hover:text-gray-700">
                首頁
              </Link>
              <span>/</span>
              <Link to="/#disposables" className="hover:text-gray-700">
                通配與菸彈
              </Link>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              <BrandSp2s className="font-bold text-gray-900" /> 煙彈（一代通用）
            </h1>
            <p className="text-sm leading-relaxed text-gray-600">
              與常見一代規格主機相容思路設計；尼古丁 3% 等標示以實際包裝為準。下單前請透過 LINE 確認現貨。
            </p>
            <div className="text-4xl font-bold text-gray-900">{`NT$${SP2S_UNIVERSAL_POD_PRICE_TWD}.00`}</div>

            <div className="space-y-3">
              <label className="text-lg font-medium text-gray-800">口味：</label>
              <div className="max-h-[min(50vh,22rem)] overflow-y-auto rounded-lg border border-gray-100 bg-gray-50/60 p-3">
                <div className="flex flex-wrap gap-2">
                  {SP2S_UNIVERSAL_PODS_FLAVORS.map((f) => (
                    <button
                      key={f.name}
                      type="button"
                      onClick={() => {
                        setSelectedFlavor(f.name);
                        setQuantity(1);
                      }}
                      className={`rounded-full border px-3 py-2 text-sm transition-colors ${
                        selectedFlavor === f.name
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6 py-3 text-lg font-medium text-gray-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex min-w-[10rem] flex-1 items-center justify-center gap-2 rounded-lg border-2 border-orange-500 px-6 py-3 font-medium text-orange-600 transition-colors hover:bg-orange-50"
                >
                  <ShoppingCart className="h-5 w-5" />
                  加入購物車
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex min-w-[10rem] flex-1 items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  立即購買
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sp2sUniversalPodsDetail;
