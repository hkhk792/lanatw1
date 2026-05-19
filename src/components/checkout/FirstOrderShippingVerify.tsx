import { useCallback, useEffect } from "react";
import { isValidTaiwanMobile } from "@/lib/phoneTaiwan";

type Props = {
  phone: string;
  onFirstOrderChange: (isFirstOrder: boolean | null, checking: boolean) => void;
};

/** 首單包郵：背景依手機查詢；畫面僅在格式錯誤時提示。 */
const FirstOrderShippingVerify = ({ phone, onFirstOrderChange }: Props) => {
  const phoneOk = isValidTaiwanMobile(phone);
  const showFormatHint = phone.trim().length > 0 && !phoneOk;

  const checkEligibility = useCallback(async () => {
    onFirstOrderChange(null, true);
    try {
      const res = await fetch("/api/checkout/customer-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = (await res.json().catch(() => null)) as {
        isFirstOrder?: boolean;
        error?: string;
      } | null;
      if (!res.ok) throw new Error(data?.error || "無法查詢首單資格");
      onFirstOrderChange(Boolean(data?.isFirstOrder), false);
    } catch {
      onFirstOrderChange(null, false);
    }
  }, [onFirstOrderChange, phone]);

  useEffect(() => {
    if (!phoneOk) {
      onFirstOrderChange(null, false);
      return;
    }
    const t = window.setTimeout(() => {
      void checkEligibility();
    }, 500);
    return () => window.clearTimeout(t);
  }, [checkEligibility, onFirstOrderChange, phoneOk]);

  if (!showFormatHint) return null;

  return <p className="text-xs text-red-600">請輸入 10 位手機號碼</p>;
};

export default FirstOrderShippingVerify;
