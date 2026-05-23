import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronLeft, Plus, Minus } from "lucide-react";
import { requestHomeScrollRestore } from "@/lib/homeScrollRestore";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { SelectVariantDialog } from "@/components/SelectVariantDialog";
import { ProductDetailLineSupportNotice } from "@/components/product/ProductDetailLineSupportNotice";
import { LINE_CUSTOMER_ID } from "@/constants/lineOfficial";
import { ProductHeroFeatureTags } from "@/components/ProductHeroFeatureTags";
import { productPhoto, SITE_LOGO_PHOTO } from "@/lib/productPhotos";

const productMain = productPhoto("disposable-flare-nimmbox-go.webp");
const logoImage = SITE_LOGO_PHOTO;
import { ORDER_MODEL_JUPITER_SET } from "@/lib/orderProductModels";

const JUPITER_PRODUCT_ID = "jupiter-6500-set";
const JUPITER_PRICE_TWD = 480;

const flavorGroups: { group: string; options: string[] }[] = [
  { group: "木星套裝專屬口味（5 款）", options: ["菸草套裝", "芋頭套裝", "咖啡套裝", "蘋果套裝", "楊梅套裝"] },
];

const Jupiter6500SetDetail = () => {
  const navigate = useNavigate();
  const { addToCart, itemCount, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [variantPromptOpen, setVariantPromptOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const buildCartPayload = () => {
    if (!selectedOption) return null;
    return {
      productId: JUPITER_PRODUCT_ID,
      title: ORDER_MODEL_JUPITER_SET,
      variant: selectedOption,
      priceTwd: JUPITER_PRICE_TWD,
      quantity,
      imageUrl: productMain,
    };
  };

  const handleAddToCart = () => {
    if (!selectedOption) {
      setVariantPromptOpen(true);
      return;
    }
    const payload = buildCartPayload();
    if (!payload) return;
    addToCart(payload);
    toast.success("已加入購物車", { description: `【${selectedOption}】x${quantity}` });
  };

  const handleBuyNow = () => {
    if (!selectedOption) {
      setVariantPromptOpen(true);
      return;
    }
    const payload = buildCartPayload();
    if (!payload) return;
    addToCart(payload);
    openCart();
  };

  const handleOptionChange = (option: string) => {
    if (option !== selectedOption) {
      setQuantity(1);
    }
    setSelectedOption(option);
  };

  const getProductTitle = () =>
    "JUPITER 木星套裝 6500 口｜換彈拋棄式 · 台灣現貨";
  const getProductDescription = () =>
    "JUPITER 木星套裝 · 換彈拋棄式 · 參攷 6500 口 · 台灣現貨";
  const getCategory = () => "JUPITER 木星套裝";
  const getTags = () => "JUPITER，木星，6500 口，五款套裝可選";
  const getBadgeText = () =>
    selectedOption ? `台灣現貨｜${selectedOption}` : "木星套裝｜請先選擇套裝口味";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SelectVariantDialog
        open={variantPromptOpen}
        onOpenChange={setVariantPromptOpen}
        message="請先從下方選擇一種套裝口味，再加入購物車或立即購買。"
      />
      <nav
        className={`sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm transition-transform duration-300 ${
          isScrolled ? "-translate-y-full" : ""
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-1">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="SP2S Logo" className="h-20 w-20 rounded-lg object-contain" />
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <a href="#" className="font-medium text-gray-700 hover:text-gray-900">
              我的帳號
            </a>
            <button
              type="button"
              onClick={openCart}
              className="font-medium text-gray-700 hover:text-gray-900"
            >
              結帳
            </button>
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
              <img
                src={productMain}
                alt="JUPITER 木星套裝 FLARE HIMMBOX"
                className="h-[500px] w-full object-contain"
              />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="rounded-md bg-red-600 px-6 py-2 font-bold text-white shadow-lg">{getBadgeText()}</div>
              </div>
            </div>

            <ProductHeroFeatureTags
              tags={["參攷 6500 口／彈", "Type-C 充電", "700mAh", "12W / Mesh", "智慧電量顯示"]}
            />

            <div className="mt-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">{getProductDescription()}</h2>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <a href="/" className="hover:text-gray-700">
                首頁
              </a>
              <span>/</span>
              <a href="/#one-time-disposables" className="hover:text-gray-700">
                拋棄式與主機
              </a>
              <span>/</span>
              <span className="tracking-tight text-gray-700">JUPITER 木星套裝</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{getProductTitle()}</h1>

            <div className="text-4xl font-bold text-gray-900">{`NT$${JUPITER_PRICE_TWD}.00`}</div>

            <div className="space-y-4">
              <label className="text-lg font-medium text-gray-800">套裝口味（請擇一）：</label>
              {flavorGroups.map(({ group, options }) => (
                <div key={group} className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{group}</p>
                  <div className="flex flex-wrap gap-2">
                    {options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleOptionChange(option)}
                        className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                          selectedOption === option
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-gray-700">
              <ProductDetailLineSupportNotice />
              <p>
                木星專屬煙彈＋兩件式主機，單顆煙彈參攷約
                6500
                口；實測隨使用習慣、功率顯示與充電週期而異。
              </p>
            </div>

            <div className="flex flex-col gap-4">
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
                  className="flex min-w-[10rem] flex-1 items-center justify-center gap-2 rounded-lg border-2 border-orange-500 py-3 px-6 font-medium text-orange-600 transition-colors hover:bg-orange-50"
                >
                  <ShoppingCart className="h-5 w-5" />
                  加入購物車
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex min-w-[10rem] flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 px-6 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  立即購買
                </button>
              </div>
              <p className="text-sm text-gray-500">切換套裝口味時數量會重設為 1。庫存、批次與包裝以實際到貨及客服回覆為準。</p>
            </div>

            <div className="mt-8 space-y-2 border-t border-gray-200 pt-6 text-sm text-gray-600">
              <div>
                <span className="font-medium text-gray-800">Category:</span> {getCategory()}
              </div>
              <div>
                <span className="font-medium text-gray-800">Tags:</span> {getTags()}
              </div>
            </div>
          </div>
        </div>

        <section className="mt-16 space-y-10">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
            <h2 className="text-2xl font-bold text-gray-900">商品介紹</h2>
            <div className="mt-4 h-px w-14 bg-gray-900" />
            <p className="mt-6 leading-8 text-gray-700">
              JUPITER 木星二代（Jupiter
              2）為兩件式設計的換彈拋棄系統，結合科技造型與人體工學握感：圓形介面與機身線條讓單手掌握更穩、外型具未來感。內建智慧顯示螢幕，可呈現參攷功率與剩餘電量，協助減少「不確定還剩多少電」的焦慮。單顆木星專屬煙彈參攷約
              6500
              口，在一般使用情境下延長更換週期；專彈專用接口與風道使口感與霧化表現一致。產品定位在兼顧便利、續航與視覺辨識度，屬高完成度的木星系列套裝。
            </p>

            <h3 className="mt-8 text-lg font-semibold text-gray-900">外觀與握感</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-8 text-gray-700">
              <li>圓形互動介面，相較前代在掌心貼合度與持握感上更佳。</li>
              <li>整體造型延續科技金屬語彙，兼顧外觀辨識與日常攜帶性。</li>
            </ul>

            <h3 className="mt-8 text-lg font-semibold text-gray-900">智慧顯示螢幕</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-8 text-gray-700">
              <li>精確參攷的功率與狀態顯示，方便掌握主機運作情況。</li>
              <li>幫助使用者彌補資訊落差，在出門或長時使用時感更安心（仍請以實機與說明書為準）。</li>
            </ul>

            <h3 className="mt-8 text-lg font-semibold text-gray-900">長效與專屬設計</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-8 text-gray-700">
              <li>單彈參攷 6500 口級別的大口數，降低頻繁換彈的頻率（實測因人而異）。</li>
              <li>專屬木星煙彈與主機匹配，從導油到氣道皆為一體化調校取向。</li>
            </ul>

            <h3 className="mt-8 text-lg font-semibold text-gray-900">硬體參攷（以包裝及實機為準）</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-8 text-gray-700">
              <li>充電：Type-C 介面。</li>
              <li>電池：參攷 700mAh 等級（可重複充電使用）。</li>
              <li>輸出與霧化：參攷 12W，Mesh 結構，口感與導流依口味批次略有差異。</li>
            </ul>

            <p className="mt-6 border-l-4 border-blue-200 pl-4 leading-8 text-gray-600">
              總結：木星套裝在智慧電量可視性與單彈大口數之間取得平衡，並以專彈專用維持穩定度；在同級換彈產品中，適合重視續航、體感與整體性價比的使用者（法規、年齡、警語請以包裝與產地標示為準）。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <h3 className="text-xl font-bold text-gray-900">主要特點</h3>
              <div className="mt-3 h-px w-12 bg-gray-900" />
              <ul className="mt-5 space-y-3 text-gray-700">
                {[
                  { k: "兩件式", v: "可充主機＋專屬彈，換彈拋棄、維護單純" },
                  { k: "大口數參攷", v: "單彈參攷 6500 口，週期較省更換" },
                  { k: "智慧顯示", v: "功率與電量參攷，降低使用不確定感" },
                  { k: "硬體", v: "Type-C、700mAh、12W、Mesh 霧化（參攷文宣與實測）" },
                ].map((item) => (
                  <li key={item.k} className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-blue-600" />
                    <div>
                      <span className="font-semibold text-gray-900">{item.k}：</span>
                      <span>{item.v}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <h3 className="text-xl font-bold text-gray-900">產品參數</h3>
              <div className="mt-3 h-px w-12 bg-gray-900" />
              <dl className="mt-5 grid grid-cols-1 gap-3 text-sm text-gray-700 sm:grid-cols-2">
                {[
                  ["商品名稱", "JUPITER 木星套裝 6500 口（換彈拋棄式電子煙，台灣現貨）"],
                  ["系列", "Jupiter 2 木星二代"],
                  ["參攷口數", "單彈參攷 6500 口（實測隨人為變因）"],
                  ["充電／電池", "Type-C 充電、參攷 700mAh"],
                  ["參攷功率／霧化", "12W、Mesh 線圈（以實測及包裝為準）"],
                  ["參攷價格", "NT$ 480"],
                  ["客服", `LINE ID：${LINE_CUSTOMER_ID}`],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex flex-col gap-0.5 border-b border-dashed border-gray-200 py-1.5 sm:col-span-2 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <dt className="text-gray-500">{k}</dt>
                    <dd className="font-medium text-gray-900 sm:max-w-[60%] sm:text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm md:p-10">
            <h3 className="text-xl font-bold text-gray-900">使用提醒</h3>
            <div className="mt-3 h-px w-12 bg-gray-900" />
            <p className="mt-5 leading-8 text-gray-700">
              本產品屬含尼古丁之電子煙相關產品，具成癮性。請依各司法管轄之法規、年齡與產地警語使用。參攷顯示數值、口數、功率以實機與包裝說明為主；顏色、庫存與批次以門市、到貨實品為準。需預訂、核對庫存請透過
              LINE（{LINE_CUSTOMER_ID}）聯繫客服。
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Jupiter6500SetDetail;
