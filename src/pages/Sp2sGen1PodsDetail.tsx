import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronLeft, Plus, Minus } from "lucide-react";
import { requestHomeScrollRestore } from "@/lib/homeScrollRestore";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { SelectVariantDialog } from "@/components/SelectVariantDialog";
import { ProductHeroFeatureTags } from "@/components/ProductHeroFeatureTags";
import { BrandSp2s } from "@/components/BrandSp2s";
import productMain from "@/assets/sp2s-gen1-pods-catalog.webp";
import logoImage from "@/assets/product-14.jpg";

const SP2S_GEN1_PODS_PRODUCT_ID = "sp2s-gen1-pods";
const SP2S_GEN1_PODS_PRICE_TWD = 220;

const DEFAULT_MOOD = "思博瑞一代通用煙彈，陶瓷霧化細緻順喉，相容多款一代主機。";

const MOOD_BY_NAME: Record<string, string> = {
  紅顏知己: "草莓調果香，甜感鮮明、層次柔順。",
  鳳梨: "熱帶鳳梨酸甜，清爽耐抽。",
  莓果: "綜合莓果酸甜，果香飽滿。",
  荔枝: "荔枝清甜，尾韻乾淨。",
  元氣蜜桃: "蜜桃氣泡感，活力甜香。",
  葡萄: "紫葡萄多汁香甜。",
  芒果: "熟成芒果濃郁香甜。",
  西瓜: "冰西瓜汁感，清甜解暑。",
  白葡萄: "青提／白葡萄清香。",
  礦泉荔枝: "荔枝與礦泉感結合，清涼順口。",
  青梅: "青梅酸香，微澀回甘。",
  奇異果: "奇異果酸甜與清新。",
  蘋果: "爽脆蘋果，自然果汁感。",
  柳橙: "鮮橙酸甜與柑橘香氣。",
  藍莓: "藍莓莓果酸甜。",
  百香果: "百香果熱帶酸香。",
  芭樂: "芭樂清香與甜感。",
  哈密瓜: "哈密瓜蜜甜柔順。",
  老冰棍: "懷舊冰棍冰甜，涼感直觀。",
  蘇打水: "氣泡蘇打清爽感。",
  黑加侖利賓納: "黑加侖莓飲酸甜濃郁。",
  檸檬紅茶: "檸檬酸香與紅茶底韻。",
  橘氣: "柑橘蘇打，氣泡感與橘香並存。",
  沙士: "沙士草本與氣泡風味。",
  礦力冰: "類似寶礦力電解質飲品，鹹甜冰涼。",
  可樂: "經典可樂焦糖與氣泡感。",
  南極冰: "極地強冷薄荷，涼感突出。",
  龍井: "龍井茶香清雅。",
  煙草: "經典煙草醇厚底韻。",
  茉莉綠茶: "茉莉花香與綠茶清新。",
  鐵觀音: "鐵觀音茶韻與回甘。",
  蜜桃烏龍: "蜜桃甜香搭烏龍茶底。",
  口香糖: "薄荷口香糖涼甜。",
  海照: "海鹽調性與冰感層次（依批次風味可能略有差異）。",
  芋頭: "芋頭奶甜柔順。",
  綠豆: "綠豆沙冰感，清甜解膩。",
};

const FLAVOR_GROUPS: { title: string; names: readonly string[] }[] = [
  {
    title: "水果系列",
    names: [
      "紅顏知己",
      "鳳梨",
      "莓果",
      "荔枝",
      "元氣蜜桃",
      "葡萄",
      "芒果",
      "西瓜",
      "白葡萄",
      "礦泉荔枝",
      "青梅",
      "奇異果",
      "蘋果",
      "柳橙",
      "藍莓",
      "百香果",
      "芭樂",
      "哈密瓜",
    ],
  },
  {
    title: "飲品與冰爽系列",
    names: ["老冰棍", "蘇打水", "黑加侖利賓納", "檸檬紅茶", "橘氣", "沙士", "礦力冰", "可樂", "南極冰"],
  },
  {
    title: "茶飲與原味系列",
    names: ["龍井", "煙草", "茉莉綠茶", "鐵觀音", "蜜桃烏龍"],
  },
  {
    title: "甜品與趣味系列",
    names: ["口香糖", "海照", "芋頭", "綠豆"],
  },
];

