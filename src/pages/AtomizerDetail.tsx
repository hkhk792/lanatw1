import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronLeft, Plus, Minus } from "lucide-react";
import { requestHomeScrollRestore } from "@/lib/homeScrollRestore";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { SelectVariantDialog } from "@/components/SelectVariantDialog";
import { ProductHeroFeatureTags } from "@/components/ProductHeroFeatureTags";
import { ResponsiveAssetImg } from "@/components/ResponsiveAssetImg";
import { AtomizerHostGemini } from "@/lib/responsiveImageVariants.generated";
import { ORDER_MODEL_ATOMIZER_HOST } from "@/lib/orderProductModels";

const productMain = AtomizerHostGemini.src;
import logoImage from "@/assets/product-14.jpg";

const ATOMIZER_PRODUCT_ID = "atomizer";
const ATOMIZER_PRICE_TWD = 290;

type ColorOption = { name: string; mood: string };

const COLOR_OPTIONS: ColorOption[] = [
  { name: "綠色", mood: "清新綠調，視覺舒壓，適合偏愛自然風格的使用者。" },
  { name: "霧藍", mood: "低飽和霧面藍，沉穩內斂，日常與工作場合皆宜。" },
  { name: "黑色", mood: "經典霧黑，低調專業，耐看不顯指紋。" },
];

const SPECS: Array<[string, string]> = [
  ["產品定位", "原子棒一代通配主機"],
  ["配色", "綠色 / 霧藍 / 黑色"],
  ["輸出模式", "預熱功率、輸出曲線、旁路機械、溫控記憶（依機型支援為準）"],
  ["操作介面", "實體加減鍵 + 主機端曲線編輯"],
  ["安全機制", "新舊霧化器辨識、功率匹配提示、過熱與短路保護"],
  ["建議搭配", "花式線圈 / 高阻口吸霧化器皆可嘗試不同曲線"],
  ["充電", "Type-C（建議使用標準規格充電器）"],
];

