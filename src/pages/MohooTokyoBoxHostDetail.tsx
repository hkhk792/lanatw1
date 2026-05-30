import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronLeft, Plus, Minus } from "lucide-react";
import { requestHomeScrollRestore } from "@/lib/homeScrollRestore";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { SelectVariantDialog } from "@/components/SelectVariantDialog";
import { ProductDetailLineSupportNotice } from "@/components/product/ProductDetailLineSupportNotice";
import { LINE_CUSTOMER_ID } from "@/constants/lineOfficial";
import { ProductHeroFeatureTags } from "@/components/ProductHeroFeatureTags";
import { productPhoto, SITE_LOGO_PHOTO, pinkyCatalogPhoto } from "@/lib/productPhotos";
import { ORDER_MODEL_MOHOO_TOKYO_BOX_HOST } from "@/lib/orderProductModels";

const productMain = pinkyCatalogPhoto("tokyo-magic-box-host");
const logoImage = SITE_LOGO_PHOTO;

const MOHOO_HOST_PRODUCT_ID = "tokyo-magic-box-host";
const MOHOO_HOST_PRICE_TWD = 650;
const MOHOO_HOST_ORIGINAL_PRICE_TWD = 845;
const MOHOO_HOST_DISCOUNT_LABEL = "省 23%";

const colorGroups: { group: string; options: string[] }[] = [
  {
    group: "經典深色系",
    options: ["深邃夜黑", "白", "灰石古藍", "碧波青藍"],
  },
  {
    group: "礦石／自然色",
    options: ["冰川灣藍", "岩石蒼綠", "王者紫晶", "紫羅蘭霧"],
  },
  {
    group: "甜美粉彩",
    options: ["夢幻粉紫", "淺茶微棕", "璀璨玫瑰紅"],
  },
  {
    group: "漸層限定",
    options: ["金色深紅夕陽", "藍海微瀾", "薰衣草霜"],
  },
];

