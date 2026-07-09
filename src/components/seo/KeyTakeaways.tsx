import { Check } from "lucide-react";

type Props = {
  items: string[];
  variant?: "landing" | "product";
};

/** 重點摘要，利於 AI 搜尋擷取。 */
export function KeyTakeaways({ items, variant = "landing" }: Props) {
  if (items.length === 0) return null;

  const box =
    variant === "product"
      ? "rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
      : "rounded-2xl border border-gold/25 bg-card/60 p-5 sm:p-6";

  return (
    <aside className={box} aria-label="重點摘要">
      <h2 className="text-lg sm:text-xl font-bold mb-4">重點摘要</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm sm:text-base text-muted-foreground">
            <Check className="w-4 h-4 mt-1 text-primary shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
