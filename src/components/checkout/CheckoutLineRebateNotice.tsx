import { LINE_OFFICIAL_CUSTOMER_URL } from "@/constants/lineOfficial";
import { LINE_REBATE_MIN_SPEND_TWD, LINE_REBATE_VOUCHER_TWD } from "@/lib/checkoutPromos";

type Props = {
  subtotalTwd: number;
};

const CheckoutLineRebateNotice = ({ subtotalTwd }: Props) => {
  const qualified = subtotalTwd >= LINE_REBATE_MIN_SPEND_TWD;
  const minLabel = LINE_REBATE_MIN_SPEND_TWD.toLocaleString("zh-TW");

  return (
    <div className="rounded-md border border-amber-200/90 bg-amber-50/95 px-3 py-3 text-xs text-amber-950">
      <p className="font-semibold tracking-wide">
        滿 {minLabel} 送 {LINE_REBATE_VOUCHER_TWD} · 下次抵扣
      </p>
      <p className="mt-1.5 leading-relaxed text-amber-900/95">
        {qualified ? (
          <>
            本單商品小計已達 NT${minLabel}，完成訂單後請透過{" "}
            <span className="font-medium">LINE 客服</span>領取 NT$
            {LINE_REBATE_VOUCHER_TWD} 現金券，供下次消費抵扣。
          </>
        ) : (
          <>
            單筆訂單商品小計滿 NT${minLabel}，完成訂單後可向{" "}
            <span className="font-medium">LINE 客服</span>領取 NT$
            {LINE_REBATE_VOUCHER_TWD} 現金券，供下次消費抵扣。
          </>
        )}
        現金券於私域 LINE 發放，使用方式與有效期以客服說明為準。
      </p>
      <a
        href={LINE_OFFICIAL_CUSTOMER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-[11px] font-medium text-amber-900 underline underline-offset-2 hover:text-amber-950"
      >
        聯繫 LINE 客服
      </a>
    </div>
  );
};

export default CheckoutLineRebateNotice;
