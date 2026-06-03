import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getCachedFirstOrderStatus,
  setCachedFirstOrderStatus,
} from "@/lib/firstOrderStatusCache";
import { isValidTaiwanMobile, normalizeTaiwanMobile } from "@/lib/phoneTaiwan";

type Props = {
  phone: string;
  onFirstOrderChange: (isFirstOrder: boolean | null) => void;
  onCheckingChange: (checking: boolean) => void;
};

type UiStatus = "idle" | "checking" | "first" | "returning" | "error";

/** 手機輸滿即查；提示區固定高度，查詢時不重置父層首單狀態以免右側運費跳動 */
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

  const checkEligibility = useCallback(async () => {
    if (!phoneOk || !phoneNorm) return;

    const cached = getCachedFirstOrderStatus(phoneNorm);
    if (cached !== null) {
      onFirstOrderChange(cached);
      onCheckingChange(false);
      setUiStatus(cached ? "first" : "returning");
      lastResolvedPhoneRef.current = phoneNorm;
      return;
    }

    const requestId = ++requestIdRef.current;
    onCheckingChange(true);
    setUiStatus("checking");

    try {
      const res = await fetch("/api/checkout/customer-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNorm }),
      });
      const data = (await res.json().catch(() => null)) as {
        isFirstOrder?: boolean;
        error?: string;
      } | null;
      if (requestId !== requestIdRef.current) return;
      if (!res.ok) throw new Error(data?.error || "無法查詢首單資格");

      const isFirst = Boolean(data?.isFirstOrder);
      setCachedFirstOrderStatus(phoneNorm, isFirst);
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

    if (phoneNorm !== lastResolvedPhoneRef.current) {
      onFirstOrderChange(null);
      setUiStatus("idle");
    }

    const cached = getCachedFirstOrderStatus(phoneNorm);
    if (cached !== null) {
      onFirstOrderChange(cached);
      onCheckingChange(false);
      setUiStatus(cached ? "first" : "returning");
      lastResolvedPhoneRef.current = phoneNorm;
      return;
    }

    const t = window.setTimeout(() => {
      void checkEligibility();
    }, 200);
    return () => window.clearTimeout(t);
  }, [
    checkEligibility,
    onCheckingChange,
    onFirstOrderChange,
    phoneNorm,
    phoneOk,
  ]);

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
          text: "此手機曾有訂單紀錄，不適用首單免運；滿 NT$1,500 小計即可免運。",
        };
      case "error":
        return {
          className: "text-amber-700",
          text: "暫時無法線上確認首單資格，送出訂單時會再次驗證。",
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
