import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronLeft, Plus, Minus } from "lucide-react";
import { requestHomeScrollRestore } from "@/lib/homeScrollRestore";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { SelectVariantDialog } from "@/components/SelectVariantDialog";
import { ProductHeroFeatureTags } from "@/components/ProductHeroFeatureTags";
import productMain from "@/assets/product-12.webp";
import productThumb1 from "@/assets/product-13.webp";
import productThumb2 from "@/assets/product-11.webp";
import logoImage from "@/assets/product-14.jpg";
import doraemonMain from "@/assets/wps1.webp";
import doraemonThumb1 from "@/assets/wps3.webp";
import doraemonThumb2 from "@/assets/wps2.webp";
import luffyMain from "@/assets/16.webp";
import luffyThumb1 from "@/assets/18.webp";
import luffyThumb2 from "@/assets/17.webp";
import kakashiMain from "@/assets/kakashi-main.webp";
import kakashiThumb1 from "@/assets/kakashi-thumb-1.webp";
import kakashiThumb2 from "@/assets/kakashi-thumb-2.webp";
import ktMain from "@/assets/kt-main.webp";
import ktThumb1 from "@/assets/kt-thumb-1.webp";
import ktThumb2 from "@/assets/kt-thumb-2.webp";
import kuromiMain from "@/assets/kuromi-main.webp";
import kuromiThumb1 from "@/assets/kuromi-thumb-1.webp";
import kuromiThumb2 from "@/assets/kuromi-thumb-2.webp";
import zoroGreenMain from "@/assets/zoro-green-main.webp";
import zoroGreenThumb1 from "@/assets/zoro-green-thumb-1.webp";
import zoroGreenThumb2 from "@/assets/zoro-green-thumb-2.webp";
import { usePreloadImages } from "@/hooks/usePreloadImages";
import { ORDER_MODEL_NINGA_CARTOON } from "@/lib/orderProductModels";

const CARTOON_PRODUCT_ID = "cartoon";
const CARTOON_PRICE_TWD = 550;

/** 所有卡通款式主圖 + 縮圖（切換時一次預載，避免手機 / 微信內首次解碼卡頓） */
const CARTOON_GALLERY_URLS: readonly string[] = [
  productMain,
  productThumb1,
  productThumb2,
  doraemonMain,
  doraemonThumb1,
  doraemonThumb2,
  luffyMain,
  luffyThumb1,
  luffyThumb2,
  kakashiMain,
  kakashiThumb1,
  kakashiThumb2,
  ktMain,
  ktThumb1,
  ktThumb2,
  kuromiMain,
  kuromiThumb1,
  kuromiThumb2,
  zoroGreenMain,
  zoroGreenThumb1,
  zoroGreenThumb2,
];

