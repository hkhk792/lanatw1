import { Star } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  aggregateShowcaseReviews,
  getShowcaseReviewsForPath,
} from "@/data/productShowcaseReviews";

/** 商品頁顧客評價（展示 + schema 資料來源）。 */
export function ProductShowcaseReviews({ variant = "product" }: { variant?: "landing" | "product" }) {
  const { pathname } = useLocation();
  const reviews = getShowcaseReviewsForPath(pathname);
  if (reviews.length === 0) return null;

  const { average, count } = aggregateShowcaseReviews(reviews);
  const box =
    variant === "product"
      ? "mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5"
      : "mt-8 rounded-2xl border border-gold/20 bg-card/40 p-5 sm:p-6";

  return (
    <section className={box} aria-labelledby="product-reviews-heading">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <h2 id="product-reviews-heading" className="text-lg font-bold">
          顧客評價
        </h2>
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          {average} / 5（{count} 則）
        </span>
      </div>
      <ul className="space-y-4">
        {reviews.map((r) => (
          <li key={r.id} className="rounded-lg border border-gray-200/80 bg-white p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-sm font-medium">{r.author}</span>
              <span className="text-xs text-muted-foreground">{r.createdAt}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{r.body}</p>
            {r.verified ? (
              <p className="text-xs text-green-700 mt-2">已驗證購買</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
