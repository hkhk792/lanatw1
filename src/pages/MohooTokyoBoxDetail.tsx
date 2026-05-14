import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronLeft, Plus, Minus } from "lucide-react";
import { requestHomeScrollRestore } from "@/lib/homeScrollRestore";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { SelectVariantDialog } from "@/components/SelectVariantDialog";
import { ProductHeroFeatureTags } from "@/components/ProductHeroFeatureTags";
import productMain from "@/assets/disposable-mohoo-tokyo.webp";
import logoImage from "@/assets/product-14.jpg";
import { ORDER_MODEL_MOHOO_BOX } from "@/lib/orderProductModels";

const MOHOO_PRODUCT_ID = "mohoo-tokyo-box";
const MOHOO_PRICE_TWD = 399;

const flavorGroups: { group: string; options: string[] }[] = [
  {
    group: "經典水果類",
    options: [
      "葡萄",
      "白葡萄",
      "百香果",
      "芭樂",
      "荔枝",
      "芒果",
      "藍莓",
      "蜜桃",
      "蘋果",
      "哈密瓜",
      "西瓜",
    ],
  },
  {
    group: "飲品與甜點類",
    options: [
      "可樂",
      "老冰棍",
      "能井",
      "礦泉水",
      "養樂多",
      "紅牛",
      "綠豆",
      "沙士",
      "雪碧",
      "草莓巧克力",
    ],
  },
  {
    group: "茶類口味",
    options: ["鐵觀音", "寶桃烏龍", "烏龍", "檸檬茉莉", "柳橙綠茶（極冰）"],
  },
  {
    group: "混合口味",
    options: ["西瓜蜜桃芒果", "芒果火龍果", "西柚葡萄柚", "檸檬海鹽"],
  },
  {
    group: "特殊／無涼系列",
    options: [
      "無涼草莓",
      "無涼古巴雪茄",
      "無涼菸草",
      "無涼百香果",
      "無涼芭樂",
      "無涼葡萄",
    ],
  },
  {
    group: "極冰系列",
    options: [
      "極冰檸檬優格冰沙",
      "極冰紅標沙士糖",
      "極冰貴妃葡萄",
      "極冰柳橙綠茶",
      "極冰草莓優格冰沙",
    ],
  },
  { group: "其他", options: ["竟礦力", "薄荷"] },
];