const ProductDetail = () => {
  const navigate = useNavigate();
  const { addToCart, itemCount, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [variantPromptOpen, setVariantPromptOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mainImage, setMainImage] = useState(productMain);
  const [thumb1, setThumb1] = useState(productThumb1);
  const [thumb2, setThumb2] = useState(productThumb2);
  const [mainImageLoading, setMainImageLoading] = useState(false);
  const mainImgRef = useRef<HTMLImageElement>(null);
  const mainImageSyncRef = useRef(mainImage);
  mainImageSyncRef.current = mainImage;

  usePreloadImages(CARTOON_GALLERY_URLS, "product-detail-cartoon", {
    concurrency: 4,
    /** 盡快開始預載（含不支援 idle 時的 timeout 後備） */
    idleTimeoutMs: 1,
  });

  /** 快取命中時部分瀏覽器不重複觸發 onLoad，用 complete 同步關閉遮罩 */
  useEffect(() => {
    const el = mainImgRef.current;
    if (el?.complete && el.naturalWidth > 0) {
      setMainImageLoading(false);
    }
  }, [mainImage]);

  const handleOptionChange = (option: string) => {
    if (option === selectedOption) return;
    setQuantity(1);
    setSelectedOption(option);
    setMainImageLoading(true);
    if (option === "多拉 A 夢") {
      setMainImage(doraemonMain);
      setThumb1(doraemonThumb1);
      setThumb2(doraemonThumb2);
    } else if (option === "火影忍者卡卡西") {
      setMainImage(kakashiMain);
      setThumb1(kakashiThumb1);
      setThumb2(kakashiThumb2);
    } else if (option === "KT 貓") {
      setMainImage(ktMain);
      setThumb1(ktThumb1);
      setThumb2(ktThumb2);
    } else if (option === "庫洛米") {
      setMainImage(kuromiMain);
      setThumb1(kuromiThumb1);
      setThumb2(kuromiThumb2);
    } else if (option === "航海王魯夫 - 藍") {
      setMainImage(luffyMain);
      setThumb1(luffyThumb1);
      setThumb2(luffyThumb2);
    } else if (option === "航海王索隆 - 綠") {
      setMainImage(zoroGreenMain);
      setThumb1(zoroGreenThumb1);
      setThumb2(zoroGreenThumb2);
    } else {
      setMainImage(productMain);
      setThumb1(productThumb1);
      setThumb2(productThumb2);
    }
  };

  const selectMainFromThumb = useCallback((src: string) => {
    if (mainImageSyncRef.current === src) return;
    setMainImageLoading(true);
    setMainImage(src);
  }, []);

  const getProductTitle = () => "卡通限量版一代通配主機｜多種配色可選";

  const getProductDescription = () => "卡通限量版一代通配主機 多種配色可選";

  const getCategory = () => {
    if (!selectedOption) return "卡通限量版一代通配主機";
    if (selectedOption === "多拉 A 夢") {
      return `卡通限量版一代通配主機｜多拉 A 夢`;
    } else if (selectedOption === "航海王魯夫 - 藍") {
      return "卡通限量版一代通配主機｜航海王魯夫";
    } else if (selectedOption === "航海王索隆 - 綠") {
      return "卡通限量版一代通配主機｜航海王索隆";
    }
    return `卡通限量版一代通配主機｜${selectedOption}`;
  };

  const getTags = () => "卡通限量版，一代通配主機，多款式可選";

  const getBadgeText = () => {
    if (!selectedOption) return "通配主機｜請先選擇款式";
    if (selectedOption === "多拉 A 夢") {
      return "通配主機｜多拉 A 夢";
    } else if (selectedOption === "航海王魯夫 - 藍") {
      return "通配主機｜航海王魯夫";
    } else if (selectedOption === "航海王索隆 - 綠") {
      return "通配主機｜航海王索隆";
    }
    return `通配主機｜${selectedOption}`;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const flavorOptions = [
    "多拉 A 夢",
    "航海王魯夫 - 藍",
    "火影忍者卡卡西",
    "航海王索隆 - 綠",
    "庫洛米",
    "KT 貓",
    "蠟筆小新",
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SelectVariantDialog
        open={variantPromptOpen}
        onOpenChange={setVariantPromptOpen}
        message="請先從上方選擇一種卡通款式（主題），再加入購物車或立即購買。"
      />
      <nav
        className={`sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm transition-transform duration-300 ${
          isScrolled ? "-translate-y-full" : ""
        }`}
      >
        <div className="container mx-auto px-4 py-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="Sp27 Logo" className="w-20 h-20 rounded-lg object-contain" />
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
              {mainImageLoading ? (
                <div
                  className="absolute inset-0 z-[5] flex items-center justify-center bg-gray-50/85 backdrop-blur-[2px]"
                  aria-busy="true"
                  aria-live="polite"
                >
                  <span className="text-sm font-medium text-gray-600">圖片載入中…</span>
                </div>
              ) : null}
              <img
                ref={mainImgRef}
                src={mainImage}
                alt="卡通限量版一代通配主機 蠟筆小新"
                width={800}
                height={800}
                decoding="async"
                fetchPriority="high"
                className="h-[500px] w-full object-contain"
                onLoad={() => setMainImageLoading(false)}
                onError={() => setMainImageLoading(false)}
              />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="bg-red-600 text-white px-6 py-2 font-bold rounded-md shadow-lg">{getBadgeText()}</div>
              </div>
            </div>

            <ProductHeroFeatureTags tags={["一代通用", "多款主題", "精緻小巧", "易於操作"]} />

            <div className="mt-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">{getProductDescription()}</h2>
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <img
                src={thumb1}
                alt="thumbnail 1"
                width={96}
                height={96}
                decoding="async"
                loading="eager"
                className="h-24 w-24 cursor-pointer rounded-lg border-2 border-gray-200 object-cover transition-colors hover:border-gray-400"
                onClick={() => selectMainFromThumb(thumb1)}
              />
              <img
                src={thumb2}
                alt="thumbnail 2"
                width={96}
                height={96}
                decoding="async"
                loading="eager"
                className="h-24 w-24 cursor-pointer rounded-lg border-2 border-gray-200 object-cover transition-colors hover:border-gray-400"
                onClick={() => selectMainFromThumb(thumb2)}
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
                卡通系列
              </a>
              <span>/</span>
              <span className="text-gray-700 tracking-tight">卡通限量版一代通配主機</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{getProductTitle()}</h1>

            <div className="text-4xl font-bold text-gray-900">NT$550.00</div>

            <div className="space-y-4">
              <label className="text-lg font-medium text-gray-800">顏色口味：</label>
              <div className="flex flex-wrap gap-3">
                {flavorOptions.map((option) => (
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
              <p>多款卡通角色可選</p>
              <p>一代通配主機設計</p>
              <p>多種配色可選</p>
              <p>卡通主題收藏首選</p>
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
                  onClick={() => {
                    if (!selectedOption) {
                      setVariantPromptOpen(true);
                      return;
                    }
                    addToCart({
                      productId: CARTOON_PRODUCT_ID,
                      title: ORDER_MODEL_NINGA_CARTOON,
                      variant: selectedOption,
                      priceTwd: CARTOON_PRICE_TWD,
                      quantity,
                      imageUrl: mainImage,
                    });
                    toast.success("已加入購物車", { description: `【${selectedOption}】x${quantity}` });
                  }}
                  className="flex-1 min-w-[10rem] border-2 border-orange-500 text-orange-600 font-medium py-3 px-6 rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  加入購物車
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedOption) {
                      setVariantPromptOpen(true);
                      return;
                    }
                    addToCart({
                      productId: CARTOON_PRODUCT_ID,
                      title: ORDER_MODEL_NINGA_CARTOON,
                      variant: selectedOption,
                      priceTwd: CARTOON_PRICE_TWD,
                      quantity,
                      imageUrl: mainImage,
                    });
                    openCart();
                  }}
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
      </main>

    </div>
  );
};

export default ProductDetail;
