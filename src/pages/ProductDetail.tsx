import { useState } from "react";
import {
  ChevronLeft, Minus, Plus, ShoppingCart, Truck, Shield, RefreshCw,
  Star, ChevronDown, ChevronUp, Check, MessageCircle, Phone,
} from "lucide-react";
import mohooMain from "@/assets/mohoo-main.png";
import productThumb1 from "@/assets/product-11.png";
import productThumb2 from "@/assets/product-13.png";

const flavorOptions = [
  { id: "tan-ice-cream",     label: "Tan Ice Cream",    cn: "香草冰淇淋" },
  { id: "confidante",        label: "Confidante",       cn: "紅顏知己" },
  { id: "water-melon",       label: "Water Melon",      cn: "西瓜" },
  { id: "passion-fruit",     label: "Passion Fruit",    cn: "百香果" },
  { id: "old-popsicle",      label: "Old Popsicle",     cn: "老冰棒" },
  { id: "pineapple",         label: "Pineapple",        cn: "鳳梨" },
  { id: "plain-tobacco",     label: "Plain Tobacco",    cn: "原味煙草" },
  { id: "peach-oolong",      label: "Peach Oolong",     cn: "桃烏龍" },
  { id: "cool-mint-gum",     label: "Cool Mint Gum",    cn: "清涼薄荷糖" },
  { id: "cool-lemon",        label: "Cool Lemon",       cn: "檸檬冰" },
  { id: "sarsae-beer",       label: "Sarsae Beer",      cn: "沙士啤酒" },
  { id: "mango",             label: "Mango",            cn: "芒果" },
  { id: "freezy-coke",       label: "Freezy Coke",      cn: "冰可樂" },
  { id: "guava-star-ice",    label: "Guava Star Ice",   cn: "番石榴冰" },
  { id: "jasmine-longjing",  label: "Jasmine Longjing", cn: "茉莉龍井" },
  { id: "lychee",            label: "Lychee",           cn: "荔枝" },
  { id: "cantaloupe",        label: "Cantaloupe",       cn: "哈密瓜" },
  { id: "honey-peach",       label: "Honey Peach",      cn: "元氣蜜桃" },
  { id: "green-apple",       label: "Green Apple",      cn: "青蘋果" },
  { id: "mineral-icecream",  label: "Mineral Icecream", cn: "礦力冰飲" },
  { id: "kiwi-fruit",        label: "Kiwi Fruit",       cn: "奇異果" },
  { id: "greentea-ice",      label: "Greentea Ice",     cn: "菊青普洱" },
  { id: "antarctic-ice",     label: "Antarctic Ice",    cn: "南極冰" },
  { id: "razzmazz-berry",    label: "Razzmazz Berry",   cn: "漿果莓果" },
  { id: "blueberry-beat",    label: "Blueberry Beat",   cn: "藍莓爆珠" },
  { id: "orange-soda",       label: "Orange Soda",      cn: "冰橘碳氣" },
  { id: "cold-soda",         label: "Cold Soda",        cn: "冰霜氣泡" },
  { id: "green-beans",       label: "Green Beans",      cn: "綠豆" },
  { id: "grape",             label: "Grape",            cn: "葡萄" },
  { id: "first-love-lychee", label: "初戀荔枝",         cn: "初戀荔枝" },
  { id: "ice-watermelon",    label: "冰鎮西瓜",         cn: "冰鎮西瓜" },
  { id: "green-apple-cn",    label: "青蘋果",           cn: "青蘋果" },
  { id: "white-peach-oolong",label: "白桃烏龍",         cn: "白桃烏龍" },
  { id: "blueberry-burst",   label: "藍莓爆珠",         cn: "藍莓爆珠" },
  { id: "grape-ice",         label: "葡萄冰",           cn: "葡萄冰" },
  { id: "cola-ice",          label: "可樂冰",           cn: "可樂冰" },
];

type CartItem = { flavorId: string; label: string; cn: string; qty: number };

const reviews = [
  { name: "Emily C.", rating: 5, text: "口味非常豐富，每種都很好喝，包裝也很精美！", date: "2025-04-10" },
  { name: "阿凱",     rating: 5, text: "出貨快速，口感細膩，下次還會再買！",        date: "2025-04-08" },
  { name: "Winnie T.", rating: 4, text: "整體很滿意，荔枝口味特別推薦。",           date: "2025-04-05" },
];

