/** 全站商品主圖統一目錄：`public/product-photos/`（扁平，不再分 pinky-imported / sp2s-universal-pods 等） */
const BASE = `${import.meta.env.BASE_URL}product-photos/`;

export function productPhoto(file: string): string {
  return `${BASE}${file}`;
}

export function pinkyCatalogPhoto(id: string): string {
  return productPhoto(`${id}.jpg`);
}

export function sp2sUniversalPodPhoto(index: number): string {
  const n = Math.min(32, Math.max(1, index));
  return productPhoto(`sp2s-pod-${String(n).padStart(2, "0")}.webp`);
}

export function sp2sUniversalPodHeroPhoto(): string {
  return productPhoto("sp2s-pod-hero.png");
}

/** 站內 Logo／浮水印（多數詳情頁共用） */
export const SITE_LOGO_PHOTO = productPhoto("product-14.jpg");
