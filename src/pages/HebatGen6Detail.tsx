import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronLeft, Plus, Minus } from "lucide-react";
import { requestHomeScrollRestore } from "@/lib/homeScrollRestore";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { SelectVariantDialog } from "@/components/SelectVariantDialog";
import { ProductHeroFeatureTags } from "@/components/ProductHeroFeatureTags";
import { productPhoto, SITE_LOGO_PHOTO } from "@/lib/productPhotos";

const productMain = productPhoto("disposable-hebat-hb10000.webp");
const logoImage = SITE_LOGO_PHOTO;
import { ORDER_MODEL_HEBAT_GEN6 } from "@/lib/orderProductModels";

const HEBAT_PRODUCT_ID = "hebat-gen6";
const HEBAT_PRICE_TWD = 269;

const flavorGroups: { group: string; options: string[] }[] = [
  {
    group: "飲品系列",
    options: ["氣泡酒", "能井", "雪碧", "芬達", "養樂多", "可樂", "咖啡", "檸檬水"],
  },
  {
    group: "水果系列",
    options: [
      "白葡萄",
      "芒果哈密瓜",
      "西瓜",
      "蜜桃",
      "草莓",
      "百香果",
      "葡萄",
      "荔枝",
      "藍莓",
    ],
  },
  { group: "清新系列", options: ["鐵觀音", "冰泉", "薄荷"] },
];

const HebatGen6Detail = () => {
  const navigate = useNavigate();
  const { addToCart, itemCount, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [variantPromptOpen, setVariantPromptOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const buildCartPayload = () => {
    if (!selectedOption) return null;
    return {
      productId: HEBAT_PRODUCT_ID,
      title: ORDER_MODEL_HEBAT_GEN6,
      variant: selectedOption,
      priceTwd: HEBAT_PRICE_TWD,
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
    "HEBAT 喜貝六代 10000 口拋棄式｜15ml · 台灣現貨";
  const getProductDescription = () =>
    "HEBAT 喜貝六代 · 10000 口 · 15ml · HB10000 · 台灣現貨";
  const getCategory = () => "HEBAT 喜貝六代拋棄式";
  const getTags = () => "HEBAT，喜貝六代，HB10000，多口味可選";
  const getBadgeText = () =>
    selectedOption ? `台灣現貨｜${selectedOption}` : "10000 口｜請先選擇口味";

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
                alt="HEBAT 喜貝六代 HB10000"
                className="h-[500px] w-full object-contain"
              />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="rounded-md bg-red-600 px-6 py-2 font-bold text-white shadow-lg">{getBadgeText()}</div>
              </div>
            </div>

            <ProductHeroFeatureTags tags={["約 10000 口", "15ml 大油倉", "550mAh 內建電", "拋棄式免保養"]} />

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
              <span className="tracking-tight text-gray-700">HEBAT 喜貝六代</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{getProductTitle()}</h1>

            <div className="text-4xl font-bold text-gray-900">{`NT$${HEBAT_PRICE_TWD}.00`}</div>

            <div className="max-h-[min(50vh,480px)] space-y-4 overflow-y-auto pr-1">
              <label className="text-lg font-medium text-gray-800">口味與規格（20 款，請選一）：</label>
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
              <p>
                客服聯繫：LINE ID <span className="font-medium">abs791012</span>
              </p>
              <p>一次性拋棄式設計，內建電池與大容量煙油；部分通路文宣若誤標 20ml，一律以 15ml 與實體包裝為準。</p>
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
              <p className="text-sm text-gray-500">
                切換口味時數量會重設為 1。實測口數、電力與油耗隨使用習慣而異；庫存與色款以客服確認為準。
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
              HEBAT
              喜貝六代定位為高性價比、主打超大口數與免整理的一次性設備：內建約 10000
              口參攷續航、15ml
              煙油倉與
              550mAh
              電池，讓重度使用者盡量一路用到煙油殆盡而無需額外保養。採用拋棄式一體結構，開封即用、無需充油與清潔，用完即丟、適合步調緊湊的族群。霧氣濃度與風味穩定，口味線涵蓋飲品、水果與茶感清新，可依喜好挑選 20
              款。以 NT$ 269 的入手門檻搭配長壽命設計，適合重視續航與省心體驗的消費者。
            </p>

            <h3 className="mt-8 text-lg font-semibold text-gray-900">極致長效續航</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-8 text-gray-700">
              <li>
                <span className="font-semibold text-gray-900">口數：</span>
                高達約 10,000 口吸食量（參攷值，依抽吸習慣、環境而異），適合高頻度使用者。
              </li>
              <li>
                <span className="font-semibold text-gray-900">容量：</span>
                內含 15ml 大容量煙油（少數文宣若出現 20ml 系誤植，以本頁 15ml 及包裝標示為準）。
              </li>
              <li>
                <span className="font-semibold text-gray-900">電池：</span>
                內建 550mAh 等級高效電池，設計上支撐至與煙油消耗匹配（實際曲線以使用為準）。
              </li>
            </ul>

            <h3 className="mt-8 text-lg font-semibold text-gray-900">純粹便捷性</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-8 text-gray-700">
              <li>
                <span className="font-semibold text-gray-900">即開即用：</span>
                拋棄式一體機，免拆裝、免注油、免日常維護（仍請遵守產品警語與法規）。
              </li>
              <li>
                <span className="font-semibold text-gray-900">輕巧生活：</span>
                用畢可負責任地依當地規定處理廢棄，適合不想額外照理設備的使用情境。
              </li>
            </ul>

            <h3 className="mt-8 text-lg font-semibold text-gray-900">吸食體驗</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-8 text-gray-700">
              <li>每口霧氣量感足夠、輸出穩定。</li>
              <li>口味從飲品、果香到茶感清新，層次多元。</li>
            </ul>
            <p className="mt-6 border-l-4 border-blue-200 pl-4 leading-8 text-gray-600">
              總結：喜貝六代以萬口級續航、15ml
              油倉與一體拋棄的省心體驗，搭配實惠價位，是追求長週期使用、不想額外保養時的實用選擇之一。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <h3 className="text-xl font-bold text-gray-900">主要特點</h3>
              <div className="mt-3 h-px w-12 bg-gray-900" />
              <ul className="mt-5 space-y-3 text-gray-700">
                {[
                  { k: "口數與容量", v: "參攷 10000 口、15ml 煙油（實測隨人為變因）" },
                  { k: "電力", v: "內建 550mAh，匹配長週期使用" },
                  { k: "型態", v: "拋棄式一次性，免注油、免常規維護" },
                  { k: "口味陣容", v: "飲品、水果、清新等共 20 款可選" },
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
                  ["商品名稱", "HEBAT 喜貝六代 10000 口拋棄式一次性電子煙（15ml 台灣現貨）"],
                  ["型號/系列", "喜貝六代 / HB10000"],
                  ["煙油容量", "15ml（以包裝為準；有誤標 20ml 時以實體為準）"],
                  ["參攷口數", "約 10,000 口"],
                  ["電池", "內建 550mAh（一次性設計，勿自行拆解）"],
                  ["參攷價格", "NT$ 269"],
                  ["客服", "LINE ID：abs791012"],
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
              本產品含尼古丁，具成癮性，請依法規與年齡限制使用。包裝上常見成癮性警示，請完整閱讀。實測口數、電力與油耗隨使用方式變化；庫存、色款、批次以門市及客服為準。訂購、留貨可透過
              LINE（abs791012）聯繫。
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HebatGen6Detail;
