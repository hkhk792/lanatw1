import type { ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ResponsiveImageSet = {
  readonly src: string;
  readonly srcSet: string;
  readonly width: number;
  readonly height: number;
};

type Props = {
  set: ResponsiveImageSet;
  sizes: string;
  alt: string;
  className?: string;
} & Pick<
  ImgHTMLAttributes<HTMLImageElement>,
  "loading" | "decoding" | "fetchPriority" | "onError" | "aria-hidden"
>;

/** 帶 srcSet / sizes / width / height，利於移動端載入與 CLS */
export function ResponsiveAssetImg({ set, sizes, alt, className, ...rest }: Props) {
  return (
    <img
      src={set.src}
      srcSet={set.srcSet}
      sizes={sizes}
      width={set.width}
      height={set.height}
      alt={alt}
      className={cn(className)}
      {...rest}
    />
  );
}
