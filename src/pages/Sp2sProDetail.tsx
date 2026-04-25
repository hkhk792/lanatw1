import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronLeft, Plus, Minus } from "lucide-react";
import { requestHomeScrollRestore } from "@/lib/homeScrollRestore";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { SelectVariantDialog } from "@/components/SelectVariantDialog";
import productMain from "@/assets/product-4.png";
import logoImage from "@/assets/product-14.jpg";

const PRO_PRODUCT_ID = "pro";
const PRO_PRICE_TWD = 880;

type ColorOption = { name: string; mood: string };

const COLOR_OPTIONS: ColorOption[] = [
  { name: "海棠粉", mood: "柔美粉調，如海棠盛開，優雅不失活力。" },
  { name: "忍者白", mood: "純白俐落，百搭經典，適合追求極簡風格。" },
  { name: "森翠綠", mood: "翠綠自然質感，清新沉穩並存。" },
  { name: "霧藍", mood: "霧面低調藍，內斂質感，日常與場合皆宜。" },
  { name: "金粉", mood: "細緻珠光金粉，低調奢華，光影下更顯層次。" },
  { name: "紫色", mood: "飽和紫調，神秘亮眼，展現個人態度。" },
  { name: "星空藍", mood: "深邃星光藍，科技感與未來感兼具。" },
  { name: "黑武士", mood: "全黑霧面，沉著力量，經典不退流行。" },
];

const INTRO_BULLETS = [
  "人體工學考量，第二代霧化黑科技。",
  "合金材質烤漆，親膚更耐磨。",
  "Y 線氣道設計，創造獨特品味。",
  "採用德國進口高精度機械加工而成。",
  "獨家煙油配方，強烈喉感，喚醒全身。",
  "插入煙彈時有震動指示。",
  "單次抽吸超過 6 秒有震動指示。",
  "20 分鐘內抽吸 15 口有震動提示。",
];

const SPECS: Array<[string, string]> = [
  ["品牌型號", "思博瑞 SP2S Pro 主機"],
  ["顏色款式", "8 色可選"],
  ["輸出功率", "6W – 8W"],
  ["電池容量", "380mAh"],
  ["充電介面", "Type-C（建議 5V / 1A 標準充電）"],
  ["操作方式", "智慧吸力感應，無實體按鍵"],
  ["燈效", "底部 LED 燈條，支援七彩模式切換"],
  ["適配煙彈", "相容各款一代煙彈與配件"],
];

const DEEP_SECTIONS: Array<{ title: string; body: string }> = [
  {
    title: "外觀設計",
    body:
      "SP2S Pro 主機採用時尚簡約設計，機身由高品質合金製成，表面烤漆細緻、手感舒適；整體輕巧便攜，符合現代使用者對質感與攜帶性的雙重期待。",
  },
  {
    title: "LED 燈條",
    body:
      "主機底部配有高辨識度 LED 燈條，支援七彩發光模式切換，夜晚或聚會場合都能增添個性與氛圍，讓設備成為風格配件的一部分。",
  },
  {
    title: "功率與電池",
    body:
      "功率範圍約 6W–8W，內建 380mAh 大容量電池，續航表現穩定，並支援快充設計，縮短等待、延長使用時間。",
  },
  {
    title: "充電介面",
    body:
      "採用 Type-C 充電介面，建議使用標準 5V / 1A 充電器；請避免長時間使用不合規格的快充頭，以降低電路負擔、保護主機壽命。",
  },
  {
    title: "操作便捷性",
    body:
      "智慧感應開關設計，無需按鍵，輕吸即可啟動；感應靈敏度經優化，輕柔吸力也能穩定觸發，上手即順。",
  },
  {
    title: "安全性能",
    body:
      "內建過熱保護、短路保護與低電量提醒等多重機制，提升使用安心度，並有助於延長主機與煙彈的穩定表現。",
  },
  {
    title: "相容性",
    body:
      "相容各款一代煙彈與相關配件，可依喜好替換口味與霧化體驗，滿足多元使用情境。",
  },
  {
    title: "維護與注意事項",
    body:
      "建議定期充電以維持電池最佳狀態，避免電量耗盡後長期閒置。使用時請避免摔落或重壓，並存放於避免高溫、潮濕的環境，以保護內部元件。",
  },
];

