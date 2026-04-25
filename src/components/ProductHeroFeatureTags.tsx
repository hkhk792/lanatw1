import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type ProductHeroFeatureTagsProps = {
  tags: readonly string[];
  className?: string;
};

/**
 * 商品主圖下方的特點標籤列：與首頁一致的 glass + 金線分隔，不遮擋主圖。
 */
export function ProductHeroFeatureTags({ tags, className }: ProductHeroFeatureTagsProps) {
  return (
    <div
      role="list"
      aria-label="商品特點"
      className={cn(
        "mt-4 border-t border-gold/15 pt-4",
        className
      )}
    >
      <p className="mb-3 flex items-center justify-center gap-2 text-[9px] uppercase tracking-luxury text-gold/80">
        <span className="h-px w-6 bg-gold/40" />
        重點規格
        <span className="h-px w-6 bg-gold/40" />
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
        {tags.map((label) => (
          <div
            key={label}
            role="listitem"
            className="glass flex items-center gap-2 rounded-md px-3 py-2 shadow-gold-soft sm:px-3.5 sm:py-2.5"
          >
            <Check className="h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2.5} aria-hidden />
            <span className="text-[11px] font-medium leading-none tracking-wide text-foreground/90 sm:text-xs">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
