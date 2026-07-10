import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { requestHomeScrollRestore } from "@/lib/homeScrollRestore";
import { resolveCartLineImageUrl } from "@/lib/cartProductImages";
import {
  displayShippingTwdForCheckout,
  FREE_SHIPPING_THRESHOLD_TWD,
} from "@/lib/checkoutShipping";
import { isValidTaiwanMobile, normalizeTaiwanMobile } from "@/lib/phoneTaiwan";
import { fetchShippingQuote, type ShippingQuote } from "@/lib/fetchShippingQuote";
import CartLineThumbnail from "@/components/CartLineThumbnail";
import FirstOrderShippingVerify from "@/components/checkout/FirstOrderShippingVerify";
import CheckoutLineRebateNotice from "@/components/checkout/CheckoutLineRebateNotice";
import SitewideGiftNotice from "@/components/checkout/SitewideGiftNotice";
import { CheckoutFooter, CheckoutProgress } from "@/components/checkout/CheckoutChrome";
import {
  formatShippingAddressFromStore,
  isPcscStoreMessage,
  openPcscStoreSelector,
  parsePcscStoreFromSearchParams,
  PCSC_PUBLIC_STORE_LOOKUP_URL,
  type PcscSelectedStore,
} from "@/lib/pcscEmap";

const formatTwd = (n: number) => `NT$${n.toLocaleString("zh-TW")}`;

const fieldClass =
  "rounded-sm border border-neutral-900 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:border-neutral-900 focus-visible:ring-neutral-900";