const FLAVOR_NAMES = FLAVOR_GROUPS.flatMap((g) => [...g.names]) as readonly string[];

type FlavorOption = { name: string; mood: string };

const FLAVOR_OPTIONS: FlavorOption[] = FLAVOR_NAMES.map((name) => ({
  name,
  mood: MOOD_BY_NAME[name] ?? DEFAULT_MOOD,
}));

const PRODUCT_BASE_NAME = "SP2S 思博瑞煙彈（一代通用主機）";

const SPECS: Array<[string, string]> = [
  ["商品名稱", PRODUCT_BASE_NAME],
  ["尼古丁含量", "常見 3%（實際以包裝標示為準）"],
  ["霧化結構", "白色陶瓷芯，導熱均勻、口感穩定"],
  ["相容主機", "SP2S／SP2S PRO 系列、RELX 一代等一代規格主機"],
  ["客服 LINE", "abs791012（下單前請先添加）"],
];

const KEY_FEATURES: Array<{ k: string; v: string }> = [
  { k: "口味陣容", v: "水果、飲品冰感、茶飲與甜品系一次收錄，可依情境輪替。" },
  { k: "陶瓷霧化", v: "陶瓷芯霧化細緻，有助穩定輸出並降低焦味困擾（仍請依使用習慣調整）。" },
  { k: "相容性", v: "一代通用思路設計，便於與多款常見主機搭配。" },
  { k: "即插即用", v: "插拔替換直覺，日常維護相對單純。" },
];

const PRODUCT_HIGHLIGHTS: Array<{ k: string; v: string }> = [
  { k: "選購提醒", v: "口味與批次以現貨為準；下單前請添加客服 LINE：abs791012。" },
  { k: "健康聲明", v: "電子煙產品具風險，非吸菸者請勿嘗試；未成年人不得購買與使用。" },
  { k: "包裝標示", v: "成分、產地與尼古丁濃度請一律以實際包裝與說明書為準。" },
  { k: "保存建議", v: "陰涼乾燥存放，避免高溫與陽光直射；主機接口建議定期清潔。" },
];

