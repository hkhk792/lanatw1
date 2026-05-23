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

const productMain = productPhoto("showcase-gen5-pods.webp");
const logoImage = SITE_LOGO_PHOTO;
import { ORDER_MODEL_VSTORM_GEN5_PODS } from "@/lib/orderProductModels";

const VSTORM_GEN5_PRODUCT_ID = "vstorm-gen5-pods";
const VSTORM_GEN5_PRICE_TWD = 129;

const flavorGroups: { group: string; options: string[] }[] = [
  {
    group: "經典水果",
    options: ["芒果", "荔枝", "桃子", "青蘋果", "百香果", "鳳梨", "西瓜", "藍莓"],
  },
  {
    group: "特色飲品",
    options: ["利賓納（黑加侖）", "可樂", "芋泥", "蜜柚", "咖啡（呐啡）"],
  },
  { group: "清新系列", options: ["薄荷", "冰泉花"] },
];

const VaporStormGen5PodsDetail = () => {
  const navigate = useNavigate();
  const { addToCart, itemCount, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [variantPromptOpen, setVariantPromptOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const buildCartPayload = () => {
    if (!selectedOption) return null;
    return {
      productId: VSTORM_GEN5_PRODUCT_ID,
      title: ORDER_MODEL_VSTORM_GEN5_PODS,
      variant: selectedOption,
      priceTwd: VSTORM_GEN5_PRICE_TWD,
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

  const getProductTitle = () => "Vapor Storm 風暴五代煙彈｜五代主機通用";
  const getProductDescription = () =>
    "風暴五代煙彈 · Ice Soul · 多主機通用 · 單顆參攷定價";
  const getCategory = () => "Vapor Storm 風暴五代煙彈";
  const getTags = () => "Vapor Storm，五代通配，煙彈，多口味可選";
  const getBadgeText = () => (selectedOption ? `通配｜${selectedOption}` : "通用五代主機｜請先選口味");

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
        message="請先從下方選擇一種口味，再加入購物車或立即購買。"
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
                alt="Vapor Storm 風暴五代煙彈"
                className="h-[500px] w-full object-contain"
              />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="rounded-md bg-red-600 px-6 py-2 font-bold text-white shadow-lg">{getBadgeText()}</div>
              </div>
            </div>

            <ProductHeroFeatureTags
              tags={["五代通配", "2.0ml 參攷", "Mesh 霧化", "3% 鹽尼", "高 CP 備品"]}
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
              <a href="/#pods-liquid-gear" className="hover:text-gray-700">
                全品類一覽
              </a>
              <span>/</span>
              <span className="tracking-tight text-gray-700">風暴五代煙彈</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{getProductTitle()}</h1>

            <div className="text-4xl font-bold text-gray-900">{`NT$${VSTORM_GEN5_PRICE_TWD}.00`}</div>

            <p className="text-sm text-gray-700 leading-relaxed">
              主打多品牌五代主機可共用，一顆參攷
              <span className="font-medium"> NT$ 129 </span>
              ，適合多機在手、想輪替口味的使用者。客服 LINE：
              <span className="font-medium"> {LINE_CUSTOMER_ID}</span>。
            </p>

            <div className="max-h-[min(50vh,420px)] space-y-4 overflow-y-auto pr-1">
              <label className="text-lg font-medium text-gray-800">口味選擇（共 15 種）：</label>
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

            <ProductDetailLineSupportNotice />

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
            </div>

            <div className="mt-4 space-y-2 border-t border-gray-200 pt-6 text-sm text-gray-600">
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
            <h2 className="text-2xl font-bold text-gray-900">核心優勢：強大的相容性</h2>
            <div className="mt-4 h-px w-14 bg-gray-900" />
            <p className="mt-6 leading-8 text-gray-700">
              本款風暴五代煙彈以「高通用性」為核心，可在不需更換主機本體的前提下，於多款主流五代規格上替換使用；實際密合、吸阻與觸點以各主機與到貨批號為準。
            </p>
            <h3 className="mt-8 text-lg font-semibold text-gray-900">參攷支援主機</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-gray-700">
              <li>ILIA 五代</li>
              <li>RELX 悅刻五代</li>
              <li>Vapor Storm 風暴五代主機</li>
              <li>及其他同規格五代接口主機（請以實測、客服確認為準）</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <h3 className="text-xl font-bold text-gray-900">產品詳細規格與成分</h3>
              <div className="mt-3 h-px w-12 bg-gray-900" />
              <ul className="mt-5 space-y-3 text-gray-700">
                {[
                  { k: "尼古丁", v: "多數款式參攷 3%（以包裝、產地標示為準）" },
                  { k: "煙油成分", v: "甘油、丙二醇、食品級香精、有機尼古丁（配方以包裝為準）" },
                  { k: "品質控管", v: "強調原物料來源與生產流程，請仍依實體外盒、警語與保存方式使用" },
                ].map((row) => (
                  <li key={row.k} className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                    <span className="shrink-0 font-semibold text-gray-900">{row.k}：</span>
                    <span>{row.v}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <h3 className="text-xl font-bold text-gray-900">綜合評價</h3>
              <div className="mt-3 h-px w-12 bg-gray-900" />
              <div className="mt-5 space-y-4 text-sm text-gray-700">
                <div>
                  <p className="font-semibold text-gray-900">優點</p>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    <li>通配性高，五代接口相近時可減少重複採購主機的負擔。</li>
                    <li>參攷定價 NT$ 129，多口味輪替時相對有成本優勢。</li>
                    <li>陣容涵蓋果香、特色飲品與清涼系，層次選擇多。</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">可留意處</p>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    <li>與部分大煙、開放系統相較，霧氣量可能屬中量體、非爆量路線。</li>
                    <li>風味濃郁度屬中位表現，重口使用者可能需調整抽吸節奏或口味。</li>
                  </ul>
                </div>
                <p className="border-l-4 border-amber-200 pl-3 text-gray-600">
                  整體而言，適合作為五代主機族的日常備彈、入門體驗與多口味實測的務實選擇，仍以個人主機與身體反應為最終依歸。
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm md:p-10">
            <h3 className="text-xl font-bold text-gray-900">使用提醒</h3>
            <div className="mt-3 h-px w-12 bg-gray-900" />
            <p className="mt-5 leading-8 text-gray-700">
              本產品屬含尼古丁之電子煙消耗品。請依年齡、法規與包裝警語使用；兒童、孕婦及非吸菸者不建議。相容性名單與庫存口味請透過
              LINE（{LINE_CUSTOMER_ID}）與客服確認。若與主機密合度不符，請勿硬裝，以免影響安全與觸點壽命。
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VaporStormGen5PodsDetail;
