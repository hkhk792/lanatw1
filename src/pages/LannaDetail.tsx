import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import productMain from "@/assets/lana-leather-main.png";
import productThumb1 from "@/assets/product-4.png";
import productThumb2 from "@/assets/product-8.png";
import logoImage from "@/assets/product-14.jpg";

const LANNA_PRODUCT_ID = "lanna";
const LANNA_PRICE_TWD = 500;

const variantOptions = [
  "烈焰黑",
  "幻彩象",
  "香檳金",
  "軍綠色",
  "炫彩粉",
  "炫正紅",
  "粉白色",
  "粉藍色",
  "粉灰色",
  "粉杏色",
  "粉綠色",
  "台灣橙",
  "玫瑰紫",
];

const LannaDetail = () => {
  const { addToCart, itemCount, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState("炫正紅");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mainImage, setMainImage] = useState(productMain);

  const buildCartPayload = () => ({
    productId: LANNA_PRODUCT_ID,
    title: getProductTitle().replace("｜", " ").trim(),
    variant: selectedOption,
    priceTwd: LANNA_PRICE_TWD,
    quantity,
    imageUrl: mainImage,
  });

  const handleAddToCart = () => {
    addToCart(buildCartPayload());
    toast.success("已加入購物車", { description: `【${selectedOption}】x${quantity}` });
  };

  const handleBuyNow = () => {
    addToCart(buildCartPayload());
    openCart();
  };

  const handleOptionChange = (option: string) => {
    if (option !== selectedOption) {
      setQuantity(1);
    }
    setSelectedOption(option);
  };

  const getProductTitle = () => `SP2S Legend S ${selectedOption} 一代升級煙桿｜多種配色可選`;
  const getProductDescription = () =>
    `SP2S Legend S ${selectedOption} 一代升級煙桿 多種配色可選`;
  const getCategory = () => "SP2S Legend S 主機";
  const getTags = () => `SP2S Legend S，SP2S Legend S ${selectedOption}`;
  const getBadgeText = () => `升級煙桿｜${selectedOption}`;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
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
              onClick={() => (window.location.href = "/")}
              className="mb-4 flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium">返回首頁</span>
            </button>

            <div className="relative bg-gray-50 rounded-lg overflow-hidden">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-3">
                {["升級煙桿", "雙檔輸出", "Type-C 快充", "合金機身"].map((t) => (
                  <div key={t} className="bg-white shadow-md rounded-lg px-4 py-3 flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-700">✓</div>
                    <span className="font-medium text-sm">{t}</span>
                  </div>
                ))}
              </div>

              <img src={mainImage} alt="SP2S Legend S" className="w-full h-[500px] object-contain" />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="bg-red-600 text-white px-6 py-2 font-bold rounded-md shadow-lg">{getBadgeText()}</div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">{getProductDescription()}</h2>
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <img
                src={productThumb1}
                alt="thumbnail 1"
                className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 hover:border-gray-400 cursor-pointer transition-colors"
                onClick={() => setMainImage(productThumb1)}
              />
              <img
                src={productThumb2}
                alt="thumbnail 2"
                className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 hover:border-gray-400 cursor-pointer transition-colors"
                onClick={() => setMainImage(productThumb2)}
              />
              <img
                src={productMain}
                alt="thumbnail main"
                className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 hover:border-gray-400 cursor-pointer transition-colors"
                onClick={() => setMainImage(productMain)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <a href="/" className="hover:text-gray-700">
                首頁
              </a>
              <span>/</span>
              <a href="#" className="hover:text-gray-700">
                SP2S 傳奇系列
              </a>
              <span>/</span>
              <span className="text-gray-700 tracking-tight">Legend S 煙桿</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{getProductTitle()}</h1>

            <div className="text-4xl font-bold text-gray-900">NT${LANNA_PRICE_TWD}.00</div>

            <div className="space-y-4">
              <label className="text-lg font-medium text-gray-800">顏色款式：</label>
              <div className="flex flex-wrap gap-3">
                {variantOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleOptionChange(option)}
                    className={`px-4 py-2 rounded-full border transition-colors ${
                      selectedOption === option
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    【{option}】
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-gray-700">
              <p>購買前請添加客服 LINE: abs791012</p>
              <p>雙檔位輸出 · 9W / 18W</p>
              <p>Type-C 快充 · 約 30 分鐘充滿</p>
              <p>鋁合金一體機身 · 髮絲紋處理</p>
              <p>通配 SP2S Legend 系列煙彈</p>
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
              LANA 皮革主機將高品質與先進技術完美結合，擁有經典而優雅的皮革外觀，彰顯您的獨特品味與氣質。
            </p>
            <h3 className="mt-8 text-lg font-semibold text-gray-900">設計理念</h3>
            <p className="mt-3 leading-8 text-gray-700">
              LANA 皮革主機的設計靈感源自奢華生活方式，將高科技產品與高級皮革的溫暖質感完美融合。選用頂級皮革，不僅柔軟舒適，還具有耐用性和獨特紋理，提升產品質感和品味。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">主要特點</h3>
              <div className="mt-3 h-px w-12 bg-gray-900" />
              <ul className="mt-5 space-y-3 text-gray-700">
                {[
                  { k: "頂級真皮包裹", v: "手工打磨皮革，溫潤觸感、耐磨耐用" },
                  { k: "雙檔位輸出", v: "9W / 18W 兩檔可切，滿足不同口感需求" },
                  { k: "Type-C 快充", v: "約 30 分鐘充滿，續航持久" },
                  { k: "鋁合金骨架", v: "一體成型髮絲紋機身，輕盈堅固" },
                  { k: "多重安全保護", v: "過熱 / 短路 / 過充三重保護機制" },
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

            <div className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">產品參數</h3>
              <div className="mt-3 h-px w-12 bg-gray-900" />
              <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700">
                {[
                  ["品牌型號", "SP2S Legend S"],
                  ["顏色款式", `${variantOptions.length} 色可選`],
                  ["輸出功率", "9W / 18W 雙檔"],
                  ["充電時間", "約 30 分鐘"],
                  ["電池容量", "3.7V / 400mAh"],
                  ["充電介面", "Type-C 快充"],
                  ["機身材質", "鋁合金 + 皮革"],
                  ["適配煙彈", "通配 SP2S Legend 系列"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between border-b border-dashed border-gray-200 py-1.5">
                    <dt className="text-gray-500">{k}</dt>
                    <dd className="font-medium text-gray-900">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-blue-50 to-white p-6 md:p-10 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900">市場影響力</h3>
            <div className="mt-3 h-px w-12 bg-gray-900" />
            <p className="mt-5 leading-8 text-gray-700">
              自上市以來，LANA 皮革主機以其獨特設計和優質性能迅速獲得市場認可。不僅成為電子煙愛好者的熱門選擇，更成為時尚潮流的代表，彰顯使用者的獨特品味和個性。
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LannaDetail;
