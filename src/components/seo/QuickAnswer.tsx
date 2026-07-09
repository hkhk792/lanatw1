import type { QuickAnswer as QuickAnswerType } from "@/lib/content-geo";

type Props = {
  data: QuickAnswerType;
  variant?: "landing" | "product";
};

/** AI 可引用摘要區塊，置於 H1 下方。 */
export function QuickAnswer({ data, variant = "landing" }: Props) {
  const box =
    variant === "product"
      ? "mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5"
      : "mt-6 rounded-2xl border border-gold/30 bg-gradient-to-br from-card/80 to-secondary/40 p-5 sm:p-6";
  const label = variant === "product" ? "text-xs font-semibold text-gray-500" : "text-xs uppercase tracking-[0.2em] text-gold font-semibold";

  return (
    <aside className={box} aria-label="快速解答">
      <p className={`${label} mb-2`}>快速解答</p>
      <h2 className="text-base sm:text-lg font-bold leading-snug text-gray-900">{data.question}</h2>
      <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">{data.answer}</p>
    </aside>
  );
}
