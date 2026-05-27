import { SHOP_SITE_URL } from "@/lib/domains";

export const DEFAULT_SITE_TITLE = "SP2S 官方精選";
export const DEFAULT_SITE_DESCRIPTION =
  "SP2S — 新一代風味科技。手工精製設備、陶瓷芯彈匣和訂製配飾。僅限 18 歲以上。";

export type SeoMeta = {
  title: string;
  description: string;
  /** 相对路径，如 /product/lanna */
  path: string;
  ogImage?: string;
  noindex?: boolean;
};

const OG_DEFAULT = `${SHOP_SITE_URL}/huan-taiwan-vape-banner.webp`;

/** 静态路由 SEO（动态 catalog/:id 在页面内自行设置） */
export const STATIC_SEO_ROUTES: Record<string, SeoMeta> = {
  "/": {
    path: "/",
    title: "SP2S — 品味精髓 | 奢華蒸氣工坊",
    description: DEFAULT_SITE_DESCRIPTION,
    ogImage: OG_DEFAULT,
  },
  "/product/lanna": {
    path: "/product/lanna",
    title: "LANA 主機｜SP2S 官方精選",
    description: "LANA 系列主機與規格說明，現貨選購。",
  },
  "/product/bullet": {
    path: "/product/bullet",
    title: "Bullet 系列｜SP2S 官方精選",
    description: "Bullet 系列產品詳情與選購。",
  },
  "/product/pro": {
    path: "/product/pro",
    title: "SP2S Pro｜官方精選",
    description: "SP2S Pro 主機系列。",
  },
  "/product/sp2s-universal-pods": {
    path: "/product/sp2s-universal-pods",
    title: "SP2S 二代通用煙彈｜口味選購",
    description: "SP2S 二代通用煙彈多口味現貨。",
  },
  "/product/sp2s-gen1-pods": {
    path: "/product/sp2s-gen1-pods",
    title: "SP2S 一代煙彈｜口味選購",
    description: "SP2S 一代煙彈系列。",
  },
  "/product/diya": {
    path: "/product/diya",
    title: "DIYA 系列｜SP2S 官方精選",
    description: "DIYA 產品詳情。",
  },
  "/product/diya-7500": {
    path: "/product/diya-7500",
    title: "DIYA 7500 拋棄式｜SP2S 官方精選",
    description: "DIYA 7500 拋棄式電子煙。",
  },
  "/product/lana-pods": {
    path: "/product/lana-pods",
    title: "LANA 煙彈｜口味選購",
    description: "LANA 煙彈口味選購。",
  },
  "/product/mohoo-tokyo-box": {
    path: "/product/mohoo-tokyo-box",
    title: "東京魔盒｜MOHOO BOX",
    description: "MOHOO 東京魔盒系列。",
  },
  "/checkout": {
    path: "/checkout",
    title: "結帳｜SP2S 官方精選",
    description: "確認訂單與配送資訊。",
    noindex: true,
  },
  "/order-complete": {
    path: "/order-complete",
    title: "訂單完成｜SP2S 官方精選",
    description: "感謝您的訂購。",
    noindex: true,
  },
  "/admin2589": {
    path: "/admin2589",
    title: "管理",
    description: "",
    noindex: true,
  },
};

/** 供 build 生成 sitemap.xml */
export const SITEMAP_PATHS: string[] = Object.values(STATIC_SEO_ROUTES)
  .filter((m) => !m.noindex)
  .map((m) => m.path)
  .concat([
    "/product/atomizer",
    "/product/diya-pods",
    "/product/sp2s-empty-shell-standard",
    "/product/sp2s-empty-shell-pro",
    "/product/venus-host",
    "/product/mohoo-tokyo-box-host",
    "/product/hebat-gen6",
    "/product/jupiter-6500",
    "/product/vapor-storm-5000",
    "/product/vapor-storm-gen5-pods",
    "/product/lana-e-liquid-30ml",
    "/product/sp2s-silicone-sleeve",
  ]);

export function getSeoForPath(pathname: string): SeoMeta {
  const base = pathname.split("?")[0] || "/";
  if (STATIC_SEO_ROUTES[base]) return STATIC_SEO_ROUTES[base];
  if (base.startsWith("/product/")) {
    const slug = base.replace("/product/", "");
    return {
      path: base,
      title: `${slug}｜SP2S 官方精選`,
      description: `瀏覽 ${slug} 產品詳情與選購。`,
    };
  }
  if (base.startsWith("/catalog/")) {
    return {
      path: base,
      title: "產品目錄｜SP2S 官方精選",
      description: "匯入產品目錄詳情。",
    };
  }
  return {
    path: base,
    title: DEFAULT_SITE_TITLE,
    description: DEFAULT_SITE_DESCRIPTION,
    ogImage: OG_DEFAULT,
  };
}
