import { useCallback, useEffect, useRef, useState } from "react";
import {
  getCachedFirstOrderStatus,
  setCachedFirstOrderStatus,
} from "@/lib/firstOrderStatusCache";
import { isValidTaiwanMobile, normalizeTaiwanMobile } from "@/lib/phoneTaiwan";

type Props = {
  phone: string;
  onFirstOrderChange: (isFirstOrder: boolean | null, checking: boolean) => void;
};

type UiStatus = "idle" | "checking" | "first" | "returning" | "error";

/** 首單包郵：依手機查詢（含快取、可取消重複請求） */
const FirstOrderShippingVerify = ({ phone, onFirstOrderChange }: Props) => {
  const phoneNorm = normalizeTaiwanMobile(phone);
  const phoneOk = isValidTaiwanMobile(phone);
  const showFormatHint = phone.trim().length > 0 && !phoneOk;
  const [uiStatus, setUiStatus] = useState<UiStatus>("idle");
  const requestIdRef = useRef(0);

  const checkEligibility = useCallback(async () => {
    if (!phoneOk || !phoneNorm) return;

    const cached = getCachedFirstOrderStatus(phoneNorm);
    if (cached !== null) {
      onFirstOrderChange(cached, false);
      setUiStatus(cached ? "first" : "returning");
      return;
    }

    const requestId = ++requestIdRef.current;
    onFirstOrderChange(null, true);
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
      onFirstOrderChange(isFirst, false);
      setUiStatus(isFirst ? "first" : "returning");
    } catch {
      if (requestId !== requestIdRef.current) return;
      onFirstOrderChange(null, false);
      setUiStatus("error");
    }
  }, [onFirstOrderChange, phoneNorm, phoneOk]);

  useEffect(() => {
    if (!phoneOk) {
      onFirstOrderChange(null, false);
      setUiStatus("idle");
      return;
    }
    const t = window.setTimeout(() => {
      void checkEligibility();
    }, 400);
    return () => window.clearTimeout(t);
  }, [checkEligibility, onFirstOrderChange, phoneOk, phoneNorm]);

  return (
    <>
      {showFormatHint ? (
        <p className="text-xs text-red-600">請輸入 10 位台灣手機號碼（09 開頭）</p>
      ) : null}
      {phoneOk && uiStatus === "checking" ? (
        <p className="text-xs text-neutral-500">正在確認首單免運資格…</p>
      ) : null}
      {phoneOk && uiStatus === "first" ? (
        <p className="text-xs text-emerald-700">
          此手機符合<strong>首單超商免運</strong>，結帳運費為 NT$0。
        </p>
      ) : null}
      {phoneOk && uiStatus === "returning" ? (
        <p className="text-xs text-neutral-600">
          此手機曾有訂單紀錄，不適用首單免運；滿 NT$1,500 小計即可免運。
        </p>
      ) : null}
      {phoneOk && uiStatus === "error" ? (
        <p className="text-xs text-amber-700">
          暫時無法線上確認首單資格，送出訂單時會再次驗證。
        </p>
      ) : null}
    </>
  );
};

export default FirstOrderShippingVerify;
