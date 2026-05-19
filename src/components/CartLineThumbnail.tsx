import { useEffect, useState } from "react";
import { getCartProductImageById, resolveCartLineImageUrl } from "@/lib/cartProductImages";

type Props = {
  productId: string;
  imageUrl?: string;
  alt: string;
  className?: string;
};

/** 購物車商品縮圖：解析路徑並在載入失敗時回退預設圖 */
const CartLineThumbnail = ({ productId, imageUrl, alt, className }: Props) => {
  const primary = resolveCartLineImageUrl(productId, imageUrl);
  const fallback = getCartProductImageById(productId);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    setUseFallback(false);
  }, [primary, productId]);

  const src = useFallback && fallback ? fallback : primary;

  if (!src) {
    return (
      <div className={`flex h-full w-full items-center justify-center text-xs text-gray-400 ${className ?? ""}`}>
        商品
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (fallback && src !== fallback) setUseFallback(true);
      }}
    />
  );
};

export default CartLineThumbnail;
