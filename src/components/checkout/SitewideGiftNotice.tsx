import type { CartLine } from "@/contexts/CartContext";
import { LINE_OFFICIAL_CUSTOMER_URL } from "@/constants/lineOfficial";
import {
  SITEWIDE_GIFT_THRESHOLD,
  sitewideGiftEligibility,
} from "@/lib/cartSitewideGift";

type Props = {
  lines: readonly CartLine[];
  /** 緊湊版（購物車浮層）：縮小間距與字級 */
  compact?: boolean;
  className?: string;
};

const SitewideGiftNotice = ({ lines, compact = false, className }: Props) => {
  const { paidQty, eligibleGifts, qtyToNextGift } = sitewideGiftEligibility(lines);
  if (paidQty <= 0) return null;

  const qualified = eligibleGifts > 0;

  const containerBase = qualified
    ? "rounded-md border border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100/70 text-amber-950"
    : "rounded-md border border-neutral-200 bg-neutral-50 text-neutral-700";
  const padding = compact ? "px-3 py-2.5" : "px-3 py-3";
  const titleSize = compact ? "text-[12px]" : "text-xs";

  const headline = qualified
    ? `已達門檻 · 可領 ${eligibleGifts} 份贈品`
    : `全場買 ${SITEWIDE_GIFT_THRESHOLD} 送 1`;

  return (
    <div className={`${containerBase} ${padding} ${className ?? ""}`}>
      <p className={`font-semibold tracking-wide ${titleSize}`}>{headline}</p>
      <p
        className={`mt-1 leading-relaxed ${
          compact ? "text-[11px]" : "text-xs"
        } ${qualified ? "text-amber-900/95" : "text-neutral-600"}`}
      >
        {qualified ? (
          <>
            目前購物車共 <span className="font-medium">{paidQty}</span> 件，
            訂單完成後請透過 <span className="font-medium">LINE 客服</span>{" "}
            提供訂單編號，自選 {eligibleGifts} 份贈品（贈品庫存／口味以客服公告為準）。
            {qtyToNextGift > 0 ? (
              <>
                {" "}再加購 <span className="font-medium">{qtyToNextGift}</span> 件可再領 1 份。
              </>
            ) : null}
          </>
        ) : (
          <>
            單筆訂單付費件數每湊滿 {SITEWIDE_GIFT_THRESHOLD} 件，
            完成下單後可向 <span className="font-medium">LINE 客服</span> 自選 1 份贈品。
            目前 <span className="font-medium">{paidQty}</span> 件，再加購{" "}
            <span className="font-medium">{qtyToNextGift}</span> 件即可領取。
          </>
        )}
      </p>
      {qualified ? (
        <a
          href={LINE_OFFICIAL_CUSTOMER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-2 inline-flex items-center gap-1.5 rounded-md border border-amber-400 bg-white px-2.5 py-1 font-medium text-amber-900 underline-offset-2 transition-colors hover:bg-amber-50 ${
            compact ? "text-[11px]" : "text-xs"
          }`}
        >
          聯繫 LINE 客服領取
        </a>
      ) : (
        <a
          href={LINE_OFFICIAL_CUSTOMER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-2 inline-block font-medium text-neutral-700 underline underline-offset-2 hover:text-neutral-900 ${
            compact ? "text-[11px]" : "text-xs"
          }`}
        >
          活動詳情聯繫 LINE 客服
        </a>
      )}
    </div>
  );
};

export default SitewideGiftNotice;
