import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronLeft, Plus, Minus } from "lucide-react";
import { requestHomeScrollRestore } from "@/lib/homeScrollRestore";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { SelectVariantDialog } from "@/components/SelectVariantDialog";
import { ProductHeroFeatureTags } from "@/components/ProductHeroFeatureTags";
import { productPhoto, SITE_LOGO_PHOTO } from "@/lib/productPhotos";

const productMain = productPhoto("showcase-e-liquid.webp");
const logoImage = SITE_LOGO_PHOTO;
import { ORDER_MODEL_LANA_ELiquid_30ML } from "@/lib/orderProductModels";

const LANA_ELiquid_PRODUCT_ID = "lana-e-liquid-30ml";
const LANA_ELiquid_PRICE_TWD = 350;

const flavorGroups: { group: string; options: string[] }[] = [
  { group: "茶香系列", options: ["鐵觀音", "龍井"] },
  {
    group: "水果系列",
    options: [
      "水蜜桃",
      "海鹽鳳梨",
      "荔枝",
      "莓果",
      "葡萄冰",
      "藍莓",
      "西瓜",
      "青蘋果",
      "芒果",
      "百香果",
    ],
  },
  { group: "經典飲品／涼感", options: ["可樂", "寶礦力", "南極冰泉", "老冰棍"] },
];

const LanaEliquid30mlDetail = () => {
  const navigate = useNavigate();
  const { addToCart, itemCount, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [variantPromptOpen, setVariantPromptOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const buildCartPayload = () => {
    if (!selectedOption) return null;
    return {
      productId: LANA_ELiquid_PRODUCT_ID,
      title: ORDER_MODEL_LANA_ELiquid_30ML,
      variant: selectedOption,
      priceTwd: LANA_ELiquid_PRICE_TWD,
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

  const getProductTitle = () => "拉娜 LANA 煙油小瓶裝（30ml）｜鹽尼古丁";
  const getProductDescription = () => "LANA 30ml 煙油 · 鹽尼 · 台灣正品發貨";
  const getCategory = () => "LANA 電子煙煙油";
  const getTags = () => "LANA，煙油，30ml，鹽尼，多口味可選";
  const getBadgeText = () =>
    selectedOption ? `30ml｜${selectedOption}` : "台灣正品｜請先選口味";

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
        message="請先從下方選擇一種「口味」規格，再加入購物車或立即購買。"
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
                alt="拉娜 LANA 電子煙煙油 30ml"
                className="h-[500px] w-full object-contain"
              />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="rounded-md bg-red-600 px-6 py-2 font-bold text-white shadow-lg">{getBadgeText()}</div>
              </div>
            </div>

            <ProductHeroFeatureTags
              tags={["30ml 大容量", "3% 鹽尼", "參攷 9000 口週期", "茶香人氣", "高 CP 囤貨"]}
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
              <span className="tracking-tight text-gray-700">LANA 30ml 煙油</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{getProductTitle()}</h1>

            <div className="text-4xl font-bold text-gray-900">{`NT$${LANA_ELiquid_PRICE_TWD}.00`}</div>

            <p className="text-sm text-gray-700 leading-relaxed">
              台灣正品出貨；客服聯繫：
              <span className="font-medium">LINE abs791012</span>。單瓶參攷使用口數與
              9000
              口層級為行銷參攷值，實際隨主機、線圈、功率與個人使用習慣差異極大。
            </p>

            <div className="max-h-[min(52vh,480px)] space-y-4 overflow-y-auto pr-1">
              <label className="text-lg font-medium text-gray-800">
                口味規格（多達十餘至十四款，實際以庫存為準）：
              </label>
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
                本頁採站內購物車與結帳；若你習慣原站流程，亦可透過 LINE
                向客服另外索取連結。切換口味時數量會重設為 1。
              </p>
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
            <h2 className="text-2xl font-bold text-gray-900">產品規格與特點</h2>
            <div className="mt-4 h-px w-14 bg-gray-900" />
            <ul className="mt-6 list-disc space-y-2 pl-5 leading-8 text-gray-700">
              <li>容量：30ml／瓶，一次性封裝（以實體與外盒為準）。</li>
              <li>尼古丁濃度：參攷 3%（30mg／ml），實測以包裝、產地、警語與法規為準。</li>
              <li>使用週期：參攷行銷約 9,000 口層級之續航感受（實際隨主機、霧化結構、每日口數、開瓶後保存而變化）。</li>
            </ul>
            <h3 className="mt-8 text-lg font-semibold text-gray-900">特點</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700">
              <li>配方取向：以相對穩定、清楚的香氣表現與可預期喉感著稱，強調以合格原料與製程生產（以包裝、檢測敘述為主）。</li>
              <li>吸感：多數使用者回饋導霧偏細緻、蒸汽體積中量，屬日常口糧等級的順口路線。</li>
              <li>口味層次：以鐵觀音等茶感與多線水果、飲品相互搭配，在濃郁度與清爽之間有較好平衡，可作口糧與風格替換之間的折衷方案。</li>
            </ul>
            <h3 className="mt-8 text-lg font-semibold text-gray-900">購買與使用建議</h3>
            <p className="mt-3 leading-8 text-gray-700">
              特別推薦給願意長期在開放或半開放主機、儲油霧化器上輪替口味、追尋
              30ml
              大包裝與攤提每毫升成本、且喜歡不斷變化味蕾體驗的族群。務必先選好口味，再加入購物車或前進站內結帳。開封後建議盡快於陰涼、避光、遠離兒童處用畢，並關好瓶蓋，避免變味或氧化。
            </p>
            <p className="mt-4 border-l-4 border-amber-200 pl-3 text-sm text-gray-600">
              總結：LANA 30ml
              煙油是市場上相對成熟的熱門產品線之一，透過大容量＋參攷 9000
              口級的長週期使用訴求與
              350
              元帶的單價，常被玩家當成長期囤貨的務實選擇。選購、批次與效期以到貨實物與客服最終回覆為準。
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm md:p-10">
            <h3 className="text-xl font-bold text-gray-900">法規與安全提醒</h3>
            <div className="mt-3 h-px w-12 bg-gray-900" />
            <p className="mt-5 leading-8 text-gray-700">
              本產品屬含尼古丁的電子煙專用煙液。未成年人、非吸煙者、懷孕或哺乳期婦女請勿接觸與使用。請只配合相容於瓶身標示濃度與劑型之霧化設備。若有不適，請即停用並尋求醫療諮詢。跨境或跨站購物時，法規、稅則、寄送限制可能不同，下單前可透過
              LINE（abs791012）釐清。
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LanaEliquid30mlDetail;
