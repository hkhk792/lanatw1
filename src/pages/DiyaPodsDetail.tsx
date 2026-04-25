import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronLeft, Plus, Minus } from "lucide-react";
import { requestHomeScrollRestore } from "@/lib/homeScrollRestore";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { SelectVariantDialog } from "@/components/SelectVariantDialog";
import { ProductHeroFeatureTags } from "@/components/ProductHeroFeatureTags";
import productMain from "@/assets/product-8.webp";
import logoImage from "@/assets/product-14.jpg";

const DIYA_PODS_PRODUCT_ID = "diya-pods";
const DIYA_PODS_PRICE_TWD = 199;

const DEFAULT_MOOD =
  "叮啞一代通用煙彈，霧化細緻、口感順滑；每顆 2.5ml，日常與外出皆宜。";

const MOOD_BY_NAME: Record<string, string> = {
  白玉山竹: "特色款，果香與山竹層次交織。",
  冬瓜: "古早味，清爽懷舊。",
  雪碧: "汽水感冰涼，帶有熟悉的碳酸清爽節奏。",
  鐵觀音: "茶香底蘊深厚，回甘優雅。",
  芭樂: "熱帶芭樂的香甜與清新。",
  冰冰爆爆: "類似薄荷／冰爽，涼感明顯、醒神解膩。",
  荔枝薄荷: "荔枝甜香與薄荷涼感並存。",
  百香果: "酸甜百香果，果香飽滿。",
  西瓜: "清甜西瓜，夏日感十足。",
  藍莓: "莓果酸甜，清新耐抽。",
  蜜桃: "水蜜桃的柔甜與汁感。",
  麝香葡萄: "麝香葡萄的芳香與甜度。",
  哈密瓜: "蜜瓜香甜，順口不膩。",
  檸檬海鹽: "檸檬酸香搭配微鹹層次，清爽有記憶點。",
  冰棍: "懷舊冰棍冰感，涼甜平衡。",
  蜂蜜柚子芒果: "複合口味：蜂蜜、柚子與芒果交疊。",
  養樂多: "乳酸菌系酸甜，順喉好入口。",
  可樂: "經典可樂風味與氣泡感。",
  薔薇布林: "薔薇花香與李子果酸，層次細緻。",
  櫻桃: "櫻桃甜香，果味鮮明。",
  草莓西瓜: "草莓與西瓜的雙果搭配。",
  冰清玉露: "類似花茶／清香，淡雅舒緩。",
  玫瑰茉莉: "玫瑰與茉莉花香調和。",
  葡萄: "多汁葡萄，香甜有尾韻。",
};

const FLAVOR_NAMES = [
  "白玉山竹",
  "冬瓜",
  "雪碧",
  "鐵觀音",
  "芭樂",
  "冰冰爆爆",
  "荔枝薄荷",
  "百香果",
  "西瓜",
  "藍莓",
  "蜜桃",
  "麝香葡萄",
  "哈密瓜",
  "檸檬海鹽",
  "冰棍",
  "蜂蜜柚子芒果",
  "養樂多",
  "可樂",
  "薔薇布林",
  "櫻桃",
  "草莓西瓜",
  "冰清玉露",
  "玫瑰茉莉",
  "葡萄",
] as const;

type FlavorOption = { name: string; mood: string };

const FLAVOR_OPTIONS: FlavorOption[] = FLAVOR_NAMES.map((name) => ({
  name,
  mood: MOOD_BY_NAME[name] ?? DEFAULT_MOOD,
}));

const PRODUCT_BASE_NAME = "DIYA 叮啞電子煙彈一盒三入 / 通用一代主機";

const SPECS: Array<[string, string]> = [
  ["商品名稱", PRODUCT_BASE_NAME],
  ["價格", "NT$199／盒"],
  ["規格", "一盒 3 顆，每顆容量 2.5ml"],
  ["相容主機", "悅刻（RELX）一代、SP2S、LANA 等一代通用主機"],
  ["客服 LINE", "abs791012（下單前請先添加）"],
];

const KEY_FEATURES: Array<{ k: string; v: string }> = [
  { k: "強相容", v: "一代通用規格，適配多款常見主機，替換直覺。" },
  { k: "大容量單顆", v: "每顆 2.5ml，單盒三入，便於攜帶與備貨。" },
  { k: "霧化表現", v: "霧化技術成熟，煙液轉化為濃郁霧氣，口感順滑。" },
  { k: "品質把關", v: "高品質煙油原料，經嚴格檢驗，使用更安心。" },
];

const PRODUCT_HIGHLIGHTS: Array<{ k: string; v: string }> = [
  { k: "口味陣容", v: "從果香、冰飲、茶系到複合調香，選擇多元。" },
  { k: "日常外出", v: "輕巧盒裝，適合日常與外出隨身使用。" },
  { k: "保存建議", v: "陰涼乾燥存放，避免陽光直射；定期清潔主機接口。" },
  { k: "購買提醒", v: "下單前請添加客服 LINE：abs791012，以便訂購與售後聯繫。" },
];