const specs = [
  ["商品名稱", "TOKYO MOHOO BOX 東京魔盒拋棄式煙彈"],
  ["尼古丁含量", "3%（尼古丁鹽）"],
  ["容量",      "2.5ml"],
  ["口味數量",  "36 種"],
  ["類型",      "拋棄式煙彈"],
  ["適配機型",  "二代系列通用"],
  ["出貨方式",  "7-11 / 全家取貨付款"],
  ["保存期限",  "製造日起 12 個月"],
];

const faqs = [
  {
    q: "可以混搭不同口味下單嗎？",
    a: "可以！您可以一次選擇多種口味，每種口味分別設定數量，系統會自動計算總價與合計件數。",
  },
  {
    q: "運費怎麼計算？",
    a: "全館消費滿 NT$1,500 即享免運優惠。未達標準運費為 NT$60，支援 7-11 / 全家取貨付款。",
  },
  {
    q: "如果收到商品有問題怎麼辦？",
    a: "請於收貨後 48 小時內透過客服 LINE 聯絡我們，並附上照片說明，我們會盡快處理退換事宜。",
  },
  {
    q: "商品有保固嗎？",
    a: "拋棄式煙彈屬耗材，不提供一般保固，但若因出廠瑕疵導致問題，可申請換貨。",
  },
];

