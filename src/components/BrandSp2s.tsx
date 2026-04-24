import { cn } from "@/lib/utils";

type BrandSp2sProps = {
  className?: string;
};

/**
 * 品牌字「SP2S」：强制 lining figures，使数字 2 与 S、P 同高、同基线。
 */
export function BrandSp2s({ className }: BrandSp2sProps) {
  return (
    <span
      className={cn(
        "inline [font-variant-numeric:lining-nums] [font-feature-settings:'lnum'_1]",
        className
      )}
      aria-label="SP2S"
    >
      SP2S
    </span>
  );
}