const DiyaPodsDetail = () => {
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

  const getProductTitle = () =>
    selectedOption ? `DIYA 叮啞煙彈 3 顆裝｜${selectedOption}｜一代通用主機` : PRODUCT_BASE_NAME;
  const getProductDescription = () =>
    selectedOption ? `DIYA 叮啞【${selectedOption}】一盒三入 · 一代通用` : "DIYA 叮啞煙彈 · 一盒三入 · 一代通用";
  const getCategory = () => "DIYA 叮啞煙彈 / 一代通用";
  const getTags = () =>
    selectedOption
      ? `DIYA，叮啞，煙彈，${selectedOption}，3顆裝，一代通用`
      : "DIYA，叮啞，煙彈，3顆裝，一代通用";
  const getBadgeText = () =>
    selectedOption ? `叮啞煙彈｜${selectedOption}` : "叮啞煙彈｜請先選擇口味";

  const selectedMood = FLAVOR_OPTIONS.find((o) => o.name === selectedOption)?.mood;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const buildCartPayload = () => {
    if (!selectedOption) return null;
    return {
      productId: DIYA_PODS_PRODUCT_ID,
      title: `DIYA 叮啞煙彈 3 顆裝 ${selectedOption}`.trim(),
      variant: selectedOption,
      priceTwd: DIYA_PODS_PRICE_TWD,
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
        className={`sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm transition-transform duration-300 ${
          isScrolled ? "-translate-y-full" : ""
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-1">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="Logo" className="h-20 w-20 rounded-lg object-contain" />
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <a href="#" className="font-medium text-gray-700 hover:text-gray-900">
              我的帳號
            </a>
            <button type="button" onClick={openCart} className="font-medium text-gray-700 hover:text-gray-900">
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

          <button type="button" onClick={openCart} aria-label="購物車" className="relative md:hidden">
            <ShoppingCart className="h-5 w-5 text-gray-600" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[10px] text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>
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
              <img src={productMain} alt="DIYA 叮啞煙彈" className="h-[500px] w-full object-contain" />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="rounded-md bg-red-600 px-6 py-2 font-bold text-white shadow-lg">{getBadgeText()}</div>
              </div>
            </div>

            <ProductHeroFeatureTags tags={["2.5ml／顆", "一盒三入", "一代通用", "多口味"]} />

            <div className="mt-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">{getProductDescription()}</h2>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <a href="/" className="hover:text-gray-700">
                首頁
              </a>
              <span>/</span>
              <a href="/#pods" className="hover:text-gray-700">
                彈匣與煙油
              </a>
              <span>/</span>
              <span className="tracking-tight text-gray-700">DIYA 叮啞煙彈</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{getProductTitle()}</h1>

            <p className="text-sm leading-relaxed text-gray-600">
              規格：一盒 3 顆，每顆 2.5ml。相容悅刻（RELX）一代、SP2S、LANA 等一代通用主機。
            </p>

            <div className="text-4xl font-bold text-gray-900">{`NT$${DIYA_PODS_PRICE_TWD}.00`}</div>

            <div className="space-y-4">
              <label className="text-lg font-medium text-gray-800">口味款式：</label>
              <div className="max-h-[280px] overflow-y-auto rounded-lg border border-gray-100 bg-gray-50/50 p-3 pr-1">
                <div className="flex flex-wrap gap-2">
                  {FLAVOR_OPTIONS.map((option) => (
                    <button
                      key={option.name}
                      type="button"
                      onClick={() => handleOptionChange(option.name)}
                      className={`shrink-0 rounded-full border px-3 py-2 text-sm transition-colors ${
                        selectedOption === option.name
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      【{option.name}】
                    </button>
                  ))}
                </div>
              </div>
              {selectedMood ? <p className="text-sm leading-relaxed text-gray-500">{selectedMood}</p> : null}
            </div>

            <div className="space-y-2 text-gray-700">
              <p className="font-medium text-gray-900">DIYA 叮啞煙彈 — 相容強、口味全</p>
              <p>購買前請添加客服 LINE: abs791012</p>
              <p>NT$199／盒 · 每盒 3 顆 · 每顆 2.5ml</p>
              <p>適配 RELX 一代、SP2S、LANA 等通用主機</p>
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
              <p className="text-sm text-gray-500">
                切換口味時數量會重設為 1。可先加入一種口味，再選其他口味分別加入，購物車內可同時保留多種口味。
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
              叮啞煙彈是一款相容性極強的一代通用煙彈，適合多款電子煙主機，包括 SP2、LANA
              等。它以多樣化的口味選擇為特色，從清新果香到茶飲與冰感調香，滿足不同使用者需求。每盒含三顆煙彈，每顆容量
              2.5ml，便於攜帶，適合日常及外出使用。
            </p>
            <p className="mt-4 leading-8 text-gray-700">
              霧化技術成熟，能快速將煙液轉化為濃郁霧氣，提供順滑口感。叮啞煙彈採用高品質煙油，經過嚴格品質檢驗，確保安全可靠。建議存放於陰涼乾燥處，避免陽光直射，並定期清潔主機接口，以延長保存並維持最佳使用效果。下單前請添加客服
              LINE：abs791012。
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
            <h3 className="text-xl font-bold text-gray-900">DIYA 叮啞口味一覽</h3>
            <div className="mt-3 h-px w-12 bg-gray-900" />
            <p className="mt-4 text-sm text-gray-600">點選口味可於上方查看簡述；以下為全系列風味說明。</p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {FLAVOR_OPTIONS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => handleOptionChange(c.name)}
                  className={`rounded-xl border p-4 text-left transition-colors ${
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <h3 className="text-xl font-bold text-gray-900">產品參數</h3>
              <div className="mt-3 h-px w-12 bg-gray-900" />
              <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-gray-700">
                {SPECS.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex flex-col gap-1 border-b border-dashed border-gray-200 py-1.5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <dt className="shrink-0 text-gray-500">{k}</dt>
                    <dd className="font-medium text-gray-900 sm:text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
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

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
            <h3 className="text-xl font-bold text-gray-900">產品特點</h3>
            <div className="mt-3 h-px w-12 bg-gray-900" />
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
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

export default DiyaPodsDetail;
