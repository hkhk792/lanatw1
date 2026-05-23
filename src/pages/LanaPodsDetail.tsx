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

const productMain = productPhoto("product-7.webp");
const logoImage = SITE_LOGO_PHOTO;
import { ORDER_MODEL_LANA_PODS } from "@/lib/orderProductModels";

const LANA_PODS_PRODUCT_ID = "lana-pods";
const LANA_PODS_PRICE_TWD = 220;

const DEFAULT_MOOD =
  "獨特調香搭配陶瓷蜂巢式霧化晶片，香氣層次分明、口感細緻順喉，為日常帶來穩定愉悅的 VAPE 體驗。";

/** 與文案對應的口味描述；其餘口味使用 DEFAULT_MOOD */
const MOOD_BY_NAME: Record<string, string> = {
  深海冰泉: "清新的泉水味結合冰涼口感，帶來純淨與清涼的雙重體驗。",
  雪碧: "清新的雪碧口味，每一口都吸入碳酸飲料的冰涼與刺激。",
  老冰棍: "清新的冰棍口感，每一口都重現夏日冰棍的冰涼與色彩。",
  可樂: "經典可樂風味，每一口都含有碳酸飲料的暢快與節奏。",
  沙士: "獨特沙士風味融合啤酒的麥芽香氣，帶來全新口感體驗，令人回味無窮。",
  百香果: "新鮮百香果的酸甜滋味，每一口都充滿自然風味。",
  葡萄: "多汁的葡萄風味，每一口都散發葡萄的香甜與層次。",
  水蜜桃: "鮮嫩多汁的水蜜桃，每一口都洋溢活力與清新。",
  草莓西瓜: "草莓的香甜與西瓜的清涼結合，帶來清新夏日體驗。",
  藍莓: "酸甜可口的藍莓味，每一口都充滿藍莓的清新與酸甜。",
  芒果百香: "絢麗芒果與酸甜百香果結合，帶來獨特熱帶風情。",
  奇異果: "陽光下熟成的奇異果，每一口都洋溢溫暖與清新。",
  鳳梨: "酸甜可口的鳳梨味，每一口都能品嚐鳳梨的清香與酸甜。",
  西瓜: "清甜的西瓜汁，彷彿置身夏日午後，每一口都是冰涼與甜蜜。",
  莓果: "混合莓果的香氣，每一口都融合藍莓、草莓等多種莓果的清新與酸甜。",
  蔓越莓: "酸甜可口的蔓越莓，每一口都散發蔓越莓的獨特風味。",
  荔枝: "絢麗的荔枝味，每一口都帶有荔枝特有的清新與甜蜜。",
  哈密瓜: "香甜的哈密瓜味道，每一口都充滿夏日的甜蜜。",
  蘋果: "新鮮多汁的蘋果味，每一口都像咬下一口剛採摘的蘋果。",
  烏龍茶: "烏龍茶的清香與茶香，每一口都帶來茶葉的清新與醇厚。",
  紅茶: "冰鎮紅茶的清新與茶香，每一口都傳遞紅茶的醇厚與冰涼。",
  龍井: "茉莉花的芳香與龍井茶的清雅融合，每一口都如同品嚐一杯上等茉莉花茶。",
  鐵觀音: "鐵觀音茶的清香與獨特韻味，每一口都帶來深厚底蘊與優雅。",
  綠豆: "清新的綠豆味結合冰涼口感，帶來絲滑酷感。",
  咖啡: "經典咖啡的醇厚與香氣，每一口都令人回味。",
  橙冰: "鮮橙的酸甜與香氣交織，每一口都帶來多種水果的新鮮與活力。",
  芒奶: "絢麗芒果與濃郁奶香結合，帶來獨特熱帶風情。",
  草莓牛奶: "草莓的香甜與柔順奶感交織，甜而不膩、層次細緻。",
};

const FLAVOR_NAMES = [
  "深海冰泉",
  "雪碧",
  "老冰棍",
  "可樂",
  "沙士",
  "百香果",
  "葡萄",
  "水蜜桃",
  "草莓西瓜",
  "藍莓",
  "芒果百香",
  "奇異果",
  "鳳梨",
  "西瓜",
  "莓果",
  "蔓越莓",
  "荔枝",
  "葡萄柚",
  "哈密瓜",
  "芭樂",
  "綜合水果",
  "蘋果",
  "烏龍茶",
  "紅茶",
  "龍井",
  "鐵觀音",
  "草莓牛奶",
  "芒奶",
  "芋頭",
  "紅酒",
  "口香糖",
  "綠豆",
  "彩虹糖",
  "咖啡",
  "橙冰",
] as const;

