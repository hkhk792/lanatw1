import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronLeft, Plus, Minus } from "lucide-react";
import { requestHomeScrollRestore } from "@/lib/homeScrollRestore";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { SelectVariantDialog } from "@/components/SelectVariantDialog";
import { ProductHeroFeatureTags } from "@/components/ProductHeroFeatureTags";
import productMain from "@/assets/disposable-diya-7500.webp";
import logoImage from "@/assets/product-14.jpg";

const DIYA_7500_PRODUCT_ID = "diya-7500";
const DIYA_7500_PRICE_TWD = 249;

const flavorGroups: { group: string; options: string[] }[] = [
  {
    group: "人氣飲品",
    options: ["冬瓜冷露", "雪碧", "養樂多", "可口可樂", "夏日酷飲（檸檬海鹽）"],
  },
  {
    group: "熱門水果",
    options: [
      "白玉山竹",
      "芭樂",
      "荔枝",
      "百香果",
      "西瓜",
      "藍莓",
      "葡萄",
      "哈密瓜",
      "芒果",
      "櫻桃",
      "草莓西瓜",
      "薔薇布林（首薇布林）",
    ],
  },
  { group: "茶香與清新", options: ["鐵觀音", "神仙薄荷", "玫瑰茉莉", "冰清玉露"] },
  { group: "童年回憶", options: ["童年冰棍", "冰冰爆爆"] },
];

