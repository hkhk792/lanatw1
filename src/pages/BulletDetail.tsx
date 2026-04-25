import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronLeft, Plus, Minus } from "lucide-react";
import { requestHomeScrollRestore } from "@/lib/homeScrollRestore";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { SelectVariantDialog } from "@/components/SelectVariantDialog";
import { ProductHeroFeatureTags } from "@/components/ProductHeroFeatureTags";
import productMain from "@/assets/product-3.webp";
import logoImage from "@/assets/product-14.jpg";

const BULLET_PRODUCT_ID = "bullet";
const BULLET_PRICE_TWD = 450;

type ColorOption = { name: string; mood: string };

const COLOR_OPTIONS: ColorOption[] = [
  { name: "藍境秋杏", mood: "融合了藍色與杏色的柔和色調，營造出寧靜而溫馨的氛圍。" },
  { name: "丁香淡紫", mood: "淡雅的紫色調，散發出一種溫柔而夢幻的氣息。" },
  { name: "新年金", mood: "金色的設計，象徵著財富與慶祝，適合作為節日禮物或特別場合使用。" },
  { name: "海棠粉", mood: "柔和的粉色，如同海棠花般甜美而優雅。" },
  { name: "黑武士", mood: "深邃的黑色調，展現出一種神秘而強大的氣質。" },
  { name: "磨砂黑", mood: "低調的磨砂黑色外觀，簡約而不失高級感。" },
  { name: "魅海藍", mood: "深邃的藍色調，彷彿深海般迷人而神秘。" },
  { name: "蝶羽藍綠", mood: "獨特的藍綠色調，猶如蝴蝶翅膀上的光澤，既清新又時尚。" },
  { name: "碧波粉綠", mood: "清新的綠色，如同清澈的水面上泛起的微波，充滿生機。" },
  { name: "無極白", mood: "純淨的白色，展現出一種簡潔而優雅的設計感。" },
  { name: "漸變藍灰", mood: "從藍色漸變到灰色的色彩變化，呈現出一種獨特的視覺效果。" },
  { name: "炫影紫紅", mood: "深邃的紫色與紅色交織，散發出一種奢華而迷人的氣息。" },
  { name: "淡雅銀白", mood: "銀白色的組合，展現了一種精緻而典雅的風格。" },
  { name: "星悅湖藍", mood: "深藍色調，如同寧靜的湖泊在星空下的映照，充滿寧靜與神秘。" },
  { name: "啞光紅", mood: "啞光質感的紅色設計，展現出一種強烈的個性與活力。" },
  { name: "媚海藍", mood: "深邃的藍色調，展現出一種深海般的神秘與魅力。" },
];

const SPECS: Array<[string, string]> = [
  ["品牌型號", "思博瑞 SP2S 主機"],
  ["顏色", "16 色可選"],
  ["充電時間", "約 45 分鐘"],
  ["電池容量", "3.7V / 400mAh"],
  ["適用電阻", "0.9Ω - 1.0Ω"],
  ["產品尺寸", "L116 × W20 × H12 mm"],
  ["充電介面", "Type-C 快充"],
  ["適配煙彈", "通配所有一代煙彈"],
];

const KEY_FEATURES: Array<{ k: string; v: string }> = [
  { k: "高效能芯片", v: "vape 主機內置最新高效能芯片，性能穩定輸出" },
  { k: "智能強化體驗", v: "口感純正，享受最佳霧化體驗" },
  { k: "廣泛煙彈兼容", v: "兼容多種品牌煙彈，滿足多元化需求" },
  { k: "時尚便攜設計", v: "主機外觀時尚，輕薄好攜帶" },
  { k: "易用長續航", v: "主機長效電池，一鍵操作簡單便捷" },
  { k: "電芯保護", v: "單桿主機 24V 充電過壓保護" },
  { k: "包裝清單", v: "1 × SP2S 煙桿 / 單主機" },
  { k: "健康提示", v: "20 分鐘吸食超 15 口有震動提示" },
];

const PRODUCT_HIGHLIGHTS: Array<{ k: string; v: string }> = [
  { k: "多種顏色選擇", v: "經典黑色、清新紫色、溫柔粉色等多款配色，滿足個性化需求。" },
  { k: "LED 電量顯示", v: "配備 LED 電量顯示，方便用戶隨時掌握電量，避免中斷使用。" },
  { k: "通用一代煙彈", v: "兼容市面上大部分一代煙彈，提供多樣化選擇，滿足不同口味需求。" },
  { k: "液晶螢幕顯示", v: "搭載液晶螢幕，清晰顯示電池電量、功率設置及操作模式。" },
  { k: "快速拔插調整瓦數", v: "快速拔插設計，輕輕拔插兩下即可調節瓦數。" },
  { k: "多重安全保護", v: "過熱保護、短路保護、過充保護等多重安全措施。" },
];