const MohooTokyoBoxHostDetail = () => {
  const navigate = useNavigate();
  const { addToCart, itemCount, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [variantPromptOpen, setVariantPromptOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const getProductTitle = () =>
    "東京魔盒主機｜MOHOO BOX · 500mAh 鋁合金鋼網棉芯 · 台灣現貨";
  const getProductDescription = () =>
    "TOKYO MOHOO BOX HOST · 12ml 適配 · 鋁合金機身 · 14 色可選";
  const getCategory = () => "MOHOO 東京魔盒主機";
  const getTags = () => "MOHOO，東京魔盒主機，鋁合金，鋼網棉芯，14 色可選";
  const getBadgeText = () =>
    selectedOption ? `台灣現貨｜${selectedOption}` : "鋁合金主機｜請先選擇顏色／款式";

  const buildCartPayload = () => {
    if (!selectedOption) return null;
    return {
      productId: MOHOO_HOST_PRODUCT_ID,
      title: ORDER_MODEL_MOHOO_TOKYO_BOX_HOST,
      variant: selectedOption,
      priceTwd: MOHOO_HOST_PRICE_TWD,
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
        message="請先從下方選擇一種顏色／款式，再加入購物車或立即購買。"
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
                alt="東京魔盒主機 TOKYO MOHOO BOX HOST"
                className="h-[500px] w-full object-contain"
              />

              <div className="absolute left-3 top-3">
                <div className="rounded-md bg-pink-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                  特價 {MOHOO_HOST_DISCOUNT_LABEL}
                </div>
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="rounded-md bg-red-600 px-6 py-2 font-bold text-white shadow-lg">
                  {getBadgeText()}
                </div>
              </div>
            </div>

            <ProductHeroFeatureTags
              tags={["500mAh 大電量", "鋁合金機身", "鋼網棉霧化芯", "12ml MOHOO 適配", "螢幕顯示電量"]}
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
              <a href="/#home-catalog-host" className="hover:text-gray-700">
                主機系列
              </a>
              <span>/</span>
              <span className="tracking-tight text-gray-700">東京魔盒主機</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{getProductTitle()}</h1>

            <p className="text-sm text-gray-600">
              MOHOO BOX 東京魔盒主機｜500mAh 鋁合金機身｜MESH 鋼網棉霧化芯｜搭配 12ml MOHOO 煙彈
            </p>

            <div className="flex flex-wrap items-end gap-3">
              <div className="text-4xl font-bold text-gray-900">{`NT$${MOHOO_HOST_PRICE_TWD.toLocaleString("zh-TW")}.00`}</div>
              <div className="flex items-center gap-2 pb-1">
                <span className="text-lg text-gray-400 line-through">
                  NT${MOHOO_HOST_ORIGINAL_PRICE_TWD.toLocaleString("zh-TW")}
                </span>
                <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs font-semibold text-pink-600">
                  {MOHOO_HOST_DISCOUNT_LABEL}
                </span>
              </div>
            </div>

            <p className="leading-7 text-gray-700">
              東京魔盒主機是專為電子菸愛好者設計的頂級電子菸產品，搭載 500mAh
              大電量電池，搭配創新 MESH 鋼網棉霧化芯；搭配 12ml 大容量 MOHOO
              煙彈可輕鬆吸食高達約 10,000 口。獨創小螢幕即時顯示電量，鋁合金輕巧機身、扁平吸嘴，煙霧飽滿濃郁、不漏油不燒焦；超過
              20 種口味可選涼版或不涼版。
            </p>

            <div className="max-h-[min(60vh,520px)] space-y-4 overflow-y-auto pr-1">
              <label className="text-lg font-medium text-gray-800">顏色／款式（請選一種）：</label>
              {colorGroups.map(({ group, options }) => (
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
              <ProductDetailLineSupportNotice />
              <p>鋁合金機身搭配扁平吸嘴，握感俐落；MESH 鋼網棉芯讓口感更細膩、輸出更穩定。</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100"
                    aria-label="減少數量"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6 py-3 text-lg font-medium text-gray-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100"
                    aria-label="增加數量"
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
                切換顏色／款式時數量會重設為 1。實際顏色、批次與庫存以到貨與客服確認為準；煙彈為另購（搭配 MOHOO BOX 12ml 煙彈）。
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
            <h2 className="text-2xl font-bold text-gray-900">產品描述</h2>
            <div className="mt-4 h-px w-14 bg-gray-900" />
            <p className="mt-6 leading-8 text-gray-700">
              想試試電子菸嗎？東京魔盒主機絕對是你的不二選擇。這款電子菸主機輕巧鋁合金機身，握在手裡像藝術品一樣時尚，500mAh
              大電量可支撐一整天；獨創小螢幕隨時顯示電量，再也不怕突然斷電尷尬。搭配 12ml 超大容量 MOHOO
              煙彈，內建創新 MESH
              鋼網棉芯，一顆彈就抽上萬口，煙霧飽滿順滑、不漏油不燒焦；超過 20
              種口味從清涼水果到濃郁菸草，任你挑，涼版／不涼版都超滿足。忙碌上班族或愛玩夜生活的人最適合，出門旅行、派對狂歡隨時來一口，扁平吸嘴超舒適，霧化細膩讓你一口接一口停不下來。趕緊入手，魔盒帶你暢快升級！
            </p>

            <h3 className="mt-8 text-lg font-semibold text-gray-900">核心硬體</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-8 text-gray-700">
              <li>
                <span className="font-semibold text-gray-900">電池：</span>500mAh
                大電量，小螢幕即時顯示剩餘電量。
              </li>
              <li>
                <span className="font-semibold text-gray-900">機身：</span>
                鋁合金輕巧設計，扁平吸嘴握感舒適、外型俐落。
              </li>
              <li>
                <span className="font-semibold text-gray-900">霧化結構：</span>
                創新 MESH 鋼網棉芯，飽滿順滑、不漏油不燒焦。
              </li>
              <li>
                <span className="font-semibold text-gray-900">煙彈搭配：</span>12ml MOHOO BOX
                煙彈（另購），參攷續航約 10,000 口。
              </li>
            </ul>

            <h3 className="mt-8 text-lg font-semibold text-gray-900">口味與款式</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-8 text-gray-700">
              <li>
                <span className="font-semibold text-gray-900">主機顏色：</span>
                14 色可選（深邃夜黑、白、灰石古藍、碧波青藍、冰川灣藍、岩石蒼綠等）。
              </li>
              <li>
                <span className="font-semibold text-gray-900">煙彈口味：</span>
                MOHOO BOX 系列超過 20 種口味，涼版／不涼版可選，輪替不無聊。
              </li>
              <li>
                <span className="font-semibold text-gray-900">適用場景：</span>
                日常通勤、出差旅行、派對夜生活皆適合。
              </li>
            </ul>

            <p className="mt-6 border-l-4 border-blue-200 pl-4 leading-8 text-gray-600">
              總結：東京魔盒主機以 500mAh 續航、鋁合金機身與 MESH
              鋼網棉芯為核心，搭配 12ml 大容量煙彈，提供穩定的萬口級霧化體驗，是兼顧外觀、續航與口感的旗艦級選擇。
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
              <h3 className="text-xl font-bold text-gray-900">主要特點</h3>
              <div className="mt-3 h-px w-12 bg-gray-900" />
              <ul className="mt-5 space-y-3 text-gray-700">
                {[
                  { k: "電池與續航", v: "500mAh 可充電，搭配小螢幕電量顯示" },
                  { k: "霧化結構", v: "MESH 鋼網棉芯，口感穩定、不漏油不燒焦" },
                  { k: "機身工藝", v: "鋁合金一體成型、扁平吸嘴更舒適" },
                  { k: "煙彈系統", v: "12ml MOHOO 煙彈，單顆參攷約 10,000 口" },
                  { k: "外觀款式", v: "14 色可選，從沉穩深色到漸層粉彩都齊全" },
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
              <h3 className="text-xl font-bold text-gray-900">詳細資訊</h3>
              <div className="mt-3 h-px w-12 bg-gray-900" />
              <dl className="mt-5 grid grid-cols-1 gap-3 text-sm text-gray-700 sm:grid-cols-2">
                {[
                  ["商品名稱", "東京魔盒主機"],
                  ["產品編號", "TOKYO-DEVICE-001"],
                  ["分類", "主機系列"],
                  ["品牌／系列", "MOHOO BOX 東京魔盒"],
                  ["電池", "500mAh 可充電（內建螢幕顯示電量）"],
                  ["機身材質", "鋁合金，扁平吸嘴"],
                  ["霧化芯", "創新 MESH 鋼網棉芯"],
                  ["煙彈容量", "12ml（MOHOO 煙彈另購）"],
                  ["參攷口數", "約 10,000 口（依煙彈與使用習慣而異）"],
                  ["顏色款式", "14 色可選"],
                  ["參攷價格", `NT$${MOHOO_HOST_PRICE_TWD}`],
                  ["客服", `LINE ID：${LINE_CUSTOMER_ID}`],
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
              本產品屬含尼古丁之電子煙相關產品，請遵守法規與年齡限制，並以包裝、警語與產地標示為準。實際顏色因螢幕顯色與批次略有差異；煙彈口味、庫存與出貨方式可透過
              LINE（{LINE_CUSTOMER_ID}）聯繫客服確認。
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-10">
            <h3 className="text-xl font-bold text-gray-900">你可能也會喜歡</h3>
            <div className="mt-3 h-px w-12 bg-gray-900" />
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                {
                  href: "/product/mohoo-tokyo-box",
                  title: "TOKYO MOHOO BOX 煙彈",
                  desc: "12ml · 約 10000 口 · 多口味",
                  image: productPhoto("disposable-mohoo-tokyo.webp"),
                },
                {
                  href: "/product/venus-host",
                  title: "VENUS 金星主機",
                  desc: "500mAh 可充電 · Mesh 線圈",
                  image: productPhoto("disposable-vapengin-venus.webp"),
                },
                {
                  href: "/product/hebat-gen6",
                  title: "HEBAT 喜貝六代",
                  desc: "10000 口拋棄式 · 15ml",
                  image: productPhoto("disposable-hebat-hb10000.webp"),
                },
                {
                  href: "/product/pro",
                  title: "SP2S Pro 旗艦主機",
                  desc: "智慧感應 · LED 炫彩",
                  image: productPhoto("product-4.webp"),
                },
              ].map((rec) => (
                <a
                  key={rec.href}
                  href={rec.href}
                  className="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={rec.image}
                      alt={rec.title}
                      className="h-full w-full object-contain transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-1 p-3">
                    <p className="text-sm font-semibold text-gray-900">{rec.title}</p>
                    <p className="text-xs text-gray-500">{rec.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MohooTokyoBoxHostDetail;