const Diya7500DisposableDetail = () => {
  const navigate = useNavigate();
  const { addToCart, itemCount, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [variantPromptOpen, setVariantPromptOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const buildCartPayload = () => {
    if (!selectedOption) return null;
    return {
      productId: DIYA_7500_PRODUCT_ID,
      title: getProductTitle().replace("｜", " ").trim(),
      variant: selectedOption,
      priceTwd: DIYA_7500_PRICE_TWD,
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
    selectedOption
      ? `DIYA 叮啞 7500 口（${selectedOption}）大容量可充電一次性`
      : "DIYA 叮啞拋棄式 7500 口大容量可充電一次性電子煙";
  const getProductDescription = () =>
    selectedOption
      ? `已選口味：${selectedOption} — DIYA 7500 口 13ml`
      : "DIYA 叮啞 · 7500 口 · 13ml · 可充電";
  const getCategory = () => "DIYA 7500 口拋棄式";
  const getTags = () => (selectedOption ? `DIYA，7500口，${selectedOption}` : "DIYA，叮啞，拋棄式");
  const getBadgeText = () =>
    selectedOption ? `可充電 7500 口｜${selectedOption}` : "13ml 大油倉｜請先選擇口味";

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
                alt="DIYA 叮啞 7500 口拋棄式"
                className="h-[500px] w-full object-contain"
              />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="rounded-md bg-red-600 px-6 py-2 font-bold text-white shadow-lg">{getBadgeText()}</div>
              </div>
            </div>

            <ProductHeroFeatureTags
              tags={["約 7500 口", "13ml 大油倉", "650mAh 可充電", "1.2Ω 霧化芯"]}
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
              <span className="tracking-tight text-gray-700">DIYA 7500 口</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{getProductTitle()}</h1>

            <div className="text-4xl font-bold text-gray-900">{`NT$${DIYA_7500_PRICE_TWD}.00`}</div>

            <p className="text-sm text-gray-600">
              尼古丁多數口味為 30mg（3%），<span className="font-medium">神仙薄荷</span>為
              50mg（5%），請以包裝標示與實品為準。常見多達二十餘款口味，實際到貨與庫存請洽客服。
            </p>

            <div className="max-h-[min(50vh,480px)] space-y-4 overflow-y-auto pr-1">
              <label className="text-lg font-medium text-gray-800">口味選擇（包裝標示甜／涼度星等）：</label>
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
              <p>13ml 大油倉配可充電 650mAh 電池，讓煙油較有機會用盡、減少「有油沒電」的狀況；實際口數隨使用習慣而異。</p>
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
              <p className="text-sm text-gray-500">切換口味時數量會重設為 1。庫存與批次以實際到貨及客服回覆為準。</p>
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
            <h2 className="text-2xl font-bold text-gray-900">規格與產品特色</h2>
            <div className="mt-4 h-px w-14 bg-gray-900" />
            <p className="mt-6 leading-8 text-gray-700">
              DIYA 叮啞
              7500
              口主打高口數與可重複充電：13ml
              煙油在一般使用情境下可盡量配合電池週期，減少浪費。霧化芯 1.2Ω
              讓出霧量與口感還原維持穩定；多數口味為
              30mg（3%）鹽尼古丁，神仙薄荷則多為
              50mg（5%），選購時務必確認外盒。包裝針對各口味設計色彩與插圖，並以星等標示甜度、涼度，方便比對。以
              NT$ 249
              的定價與大容量＋可充式設計，在重度使用、重視口味多樣與實用性的消費者之間有明顯性價比。
            </p>

            <h3 className="mt-8 text-lg font-semibold text-gray-900">核心參數</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-8 text-gray-700">
              <li>抽吸口數：參攷約 7,500 口（7500 PUFFS，實測隨人為變因）。</li>
              <li>煙油容量：13ml。</li>
              <li>電池容量：650mAh，支援以 Type-C 等方式充電（以包裝附件為準）。</li>
              <li>霧化芯電阻：1.2Ω。</li>
              <li>尼古丁：多為 3%（30mg）；神仙薄荷多為 5%（50mg），請以包裝與產地標示為準。</li>
            </ul>

            <h3 className="mt-8 text-lg font-semibold text-gray-900">產品特色</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-8 text-gray-700">
              <li>
                <span className="font-semibold text-gray-900">高性價比：</span>與多數大口數產品相較，NT$ 249
                定價具競爭力。
              </li>
              <li>
                <span className="font-semibold text-gray-900">長效設計：</span>13ml 油倉＋可充電池，降低「有油沒電」的窘境。
              </li>
              <li>
                <span className="font-semibold text-gray-900">視覺化包裝：</span>口味專屬圖色；標示甜／涼度星等（參攷
                4–5 星甜、2–3 星涼等，以包裝為準）。
              </li>
              <li>
                <span className="font-semibold text-gray-900">口感穩定：</span>1.2Ω 結構在煙霧量與還原度之間取得平衡。
              </li>
            </ul>
            <p className="mt-6 border-l-4 border-blue-200 pl-4 leading-8 text-gray-600">
              總結：針對重度與多口味需求，以可充式長效、親民定價與清楚標示的口味矩陣，是實用取向的耐用選擇（仍以法規、年齡限制與包裝警語為準）。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <h3 className="text-xl font-bold text-gray-900">主要特點</h3>
              <div className="mt-3 h-px w-12 bg-gray-900" />
              <ul className="mt-5 space-y-3 text-gray-700">
                {[
                  { k: "口數", v: "參攷 7500 口，適合高頻使用" },
                  { k: "煙油／電力", v: "13ml ＋ 650mAh 可補電，盡量用滿壽命" },
                  { k: "霧化", v: "1.2Ω，煙霧量適中、口感還原穩定" },
                  { k: "包裝體驗", v: "專屬圖色與甜涼度標示，方便比對" },
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
                  ["商品名稱", "DIYA 叮啞拋棄式 7500 口大容量可充電一次性電子煙"],
                  ["參攷口數", "約 7,500 口（7500 PUFFS）"],
                  ["煙油容量", "13ml"],
                  ["電池", "650mAh 可充電（介面以包裝為準）"],
                  ["霧化芯", "1.2Ω"],
                  ["尼古丁", "多數 3%（30mg），神仙薄荷多為 5%（50mg）"],
                  ["參攷價格", "NT$ 249"],
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
              本產品屬含尼古丁之電子煙相關產品，具成癮性，非吸菸者、未成年者、孕婦等族群請勿使用。實測口數、甜度涼度星等與批次有關，以實體包裝與到貨為準。訂貨、留貨、口味確認請透過
              LINE（abs791012）聯繫客服。
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Diya7500DisposableDetail;
