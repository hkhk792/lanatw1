import { pinkyImportedCatalog } from "@/data/pinkyImportedCatalog";
import { Sp2sGen1PodsCatalog } from "@/lib/responsiveImageVariants.generated";
import { pinkyCatalogPhoto, productPhoto, sp2sUniversalPodHeroPhoto } from "@/lib/productPhotos";

/** 依 productId 的購物車預設主圖（localStorage 舊路徑失效時回退） */
const CART_PRODUCT_IMAGE_BY_ID: Record<string, string> = {
  atomizer: productPhoto("atomizer-host-gemini.webp"),
  bullet: productPhoto("product-3.webp"),
  cartoon: productPhoto("product-12.webp"),
  diya: productPhoto("product-6.webp"),
  "diya-7500": productPhoto("disposable-diya-7500.webp"),
  "diya-pods": productPhoto("product-8.webp"),
  "hebat-gen6": productPhoto("disposable-hebat-hb10000.webp"),
  "jupiter-6500-set": productPhoto("disposable-flare-nimmbox-go.webp"),
  lanna: productPhoto("lana-premium-device.webp"),
  "lana-e-liquid-30ml": productPhoto("showcase-e-liquid.webp"),
  "lana-pods": productPhoto("product-7.webp"),
  "mohoo-tokyo-box": productPhoto("disposable-mohoo-tokyo.webp"),
  "sp2-tokyo-box-pods": pinkyCatalogPhoto("tokyo-magic-box-host"),
  pro: productPhoto("product-4.webp"),
  "sp2s-empty-shell-pro": productPhoto("pro-shell.png"),
  "sp2s-empty-shell-standard": productPhoto("standard-white-core.png"),
  "sp2s-gen1-pods": Sp2sGen1PodsCatalog.src,
  "sp2s-silicone-sleeve": productPhoto("showcase-vape-gear.webp"),
  "sp2s-universal-pods": sp2sUniversalPodHeroPhoto(),
  "venus-host": productPhoto("disposable-vapengin-venus.webp"),
  "vapor-storm-5000": productPhoto("disposable-vapor-storm-cf5000.webp"),
  "vstorm-gen5-pods": productPhoto("showcase-gen5-pods.webp"),
};

for (const item of pinkyImportedCatalog) {
  CART_PRODUCT_IMAGE_BY_ID[item.id] = pinkyCatalogPhoto(item.id);
}
CART_PRODUCT_IMAGE_BY_ID["sp2-tokyo-box-pods"] = pinkyCatalogPhoto("tokyo-magic-box-host");

/** 將各種歷史路徑統一為站內絕對路徑 `/product-photos/...` */
function normalizeProductPhotoPath(imageUrl?: string): string | undefined {
  const raw = imageUrl?.trim();
  if (!raw) return undefined;

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    try {
      const { pathname } = new URL(raw);
      const idx = pathname.indexOf("/product-photos/");
      if (idx >= 0) return pathname.slice(idx);
    } catch {
      return undefined;
    }
    return undefined;
  }

  const idx = raw.indexOf("product-photos/");
  if (idx >= 0) {
    const path = raw.slice(idx);
    return `/${path.replace(/^\/+/, "")}`;
  }

  // Vite 打包的 /assets/*.webp 僅在當次 build 有效，購物車持久化後會 404
  if (raw.includes("/assets/")) return undefined;

  if (raw.startsWith("/") && /\.(webp|png|jpe?g)$/i.test(raw)) return raw;

  return undefined;
}

export function getCartProductImageById(productId: string): string {
  return CART_PRODUCT_IMAGE_BY_ID[productId] ?? "";
}

/** 結帳／購物車展示用：優先保留有效的 product-photos URL，否則依 productId 回退 */
export function resolveCartLineImageUrl(productId: string, imageUrl?: string): string {
  const normalized = normalizeProductPhotoPath(imageUrl);
  if (normalized) return normalized;
  return getCartProductImageById(productId);
}