const Sp2sProDetail = () => {
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
    selectedOption
      ? `SP2S Pro ${selectedOption} 二代旗艦霧化主機｜智慧感應 · LED 炫彩`
      : "SP2S Pro 二代旗艦霧化主機｜智慧感應 · LED 炫彩";
  const getProductDescription = () =>
    selectedOption ? `SP2S Pro ${selectedOption} 二代旗艦霧化主機` : "SP2S Pro 二代旗艦霧化主機";
  const getCategory = () => "SP2S Pro 系列";
  const getTags = () =>
    selectedOption ? `SP2S Pro，${selectedOption}，二代主機` : "SP2S Pro，二代主機";
  const getBadgeText = () => (selectedOption ? `SP2 PRO｜${selectedOption}` : "SP2 PRO｜請先選擇顏色");

  const selectedMood = COLOR_OPTIONS.find((o) => o.name === selectedOption)?.mood;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const buildCartPayload = () => {
    if (!selectedOption) return null;
    return {
      productId: PRO_PRODUCT_ID,
      title: getProductTitle().replace("｜", " ").trim(),
      variant: selectedOption,
      priceTwd: PRO_PRICE_TWD,
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
        message="請先從上方選擇一種顏色款式，再加入購物車或立即購買。"
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
              <div className="absolute left-4 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-3">
                {["第二代霧化", "智慧感應", "LED 炫彩", "Type-C"].map((t) => (
                  <div key={t} className="flex items-center gap-2 rounded-lg bg-white px-4 py-3 shadow-md">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-700">✓</div>
                    <span className="text-sm font-medium">{t}</span>
                  </div>
                ))}
              </div>

              <img src={productMain} alt="SP2S Pro" className="h-[500px] w-full object-contain" />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="rounded-md bg-red-600 px-6 py-2 font-bold text-white shadow-lg">{getBadgeText()}</div>
              </div>
            </div>

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
              <a href="#" className="hover:text-gray-700">
                SP2S Pro 系列
              </a>
              <span>/</span>
              <span className="tracking-tight text-gray-700">二代旗艦主機</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{getProductTitle()}</h1>

            <div className="text-4xl font-bold text-gray-900">{`NT$${PRO_PRICE_TWD}.00`}</div>

            <div className="space-y-4">
              <span className="text-lg font-medium text-gray-800">顏色款式：</span>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((option) => (
                  <button
                    key={option.name}
                    type="button"
                    onClick={() => handleOptionChange(option.name)}
                    className={`rounded-full border px-4 py-2 transition-colors ${
                      selectedOption === option.name
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    【{option.name}】
                  </button>
                ))}
              </div>
              {selectedMood ? <p className="text-sm text-gray-500">{selectedMood}</p> : null}
            </div>

            <div className="space-y-2 text-gray-700">
              <p>購買前請添加客服 LINE: abs791012</p>
              <p>品牌：SPRINGTIME 思博瑞 · SP2S Pro 二代旗艦</p>
              <p>380mAh 電池 · 6W–8W 輸出 · Type-C 充電</p>
              <p>智慧吸力感應 · 底部七彩 LED 燈條</p>
              <p>相容一代煙彈與配件</p>
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
                切換款式時數量會重設為 1。可先加入一種款式，再選其他款式分別加入，購物車內可同時保留多種款式。
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
            <h2 className="text-2xl font-bold text-gray-900">產品介紹</h2>
            <div className="mt-4 h-px w-14 bg-gray-900" />
            <p className="mt-6 leading-8 text-gray-700">
              SP2S Pro 主機由思博瑞（SP2S）推出，集第二代霧化技術、合金烤漆工藝與智慧感應於一身，為追求喉感與質感並重的使用者打造旗艦級體驗。
            </p>
            <ul className="mt-6 space-y-3 text-gray-800">
              {INTRO_BULLETS.map((line) => (
                <li key={line} className="flex gap-3 text-sm leading-relaxed sm:text-base">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-900" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
            <h3 className="text-xl font-bold text-gray-900">八款配色 · 質感各異</h3>
            <div className="mt-3 h-px w-12 bg-gray-900" />
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => handleOptionChange(c.name)}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    selectedOption === c.name ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold text-gray-900">{c.name}</div>
                  <p className="mt-1 text-sm leading-6 text-gray-600">{c.mood}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <h3 className="text-xl font-bold text-gray-900">產品參數</h3>
              <div className="mt-3 h-px w-12 bg-gray-900" />
              <dl className="mt-5 grid grid-cols-1 gap-3 text-sm text-gray-700">
                {SPECS.map(([k, v]) => (
                  <div key={k} className="flex items-start justify-between gap-4 border-b border-dashed border-gray-200 py-2">
                    <dt className="text-gray-500">{k}</dt>
                    <dd className="max-w-[60%] text-right font-medium text-gray-900">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <h3 className="text-xl font-bold text-gray-900">智慧提示與震動</h3>
              <div className="mt-3 h-px w-12 bg-gray-900" />
              <ul className="mt-5 space-y-3 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="text-gray-900">·</span>
                  插入煙彈時震動回饋，確認安裝到位。
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-900">·</span>
                  單次抽吸超過 6 秒震動提示，避免過度吸入。
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-900">·</span>
                  20 分鐘內累計 15 口震動提示，協助掌握使用節奏。
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
            <h3 className="text-xl font-bold text-gray-900">產品深度說明</h3>
            <div className="mt-3 h-px w-12 bg-gray-900" />
            <div className="mt-8 space-y-8">
              {DEEP_SECTIONS.map((s) => (
                <div key={s.title}>
                  <h4 className="text-base font-semibold text-gray-900">{s.title}</h4>
                  <p className="mt-2 text-sm leading-7 text-gray-700 sm:text-[15px]">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Sp2sProDetail;
