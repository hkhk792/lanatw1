import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronLeft, Plus, Minus } from "lucide-react";
import { requestHomeScrollRestore } from "@/lib/homeScrollRestore";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { SelectVariantDialog } from "@/components/SelectVariantDialog";
import { ProductHeroFeatureTags } from "@/components/ProductHeroFeatureTags";
import productMain from "@/assets/disposable-vapor-storm-cf5000.webp";
import logoImage from "@/assets/product-14.jpg";
import { ORDER_MODEL_VAPOR_STORM_5000 } from "@/lib/orderProductModels";

const VAPOR_STORM_PRODUCT_ID = "vapor-storm-5000";
const VAPOR_STORM_PRICE_TWD = 290;

const flavorGroups: { group: string; options: string[] }[] = [
  {
    group: "水果系列",
    options: ["荔枝", "鳳梨", "芒果", "葡萄", "西瓜", "青蘋果", "桃子"],
  },
  {
    group: "茶飲與調味系列",
    options: [
      "茉莉花茶",
      "鐵觀音",
      "龍井茶",
      "能井",
      "蜂蜜葡萄柚",
      "可樂",
      "咖啡",
      "薄荷",
      "冰泉",
    ],
  },
];

const VaporStorm5000Detail = () => {
  const navigate = useNavigate();
  const { addToCart, itemCount, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [variantPromptOpen, setVariantPromptOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const buildCartPayload = () => {
    if (!selectedOption) return null;
    return {
      productId: VAPOR_STORM_PRODUCT_ID,
      title: ORDER_MODEL_VAPOR_STORM_5000,
      variant: selectedOption,
      priceTwd: VAPOR_STORM_PRICE_TWD,
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
    "VAPOR STORM 風暴 5000 口拋棄式｜飛霧發光 · CF5000";
  const getProductDescription = () =>
    "VAPOR STORM · 10ml · Mesh · 參攷 5000 口 · 台灣現貨";
  const getCategory = () => "VAPOR STORM CF5000";
  const getTags = () => "VAPOR STORM，風暴，5000口，多口味可選";
  const getBadgeText = () =>
    selectedOption ? `飛霧發光｜${selectedOption}` : "10ml Mesh｜請先選擇口味";

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
                alt="VAPOR STORM CF5000 風暴"
                className="h-[500px] w-full object-contain"
              />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="rounded-md bg-red-600 px-6 py-2 font-bold text-white shadow-lg">{getBadgeText()}</div>
              </div>
            </div>

            <ProductHeroFeatureTags
              tags={["參攷 5000 口", "10ml 大油", "650mAh", "Mesh 線圈", "飛霧發光"]}
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
              <span className="tracking-tight text-gray-700">VAPOR STORM CF5000</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{getProductTitle()}</h1>

            <div className="text-4xl font-bold text-gray-900">{`NT$${VAPOR_STORM_PRICE_TWD}.00`}</div>

            <p className="text-sm text-gray-600">
              以下為常見口味陣容（參攷十餘至十五款，依批次與到貨而異）；實際庫存以客服確認為準。
            </p>

            <div className="max-h-[min(50vh,480px)] space-y-4 overflow-y-auto pr-1">
              <label className="text-lg font-medium text-gray-800">口味選擇：</label>
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
              <p>網狀加熱與發光外殻為本系列外觀亮點；參攷 5000 口與續航隨實機使用、環境溫度與抽吸習慣變化。</p>
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
              <p className="text-sm text-gray-500">切換口味時數量會重設為 1。法規、警語、年齡與產地標示請以實體包裝為準。</p>
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
            <h2 className="text-2xl font-bold text-gray-900">核心規格與特點</h2>
            <div className="mt-4 h-px w-14 bg-gray-900" />
            <p className="mt-6 leading-8 text-gray-700">
              VAPOR STORM 風暴
              5000
              在 CF5000
              外觀上結合了潮流配色與「飛霧發光」辨識度，霧化端採用
              Mesh
              網狀線圈，加熱面積較平均，風味還原與霧氣層次較有餘裕。10ml
              煙油倉與
              650mAh
              電池的組合，以參攷約
              5000
              口為產品定位，兼顧外出攜帶與單次生命週期。口味線涵蓋清爽果香、茶感與多款調飲，可依個人喜好多樣化選配。
            </p>

            <h3 className="mt-8 text-lg font-semibold text-gray-900">參攷硬體</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-8 text-gray-700">
              <li>抽吸口數：參攷約 5,000 口（實測隨人為、環境與出貨批次而異）。</li>
              <li>電池容量：650mAh，提供全段使用週期所需動力參攷值。</li>
              <li>煙油容量：10ml。</li>
              <li>霧化：Mesh Coil 網狀結構，均勻加熱、口感細膩度較穩定。</li>
              <li>外觀：內建發光表現，提升可視性與潮流辨識（實作方式以實機與包裝為準）。</li>
            </ul>

            <h3 className="mt-8 text-lg font-semibold text-gray-900">產品特色一覽</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-8 text-gray-700">
              <li>口感升級：網狀霧化設計，煙霧層次與還原度較佳。</li>
              <li>外觀：專屬色票搭配飛霧與光效，在派對或戶外情境下辨識度高（仍請得體、合法使用）。</li>
              <li>便攜：機身一體化、拋棄式開封即用，結構緊湊、方便隨行。</li>
              <li>大容量體系：10ml 配 650mAh，參攷 5000 口級的完整使用曲線（以實測為準）。</li>
            </ul>
            <p className="mt-6 border-l-4 border-blue-200 pl-4 leading-8 text-gray-600">
              總結：以 NT$ 290
              提供發光外觀＋Mesh 霧化與參攷 5000
              口，在同價帶產品中，適合同時在意視覺效果與吸食細節的族群（請遵守年齡、法規與警語，勿於禁菸或未成年人場所使用）。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <h3 className="text-xl font-bold text-gray-900">主要特點</h3>
              <div className="mt-3 h-px w-12 bg-gray-900" />
              <ul className="mt-5 space-y-3 text-gray-700">
                {[
                  { k: "拋桿一體", v: "即開即用，拋棄式生命週期" },
                  { k: "霧化", v: "Mesh，均溫導霧" },
                  { k: "油電平衡", v: "10ml ＋ 650mAh，參攷 5000 口" },
                  { k: "體驗", v: "專屬顏與飛霧光效" },
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
                  [
                    "商品名稱",
                    "VAPOR STORM 風暴 5000 口拋棄式飛霧發光一次性電子煙桿",
                  ],
                  ["型號", "CF5000 系列參攷"],
                  ["參攷口數", "約 5,000 口"],
                  ["煙油", "10ml"],
                  ["電池", "650mAh 等級拋棄式配置"],
                  ["霧化", "Mesh 網狀線圈"],
                  ["參攷價格", "NT$ 290"],
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
              本產品含尼古丁。請遵守年齡與各項法規，並詳閱包裝、警語與廢棄物處理建議。發光功能在睡眠、行車或法規禁示場合請關閉或勿使用。訂貨與庫存請以
              LINE（abs791012）向客服核對。
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VaporStorm5000Detail;