type FlavorOption = { name: string; mood: string };

const FLAVOR_OPTIONS: FlavorOption[] = FLAVOR_NAMES.map((name) => ({
  name,
  mood: MOOD_BY_NAME[name] ?? DEFAULT_MOOD,
}));

const SPECS: Array<[string, string]> = [
  ["商品名稱", "lana煙彈 3 顆裝（一代通配主機）"],
  ["適配主機", "一代通配主機"],
  ["霧化結構", "陶瓷蜂巢式霧化晶片"],
  ["包裝規格", "3 顆裝／盒"],
  ["現貨", "台灣現貨"],
  ["客服 LINE", `${LINE_CUSTOMER_ID}（下單前請先添加）`],
];

const KEY_FEATURES: Array<{ k: string; v: string }> = [
  { k: "陶瓷蜂巢芯", v: "陶瓷蜂巢式霧化晶片設計，霧化細緻、口感純粹。" },
  { k: "極致體驗", v: "獨特品味與高品質工藝，每一口都豐富而順喉。" },
  { k: "一代通配", v: "相容市面常見一代主機，替換直覺、選擇多元。" },
  { k: "台灣現貨", v: "台灣現貨發出，購買前請依頁面提示聯繫客服確認。" },
];

const PRODUCT_HIGHLIGHTS: Array<{ k: string; v: string }> = [
  { k: "多口味陣容", v: "從冰飲、水果到茶系與奶系，滿足不同情境的味覺偏好。" },
  { k: "3 顆裝設計", v: "每盒三顆，方便與同好分享或備貨替換。" },
  { k: "VAPE 體驗", v: "無論日常舒適感或嘗鮮刺激感，lana煙彈都能對應你的需求。" },
  { k: "購買提醒", v: `下單前請添加客服 LINE：${LINE_CUSTOMER_ID}，以完成訂購與售後聯繫。` },
];

