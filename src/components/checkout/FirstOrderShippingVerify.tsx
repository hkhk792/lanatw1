import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchFirstOrderStatus } from "@/lib/fetchFirstOrderStatus";
import { isValidTaiwanMobile, normalizeTaiwanMobile } from "@/lib/phoneTaiwan";

type Props = {
  phone: string;
  onFirstOrderChange: (isFirstOrder: boolean | null) => void;
  onCheckingChange: (checking: boolean) => void;
};

type UiStatus = "idle" | "checking" | "first" | "returning" | "error";

/** 手機號碼一輸入完成即查首單；不阻擋老客下單（僅影響運費顯示）。 */
const FirstOrderShippingVerify = ({
  phone,
  onFirstOrderChange,
  onCheckingChange,
}: Props) => {
  const phoneNorm = normalizeTaiwanMobile(phone);
  const phoneOk = isValidTaiwanMobile(phone);
  const showFormatHint = phone.trim().length > 0 && !phoneOk;
  const [uiStatus, setUiStatus] = useState<UiStatus>("idle");
  const requestIdRef = useRef(0);
  const lastResolvedPhoneRef = useRef("");

  const runCheck = useCallback(async () => {
    if (!phoneOk || !phoneNorm) return;

    const requestId = ++requestIdRef.current;
    onCheckingChange(true);
    setUiStatus("checking");

    try {
      const isFirst = await fetchFirstOrderStatus(phone);
      if (requestId !== requestIdRef.current) return;
      onFirstOrderChange(isFirst);
      onCheckingChange(false);
      setUiStatus(isFirst ? "first" : "returning");
      lastResolvedPhoneRef.current = phoneNorm;
    } catch {
      if (requestId !== requestIdRef.current) return;
      onFirstOrderChange(null);
      onCheckingChange(false);
      setUiStatus("error");
    }
  }, [onCheckingChange, onFirstOrderChange, phoneNorm, phoneOk]);

  useEffect(() => {
    if (!phoneOk) {
      lastResolvedPhoneRef.current = "";
      onFirstOrderChange(null);
      onCheckingChange(false);
      setUiStatus("idle");
      return;
    }

    if (phoneNorm === lastResolvedPhoneRef.current) return;

    void runCheck();
  }, [onCheckingChange, onFirstOrderChange, phoneNorm, phoneOk, runCheck]);

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
