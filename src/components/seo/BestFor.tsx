import { Check, X } from "lucide-react";

type Props = {
  bestFor: string[];
  avoidFor?: string[];
  variant?: "landing" | "product";
};

/** 適合／不適合對象，利於 AI 搜尋與選購決策。 */
export function BestFor({ bestFor, avoidFor = [], variant = "landing" }: Props) {
  if (bestFor.length === 0 && avoidFor.length === 0) return null;

  const box =
    variant === "product"
      ? "rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
      : "rounded-2xl border border-gold/25 bg-card/60 p-5 sm:p-6";
  const boxMuted =
    variant === "product"
      ? "rounded-xl border border-gray-100 bg-gray-50 p-4 sm:p-5"
      : "rounded-2xl border border-gold/20 bg-card/40 p-5 sm:p-6";

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {bestFor.length > 0 ? (
        <aside className={box} aria-label="適合對象">
          <h2 className="text-lg sm:text-xl font-bold mb-4">適合誰</h2>
          <ul className="space-y-2">
            {bestFor.map((item) => (
              <li key={item} className="flex gap-2 text-sm sm:text-base text-muted-foreground">
                <Check className="w-4 h-4 mt-1 text-primary shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
      {avoidFor.length > 0 ? (
        <aside className={boxMuted} aria-label="不適合對象">
          <h2 className="text-lg sm:text-xl font-bold mb-4">不建議</h2>
          <ul className="space-y-2">
            {avoidFor.map((item) => (
              <li key={item} className="flex gap-2 text-sm sm:text-base text-muted-foreground">
                <X className="w-4 h-4 mt-1 text-primary shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </div>
  );
}
