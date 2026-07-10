import { useEffect, useMemo, useRef, useState } from "react";
import { fetchShippingQuote, type ShippingQuote } from "@/lib/fetchShippingQuote";
import { isValidTaiwanMobile, normalizeTaiwanMobile } from "@/lib/phoneTaiwan";

type Props = {
  phone: string;
  subtotalTwd: number;
  onQuoteChange: (quote: ShippingQuote | null) => void;
};

type UiStatus = "idle" | "checking" | "first" | "returning" | "error";

/** 手機一輸入完成就向後台取運費報價，畫面金額與後台一致。 */
const FirstOrderShippingVerify = ({ phone, subtotalTwd, onQuoteChange }: Props) => {
  const phoneNorm = normalizeTaiwanMobile(phone);
  const phoneOk = isValidTaiwanMobile(phone);
  const showFormatHint = phone.trim().length > 0 && !phoneOk;
  const [uiStatus, setUiStatus] = useState<UiStatus>("idle");
  const requestIdRef = useRef(0);

  useEffect(() => {
    const requestId = ++requestIdRef.current;

    if (!phoneOk || !phoneNorm) {
      onQuoteChange(null);
      setUiStatus("idle");
      return;
    }

    onQuoteChange(null);
    setUiStatus("checking");

    void fetchShippingQuote(phoneNorm, subtotalTwd, { forceRefresh: true })
      .then((quote) => {
        if (requestId !== requestIdRef.current) return;
        onQuoteChange(quote);
        setUiStatus(quote.isFirstOrder ? "first" : "returning");
      })
      .catch(() => {
        if (requestId !== requestIdRef.current) return;
        onQuoteChange(null);
        setUiStatus("error");
      });

    return () => {
      if (requestId === requestIdRef.current) requestIdRef.current += 1;
    };
  }, [onQuoteChange, phoneNorm, phoneOk, subtotalTwd]);

  const statusLine = useMemo(() => {
    if (showFormatHint) {
      return {
        className: "text-red-600",
        text: "請輸入 10 位台灣手機號碼（09 開頭）",
      };
    }
    if (!phoneOk) return { className: "text-transparent", text: "\u00a0" };
    switch (uiStatus) {
      case "checking":
        return { className: "text-neutral-500", text: "正在向後台確認運費…" };
      case "first":
        return {
          className: "text-emerald-700",
          text: "此手機符合首單超商免運，結帳運費為 NT$0。",
        };
      case "returning":
        return {
          className: "text-neutral-600",
          text: "歡迎回來！您是老顧客，運費 NT$70；滿 NT$1,500 小計即享免運，可直接下單。",
        };
      case "error":
        return {
          className: "text-amber-700",
          text: "暫時無法線上確認運費；下單時會向後台重新計算。",
        };
      default:
        return { className: "text-transparent", text: "\u00a0" };
    }
  }, [phoneOk, showFormatHint, uiStatus]);

  return (
    <div className="min-h-[2.75rem]" aria-live="polite">
      <p className={`text-xs leading-relaxed ${statusLine.className}`}>{statusLine.text}</p>
    </div>
  );
};

export default FirstOrderShippingVerify;
