import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { requestHomeScrollRestore } from "@/lib/homeScrollRestore";
import {
  buy10Get1PoolSummaries,
  buildCheckoutOrderItems,
  isBuy10GiftProductId,
} from "@/lib/cartBuy10Get1";
import {
  FREE_SHIPPING_THRESHOLD_TWD,
  resolveShippingTwd,
} from "@/lib/checkoutShipping";
import { isValidTaiwanMobile, normalizeTaiwanMobile } from "@/lib/phoneTaiwan";
import FirstOrderShippingVerify from "@/components/checkout/FirstOrderShippingVerify";
import CheckoutLineRebateNotice from "@/components/checkout/CheckoutLineRebateNotice";
import { CheckoutFooter, CheckoutProgress } from "@/components/checkout/CheckoutChrome";

const formatTwd = (n: number) => `NT$${n.toLocaleString("zh-TW")}`;

const fieldClass =
  "rounded-sm border border-neutral-900 bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:border-neutral-900 focus-visible:ring-neutral-900";

const Checkout = () => {
  const navigate = useNavigate();
  const { lines, clearCart } = useCart();

  const orderItems = useMemo(() => buildCheckoutOrderItems(lines), [lines]);
  const subtotalTwd = useMemo(
    () => orderItems.reduce((s, it) => s + it.lineTotalTwd, 0),
    [orderItems]
  );
  const buy10Summaries = useMemo(() => buy10Get1PoolSummaries(lines), [lines]);
  const [isFirstOrder, setIsFirstOrder] = useState<boolean | null>(null);
  const [firstOrderChecking, setFirstOrderChecking] = useState(false);

  const promoLabel = (productId: string) => {
    if (productId === "sp2s-universal-pods") return "SP2S 煙彈";
    if (productId === "lana-pods") return "LANA 煙彈";
    return productId;
  };

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

  const firstOrderFreeShipping = isFirstOrder === true;
  const shippingTwd = useMemo(
    () => resolveShippingTwd(subtotalTwd, firstOrderFreeShipping),
    [subtotalTwd, firstOrderFreeShipping]
  );
  const totalTwd = subtotalTwd + shippingTwd;

  const handleFirstOrderChange = (next: boolean | null, checking: boolean) => {
    setIsFirstOrder(next);
    setFirstOrderChecking(checking);
  };

  useEffect(() => {
    if (lines.length === 0) {
      requestHomeScrollRestore();
      navigate("/", { replace: true });
      toast.message("購物車是空的", { description: "請先加入商品後再結帳。" });
    }
  }, [lines.length, navigate]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const addressOk = Boolean(shippingAddress.trim());
    const storeOk = Boolean(pickupStoreCode.trim());
    if (!name.trim() || !phone.trim() || !addressOk || !storeOk || !lineId.trim()) {
      toast.error("請填寫必填欄位", {
        description:
          "姓名、手機號碼、收貨地址、收貨門市號與 LINE ID 皆為必填。",
      });
      return;
    }

    if (firstOrderChecking) {
      toast.error("正在確認首單資格", { description: "請稍候再送出訂單。" });
      return;
    }

    if (
      shippingTwd === 0 &&
      subtotalTwd < FREE_SHIPPING_THRESHOLD_TWD &&
      !firstOrderFreeShipping
    ) {
      toast.error("運費不符合活動", {
        description: "首單包郵僅限首次下單；否則小計須滿 NT$1,500 才免運。",
      });
      return;
    }

    if (!isValidTaiwanMobile(phone)) {
      toast.error("請輸入有效的台灣手機號碼");
      return;
    }

    const payload = {
      country: country.trim() || "台灣",
      paymentMethod: payment,
      customerName: name.trim(),
      phone: normalizeTaiwanMobile(phone) || phone.trim(),
      shippingAddress: shippingAddress.trim(),
      pickupStoreCode: pickupStoreCode.trim(),
      lineId: lineId.trim(),
      notes: notes.trim(),
      subtotalTwd,
      shippingTwd,
      totalTwd,
      ...(firstOrderFreeShipping ? { firstOrderFreeShipping: true } : {}),
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

    try {
      setIsSubmitting(true);
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
        | { error?: string; orderNumber?: string; batchDate?: string }
        | null;

      if (!response.ok) {
        throw new Error(data?.error || "下單失敗，請稍後再試。");
      }

      clearCart();
      const orderHint = data?.orderNumber ? `訂單編號 ${data.orderNumber} · ` : "";
      const batchHint = data?.batchDate ? `截單批次 ${data.batchDate} · ` : "";
      toast.success("訂單已送出", {
        description: `${orderHint}${batchHint}合計 ${formatTwd(totalTwd)} · 貨到付款`,
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
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <Label htmlFor="shippingAddress" className="text-neutral-800">
                    收貨地址 <span className="text-red-600">*</span>
                  </Label>
                  <a
                    href="https://www.7-11.com.tw/service/store"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-neutral-600 underline underline-offset-2 hover:text-neutral-900"
                  >
                    查詢店號地圖
                  </a>
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
                  超商取貨（7-11／全家）可填店名與路段，店號請填於下方「收貨門市號」。宅配請於本欄寫明完整地址；宅配運費為超商取貨運費之二倍。
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
                  LINE ID <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="lineId"
                  value={lineId}
                  onChange={(e) => setLineId(e.target.value)}
                  className={fieldClass}
                  placeholder="您的 LINE ID（不含 @）"
                  required
                  autoComplete="username"
                />
              </div>

              <FirstOrderShippingVerify
                phone={phone}
                lineId={lineId}
                onFirstOrderChange={handleFirstOrderChange}
              />

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
                {orderItems.map((it) => {
                  const isGift = isBuy10GiftProductId(it.productId);
                  return (
                    <div
                      key={`${it.productId}-${it.variant}`}
                      className={`flex gap-3 text-sm ${isGift ? "rounded-md border border-emerald-200 bg-emerald-50/70 px-2 py-2" : ""}`}
                    >
                      <div className="h-14 w-14 shrink-0 border border-neutral-200 bg-white">
                        {it.imageUrl ? (
                          <img src={it.imageUrl} alt="" className="h-full w-full object-contain" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] text-neutral-400">
                            商品
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium leading-snug text-neutral-900">
                          {isGift ? "贈品 · " : ""}
                          {it.productModel}
                        </p>
                        <p className="mt-0.5 text-xs text-neutral-500">
                          【{it.variant}】× {it.quantity}
                        </p>
                      </div>
                      <p className="shrink-0 font-medium text-neutral-900">{formatTwd(it.lineTotalTwd)}</p>
                    </div>
                  );
                })}
              </div>

              <dl className="mt-6 space-y-3 text-sm">
                {buy10Summaries.length > 0 && (
                  <div className="rounded-md border border-emerald-200 bg-emerald-50/90 px-3 py-2 text-xs text-emerald-950">
                    <ul className="space-y-1">
                      {buy10Summaries.map((s) => (
                        <li key={s.productId}>
                          買十送一（{promoLabel(s.productId)}）：付費 {s.paidQty} 顆，贈 {s.giftUnits} 顆，共{" "}
                          {s.totalPieces} 顆到手
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <dt>小計</dt>
                  <dd className="font-medium text-neutral-900">{formatTwd(subtotalTwd)}</dd>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <dt>
                    {firstOrderFreeShipping
                      ? "超商取貨（首單包郵）"
                      : `超商取貨（滿 ${FREE_SHIPPING_THRESHOLD_TWD.toLocaleString("zh-TW")} 免運）`}
                  </dt>
                  <dd className="font-medium text-neutral-900">
                    {shippingTwd === 0 ? "免運" : formatTwd(shippingTwd)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-neutral-200 pt-4 text-base font-semibold text-neutral-900">
                  <dt>合計</dt>
                  <dd>{formatTwd(totalTwd)}</dd>
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
                className="mt-8 w-full bg-neutral-950 py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-neutral-800"
              >
                {isSubmitting ? "送出中..." : "下單購買"}
              </button>
            </div>
          </aside>
        </form>
      </main>

      <CheckoutFooter />
    </div>
  );
};

export default Checkout;
