import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronLeft, Plus, Minus } from "lucide-react";
import { requestHomeScrollRestore } from "@/lib/homeScrollRestore";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { SelectVariantDialog } from "@/components/SelectVariantDialog";
import { ProductHeroFeatureTags } from "@/components/ProductHeroFeatureTags";
import { BrandSp2s } from "@/components/BrandSp2s";
import productMain from "@/assets/showcase-vape-gear.webp";
import logoImage from "@/assets/product-14.jpg";
import { ORDER_MODEL_SP2S_SILICONE_SLEEVE } from "@/lib/orderProductModels";

const SP2S_SLEEVE_PRODUCT_ID = "sp2s-silicone-sleeve";
const SP2S_SLEEVE_PRICE_TWD = 120;

const specGroups: { group: string; options: string[] }[] = [
  {
    group: "純色／花紋保護套",
    options: ["黑色", "白色", "粉紅", "深藍", "水藍", "紅色", "黃色", "乳牛紋", "彩色"],
  },
  {
    group: "掛繩系列",
    options: ["海王星掛繩 · 藍", "海王星掛繩 · 紅", "海王星掛繩 · 紫", "海王星掛繩 · 粉", "一般項鍊掛繩"],
  },
];

const Sp2sSiliconeSleeveDetail = () => {
  const navigate = useNavigate();
  const { addToCart, itemCount, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [variantPromptOpen, setVariantPromptOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const buildCartPayload = () => {
    if (!selectedOption) return null;
    return {
      productId: SP2S_SLEEVE_PRODUCT_ID,
      title: ORDER_MODEL_SP2S_SILICONE_SLEEVE,
      variant: selectedOption,
      priceTwd: SP2S_SLEEVE_PRICE_TWD,
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
    "電子煙配件 思博瑞 SP2S 主機矽膠保護套｜多色／掛繩可選";
  const getProductDescription = () => "專用於 SP2S 一代主機 · 矽膠套與掛繩系列";
  const getCategory = () => "SP2S 主機矽膠保護套／掛繩";
  const getTags = () => "SP2S，保護套，掛繩，配件，多規格可選";
  const getBadgeText = () => (selectedOption ? `多色可選｜${selectedOption}` : "先選顏色／掛繩款");

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
        message="請先從下方選擇「顏色／掛繩」規格，再加入購物車或立即購買。"
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
                alt="思博瑞 SP2S 矽膠保護套與掛繩"
                className="h-[500px] w-full object-contain"
              />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="rounded-md bg-red-600 px-6 py-2 font-bold text-white shadow-lg">{getBadgeText()}</div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-1 text-sm text-gray-800">
              <span>適用</span>
              <BrandSp2s className="font-serif text-base text-foreground" />
              <span>思博瑞一代主機專用</span>
            </div>

            <ProductHeroFeatureTags
              tags={["防震抗摔", "矽膠包覆", "防滑握感", "可搭掛繩", "NT$ 120 親民價"]}
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
              <a href="/#pods-liquid-gear" className="hover:text-gray-700">
                全品類一覽
              </a>
              <span>/</span>
              <span className="tracking-tight text-gray-700">SP2S 保護套</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              電子煙配件 思博瑞 <BrandSp2s className="text-inherit" /> 主機矽膠保護套（多色可選）
            </h1>

            <div className="text-4xl font-bold text-gray-900">{`NT$${SP2S_SLEEVE_PRICE_TWD}.00`}</div>

            <p className="text-sm text-gray-700 leading-relaxed">
              專為 <span className="font-medium">SP2S 一代主機</span>{" "}
              開模；可緩衝摔落、防日常刮損、提升單手掌握穩定度。購買前可透過
              <span className="font-medium"> LINE abs791012</span>{" "}
              確認庫存色與實體圖。價格具參攷性，以實際結帳與活動為準。
            </p>

            <div className="max-h-[min(50vh,460px)] space-y-4 overflow-y-auto pr-1">
              <label className="text-lg font-medium text-gray-800">規格（顏色／配件，請擇一）：</label>
              {specGroups.map(({ group, options }) => (
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
            </div>

            <div className="mt-4 space-y-2 border-t border-gray-200 pt-6 text-sm text-gray-600">
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
            <h2 className="text-2xl font-bold text-gray-900">產品核心優勢</h2>
            <div className="mt-4 h-px w-14 bg-gray-900" />
            <ul className="mt-6 list-disc space-y-2 pl-5 leading-8 text-gray-700">
              <li>全方位防護：高彈矽膠能吸收邊角撞擊，降低日常摔落造成外殼、漆面受損的機率。</li>
              <li>輕薄取向：不刻意堆疊厚度，盡量維持主機可攜性，表面開孔盡量對位按鍵、燈號與充電孔。</li>
              <li>提升握感：觸感柔軟具一定止滑，長時間握持較不易因手汗、油脂而滑脫。</li>
              <li>便攜掛帶：部分掛繩、項鍊款可讓主機以頸掛、掛飾方式帶出門，減少隨手放丟的機會（依款式）。</li>
            </ul>
            <h3 className="mt-8 text-lg font-semibold text-gray-900">使用與保養</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">
              <li>安裝前請再三確認主機本體為思博瑞 SP2S 一代，尺寸若不符請勿硬套，以免變形或壓到按鍵。</li>
              <li>建議以清水或中性清潔劑、軟毛刷手洗；擦乾陰乾後再裝回，避免化學殘留、酒精長泡造成退色。</li>
              <li>避免陽光與高溫長時曝曬、避免置於內飾密閉高溫車內，以減少矽膠老化、硬化或變形情形。</li>
            </ul>
            <h3 className="mt-8 text-lg font-semibold text-gray-900">購買建議</h3>
            <p className="mt-3 leading-8 text-gray-700">
              建議在結帳前先以 LINE
              向客服比對到貨顏色、實照與是否含掛鍊。若僅要保護主機、可優先考慮黑、白、深藍、水藍等實用色；想凸顯個人風格可選乳牛、彩色或掛飾。單參攷價
              NT$ 120
              具日常囤貨的 CP
              取向，仍以實體、活動與結帳金額為準。
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm md:p-10">
            <h3 className="text-xl font-bold text-gray-900">法規與產品聲明</h3>
            <div className="mt-3 h-px w-12 bg-gray-900" />
            <p className="mt-5 leading-8 text-gray-700">
              本頁以不含尼古丁的保護套、掛繩等週邊販售為敘述主體；若圖中同時出現主機、煙彈，屬風格示意。未成年人請勿接觸電子煙及相關內容；成年人亦須符合當地法規。客服、大量採購請以
              LINE
              <span className="font-medium"> abs791012</span> 聯絡。
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Sp2sSiliconeSleeveDetail;