const AtomizerDetail = () => {
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

  const getProductTitle = () => "原子棒一代通配主機｜可調功率 · 曲線輸出";
  const getProductDescription = () => "原子棒一代通配主機";
  const getCategory = () => "原子棒一代通配主機 / 調壓設備";
  const getTags = () => "原子棒，一代通配主機，多色可選";
  const getBadgeText = () => (selectedOption ? `主機｜${selectedOption}` : "主機｜請先選擇配色");

  const selectedMood = COLOR_OPTIONS.find((o) => o.name === selectedOption)?.mood;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const buildCartPayload = () => {
    if (!selectedOption) return null;
    return {
      productId: ATOMIZER_PRODUCT_ID,
      title: ORDER_MODEL_ATOMIZER_HOST,
      variant: selectedOption,
      priceTwd: ATOMIZER_PRICE_TWD,
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
        message="請先從上方選擇一種配色，再加入購物車或立即購買。"
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
              <div className="h-[min(100vw,28rem)] w-full sm:h-[500px]">
                <ResponsiveAssetImg
                  set={AtomizerHostGemini}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  alt="原子棒一代通配主機"
                  className="h-full w-full object-contain"
                  loading="eager"
                  decoding="async"
                />
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="rounded-md bg-red-600 px-6 py-2 font-bold text-white shadow-lg">{getBadgeText()}</div>
              </div>
            </div>

            <ProductHeroFeatureTags tags={["預熱功率", "輸出曲線", "旁路模式", "安全辨識"]} />

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
              <span className="tracking-tight text-gray-700">原子棒一代通配主機</span>
              <span>/</span>
              <span className="text-gray-700">原子棒系列</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{getProductTitle()}</h1>

            <div className="text-4xl font-bold text-gray-900">{`NT$${ATOMIZER_PRICE_TWD}.00`}</div>

            <div className="space-y-4">
              <span className="text-lg font-medium text-gray-800">配色：</span>
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
              <p>支援預熱功率、主機端輸出曲線與記憶切換</p>
              <p>新舊霧化器辨識，降低誤選功率導致糊芯風險</p>
              <p>旁路機械模式，適合燒絲與 DIY 霧化器玩家</p>
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
            <h2 className="text-2xl font-bold text-gray-900">產品介紹</h2>
            <div className="mt-4 h-px w-14 bg-gray-900" />
            <p className="mt-6 leading-8 text-gray-700">
              原子棒一代通配主機面向進階與玩味兼具的使用者，將「可調功率、曲線輸出、旁路機械」與「安全辨識」整合在同一手持設備中，讓同一款煙油也能透過不同輸出策略，呈現更立體的味覺層次。
            </p>

            <h3 className="mt-10 text-lg font-semibold text-gray-900">功能多樣</h3>
            <p className="mt-3 leading-8 text-gray-700">
              具備預熱功率設定功能，可配合電腦端操作；使用花式線圈時能快速輸出煙霧，以口吸搭配高電阻霧化芯時，亦可降低後段糊芯機率，前段口感更乾淨。輸出曲線可在主機端完成設定，無需依賴電腦，即可讓同一款煙油獲得不同口感變化，帶來更有層次的味覺享受。另具備記憶功能，切換溫控或模式時不必反覆微調，可快速回到慣用設定。
            </p>

            <h3 className="mt-10 text-lg font-semibold text-gray-900">安全保護</h3>
            <p className="mt-3 leading-8 text-gray-700">
              新舊霧化器識別功能：更換霧化器時需按壓加號或減號確認電阻，主機會依所選電阻匹配相對應的功率與輸出電壓；若選擇錯誤，可能導致霧化芯過熱或燒糊，辨識流程可協助自動匹配輸出，降低誤操作風險。另提供旁路機械輸出模式，適合偏好機械桿手感或 DIY
              霧化器的玩家，無須反覆調功即可進行燒絲與結構微調，並可體驗更即時的煙霧輸出反應。
            </p>

            <h3 className="mt-10 text-lg font-semibold text-gray-900">操作便捷</h3>
            <p className="mt-3 leading-8 text-gray-700">
              預熱功率雖需多嘗試才能找到甜蜜點，但熟悉後可換來更穩定的霧化表現；輸出曲線在主機上即可編修，外出調整更直覺。記憶功能讓常用模式一鍵召回；新舊霧化器辨識請務必依畫面提示正確確認電阻，以匹配安全輸出。旁路模式下可直接感受電池與線圈的即時反應，適合進階玩家逐步建立自己的使用節奏。
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
            <h3 className="text-xl font-bold text-gray-900">三色 · 風格速選</h3>
            <div className="mt-3 h-px w-12 bg-gray-900" />
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
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
              <h3 className="text-xl font-bold text-gray-900">進階玩法建議</h3>
              <div className="mt-3 h-px w-12 bg-gray-900" />
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-gray-700">
                <li className="flex gap-2">
                  <span className="text-gray-900">·</span>
                  花式線圈建議從較緩的預熱與較低起跳功率開始，逐步拉高，觀察棉芯吃油速度再微調曲線轉折點。
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-900">·</span>
                  口吸 MTL 可優先使用較溫和的曲線前段，保留煙油前調香氣，尾段再略收功率避免過熱。
                </li>
                <li className="flex gap-2">
                  <span className="text-gray-900">·</span>
                  旁路模式適合短時間內完成燒絲與乾燒檢查，仍建議在通風環境操作並留意霧化器溫度。
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 md:p-8">
              <h3 className="text-lg font-semibold text-gray-900">包裝清單（參考）</h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                主機本體、Type-C 充電線、說明卡（實際內容以到貨包裝為準）。建議首次使用前完整閱讀安全提示與按鍵組合說明。
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 md:p-8">
              <h3 className="text-lg font-semibold text-gray-900">選購與保養提醒</h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                請使用合格充電器，避免長時間空燒與過度乾燒；定期清潔接點與 510 介面，可維持辨識與輸出穩定。若長時間不使用，請存放於陰涼乾燥處並保持適度電量。
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
            <h3 className="text-xl font-bold text-gray-900">常見問題</h3>
            <div className="mt-3 h-px w-12 bg-gray-900" />
            <dl className="mt-6 space-y-6 text-sm text-gray-700">
              <div>
                <dt className="font-semibold text-gray-900">為什麼更換霧化器後要確認電阻？</dt>
                <dd className="mt-2 leading-7">
                  不同線圈阻值對應的安全功率區間不同，確認後主機才能正確匹配輸出，降低瞬間過熱或燒芯風險。
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900">曲線一定要接電腦才能改嗎？</dt>
                <dd className="mt-2 leading-7">本頁介紹之機型支援在主機端完成基礎曲線調整，實際功能以實機韌體與說明為準。</dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900">旁路模式與一般調壓有什麼差？</dt>
                <dd className="mt-2 leading-7">
                  旁路模式更接近電池直驅體驗，輸出曲線與手感會隨電量變化而改變，適合已熟悉電池與線圈特性的玩家。
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AtomizerDetail;
