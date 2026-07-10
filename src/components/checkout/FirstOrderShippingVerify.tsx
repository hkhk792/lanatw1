import { useEffect, useMemo, useRef, useState } from "react";
import { fetchFirstOrderStatus } from "@/lib/fetchFirstOrderStatus";
import { isValidTaiwanMobile, normalizeTaiwanMobile } from "@/lib/phoneTaiwan";

type Props = {
  phone: string;
  onFirstOrderChange: (isFirstOrder: boolean | null) => void;
};

type UiStatus = "idle" | "checking" | "first" | "returning" | "error";

/** 手機號碼一輸入完成即查首單；不阻擋老客下單（僅影響運費顯示）。 */
const FirstOrderShippingVerify = ({
  phone,
  onFirstOrderChange,
}: Props) => {
  const phoneNorm = normalizeTaiwanMobile(phone);
  const phoneOk = isValidTaiwanMobile(phone);
  const showFormatHint = phone.trim().length > 0 && !phoneOk;
  const [uiStatus, setUiStatus] = useState<UiStatus>("idle");
  const requestIdRef = useRef(0);

  useEffect(() => {
    const requestId = ++requestIdRef.current;

    if (!phoneOk || !phoneNorm) {
      onFirstOrderChange(null);
      setUiStatus("idle");
      return;
    }

    // 手機一變更就清除上一支手機的資格，避免查詢期間沿用舊的免運結果。
    onFirstOrderChange(null);
    setUiStatus("checking");

    void fetchFirstOrderStatus(phoneNorm, { forceRefresh: true })
      .then((isFirst) => {
        if (requestId !== requestIdRef.current) return;
        onFirstOrderChange(isFirst);
        setUiStatus(isFirst ? "first" : "returning");
      })
      .catch(() => {
        if (requestId !== requestIdRef.current) return;
        onFirstOrderChange(null);
        setUiStatus("error");
      });

    return () => {
      if (requestId === requestIdRef.current) requestIdRef.current += 1;
    };
  }, [onFirstOrderChange, phoneNorm, phoneOk]);

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
        return { className: "text-neutral-500", text: "正在確認首單免運資格…" };
      case "first":
        return {
          className: "text-emerald-700",
          text: "此手機符合首單超商免運，結帳運費為 NT$0。",
        };
      case "returning":
        return {
          className: "text-neutral-600",
          text: "此手機曾有訂單紀錄：運費 NT$70，滿 NT$1,500 小計免運，可直接下單。",
        };
      case "error":
        return {
          className: "text-amber-700",
          text: "暫時無法線上確認首單資格；下單時會自動再查一次。",
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
