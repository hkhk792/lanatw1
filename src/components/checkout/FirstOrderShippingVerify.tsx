import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { isValidTaiwanMobile } from "@/lib/phoneTaiwan";

type Props = {
  phone: string;
  lineId: string;
  onFirstOrderChange: (isFirstOrder: boolean | null, checking: boolean) => void;
};

/** 首單包郵：依資料庫查詢手機／LINE 是否曾有訂單（無簡訊驗證碼）。 */
const FirstOrderShippingVerify = ({ phone, lineId, onFirstOrderChange }: Props) => {
  const [checking, setChecking] = useState(false);
  const [isFirstOrder, setIsFirstOrder] = useState<boolean | null>(null);

  const phoneOk = isValidTaiwanMobile(phone);
  const lineOk = lineId.trim().replace(/^@+/, "").length >= 2;

  const checkEligibility = useCallback(async () => {
    if (!phoneOk && !lineOk) {
      setIsFirstOrder(null);
      onFirstOrderChange(null, false);
      return;
    }
    setChecking(true);
    onFirstOrderChange(null, true);
    try {
      const res = await fetch("/api/checkout/customer-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, lineId }),
      });
      const data = (await res.json().catch(() => null)) as {
        isFirstOrder?: boolean;
        error?: string;
      } | null;
      if (!res.ok) throw new Error(data?.error || "無法查詢首單資格");
      const next = Boolean(data?.isFirstOrder);
      setIsFirstOrder(next);
      onFirstOrderChange(next, false);
    } catch (e) {
      setIsFirstOrder(null);
      onFirstOrderChange(null, false);
      toast.error(e instanceof Error ? e.message : "查詢失敗");
    } finally {
      setChecking(false);
    }
  }, [lineId, lineOk, onFirstOrderChange, phone, phoneOk]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      void checkEligibility();
    }, 500);
    return () => window.clearTimeout(t);
  }, [checkEligibility]);

  if (!phoneOk && !lineOk) return null;

  return (
    <div className="rounded-md border border-sky-200 bg-sky-50/80 px-4 py-3 text-sm text-sky-950">
      <p className="font-medium">首單不限額包郵</p>
      <p className="mt-1 text-xs leading-relaxed text-sky-900/90">
        系統依您填寫的手機與 LINE ID 比對歷史訂單；若為首次下單且未滿 NT$1,500，運費將自動免除。
      </p>
      {checking && <p className="mt-2 text-xs text-sky-800">正在查詢首單資格…</p>}
      {!checking && isFirstOrder === true && (
        <p className="mt-2 text-xs font-medium text-emerald-800">✓ 符合首單資格，本單可享免運</p>
      )}
      {!checking && isFirstOrder === false && (
        <p className="mt-2 text-xs text-neutral-600">
          此手機或 LINE 已有訂單紀錄；運費依一般規則（滿 NT$1,500 免運，否則 NT$70）。
        </p>
      )}
    </div>
  );
};

export default FirstOrderShippingVerify;
