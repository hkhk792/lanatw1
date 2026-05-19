import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronLeft, Plus, Minus } from "lucide-react";
import { requestHomeScrollRestore } from "@/lib/homeScrollRestore";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { ProductHeroFeatureTags } from "@/components/ProductHeroFeatureTags";
import { BrandSp2s } from "@/components/BrandSp2s";
import { productPhoto, SITE_LOGO_PHOTO } from "@/lib/productPhotos";
import {
  ORDER_MODEL_SP2S_EMPTY_SHELL_PRO,
  ORDER_MODEL_SP2S_EMPTY_SHELL_STANDARD,
} from "@/lib/orderProductModels";

const MOQ = 100;
const UNIT_PRICE_TWD = 35;

type ShellKind = "standard" | "pro";

const SHELL_CONFIG: Record<
  ShellKind,
  {
    productId: string;
    orderModel: string;
    pageTitle: string;
    heroSrc: string;
    heroAlt: string;
    badge: string;
    bullets: string[];
  }
> = {
  standard: {
    productId: "sp2s-empty-shell-standard",
    orderModel: ORDER_MODEL_SP2S_EMPTY_SHELL_STANDARD,
    pageTitle: "SP2／SP2S 一代空殼（一般版白芯）",
    heroSrc: productPhoto("standard-white-core.png"),
    heroAlt: "SP2 一代空殼 一般版白芯 透明殼體",
    badge: "正版空殼 · 2.3ml",
    bullets: [
      "一般版白芯，正版 SP2 一代通用空殼。",
      "灌滿參考容量約 2.3ml（實際以灌裝與使用方式為準）。",
      "原為舊版 SP2 盒裝殼路線；下單前可透過 LINE 與客服確認批次與相容。",
    ],
  },
  pro: {
    productId: "sp2s-empty-shell-pro",
    orderModel: ORDER_MODEL_SP2S_EMPTY_SHELL_PRO,
    pageTitle: "SP2S 一代空殼（Pro 版盒裝殼）",
    heroSrc: productPhoto("pro-shell.png"),
    heroAlt: "SP2S Pro 版一代空殼 透明殼體",
    badge: "Pro 版殼 · 2.3ml",
    bullets: [
      "Pro 版殼，SP2S 正版一代空殼。",
      "灌滿參考容量約 2.3ml（實際以灌裝與使用方式為準）。",
      "為目前盒裝 SP2 系列所使用之殼型；下單前可透過 LINE 與客服確認現貨。",
    ],
  },
};

function Sp2sEmptyShellDetailPage({ kind }: { kind: ShellKind }) {
  const navigate = useNavigate();
  const { addToCart, itemCount, openCart } = useCart();
  const [quantity, setQuantity] = useState(MOQ);
  const [isScrolled, setIsScrolled] = useState(false);
  const c = SHELL_CONFIG[kind];

  const buildCartPayload = () => ({
    productId: c.productId,
    title: c.orderModel,
    variant: "空殼單規格",
    priceTwd: UNIT_PRICE_TWD,
    quantity,
    imageUrl: c.heroSrc,
  });

  const handleAddToCart = () => {
    if (quantity < MOQ) {
      toast.error(`本商品 ${MOQ} 顆起拿`, { description: "請將數量調整為至少 100 顆。" });
      return;
    }
    addToCart(buildCartPayload());
    toast.success("已加入購物車", { description: `${quantity} 顆 × NT$${UNIT_PRICE_TWD}` });
  };

  const handleBuyNow = () => {
    if (quantity < MOQ) {
      toast.error(`本商品 ${MOQ} 顆起拿`, { description: "請將數量調整為至少 100 顆。" });
      return;
    }
    addToCart(buildCartPayload());
    openCart();
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <nav
        className={`sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm transition-transform duration-300 ${
          isScrolled ? "-translate-y-full" : ""
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-1">
          <div className="flex items-center gap-2">
            <img src={SITE_LOGO_PHOTO} alt="SP2S Logo" className="h-20 w-20 rounded-lg object-contain" />
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <button
              type="button"
              onClick={openCart}
              className="relative font-medium text-gray-700 hover:text-gray-900"
            >
              購物車
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>
          </div>

          <div>
            <button type="button" onClick={openCart} aria-label="購物車" className="relative md:hidden">
              <ShoppingCart className="h-5 w-5 text-gray-600" />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[10px] text-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                requestHomeScrollRestore();
                navigate("/");
              }}
              className="mb-4 flex items-center gap-1 text-gray-600 transition-colors hover:text-gray-900"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="text-sm font-medium">返回首頁</span>
            </button>

            <div className="relative overflow-hidden rounded-lg bg-gray-50">
              <img src={c.heroSrc} alt={c.heroAlt} className="h-[500px] w-full object-contain" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="rounded-md bg-red-600 px-6 py-2 font-bold text-white shadow-lg">{c.badge}</div>
              </div>
            </div>

            <ProductHeroFeatureTags tags={["一代空殼", "2.3ml 參考容量", `${MOQ} 顆起拿`, "LINE 客服確認現貨"]} />
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <a href="/" className="hover:text-gray-700">
                首頁
              </a>
              <span>/</span>
              <a href="/#pods-liquid-gear" className="hover:text-gray-700">
                全品類一覽
              </a>
              <span>/</span>
              <span className="tracking-tight text-gray-700">{c.pageTitle}</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              {kind === "pro" ? (
                <>
                  <BrandSp2s className="text-inherit" />
                  {c.pageTitle.replace(/^SP2S\s*/, "")}
                </>
              ) : (
                c.pageTitle
              )}
            </h1>

            <div>
              <div className="text-4xl font-bold text-gray-900">{`NT$${UNIT_PRICE_TWD}`}</div>
              <p className="mt-1 text-sm font-medium text-amber-800">每顆 · {MOQ} 顆起拿（未滿 {MOQ} 顆無法下單）</p>
            </div>

            <p className="text-sm leading-relaxed text-gray-700">
              批補／現貨與相容細節請洽 LINE 客服（abs791012）。本站僅供參考展示，實際出貨規格以客服回覆為準。
            </p>

            <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
              {c.bullets.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>

            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium text-gray-800">數量（顆）</p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(MOQ, q - 1))}
                    className="px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-[4rem] px-6 py-3 text-center text-lg font-medium text-gray-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
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
                  className="flex min-w-[10rem] flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
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
}

export function Sp2sEmptyShellStandardDetail() {
  return <Sp2sEmptyShellDetailPage kind="standard" />;
}

export function Sp2sEmptyShellProDetail() {
  return <Sp2sEmptyShellDetailPage kind="pro" />;
}