const Checkout = () => {
  const navigate = useNavigate();
  const { lines, clearCart } = useCart();

  const orderItems = useMemo(
    () =>
      lines.map((line) => ({
        productModel: line.title,
        variant: line.variant,
        quantity: line.quantity,
        unitPriceTwd: line.priceTwd,
        lineTotalTwd: line.priceTwd * line.quantity,
        productId: line.productId,
        imageUrl: resolveCartLineImageUrl(line.productId, line.imageUrl),
      })),
    [lines]
  );
  const subtotalTwd = useMemo(
    () => orderItems.reduce((s, it) => s + it.lineTotalTwd, 0),
    [orderItems]
  );
  const [shippingQuote, setShippingQuote] = useState<ShippingQuote | null>(null);

  const [country, setCountry] = useState("台灣");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [lineId, setLineId] = useState("");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState<"cod">("cod");
  /** 7-11 等超商門市店號，與「收貨地址」分開填寫 */
  const [pickupStoreCode, setPickupStoreCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayShippingTwd = useMemo(
    () =>
      shippingQuote !== null
        ? shippingQuote.shippingTwd
        : displayShippingTwdForCheckout(subtotalTwd, null),
    [shippingQuote, subtotalTwd]
  );
  const displayTotalTwd = subtotalTwd + displayShippingTwd;
  const showFirstOrderBadge =
    shippingQuote?.isFirstOrder === true &&
    shippingQuote.shippingTwd === 0 &&
    subtotalTwd < FREE_SHIPPING_THRESHOLD_TWD;


  useEffect(() => {
    if (lines.length === 0) {
      requestHomeScrollRestore();
      navigate("/", { replace: true });
      toast.message("購物車是空的", { description: "請先加入商品後再結帳。" });
    }
  }, [lines.length, navigate]);

  const applyPcscStore = useCallback((store: PcscSelectedStore) => {
    setPickupStoreCode(store.storeId);
    const addressLine = formatShippingAddressFromStore(store);
    if (addressLine) setShippingAddress(addressLine);
    toast.success("已帶入 7-11 門市", {
      description: `${store.storeName || "門市"}（${store.storeId}）`,
    });
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (!isPcscStoreMessage(event.data)) return;
      applyPcscStore(event.data.store);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [applyPcscStore]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const store = parsePcscStoreFromSearchParams(params);
    if (!store) return;
    applyPcscStore(store);
    params.delete("cvs_storeid");
    params.delete("cvs_storename");
    params.delete("cvs_storeaddress");
    const next = params.toString();
    navigate({ pathname: "/checkout", search: next ? `?${next}` : "" }, { replace: true });
  }, [applyPcscStore, navigate]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const addressOk = Boolean(shippingAddress.trim());
    const storeOk = Boolean(pickupStoreCode.trim());
    if (!name.trim() || !phone.trim() || !addressOk || !storeOk) {
      toast.error("請填寫必填欄位", {
        description: "姓名、手機號碼、收貨地址與收貨門市號為必填。",
      });
      return;
    }

    if (!isValidTaiwanMobile(phone)) {
      toast.error("請輸入有效的台灣手機號碼");
      return;
    }

    setIsSubmitting(true);

    try {
      let quote: ShippingQuote;
      try {
        quote = await fetchShippingQuote(phone, subtotalTwd, { forceRefresh: true });
        setShippingQuote(quote);
      } catch {
        quote = {
          phone: normalizeTaiwanMobile(phone) || phone.trim(),
          isFirstOrder: false,
          hasPriorOrders: true,
          shippingTwd: displayShippingTwdForCheckout(subtotalTwd, false),
        };
        setShippingQuote(quote);
      }

      const shippingTwdFinal = quote.shippingTwd;
      const totalTwdFinal = subtotalTwd + shippingTwdFinal;
      const firstOrderEligible =
        quote.isFirstOrder && shippingTwdFinal === 0 && subtotalTwd < FREE_SHIPPING_THRESHOLD_TWD;

      const payload = {
        country: country.trim() || "台灣",
        paymentMethod: payment,
        customerName: name.trim(),
        phone: normalizeTaiwanMobile(phone) || phone.trim(),
        shippingAddress: shippingAddress.trim(),
        pickupStoreCode: pickupStoreCode.trim(),
        lineId: lineId.trim() || "未提供",
        notes: notes.trim(),
        subtotalTwd,
        shippingTwd: shippingTwdFinal,
        totalTwd: totalTwdFinal,
        ...(firstOrderEligible ? { firstOrderFreeShipping: true } : {}),
        items: orderItems.map((it) => ({
          productModel: it.productModel,
          variant: it.variant,
          quantity: it.quantity,
          unitPriceTwd: it.unitPriceTwd,
          lineTotalTwd: it.lineTotalTwd,
          productId: it.productId,
          imageUrl: it.imageUrl ?? "",
        })),
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const ct = response.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const raw = await response.text();
        const looksLikeHtml = /<!doctype\s+html/i.test(raw) || raw.trimStart().startsWith("<html");
        throw new Error(
          looksLikeHtml
            ? "訂單 API 未啟用（伺服器回傳了網頁而非 API）。請確認網域已連到本專案的 Vercel，並可開啟 /api/health 檢查是否為 JSON。"
            : "訂單回應格式異常，請稍後再試。"
        );
      }

      const data = (await response.json().catch(() => null)) as
        | {
            error?: string;
            orderNumber?: string;
            batchDate?: string;
            shippingTwd?: number;
            totalTwd?: number;
            shippingAdjusted?: boolean;
          }
        | null;

      if (!response.ok) {
        throw new Error(data?.error || "下單失敗，請稍後再試。");
      }

      clearCart();
      const orderHint = data?.orderNumber ? `訂單編號 ${data.orderNumber} · ` : "";
      const batchHint = data?.batchDate ? `截單批次 ${data.batchDate} · ` : "";
      const actualShippingTwd =
        typeof data?.shippingTwd === "number" ? data.shippingTwd : shippingTwdFinal;
      const actualTotalTwd =
        typeof data?.totalTwd === "number" ? data.totalTwd : totalTwdFinal;
      const shippingHint =
        actualShippingTwd > 0
          ? `運費 ${formatTwd(actualShippingTwd)} · `
          : "免運 · ";
      toast.success("訂單已送出", {
        description: `${orderHint}${batchHint}${shippingHint}合計 ${formatTwd(actualTotalTwd)} · 貨到付款`,
      });
      navigate("/order-complete", { replace: true });
    } catch (error) {
      toast.error("訂單送出失敗", {
        description: error instanceof Error ? error.message : "請稍後再試，或聯繫客服協助下單。",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (lines.length === 0) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900">
      <CheckoutProgress step="checkout" />

      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <Link
            to="/"
            onClick={() => requestHomeScrollRestore()}
            className="text-sm font-semibold tracking-wide text-neutral-900 hover:opacity-70"
          >
            ← 返回商城
          </Link>
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
            SP2S 電子菸線上商城
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <form onSubmit={handlePlaceOrder} className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <section className="lg:col-span-7">
            <h1 className="text-lg font-semibold text-neutral-900">帳單與運送</h1>
            <p className="mt-1 text-sm text-neutral-500">請填寫取貨與聯絡資訊（標示 * 為必填）</p>

            <div className="mt-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="country" className="text-neutral-800">
                  國家／地區 <span className="text-red-600">*</span>
                </Label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={`h-10 w-full px-3 text-sm ${fieldClass}`}
                >
                  <option value="台灣">台灣</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-neutral-800">
                  姓名 <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={fieldClass}
                  placeholder="收件人姓名"
                  autoComplete="name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-neutral-800">
                  手機號碼 <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={fieldClass}
                  placeholder="09xxxxxxxx"
                  inputMode="tel"
                  autoComplete="tel"
                />
                <FirstOrderShippingVerify
                  phone={phone}
                  subtotalTwd={subtotalTwd}
                  onQuoteChange={setShippingQuote}
                />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <Label htmlFor="shippingAddress" className="text-neutral-800">
                    收貨地址 <span className="text-red-600">*</span>
                  </Label>
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <button
                      type="button"
                      onClick={() => openPcscStoreSelector()}
                      className="text-xs text-neutral-600 underline underline-offset-2 hover:text-neutral-900"
                    >
                      選擇 7-11 取貨門市
                    </button>
                    <a
                      href={PCSC_PUBLIC_STORE_LOOKUP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-800"
                    >
                      僅查店號
                    </a>
                  </span>
                </div>
                <Input
                  id="shippingAddress"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className={fieldClass}
                  placeholder="超商取貨可填店名與路段；宅配請填詳細地址。"
                  autoComplete="street-address"
                  required
                />
                <p className="text-xs leading-relaxed text-neutral-500">
                  點「選擇 7-11 取貨門市」於地圖選店後會自動帶回本欄與「收貨門市號」。若地圖顯示系統忙碌，請改點「僅查店號」手動填寫，或洽 LINE 客服。宅配請寫完整地址，門市號填「無」。
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pickupStoreCode" className="text-neutral-800">
                  收貨門市號 <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="pickupStoreCode"
                  value={pickupStoreCode}
                  onChange={(e) => setPickupStoreCode(e.target.value)}
                  className={fieldClass}
                  placeholder="例：195946（7-11 店號 7 碼）"
                  inputMode="numeric"
                  autoComplete="off"
                  required
                />
                <p className="text-xs leading-relaxed text-neutral-500">
                  超商取貨請填 7-11／全家店號；宅配請填「無」。
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lineId" className="text-neutral-800">
                  LINE ID <span className="text-neutral-400 font-normal">（選填）</span>
                </Label>
                <Input
                  id="lineId"
                  value={lineId}
                  onChange={(e) => setLineId(e.target.value)}
                  className={fieldClass}
                  placeholder="選填，方便客服聯絡您"
                  autoComplete="username"
                />
              </div>

              <CheckoutLineRebateNotice subtotalTwd={subtotalTwd} />

              <div className="space-y-2">
                <Label htmlFor="notesDefault" className="text-neutral-800">
                  額外資訊 · 訂單備註
                </Label>
                <p className="text-[11px] leading-relaxed text-neutral-500">
                  宅配請於「收貨地址」寫完整地址，並於「收貨門市號」填「無」。
                </p>
                <Textarea
                  id="notesDefault"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={`min-h-[120px] ${fieldClass}`}
                  placeholder="如有特殊取貨時間或其他需求請在此說明"
                />
              </div>
            </div>
          </section>

          <aside className="lg:col-span-5">
            <div className="border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-neutral-900">您的訂單</h2>

              <div className="mt-4">
                <CheckoutLineRebateNotice subtotalTwd={subtotalTwd} />
              </div>

              <div className="mt-6 space-y-4 border-b border-neutral-200 pb-6">
                {orderItems.map((it) => (
                  <div
                    key={`${it.productId}-${it.variant}`}
                    className="flex gap-3 text-sm"
                  >
                    <div className="h-14 w-14 shrink-0 border border-neutral-200 bg-white">
                      <CartLineThumbnail
                        productId={it.productId}
                        imageUrl={it.imageUrl}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium leading-snug text-neutral-900">
                        {it.productModel}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        【{it.variant}】× {it.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 font-medium text-neutral-900">{formatTwd(it.lineTotalTwd)}</p>
                  </div>
                ))}
              </div>

              <dl className="mt-6 space-y-3 text-sm">
                <SitewideGiftNotice lines={lines} />
                <div className="flex justify-between text-neutral-600">
                  <dt>小計</dt>
                  <dd className="font-medium text-neutral-900">{formatTwd(subtotalTwd)}</dd>
                </div>
                <div className="flex justify-between gap-3 text-neutral-600">
                  <dt className="min-w-0 flex-1 leading-snug">
                    超商取貨
                    {showFirstOrderBadge ? (
                      <span className="mt-0.5 block text-[11px] font-normal text-emerald-700">
                        首單免運
                      </span>
                    ) : null}
                  </dt>
                  <dd className="shrink-0 min-w-[4.5rem] text-right font-medium tabular-nums text-neutral-900">
                    {displayShippingTwd === 0 ? "免運" : formatTwd(displayShippingTwd)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-neutral-200 pt-4 text-base font-semibold text-neutral-900">
                  <dt>合計</dt>
                  <dd className="shrink-0 min-w-[4.5rem] text-right tabular-nums">
                    {formatTwd(displayTotalTwd)}
                  </dd>
                </div>
              </dl>

              <div className="mt-8 border-t border-neutral-200 pt-6">
                <p className="text-sm font-medium text-neutral-900">付款方式</p>
                <label className="mt-4 flex cursor-pointer items-start gap-3 border border-neutral-900 bg-white p-4">
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === "cod"}
                    onChange={() => setPayment("cod")}
                    className="mt-1 accent-neutral-900"
                  />
                  <span>
                    <span className="font-medium text-neutral-900">貨到付款</span>
                    <span className="mt-1 block text-xs text-neutral-500">取貨時以現金支付即可。</span>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-8 w-full bg-neutral-950 py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-neutral-800 disabled:opacity-60"
              >
                {isSubmitting ? "送出中…" : "下單購買"}
              </button>
              <p className="mt-2 text-center text-[11px] text-neutral-500">
                點一次即可：系統會向後台確認運費並送出訂單。
              </p>
            </div>
          </aside>
        </form>
      </main>

      <CheckoutFooter />
    </div>
  );
};

export default Checkout;