const BulletDetail = () => {
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
    selectedOption
      ? `SP2S ${selectedOption} 一代通用主機｜sp2s 電子煙主機`
      : "SP2S 一代通用主機｜sp2s 電子煙主機";
  const getProductDescription = () =>
    selectedOption
      ? `SP2S ${selectedOption} 一代通用主機 sp2s 電子煙主機`
      : "SP2S 一代通用主機 sp2s 電子煙主機";
  const getCategory = () => "SP2S 煙桿主機";
  const getTags = () =>
    selectedOption ? `SP2S，SP2S ${selectedOption} 一代通用主機` : "SP2S，一代通用主機";
  const getBadgeText = () =>
    selectedOption ? `一代通用主機｜${selectedOption}` : "一代通用主機｜請先選擇顏色";

  const selectedMood = COLOR_OPTIONS.find((o) => o.name === selectedOption)?.mood;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const buildCartPayload = () => {
    if (!selectedOption) return null;
    return {
      productId: BULLET_PRODUCT_ID,
      title: getProductTitle().replace("｜", " ").trim(),
      variant: selectedOption,
      priceTwd: BULLET_PRICE_TWD,
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
        className={`sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm transition-transform duration-300 ${
          isScrolled ? "-translate-y-full" : ""
        }`}
      >
        <div className="container mx-auto px-4 py-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="SP2S Logo" className="w-20 h-20 rounded-lg object-contain" />
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              我的帳號
            </a>
            <button
              type="button"
              onClick={openCart}
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              結帳
            </button>
            <button
              type="button"
              onClick={openCart}
              className="text-gray-700 hover:text-gray-900 font-medium relative"
            >
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
              <img src={productMain} alt="SP2S 一代通用主機" className="w-full h-[500px] object-contain" />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="bg-red-600 text-white px-6 py-2 font-bold rounded-md shadow-lg">{getBadgeText()}</div>
              </div>
            </div>

            <ProductHeroFeatureTags tags={["一代通用", "16 色可選", "Type-C 快充", "合金機身"]} />

            <div className="mt-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">{getProductDescription()}</h2>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <a href="/" className="hover:text-gray-700">
                首頁
              </a>
              <span>/</span>
              <a href="#" className="hover:text-gray-700">
                SP2S 煙桿主機
              </a>
              <span>/</span>
              <span className="text-gray-700 tracking-tight">一代通用主機</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{getProductTitle()}</h1>

            <div className="text-4xl font-bold text-gray-900">{`NT$${BULLET_PRICE_TWD}.00`}</div>

            <div className="space-y-4">
              <label className="text-lg font-medium text-gray-800">顏色款式：</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((option) => (
                  <button
                    key={option.name}
                    type="button"
                    onClick={() => handleOptionChange(option.name)}
                    className={`px-4 py-2 rounded-full border transition-colors ${
                      selectedOption === option.name
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    【{option.name}】
                  </button>
                ))}
              </div>
              {selectedMood ? (
                <p className="text-sm text-gray-500">{selectedMood}</p>
              ) : null}
            </div>

            <div className="space-y-2 text-gray-700">
              <p>購買前請添加客服 LINE: abs791012</p>
              <p>品牌：SPRINGTIME 思博瑞</p>
              <p>電池容量：3.7V / 400mAh</p>
              <p>Type-C 快充 · 約 45 分鐘充滿</p>
              <p>通配所有 SP2S 一代煙彈</p>
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
                切換款式時數量會重設為 1。可先加入一種款式，再選其他款式分別加入，購物車內可同時保留多種款式。
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
              思博瑞 SP2S 電子煙主機 換彈煙桿是一款集高性能與優雅設計於一身的頂級電子煙設備，專為追求卓越體驗的電子菸愛好者打造。它不僅具備強大的功能和卓越的性能，還擁有時尚的外觀和人性化的設計，SP2S 思博瑞旨在為用戶提供最佳的 Vape 體驗。
            </p>
            <p className="mt-4 leading-8 text-gray-700">
              電子煙線上購買，方便快捷的選擇！選擇知名電子菸品牌，享受高品質的產品與優秀的服務，讓您的抽菸體驗更加愉悅與舒適。
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 md:p-10 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900">16 色 · 每一色都是心境</h3>
            <div className="mt-3 h-px w-12 bg-gray-900" />
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {COLOR_OPTIONS.map((c) => (
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
                  <div className="font-semibold text-gray-900">{c.name}</div>
                  <p className="mt-1 text-sm leading-6 text-gray-600">{c.mood}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">產品參數</h3>
              <div className="mt-3 h-px w-12 bg-gray-900" />
              <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700">
                {SPECS.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between border-b border-dashed border-gray-200 py-1.5"
                  >
                    <dt className="text-gray-500">{k}</dt>
                    <dd className="font-medium text-gray-900">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-xs text-gray-400">
                一次性電子菸線上購買旨在為用戶提供最佳的霧化器電子煙體驗。
              </p>
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
                <div
                  key={h.k}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-5"
                >
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

export default BulletDetail;
