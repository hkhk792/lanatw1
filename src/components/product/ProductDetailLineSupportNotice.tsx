import { LINE_CUSTOMER_ID, LINE_CUSTOMER_SHOPPING_REMINDER, LINE_OFFICIAL_CUSTOMER_URL } from "@/constants/lineOfficial";
import { cn } from "@/lib/utils";

type ProductDetailLineSupportNoticeProps = {
  className?: string;
};

/** 商品詳情頁共用：購物／下單前請添加客服 LINE */
export function ProductDetailLineSupportNotice({ className }: ProductDetailLineSupportNoticeProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-amber-200/90 bg-amber-50/90 px-4 py-3 text-sm leading-relaxed text-gray-800",
        className
      )}
      role="note"
    >
      <p>{LINE_CUSTOMER_SHOPPING_REMINDER}</p>
      <p className="mt-2 text-gray-600">
        亦可
        <a
          href={LINE_OFFICIAL_CUSTOMER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-1 font-medium text-green-700 underline-offset-2 hover:underline"
        >
          點此開啟 LINE 客服
        </a>
        （ID：
        <span className="select-all font-mono font-semibold text-gray-900">{LINE_CUSTOMER_ID}</span>）
      </p>
    </div>
  );
}