const Sp2sGen1PodsDetail = () => {
  const navigate = useNavigate();
  const { addToCart, itemCount, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [variantPromptOpen, setVariantPromptOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleOptionChange = (option: string) => {
    if (option !== selectedOption) setQuantity(1);
    setSelectedOption(option);
  };

  const getProductTitle = () =>
    selectedOption ? `SP2S 一代通用煙彈｜${selectedOption}｜思博瑞` : PRODUCT_BASE_NAME;
  const getProductDescription = () =>
    selectedOption ? `SP2S【${selectedOption}】一代通用煙彈` : "SP2S 一代通用煙彈 · 思博瑞";
  const getCategory = () => "SP2S 煙彈 / 一代通用";
  const getTags = () =>
    selectedOption
      ? `SP2S，思博瑞，煙彈，${selectedOption}，一代通用`
      : "SP2S，思博瑞，煙彈，一代通用";
  const getBadgeText = () =>
    selectedOption ? `陶瓷白芯｜${selectedOption}` : "陶瓷白芯｜請先選擇口味";

  const selectedMood = FLAVOR_OPTIONS.find((o) => o.name === selectedOption)?.mood;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const buildCartPayload = () => {
    if (!selectedOption) return null;
    return {
      productId: SP2S_GEN1_PODS_PRODUCT_ID,
      title: `SP2S 一代通用煙彈 ${selectedOption}`.trim(),
      variant: selectedOption,
      priceTwd: SP2S_GEN1_PODS_PRICE_TWD,
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
              <img src={productMain} alt="SP2S 一代通用煙彈口味總覽" className="h-[500px] w-full object-contain" />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="rounded-md bg-red-600 px-6 py-2 font-bold text-white shadow-lg">{getBadgeText()}</div>
              </div>
            </div>

            <ProductHeroFeatureTags tags={["陶瓷白芯", "一代通用", "多口味", "即插即用"]} />

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
              <a href="/#accessories" className="hover:text-gray-700">
                訂製配飾
              </a>
              <span>/</span>
              <span className="tracking-tight text-gray-700">
                <BrandSp2s className="font-semibold text-gray-700" /> 一代煙彈
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              <BrandSp2s className="font-bold text-gray-900" /> 思博瑞一代通用煙彈
            </h1>

            <p className="text-sm leading-relaxed text-gray-600">
              高性能陶瓷芯、豐富口味與一代主機相容思路並重；尼古丁濃度與成分請以包裝標示為準。
            </p>

            <div className="text-4xl font-bold text-gray-900">{`NT$${SP2S_GEN1_PODS_PRICE_TWD}.00`}</div>

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
              <p className="font-medium text-gray-900">
                <BrandSp2s /> 思博瑞煙彈 — 口味全、相容廣
              </p>
              <p>購買前請添加客服 LINE: abs791012</p>
              <p>白色陶瓷芯 · 一代通用 · 多層次風味</p>
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
              思博瑞 <BrandSp2s className="text-gray-800" />{" "}
              煙彈在口味、霧化表現與主機相容之間取得平衡：口味涵蓋水果、飲品冰感、茶飲與甜品趣味等路線，方便依情境輪替；陶瓷芯有助於穩定霧化與口感一致性。實際濃度、成分與產地資訊，請以包裝與官方說明為準。
            </p>
            <p className="mt-4 leading-8 text-gray-700">
              <span className="font-semibold text-gray-900">1. 多樣化的口味選擇</span>
              <br />
              從經典煙草、茶系到水果與汽水冰感，風味跨度大；若你正在控制尼古丁攝入，請務必確認包裝標示並依自身需求選購。
            </p>
            <p className="mt-4 leading-8 text-gray-700">
              <span className="font-semibold text-gray-900">2. 高性能霧化技術</span>
              <br />
              白色陶瓷芯具較佳導熱與均勻霧化特性，相較傳統棉芯更不易出現乾燒焦味（仍請避免空燒與過度連抽）。結構上亦著重防漏與日常使用穩定性。
            </p>
            <p className="mt-4 leading-8 text-gray-700">
              <span className="font-semibold text-gray-900">3. 強大的兼容性</span>
              <br />
              除 <BrandSp2s className="text-gray-800" />{" "}
              主機外，亦常見於一代規格相容場景（例如 RELX 一代等，實際密合度仍以主機／煙彈批次為準）。
            </p>
            <p className="mt-4 leading-8 text-gray-700">
              <span className="font-semibold text-gray-900">4. 經濟實惠與性價比</span>
              <br />
              合理定價與耐用取向的霧化元件，有助降低頻繁更換成本；實際使用壽命仍取決於抽吸習慣與煙油特性。
            </p>
            <p className="mt-4 leading-8 text-gray-700">
              <span className="font-semibold text-gray-900">5. 健康與環保設計</span>
              <br />
              材料與檢驗流程以品牌官方揭露為準；請依法規與年齡限制使用，並妥善回收廢棄彈匣與包材。
            </p>
            <p className="mt-4 leading-8 text-gray-700">
              <span className="font-semibold text-gray-900">6. 便捷的使用與維護</span>
              <br />
              即插即用、分離式設計讓清潔與更換更直覺；建議定期清潔主機接點並避免冷凝堆積影響通電。
            </p>
            <p className="mt-4 leading-8 text-gray-700">
              <span className="font-semibold text-gray-900">總結</span>
              <br />
              思博瑞 <BrandSp2s className="text-gray-800" />{" "}
              煙彈以口味豐富、霧化細緻與相容面向見長，適合希望在同一代主機生態中快速找到順口風味的使用者。下單前請添加客服 LINE：abs791012。
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
            <h3 className="text-xl font-bold text-gray-900">
              <BrandSp2s className="font-bold text-gray-900" /> 一代口味分區一覽
            </h3>
            <div className="mt-3 h-px w-12 bg-gray-900" />
            <p className="mt-4 text-sm text-gray-600">點選卡片可同步帶入上方口味選擇。</p>

            {FLAVOR_GROUPS.map((group, gi) => (
              <div key={group.title} className={gi === 0 ? "mt-8" : "mt-10"}>
                <h4 className="text-lg font-semibold text-gray-900">{group.title}</h4>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.names.map((name) => {
                    const mood = MOOD_BY_NAME[name] ?? DEFAULT_MOOD;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => handleOptionChange(name)}
                        className={`rounded-xl border p-4 text-left transition-colors ${
                          selectedOption === name
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="font-semibold text-gray-900">【{name}】</div>
                        <p className="mt-1 text-sm leading-6 text-gray-600">{mood}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
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

export default Sp2sGen1PodsDetail;
