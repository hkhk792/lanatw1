/** 官方商城（购物承接） */
export const SHOP_SITE_URL = "https://sp2spods.com";

/** 内容 / SEO 站（PodPick Guide） */
export const GUIDE_SITE_URL = "https://podpickguide.com";

export function guideArticleUrl(slug: string): string {
  const path = slug.startsWith("/") ? slug : `/${slug}`;
  return `${GUIDE_SITE_URL}${path}`;
}

/** @deprecated 使用 guideArticleUrl('sp2s-pod-flavor-guide') */
export const GUIDE_SP2S_POD_FLAVOR = guideArticleUrl("sp2s-pod-flavor-guide");
export const GUIDE_DIY_E_LIQUID = guideArticleUrl("diy-e-liquid-guide");
export const GUIDE_AIRPORT_VAPING = guideArticleUrl("airport-vaping-guide");