const MohooTokyoBoxDetail = () => {
  const navigate = useNavigate();
  const { addToCart, itemCount, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [variantPromptOpen, setVariantPromptOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const buildCartPayload = () => {
    if (!selectedOption) return null;
    return {
      productId: MOHOO_PRODUCT_ID,
      title: ORDER_MODEL_MOHOO_BOX,
      variant: selectedOption,
      priceTwd: MOHOO_PRICE_TWD,
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

  const getProductTitle = () => "TOKYO MOHOO BOX 東京魔盒煙彈｜12ml · 台灣現貨";
  const getProductDescription = () => "TOKYO MOHOO BOX · 12ml 煙彈 · 多口味台灣現貨";
  const getCategory = () => "TOKYO MOHOO BOX 煙彈";
  const getTags = () => "MOHOO，東京魔盒，12ml，多口味可選";
  const getBadgeText = () =>
    selectedOption ? `台灣現貨｜${selectedOption}` : "12ml 大容量｜請先選擇口味";

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
                alt="TOKYO MOHOO BOX 東京魔盒"
                className="h-[500px] w-full object-contain"
              />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="rounded-md bg-red-600 px-6 py-2 font-bold text-white shadow-lg">{getBadgeText()}</div>
              </div>
            </div>

            <ProductHeroFeatureTags tags={["12ml 超大容量", "鋼網棉芯", "磁吸換彈", "約 10000 口（套裝）"]} />

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
              <span className="tracking-tight text-gray-700">MOHOO 東京魔盒</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{getProductTitle()}</h1>

            <div className="text-4xl font-bold text-gray-900">{`NT$${MOHOO_PRICE_TWD}.00`}</div>

            <div className="max-h-[min(60vh,520px)] space-y-4 overflow-y-auto pr-1">
              <label className="text-lg font-medium text-gray-800">口味與規格（請選一種口味）：</label>
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
              <p>大容量 12ml 煙油、鋼網棉芯與磁吸設計，口感穩定、更換直覺；實際使用天數隨抽吸習慣而異。</p>
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
                切換口味時數量會重設為 1。口味、庫存以實際到貨與客服確認為準；卡片規格 12ml／約 10000
                口以包裝與實品為主。
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
              TOKYO MOHOO BOX 東京魔盒強調創新與大容量體驗，單顆 12ml
              煙油設計在一般使用情境下，預估可持續約
              7–10
              天（實際天數隨抽吸習慣、功率與環境而異）。鋼網棉芯有助於穩定導油與口感，霧氣層次豐富；磁吸讓主機與煙彈接合更順手，透明視窗便於觀察餘量，多道防漏結構則減少外溢困擾。煙油選用高品質丙二醇（PG）與植物甘油（VG），搭配食品級香精，並採有機尼古丁配方，旨在兼顧細膩度與使用感受。整體風格輕巧、偏商務質感，適合重視續航與便利的族群。
            </p>

            <h3 className="mt-8 text-lg font-semibold text-gray-900">大容量與硬體</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-8 text-gray-700">
              <li>
                <span className="font-semibold text-gray-900">大容量設計：</span>
                12 毫升煙油，常規使用下單顆預計可達約 7–10 天（參攷值）。
              </li>
              <li>
                <span className="font-semibold text-gray-900">鋼網棉芯技術：</span>
                創新鋼網棉芯幫助口感穩定、順滑，使用中途較不易出現明顯焦味（仍依實際使用而異）。
              </li>
              <li>
                <span className="font-semibold text-gray-900">磁吸式設計：</span>
                煙彈與主機連接緊密，更換更省力。
              </li>
              <li>
                <span className="font-semibold text-gray-900">透明視窗：</span>
                可直觀判讀煙油剩餘量。
              </li>
              <li>
                <span className="font-semibold text-gray-900">防漏科技：</span>
                多道結構降低外漏風險。
              </li>
            </ul>

            <h3 className="mt-8 text-lg font-semibold text-gray-900">煙油品質與體驗</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-8 text-gray-700">
              <li>
                <span className="font-semibold text-gray-900">煙油配方：</span>
                高品質 PG／VG 基底，食品級香精；採有機尼古丁，以追求較平衡的口感表現（仍以包裝與法規標示為準）。
              </li>
              <li>
                <span className="font-semibold text-gray-900">使用體驗：</span>
                霧氣量感足夠、香氣鮮明，定位為輕巧商務風，適合日常與外出。
              </li>
            </ul>
            <p className="mt-6 border-l-4 border-blue-200 pl-4 leading-8 text-gray-600">
              總結：東京魔盒以 12ml 的長效續航力與穩定的棉芯技術，搭配磁吸、視窗與防漏，為追求高品質與便利的用戶提供一體化的霧化體驗。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <h3 className="text-xl font-bold text-gray-900">主要特點</h3>
              <div className="mt-3 h-px w-12 bg-gray-900" />
              <ul className="mt-5 space-y-3 text-gray-700">
                {[
                  { k: "容量與續航", v: "12ml 大容量，單顆預估 7–10 天（參攷）" },
                  { k: "霧化結構", v: "鋼網棉芯，口感穩定、層次清晰" },
                  { k: "連接方式", v: "磁吸式，換彈更順手" },
                  { k: "觀測與防護", v: "透明油量視窗＋防漏設計" },
                  { k: "口味陣容", v: "水果、茶飲、極冰、無涼等多系列可選" },
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
                  ["商品名稱", "TOKYO MOHOO BOX 東京魔盒煙彈（多種口味台灣現貨）"],
                  ["系列", "MOHOO BOX／東京魔盒"],
                  ["煙油容量", "12ml／顆（以包裝為準）"],
                  ["參攷續航", "單顆約 7–10 天、套裝約 10000 口（實測隨使用而異）"],
                  ["參攷價格", "NT$ 399"],
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
              本產品屬含尼古丁之電子煙相關產品，請遵守法規與年齡限制，並以包裝、警語與產地標示為準。口味、庫存、批次與實測口數可能因到貨不同而有差異；訂貨、留貨與配送可透過
              LINE（abs791012）聯繫客服確認。
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MohooTokyoBoxDetail;
