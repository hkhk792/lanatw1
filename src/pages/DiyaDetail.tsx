import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronLeft, Plus, Minus } from "lucide-react";
import { requestHomeScrollRestore } from "@/lib/homeScrollRestore";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { SelectVariantDialog } from "@/components/SelectVariantDialog";
import { ProductHeroFeatureTags } from "@/components/ProductHeroFeatureTags";
import productMain from "@/assets/product-6.webp";
import logoImage from "@/assets/product-14.jpg";
import { ORDER_MODEL_DIYA_DEVICE } from "@/lib/orderProductModels";

const DIYA_PRODUCT_ID = "diya";
const DIYA_PRICE_TWD = 320;

const PRODUCT_FULL_NAME = ORDER_MODEL_DIYA_DEVICE;

type ColorOption = { name: string; mood: string };

const COLOR_OPTIONS: ColorOption[] = [
  { name: "光影藍綠", mood: "藍綠交織的光影感，清爽又帶一點未來科技氛圍。" },
  { name: "少女粉", mood: "柔粉甜美，輕盈好搭，適合喜歡柔和配色的使用者。" },
  { name: "情迷藍", mood: "飽和藍調沉穩迷人，日常配戴也顯質感。" },
  { name: "皓月白", mood: "乾淨皓白如月，極簡耐看，任何場合都不突兀。" },
  { name: "紳士黑", mood: "內斂黑系，俐落有型，偏商務與低調風格首選。" },
];

const SPECS: Array<[string, string]> = [
  ["產品全稱", PRODUCT_FULL_NAME],
  ["輸出功率", "8W 大功率"],
  ["電池容量", "450mAh"],
  ["油倉容量", "2.5ml 大容量"],
  ["煙彈相容", "一代煙彈通用"],
  ["定位", "陶瓷霧化桿 / 便攜主機"],
];

const DiyaDetail = () => {
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

  const getProductTitle = () => "DIYA 叮啞霧化桿｜2.5ML · 8W · 一代通用";
  const getProductDescription = () => "DIYA 叮啞霧化桿 · 2.5ML 大容量 · 陶瓷芯";
  const getCategory = () => "DIYA 陶瓷霧化系列";
  const getTags = () => "DIYA，叮啞，一代通用，多色可選";
  const getBadgeText = () =>
    selectedOption ? `叮啞主機｜${selectedOption}` : "叮啞主機｜請先選擇配色";

  const selectedMood = COLOR_OPTIONS.find((o) => o.name === selectedOption)?.mood;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const buildCartPayload = () => {
    if (!selectedOption) return null;
    return {
      productId: DIYA_PRODUCT_ID,
      title: PRODUCT_FULL_NAME,
      variant: selectedOption,
      priceTwd: DIYA_PRICE_TWD,
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
        message="請先從上方選擇一種主機配色，再加入購物車或立即購買。"
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
              <img src={productMain} alt="DIYA 叮啞霧化桿" className="h-[500px] w-full object-contain" />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="rounded-md bg-red-600 px-6 py-2 font-bold text-white shadow-lg">{getBadgeText()}</div>
              </div>
            </div>

            <ProductHeroFeatureTags tags={["2.5ML 大油倉", "8W 大功率", "450mAh", "一代通用"]} />

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
              <span className="tracking-tight text-gray-700">DIYA 陶瓷</span>
              <span>/</span>
              <span className="text-gray-700">叮啞霧化桿</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{getProductTitle()}</h1>

            <p className="text-sm leading-relaxed text-gray-600">{PRODUCT_FULL_NAME}</p>

            <div className="text-4xl font-bold text-gray-900">{`NT$${DIYA_PRICE_TWD}.00`}</div>

            <div className="space-y-4">
              <span className="text-lg font-medium text-gray-800">主機配色：</span>
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
              <p>8W 輸出 · 450mAh 電量 · 2.5ml 大容量油倉</p>
              <p>一代煙彈通用，換彈方便</p>
              <p>陶瓷霧化路徑，口感細緻順喉</p>
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
                切換配色時數量會重設為 1。可先加入一種配色，再選其他配色分別加入，購物車內可同時保留多筆。
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
              DIYA 叮啞系列以「大油倉、穩定輸出、一代通用」為核心，將 2.5ml 儲油空間與 8W
              大功率、450mAh 電池整合在輕巧桿身中，適合希望減少頻繁注油、又想維持一致霧化表現的使用者。外觀提供五款主機配色，可依個人風格自由選擇。
            </p>
            <p className="mt-4 leading-8 text-gray-700">
              霧化路徑採陶瓷相關結構設計（實際結構以官方規格為準），有助於均勻導油與細緻口感；搭配市面常見一代規格煙彈，降低相容性困擾，日常替換更直覺。
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
            <h3 className="text-xl font-bold text-gray-900">五款主機配色</h3>
            <div className="mt-3 h-px w-12 bg-gray-900" />
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
              <dl className="mt-5 space-y-3 text-sm text-gray-700">
                {SPECS.map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-1 border-b border-dashed border-gray-200 py-2 sm:flex-row sm:justify-between sm:gap-4">
                    <dt className="text-gray-500">{k}</dt>
                    <dd className="font-medium text-gray-900 sm:max-w-[58%] sm:text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <h3 className="text-xl font-bold text-gray-900">使用情境</h3>
              <div className="mt-3 h-px w-12 bg-gray-900" />
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-gray-700">
                <li className="flex gap-2">
                  <span className="text-gray-900">·</span>
                  通勤與外出：輕量桿身＋一代通用，臨時補貨或替換煙彈較容易取得。
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-900">·</span>
                  偏好較長續抽節奏：2.5ml 大油倉可減少反覆開蓋注油或頻繁更換的次數（仍請依煙彈實際壽命使用）。
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-900">·</span>
                  8W 輸出適合多數一代口吸／輕肺吸型煙彈，建議依煙油濃度微調抽吸節奏以取得最佳風味。
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 md:p-8">
              <h3 className="text-lg font-semibold text-gray-900">保養建議</h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                定期以乾布擦拭主機與接點，避免冷凝液堆積影響通電；長時間不用請拔除煙彈並存放於陰涼乾燥處。充電請使用合格線材，避免邊充邊吸以延長電池壽命。
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 md:p-8">
              <h3 className="text-lg font-semibold text-gray-900">選購提醒</h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                本商品標示為一代煙彈通用，實際密合度仍可能因品牌模具略有差異；若遇吸阻異常或漏油，請先確認煙彈是否安裝到位。未成年人不得購買與使用電子煙產品。
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DiyaDetail;
