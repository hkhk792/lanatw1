import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { requestHomeScrollRestore } from "@/lib/homeScrollRestore";
import { useCart } from "@/contexts/CartContext";
import { SelectVariantDialog } from "@/components/SelectVariantDialog";
import {
  findPinkyCatalogItemById,
  getPinkyImportedCatalogImage,
  pinkyImportedCatalog,
} from "@/data/pinkyImportedCatalog";
import { pinkyImportedCloudwaysDetailsById } from "@/data/pinkyImportedCloudwaysDetails.generated";

const DEFAULT_SITE_TITLE = "SP2S — 品味精髓 | 奢華蒸氣工坊";
const DEFAULT_IMPORTED_PRICE_TWD = 299;
const IMPORTED_DISPOSABLE_PRICE_TWD = 269;

const PinkyImportedCatalogDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addToCart, itemCount, openCart } = useCart();
  const item = findPinkyCatalogItemById(id);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [variantPromptOpen, setVariantPromptOpen] = useState(false);

  useEffect(() => {
    document.title = item ? `${item.title}｜匯入產品目錄` : "匯入產品目錄｜SP2S";
    return () => {
      document.title = DEFAULT_SITE_TITLE;
    };
  }, [item]);

  const goHome = () => {
    requestHomeScrollRestore();
    navigate("/");
  };

  const cloudways = item ? pinkyImportedCloudwaysDetailsById[item.id] : null;
  const flavors = cloudways?.flavors?.length ? [...cloudways.flavors] : [];
  const hasVariants = flavors.length > 0;
  const activeVariant = selectedOption ?? (hasVariants ? null : "標準款");
  const unitPriceTwd =
    item?.category === "拋棄式／大口數系列"
      ? IMPORTED_DISPOSABLE_PRICE_TWD
      : DEFAULT_IMPORTED_PRICE_TWD;

  const related = useMemo(
    () =>
      item
        ? pinkyImportedCatalog
            .filter((entry) => entry.category === item.category && entry.id !== item.id)
            .slice(0, 8)
        : [],
    [item]
  );

  const buildCartPayload = () => {
    if (!item || !activeVariant) return null;
    return {
      productId: item.id,
      title: item.title,
      variant: activeVariant,
      priceTwd: unitPriceTwd,
      quantity,
      imageUrl: getPinkyImportedCatalogImage(item.id),
    };
  };

  const handleAddToCart = () => {
    if (!activeVariant) {
      setVariantPromptOpen(true);
      return;
    }
    const payload = buildCartPayload();
    if (!payload) return;
    addToCart(payload);
    toast.success("已加入購物車", { description: `【${activeVariant}】x${quantity}` });
  };

  const handleBuyNow = () => {
    if (!activeVariant) {
      setVariantPromptOpen(true);
      return;
    }
    const payload = buildCartPayload();
    if (!payload) return;
    addToCart(payload);
    openCart();
  };

  if (!item) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <main className="container mx-auto max-w-5xl px-4 pt-16 pb-16">
          <button
            type="button"
            onClick={goHome}
            className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            返回首頁
          </button>
          <h1 className="text-2xl font-bold text-gray-900">找不到這個條目</h1>
          <p className="mt-4 text-sm text-gray-600">該條目可能已被移除，請回首頁重新選擇。</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <SelectVariantDialog
        open={variantPromptOpen}
        onOpenChange={setVariantPromptOpen}
        message="請先選擇規格/口味，再加入購物車或立即購買。"
      />

      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <p className="text-sm font-semibold tracking-wide text-gray-800">{item.title}</p>
          <button
            type="button"
            onClick={openCart}
            className="relative inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
          >
            <ShoppingCart className="w-5 h-5" />
            購物車
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 min-w-5 h-5 px-1 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <button
          type="button"
          onClick={goHome}
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          返回首頁
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
            <img
              src={getPinkyImportedCatalogImage(item.id)}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-[420px] object-cover"
            />
          </div>

          <div className="flex flex-col gap-5">
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Link to="/" className="hover:text-gray-700">
                首頁
              </Link>
              <span>/</span>
              <span className="hover:text-gray-700">{item.category}</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
            <div className="text-4xl font-bold text-gray-900">{`NT$${unitPriceTwd}.00`}</div>

            <div className="space-y-3">
              <label className="text-lg font-medium text-gray-800">{hasVariants ? "口味／規格：" : "規格："}</label>
              {hasVariants ? (
                <div className="flex flex-wrap gap-2">
                  {flavors.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setSelectedOption(name)}
                      className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                        selectedOption === name
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">標準款</p>
              )}
            </div>

            <div className="space-y-2 text-gray-700 text-sm">
              <p>分類：{item.category}</p>
              <p>此頁商品為匯入目錄條目，實際現貨與口味以客服回覆為準。</p>
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
                  className="flex-1 min-w-[10rem] bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  立即購買
                </button>
              </div>
              <p className="text-sm text-gray-500">
                {hasVariants
                  ? "切換口味時不會清空已加入購物車的其他款式。"
                  : "此商品目前提供標準款。"}
              </p>
            </div>
          </div>
        </div>

        {flavors.length > 0 ? (
          <section className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">口味／規格清單</h2>
            <p className="mb-4 text-xs text-gray-500">
              以下由站內商品匯出資料整理（不含庫存）；實際供貨以客服為準。
            </p>
            <ul className="columns-1 gap-x-6 sm:columns-2">
              {flavors.map((name) => (
                <li
                  key={name}
                  className="mb-2 break-inside-avoid text-sm leading-relaxed text-gray-700"
                >
                  <span className="font-medium">{name}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">同分類其他條目</h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((entry) => (
                <Link
                  key={entry.id}
                  to={`/catalog/${entry.id}`}
                  className="border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900"
                >
                  {entry.title}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
};

export default PinkyImportedCatalogDetailPage;