const LanaPodsDetail = () => {
  const navigate = useNavigate();
  const { addToCart, itemCount, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [variantPromptOpen, setVariantPromptOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleOptionChange = (option: string) => {
    if (option !== selectedOption) {
      setQuantity(1);
    }
    setSelectedOption(option);
  };

  const baseTitle = "lana煙彈 3 顆裝（一代通配主機）";
  const getProductTitle = () => `${baseTitle}｜多口味可選`;
  const getProductDescription = () => "lana煙彈 3 顆裝 · 一代通配主機 · 陶瓷蜂巢芯";
  const getCategory = () => "lana煙彈 / 一代通配";
  const getTags = () => "lana，煙彈，3 顆裝，一代通配，多口味可選";
  const getBadgeText = () =>
    selectedOption ? `lana煙彈｜${selectedOption}` : "lana煙彈｜請先選擇口味";

  const selectedMood = FLAVOR_OPTIONS.find((o) => o.name === selectedOption)?.mood;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const buildCartPayload = () => {
    if (!selectedOption) return null;
    return {
      productId: LANA_PODS_PRODUCT_ID,
      title: ORDER_MODEL_LANA_PODS,
      variant: selectedOption,
      priceTwd: LANA_PODS_PRICE_TWD,
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

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SelectVariantDialog
        open={variantPromptOpen}
        onOpenChange={setVariantPromptOpen}
        message="請先從上方選擇一種口味，再加入購物車或立即購買。"
      />
      <nav
        className={`sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm transition-transform duration-300 ${
          isScrolled ? "-translate-y-full" : ""
        }`}
      >
        <div className="container mx-auto px-4 py-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="Logo" className="w-20 h-20 rounded-lg object-contain" />
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              我的帳號
            </a>
            <button type="button" onClick={openCart} className="text-gray-700 hover:text-gray-900 font-medium">
              結帳
            </button>
            <button type="button" onClick={openCart} className="text-gray-700 hover:text-gray-900 font-medium relative">
              購物車
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>
          </div>

          <div>
            <button type="button" onClick={openCart} aria-label="購物車" className="relative md:hidden">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-4 h-4 px-0.5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                requestHomeScrollRestore();
                navigate("/");
              }}
              className="mb-4 flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium">返回首頁</span>
            </button>

            <div className="relative bg-gray-50 rounded-lg overflow-hidden">
              <img src={productMain} alt="lana煙彈" className="w-full h-[500px] object-cover" />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="bg-red-600 text-white px-6 py-2 font-bold rounded-md shadow-lg">{getBadgeText()}</div>
              </div>
            </div>

            <ProductHeroFeatureTags tags={["陶瓷蜂巢", "一代通用", "3 顆裝", "台灣現貨"]} />

            <div className="mt-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">{getProductDescription()}</h2>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="text-sm text-gray-500 flex flex-wrap items-center gap-2">
              <a href="/" className="hover:text-gray-700">
                首頁
              </a>
              <span>/</span>
              <a href="/#pods" className="hover:text-gray-700">
                彈匣與煙油
              </a>
              <span>/</span>
              <span className="text-gray-700 tracking-tight">lana煙彈</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{getProductTitle()}</h1>

            <div className="text-4xl font-bold text-gray-900">{`NT$${LANA_PODS_PRICE_TWD}.00`}</div>

            <div className="space-y-4">
              <label className="text-lg font-medium text-gray-800">口味款式：</label>
              <div className="flex flex-wrap gap-2 max-h-[280px] overflow-y-auto pr-1 border border-gray-100 rounded-lg p-3 bg-gray-50/50">
                {FLAVOR_OPTIONS.map((option) => (
                  <button
                    key={option.name}
                    type="button"
                    onClick={() => handleOptionChange(option.name)}
                    className={`px-3 py-2 text-sm rounded-full border transition-colors shrink-0 ${
                      selectedOption === option.name
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    【{option.name}】
                  </button>
                ))}
              </div>
              {selectedMood ? <p className="text-sm text-gray-500 leading-relaxed">{selectedMood}</p> : null}
            </div>

            <div className="space-y-2 text-gray-700">
              <p className="font-medium text-gray-900">lana煙彈－極致，體驗非凡！</p>
              <ProductDetailLineSupportNotice />
              <p>台灣現貨 · 每盒 3 顆裝 · 一代通配主機</p>
              <p>陶瓷蜂巢式霧化晶片，純粹而豐富的 VAPE 體驗</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 text-lg font-medium text-gray-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 min-w-[10rem] border-2 border-orange-500 text-orange-600 font-medium py-3 px-6 rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  加入購物車
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex-1 min-w-[10rem] bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  立即購買
                </button>
              </div>
              <p className="text-sm text-gray-500">
                切換口味時數量會重設為 1。可先加入一種口味，再選其他口味分別加入，購物車內可同時保留多種口味。
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-600 space-y-2">
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
          <div className="rounded-2xl border border-gray-100 bg-white p-6 md:p-10 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">商品介紹</h2>
            <div className="mt-4 h-px w-14 bg-gray-900" />
            <p className="mt-6 leading-8 text-gray-700">
              lana煙彈以獨特品味與高品質著稱，採用陶瓷蜂巢式霧化晶片設計，結合先進技術工藝，確保每一口都為你帶來純粹而豐富的
              VAPE 體驗。不論你追求日常的舒適感，還是想嘗試新鮮刺激的體驗，lana煙彈都能滿足你的需求。
            </p>
            <p className="mt-4 leading-8 text-gray-700">
              本商品為 lana煙彈 3 顆裝，一代通配主機；台灣現貨。下單前請依網頁提示添加客服 LINE：
              {LINE_CUSTOMER_ID}，以便完成訂購與售後聯繫。
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 md:p-10 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900">lana煙彈口味一覽</h3>
            <div className="mt-3 h-px w-12 bg-gray-900" />
            <p className="mt-4 text-sm text-gray-600">
              點選口味可於上方查看簡述；以下為完整風味說明（與官網文案一致者優先收錄）。
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {FLAVOR_OPTIONS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => handleOptionChange(c.name)}
                  className={`text-left rounded-xl border p-4 transition-colors ${
                    selectedOption === c.name
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold text-gray-900">【{c.name}】</div>
                  <p className="mt-1 text-sm leading-6 text-gray-600">{c.mood}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">產品參數</h3>
              <div className="mt-3 h-px w-12 bg-gray-900" />
              <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-gray-700">
                {SPECS.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-dashed border-gray-200 py-1.5"
                  >
                    <dt className="text-gray-500 shrink-0">{k}</dt>
                    <dd className="font-medium text-gray-900 sm:text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">主要特點</h3>
              <div className="mt-3 h-px w-12 bg-gray-900" />
              <ul className="mt-5 space-y-3 text-gray-700">
                {KEY_FEATURES.map((f) => (
                  <li key={f.k} className="flex gap-3">
                    <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-blue-600" />
                    <div>
                      <span className="font-semibold text-gray-900">{f.k}：</span>
                      <span>{f.v}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 md:p-10 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900">產品特點</h3>
            <div className="mt-3 h-px w-12 bg-gray-900" />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRODUCT_HIGHLIGHTS.map((h) => (
                <div key={h.k} className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                  <div className="text-base font-semibold text-gray-900">{h.k}</div>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{h.v}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LanaPodsDetail;