const ProductDetail = () => {
  const [mainImage, setMainImage] = useState(mohooMain);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [globalQty, setGlobalQty] = useState(1);
  const [activeFlavor, setActiveFlavor] = useState(flavorOptions[0]);
  const [activeTab, setActiveTab] = useState<"detail" | "spec" | "faq">("detail");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const gallery = [mohooMain, productThumb1, productThumb2];

  const totalCartQty = cart.reduce((s, i) => s + i.qty, 0);
  const totalCartPrice = totalCartQty * 450;

  const addToCart = () => {
    setCart((prev) => {
      const exists = prev.find((i) => i.flavorId === activeFlavor.id);
      if (exists) {
        return prev.map((i) =>
          i.flavorId === activeFlavor.id ? { ...i, qty: i.qty + globalQty } : i
        );
      }
      return [
        ...prev,
        { flavorId: activeFlavor.id, label: activeFlavor.label, cn: activeFlavor.cn, qty: globalQty },
      ];
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const updateCartQty = (flavorId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.flavorId === flavorId ? { ...i, qty: Math.max(0, i.qty + delta) } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeFromCart = (flavorId: string) => {
    setCart((prev) => prev.filter((i) => i.flavorId !== flavorId));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ── 導航欄 ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => (window.location.href = "/")}
            className="flex items-center gap-1 text-sm text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="font-medium">返回首頁</span>
          </button>

          <span className="font-bold text-blue-700 tracking-wide text-sm hidden sm:block">TOKYO MOHOO BOX</span>

          {/* 購物車按鈕 */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-1.5 text-slate-700 hover:text-blue-600 transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="text-sm font-medium hidden sm:block">購物車</span>
            {totalCartQty > 0 && (
              <span className="absolute -top-2 -right-2 min-w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center px-1">
                {totalCartQty}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── Toast ── */}
      {addedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium animate-fade-in">
          <Check className="h-4 w-4" />
          已加入購物車！
        </div>
      )}

      {/* ── 購物車側抽屜 ── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setCartOpen(false)} />
          <aside className="w-full max-w-sm bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold">購物車（{totalCartQty} 件）</h2>
              <button onClick={() => setCartOpen(false)} className="text-slate-400 hover:text-slate-700 text-2xl leading-none">&times;</button>
            </div>

            <div className="flex-1 overflow-auto px-5 py-4 space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-slate-500 text-sm py-16">購物車是空的，快去選口味吧！</p>
              ) : (
                cart.map((item) => (
                  <div key={item.flavorId} className="flex items-center gap-3 border border-slate-200 rounded-xl p-3">
                    <img src={mohooMain} alt={item.label} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.cn}</p>
                      <p className="text-sm font-bold text-blue-700 mt-0.5">NT${item.qty * 450}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden text-sm">
                        <button onClick={() => updateCartQty(item.flavorId, -1)} className="px-2 py-1 hover:bg-slate-100">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 font-semibold min-w-8 text-center">{item.qty}</span>
                        <button onClick={() => updateCartQty(item.flavorId, 1)} className="px-2 py-1 hover:bg-slate-100">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.flavorId)} className="text-xs text-red-400 hover:text-red-600 mt-0.5">移除</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="px-5 py-4 border-t border-slate-200 space-y-3">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>小計</span>
                  <span className="font-semibold text-slate-900">NT${totalCartPrice}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>運費</span>
                  <span className={totalCartPrice >= 1500 ? "text-green-600 font-semibold" : "text-slate-900 font-semibold"}>
                    {totalCartPrice >= 1500 ? "免運 🎉" : "NT$60"}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-slate-100 pt-2">
                  <span>合計</span>
                  <span className="text-blue-700">NT${totalCartPrice >= 1500 ? totalCartPrice : totalCartPrice + 60}</span>
                </div>
                {totalCartPrice < 1500 && (
                  <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                    再買 NT${1500 - totalCartPrice} 即可享免運！
                  </p>
                )}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors">
                  前往結帳
                </button>
                <button
                  onClick={() => setCartOpen(false)}
                  className="w-full border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium py-2.5 rounded-xl transition-colors text-sm"
                >
                  繼續購物
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* ── 主要內容 ── */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* 麵包屑 */}
        <nav className="text-xs text-slate-500 mb-4 flex items-center gap-1.5 flex-wrap">
          <a href="/" className="hover:text-blue-600">首頁</a>
          <span>/</span>
          <span>拋棄式煙彈</span>
          <span>/</span>
          <span className="text-slate-700 font-medium">TOKYO MOHOO BOX</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-10">
          {/* ── 左側：圖片 ── */}
          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden aspect-square">
              <img src={mainImage} alt="TOKYO MOHOO BOX" className="w-full h-full object-contain" />
            </div>
            <div className="flex gap-2">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    mainImage === img ? "border-blue-500 shadow-md" : "border-slate-200 hover:border-blue-300"
                  }`}
                >
                  <img src={img} alt={`縮略圖 ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ── 右側：購買區 ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 flex flex-col gap-5">
            {/* 標題 & 評價 */}
            <div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                <span className="text-xs text-slate-500 ml-1">4.9（{reviews.length} 則評價）</span>
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold leading-snug text-slate-900">
                TOKYO MOHOO BOX 東京魔盒拋棄式煙彈
              </h1>
            </div>

            {/* 價格 & 運費 */}
            <div className="bg-blue-50 rounded-xl px-4 py-3 space-y-1.5">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-blue-700">NT$450</span>
                <span className="text-sm text-slate-400 line-through">NT$520</span>
                <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">省 NT$70</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">
                  <Truck className="h-3 w-3" /> 全館滿 1500 免運
                </span>
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                  7-11 / 全家取貨付款
                </span>
              </div>
              <p className="text-xs text-slate-500">約 2-3 個工作天出貨，假日可能順延。</p>
            </div>

            {/* 口味選擇 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-slate-700">選擇口味</h2>
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2.5 py-0.5 rounded-full">
                  共 {flavorOptions.length} 種
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-64 overflow-y-auto pr-1">
                {flavorOptions.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFlavor(f)}
                    className={`rounded-lg border px-2.5 py-2 text-left transition-all duration-150 ${
                      activeFlavor.id === f.id
                        ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    <p className="text-xs font-semibold truncate">{f.label}</p>
                    {f.label !== f.cn && <p className={`text-[10px] truncate ${activeFlavor.id === f.id ? "text-blue-100" : "text-slate-400"}`}>{f.cn}</p>}
                  </button>
                ))}
              </div>
              <p className="text-xs mt-2 text-slate-500">
                已選：<span className="text-blue-700 font-semibold">{activeFlavor.label} {activeFlavor.label !== activeFlavor.cn ? `（${activeFlavor.cn}）` : ""}</span>
              </p>
            </div>

            {/* 數量 */}
            <div>
              <h2 className="text-sm font-bold text-slate-700 mb-2">數量</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-xl border border-slate-300 overflow-hidden">
                  <button
                    onClick={() => setGlobalQty((p) => Math.max(1, p - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{globalQty}</span>
                  <button
                    onClick={() => setGlobalQty((p) => p + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-slate-500">小計：<span className="text-slate-900 font-semibold">NT${globalQty * 450}</span></span>
              </div>
            </div>

            {/* 加購按鈕 */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={addToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-200"
              >
                <ShoppingCart className="h-5 w-5" />
                加入購物車
              </button>
              <button className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 rounded-xl transition-colors">
                立即購買
              </button>
            </div>

            {/* 保障標籤 */}
            <div className="flex flex-wrap gap-3 pt-1 border-t border-slate-100">
              {[
                { icon: Shield,     text: "品質保證" },
                { icon: RefreshCw,  text: "瑕疵換貨" },
                { icon: MessageCircle, text: "LINE 客服" },
                { icon: Phone,      text: "24h 即時回應" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Icon className="h-3.5 w-3.5 text-blue-500" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 購物車清單小結 ── */}
        {cart.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900">已選購清單（{totalCartQty} 件）</h3>
              <button
                onClick={() => setCartOpen(true)}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                查看購物車
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {cart.map((item) => (
                <div key={item.flavorId} className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5 text-sm">
                  <span className="font-medium text-slate-800">{item.label}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateCartQty(item.flavorId, -1)} className="w-5 h-5 rounded bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-100">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-5 text-center font-bold text-xs">{item.qty}</span>
                    <button onClick={() => updateCartQty(item.flavorId, 1)} className="w-5 h-5 rounded bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-100">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.flavorId)} className="text-slate-400 hover:text-red-500">&times;</button>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                商品合計 <span className="font-bold text-slate-900">NT${totalCartPrice}</span>
                {" · "}運費{" "}
                <span className={totalCartPrice >= 1500 ? "text-green-600 font-bold" : "font-bold"}>
                  {totalCartPrice >= 1500 ? "免運 🎉" : "NT$60"}
                </span>
              </div>
              <button
                onClick={() => setCartOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors"
              >
                結帳
              </button>
            </div>
            {totalCartPrice < 1500 && (
              <div className="mt-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                💡 再買 NT${1500 - totalCartPrice} 即享免運優惠！
              </div>
            )}
          </div>
        )}

        {/* ── 詳情 Tab ── */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-200">
            {(["detail", "spec", "faq"] as const).map((tab) => {
              const labels = { detail: "商品詳情", spec: "規格參數", faq: "常見問題" };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                    activeTab === tab
                      ? "text-blue-700 border-b-2 border-blue-600 bg-blue-50"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>

          <div className="p-5 md:p-6">
            {/* 商品詳情 */}
            {activeTab === "detail" && (
              <div className="space-y-5 text-sm leading-7 text-slate-700">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                  <span className="text-2xl">🎌</span>
                  <div>
                    <p className="font-bold text-slate-900 mb-1">東京限定風味體驗</p>
                    <p>TOKYO MOHOO BOX 集結 36 種精選口味，3% 尼古丁鹽基底，帶來絲滑順暢的吸食體驗，適合所有二代系列主機。</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { emoji: "💧", title: "2.5ml 大容量",  desc: "更持久的使用體驗，每顆煙彈足量滿足。" },
                    { emoji: "🌿", title: "3% 尼古丁鹽",   desc: "滿足感十足，喉感溫潤不嗆喉。" },
                    { emoji: "🔌", title: "二代系列通用",   desc: "與所有 SP2S 二代主機完美相容。" },
                  ].map(({ emoji, title, desc }) => (
                    <div key={title} className="flex flex-col items-center text-center p-4 border border-slate-200 rounded-xl gap-2">
                      <span className="text-3xl">{emoji}</span>
                      <p className="font-bold text-slate-900 text-sm">{title}</p>
                      <p className="text-xs text-slate-500 leading-5">{desc}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500 space-y-1">
                  <p className="font-semibold text-slate-700">⚠️ 使用注意事項</p>
                  <p>• 本產品含有尼古丁，未滿 18 歲請勿購買使用。</p>
                  <p>• 請存放於陰涼乾燥處，避免陽光直射或高溫環境。</p>
                  <p>• 孕婦、心臟病患者及對尼古丁過敏者請勿使用。</p>
                  <p>• 請勿讓兒童及寵物接觸本產品。</p>
                </div>
              </div>
            )}

            {/* 規格參數 */}
            {activeTab === "spec" && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {specs.map(([label, value], i) => (
                      <tr key={label} className={i % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                        <td className="px-4 py-3 text-slate-500 font-medium w-36 whitespace-nowrap">{label}</td>
                        <td className="px-4 py-3 text-slate-900 font-semibold">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 常見問題 */}
            {activeTab === "faq" && (
              <div className="space-y-2">
                {faqs.map((faq, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-sm font-semibold text-slate-800">{faq.q}</span>
                      {openFaq === i ? <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />}
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 text-sm text-slate-600 leading-6 bg-blue-50 border-t border-blue-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── 用戶評價 ── */}
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">
          <h3 className="font-bold text-slate-900 text-lg mb-4">用戶評價</h3>
          <div className="space-y-4">
            {reviews.map((r, i) => (
              <div key={i} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center">
                      {r.name[0]}
                    </div>
                    <span className="text-sm font-semibold text-slate-800">{r.name}</span>
                  </div>
                  <span className="text-xs text-slate-400">{r.date}</span>
                </div>
                <div className="flex gap-0.5 mb-1">
                  {[...Array(r.rating)].map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-6">{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── LINE 客服 ── */}
        <div className="fixed bottom-6 right-6 z-40">
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 transition-all hover:scale-105 text-sm">
            <MessageCircle className="h-5 w-5" />
            LINE 客服
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
