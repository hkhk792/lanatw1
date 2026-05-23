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

const productMain = productPhoto("disposable-vapengin-venus.webp");
const logoImage = SITE_LOGO_PHOTO;
import { ORDER_MODEL_VENUS_HOST } from "@/lib/orderProductModels";

const VENUS_PRODUCT_ID = "venus-host";
const VENUS_PRICE_TWD = 219;

const flavorGroups: { group: string; options: string[] }[] = [
  { group: "甜點類", options: ["花生曲奇", "焦糖花生"] },
  {
    group: "水果類",
    options: ["芒果藍冰", "菠蘿汽水", "草莓", "西瓜", "桃子", "百香果", "葡萄"],
  },
  { group: "清涼類", options: ["櫻桃薄荷"] },
];

const VenusHostDetail = () => {
  const navigate = useNavigate();
  const { addToCart, itemCount, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [variantPromptOpen, setVariantPromptOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const getProductTitle = () =>
    "VENUS 金星主機可充電霧化主機｜VAPENGIN 2ml Mesh · 台灣現貨";
  const getProductDescription = () => "VENUS 金星主機 · 可充電霧化 · Mesh · 台灣現貨";
  const getCategory = () => "VENUS 金星主機";
  const getTags = () => "VENUS，VAPENGIN，金星主機，多口味可選";
  const getBadgeText = () =>
    selectedOption ? `台灣現貨｜${selectedOption}` : "可充電主機｜請先選擇口味";

  const buildCartPayload = () => {
    if (!selectedOption) return null;
    return {
      productId: VENUS_PRODUCT_ID,
      title: ORDER_MODEL_VENUS_HOST,
      variant: selectedOption,
      priceTwd: VENUS_PRICE_TWD,
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

  useEffect(() => {
    document.title = "VENUS 金星主機｜VAPENGIN";
  }, []);

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
        message="請先從下方選擇一種煙彈口味，再加入購物車或立即購買。"
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
                alt="VAPENGIN VENUS 金星主機"
                className="h-[500px] w-full object-contain"
              />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="rounded-md bg-red-600 px-6 py-2 font-bold text-white shadow-lg">
                  {getBadgeText()}
                </div>
              </div>
            </div>

            <ProductHeroFeatureTags tags={["2ml 煙彈", "500mAh 可充電", "Mesh 線圈", "約 600 口"]} />

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
              <span className="tracking-tight text-gray-700">VENUS 金星主機</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{getProductTitle()}</h1>

            <p className="text-sm text-gray-600">可充電霧化電子煙主機 · 台灣現貨 · VAPENGIN 2ml Mesh</p>

            <div className="text-4xl font-bold text-gray-900">{`NT$${VENUS_PRICE_TWD.toLocaleString("zh-TW")}.00`}</div>

            <div className="max-h-[min(60vh,520px)] space-y-4 overflow-y-auto pr-1">
              <label className="text-lg font-medium text-gray-800">口味與規格（煙彈口味參考，請選一種）：</label>
              {flavorGroups.map(({ group, options }) => (
                <div key={group} className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{group}</p>
                  <div className="flex flex-wrap gap-2">
                    {options.map((option) => (
                      <button
                        key={`${group}-${option}`}
                        type="button"
                        onClick={() => handleOptionChange(option)}
                        className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
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
              <p>半透明外殼＋金屬底座，小巧便攜；專用金星煙彈，Mesh 霧化細膩穩定。</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100"
                    aria-label="減少數量"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6 py-3 text-lg font-medium text-gray-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100"
                    aria-label="增加數量"
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
              <p className="text-sm text-gray-500">
                切換口味時數量會重設為 1。不同口味可分批加入購物車。口味與庫存以實際到貨與客服確認為準。
              </p>
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
              VENUS
              金星主機是一款設計精緻的電子煙設備，採用半透明材質搭配金屬底座，造型時尚，兼具科技感與美學。網狀（Mesh）線圈提供均勻加熱、口感細膩；500mAh
              大電量支援約 600 口，全日使用更安心。可換 2ml
              煙彈設計，隨行替換不同口味，主機緊湊好攜帶。專為金星煙彈適配，發揮穩定霧化表現，是重視外觀與性能的使用者理想之選。
            </p>

            <h3 className="mt-8 text-lg font-semibold text-gray-900">重點特色</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-8 text-gray-700">
              <li>
                <span className="font-semibold text-gray-900">外觀設計：</span>
                半透明材質搭配金屬底座，造型時尚，科技感與美感並存。
              </li>
              <li>
                <span className="font-semibold text-gray-900">網狀線圈技術：</span>
                均勻加熱，霧氣口感細膩、輸出穩定。
              </li>
              <li>
                <span className="font-semibold text-gray-900">大容量電池：</span>
                500mAh，支援約 600 口，續航足以應付整日需求。
              </li>
              <li>
                <span className="font-semibold text-gray-900">可換煙彈設計：</span>2ml
                煙彈，方便依喜好更換；一次可備多顆，輪替口味。
              </li>
              <li>
                <span className="font-semibold text-gray-900">便捷操作：</span>
                主機輕巧便攜，適合日常與外出。
              </li>
              <li>
                <span className="font-semibold text-gray-900">專用適配：</span>
                專為金星煙彈設計，以達最佳霧化表現。
              </li>
            </ul>
            <p className="mt-6 border-l-4 border-blue-200 pl-4 leading-8 text-gray-600">
              總結：VENUS
              金星主機以 Mesh 霧化、500mAh 續航與 2ml 可換彈設計，兼顧日常攜帶與多口味彈性，是追求外觀質感與穩定輸出的實用之選。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <h3 className="text-xl font-bold text-gray-900">主要特點</h3>
              <div className="mt-3 h-px w-12 bg-gray-900" />
              <ul className="mt-5 space-y-3 text-gray-700">
                {[
                  { k: "霧化結構", v: "Mesh 網狀線圈，加熱均勻、層次清楚" },
                  { k: "續航表現", v: "500mAh 可充電，約 600 口（實測隨使用習慣而異）" },
                  { k: "煙彈系統", v: "2ml 可換彈，甜點／水果／清涼等多口味可選" },
                  { k: "機身設計", v: "半透明殼＋金屬底座，輕巧好握" },
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
                  ["商品名稱", "VENUS 金星主機可充電霧化電子煙主機（台灣現貨）"],
                  ["品牌/系列", "VAPENGIN / VENUS 金星"],
                  ["電池容量", "500mAh 可充電"],
                  ["參攷口數", "約 600 口（依使用方式而異）"],
                  ["煙彈規格", "2ml，Mesh 線圈"],
                  ["參攷價格", "NT$ 219"],
                  ["客服", `LINE ID：${LINE_CUSTOMER_ID}`],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex flex-col gap-0.5 border-b border-dashed border-gray-200 py-1.5 sm:col-span-2 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <dt className="text-gray-500">{k}</dt>
                    <dd className="font-medium text-gray-900 sm:max-w-[60%] sm:text-right">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm md:p-10">
            <h3 className="text-xl font-bold text-gray-900">使用提醒</h3>
            <div className="mt-3 h-px w-12 bg-gray-900" />
            <p className="mt-5 leading-8 text-gray-700">
              本產品屬含尼古丁之電子煙相關產品，請遵守法規與年齡限制，並參考包裝與產地標示。口味、庫存與包裝以門市及到貨實物為準；代留與出貨方式請透過
              LINE（{LINE_CUSTOMER_ID}）聯繫客服。
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VenusHostDetail;
