import {
  findPinkyCatalogItemById,
  getPinkyImportedCatalogImage,
  pinkyImportedCatalog,
} from "@/data/pinkyImportedCatalog";
import { SHOP_SITE_URL } from "@/lib/domains";
import {
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_TITLE,
  SHOP_OG_DEFAULT,
  SITE_HOME_DESCRIPTION,
  SITE_HOME_TITLE,
} from "@/lib/siteConfig";

export { DEFAULT_SITE_DESCRIPTION, DEFAULT_SITE_TITLE };

export type SeoMeta = {
  title: string;
  description: string;
  /** 相对路径，如 /product/lanna */
  path: string;
  ogImage?: string;
  noindex?: boolean;
  /** 供 JSON-LD Product 使用 */
  productName?: string;
};

export type ProductStructuredDataMeta = {
  name: string;
  priceTwd: number;
  image?: string;
};

const OG_DEFAULT = SHOP_OG_DEFAULT;

function absoluteShopAssetUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SHOP_SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** 静态路由 SEO */
const PRODUCT_STRUCTURED_DATA_BY_PATH: Record<string, ProductStructuredDataMeta> = {
  "/product/atomizer": { name: "原子棒一代通配主機", priceTwd: 290 },
  "/product/bullet": { name: "SP2S 思博瑞 一代", priceTwd: 450 },
  "/product/diya": { name: "DIYA 叮啞霧化桿", priceTwd: 320 },
  "/product/diya-7500": { name: "DIYA 叮啞拋棄式 7500 口", priceTwd: 240 },
  "/product/diya-pods": { name: "DIYA 叮啞通用煙彈", priceTwd: 220 },
  "/product/hebat-gen6": { name: "HEBAT 喜貝六代", priceTwd: 650 },
  "/product/jupiter-6500": { name: "JUPITER 木星 6500 套裝", priceTwd: 269 },
  "/product/lana-e-liquid-30ml": { name: "LANA 小蠻腰煙油 30ml", priceTwd: 350 },
  "/product/lana-pods": { name: "LANA 小蠻腰煙彈", priceTwd: 220 },
  "/product/lanna": { name: "LANA 主機", priceTwd: 500 },
  "/product/mohoo-tokyo-box": { name: "MOHOO 東京魔盒", priceTwd: 399 },
  "/product/mohoo-tokyo-box-host": { name: "MOHOO 東京魔盒主機", priceTwd: 350 },
  "/product/pro": { name: "SP2S Pro", priceTwd: 450 },
  "/product/sp2s-empty-shell-pro": { name: "SP2S Pro 版空殼", priceTwd: 35 },
  "/product/sp2s-empty-shell-standard": { name: "SP2S 一般版空殼", priceTwd: 35 },
  "/product/sp2s-gen1-pods": { name: "SP2S 一代煙彈", priceTwd: 220 },
  "/product/sp2s-silicone-sleeve": { name: "SP2S 矽膠保護套", priceTwd: 120 },
  "/product/sp2s-universal-pods": { name: "SP2S 二代通用煙彈", priceTwd: 280 },
  "/product/vapor-storm-5000": { name: "VAPOR STORM 5000 口", priceTwd: 229 },
  "/product/vapor-storm-gen5-pods": { name: "VAPOR STORM 五代煙彈", priceTwd: 129 },
  "/product/venus-host": { name: "VENUS 金星主機", priceTwd: 219 },
};

export const STATIC_SEO_ROUTES: Record<string, SeoMeta> = {
  "/": {
    path: "/",
    title: SITE_HOME_TITLE,
    description: SITE_HOME_DESCRIPTION,
    ogImage: OG_DEFAULT,
  },
  "/product/lanna": {
    path: "/product/lanna",
    title: "LANA 皮革主機｜一代通配電子煙主機",
    description: "LANA 皮革主機一代通配，多色可選。現貨配送，SP2S 官方商城。",
    productName: "LANA 皮革主機",
  },
  "/product/bullet": {
    path: "/product/bullet",
    title: "SP2S 一代主機｜思博瑞電子煙主機現貨",
    description: "SP2S 一代通用主機，兼容 SP2S 煙彈。陶瓷霧化、現貨選購。",
    productName: "SP2S 一代通用主機",
  },
  "/product/pro": {
    path: "/product/pro",
    title: "SP2S Pro 二代主機｜旗艦電子煙主機",
    description: "SP2S Pro 二代旗艦主機，智慧感應、LED 炫彩。官方現貨。",
    productName: "SP2S Pro 二代主機",
  },
  "/product/atomizer": {
    path: "/product/atomizer",
    title: "原子棒主機｜可調功率一代通配",
    description: "原子棒一代通配主機，可調功率、曲線輸出。SP2S 官方商城現貨。",
    productName: "原子棒主機",
  },
  "/product/sp2s-universal-pods": {
    path: "/product/sp2s-universal-pods",
    title: "SP2S 煙彈｜二代通用菸彈 32 口味",
    description: "SP2S 煙彈（思博瑞）二代通用菸彈，32 口味現貨。一代主機通用，官方選購。",
    productName: "SP2S 煙彈（一代通用）",
  },
  "/product/sp2s-gen1-pods": {
    path: "/product/sp2s-gen1-pods",
    title: "SP2S 一代煙彈｜思博瑞菸彈口味選購",
    description: "SP2S 一代通用煙彈，多口味現貨。思博瑞官方菸彈系列。",
    productName: "SP2S 一代通用煙彈",
  },
  "/product/diya": {
    path: "/product/diya",
    title: "DIYA 叮啞霧化桿｜一代通用主機",
    description: "DIYA 叮啞霧化桿 2.5ml 大容量，一代通用。SP2S 官方商城。",
    productName: "DIYA 叮啞霧化桿",
  },
  "/product/diya-pods": {
    path: "/product/diya-pods",
    title: "DIYA 煙彈｜叮啞電子煙彈一盒三入",
    description: "DIYA 叮啞電子煙彈，一盒三入，通用一代主機。多口味現貨。",
    productName: "DIYA 煙彈",
  },
  "/product/diya-7500": {
    path: "/product/diya-7500",
    title: "DIYA 7500 拋棄式｜大容量一次性電子煙",
    description: "DIYA 叮啞 7500 口拋棄式電子煙，可充電大容量。台灣現貨。",
    productName: "DIYA 7500 拋棄式",
  },
  "/product/lana-pods": {
    path: "/product/lana-pods",
    title: "LANA 煙彈｜拉娜菸彈 3 顆裝",
    description: "LANA 煙彈 3 顆裝，一代通配主機。多口味現貨選購。",
    productName: "LANA 煙彈",
  },
  "/product/lana-e-liquid-30ml": {
    path: "/product/lana-e-liquid-30ml",
    title: "LANA 煙油 30ml｜拉娜小瓶裝煙油",
    description: "拉娜 LANA 煙油 30ml 小瓶裝，多口味。SP2S 官方商城。",
    productName: "LANA 煙油 30ml",
  },
  "/product/mohoo-tokyo-box": {
    path: "/product/mohoo-tokyo-box",
    title: "東京魔盒煙彈｜MOHOO BOX 多口味",
    description: "TOKYO MOHOO BOX 東京魔盒煙彈，多種口味台灣現貨。",
    productName: "東京魔盒煙彈",
  },
  "/product/mohoo-tokyo-box-host": {
    path: "/product/mohoo-tokyo-box-host",
    title: "東京魔盒主機｜MOHOO BOX 14 色可選",
    description: "東京魔盒主機 MOHOO BOX，500mAh 鋁合金，14 色可選。現貨。",
    productName: "東京魔盒主機",
  },
  "/product/venus-host": {
    path: "/product/venus-host",
    title: "VENUS 金星主機｜VAPENGIN 可充電主機",
    description: "VENUS 金星主機可充電霧化電子煙，台灣現貨。SP2S 官方商城。",
    productName: "VENUS 金星主機",
  },
  "/product/hebat-gen6": {
    path: "/product/hebat-gen6",
    title: "HEBAT 喜貝六代｜10000 口拋棄式電子煙",
    description: "HEBAT 喜貝六代 10000 口拋棄式一次性電子煙，15ml 台灣現貨。",
    productName: "HEBAT 喜貝六代",
  },
  "/product/jupiter-6500": {
    path: "/product/jupiter-6500",
    title: "JUPITER 木星 6500 口｜換彈拋棄式套裝",
    description: "JUPITER 木星 6500 口換彈拋棄式電子煙套裝，台灣現貨。",
    productName: "JUPITER 木星套裝",
  },
  "/product/vapor-storm-5000": {
    path: "/product/vapor-storm-5000",
    title: "VAPOR STORM 5000 口｜風暴拋棄式電子煙",
    description: "VAPOR STORM 風暴 5000 口拋棄式發光一次性電子煙，現貨。",
    productName: "VAPOR STORM 5000",
  },
  "/product/vapor-storm-gen5-pods": {
    path: "/product/vapor-storm-gen5-pods",
    title: "Vapor Storm 五代煙彈｜風暴菸彈",
    description: "Vapor Storm 風暴五代煙彈，五代主機通用。多口味現貨。",
    productName: "Vapor Storm 五代煙彈",
  },
  "/product/sp2s-silicone-sleeve": {
    path: "/product/sp2s-silicone-sleeve",
    title: "SP2S 矽膠保護套｜思博瑞主機配件",
    description: "思博瑞 SP2S 主機矽膠保護套，多色可選。電子煙配件現貨。",
    productName: "SP2S 矽膠保護套",
  },
  "/product/sp2s-empty-shell-standard": {
    path: "/product/sp2s-empty-shell-standard",
    title: "SP2S 一代空殼（一般版）｜正版空殼",
    description: "SP2／SP2S 一代空殼一般版白芯，正版空殼現貨。",
    productName: "SP2S 一代空殼（一般版）",
  },
  "/product/sp2s-empty-shell-pro": {
    path: "/product/sp2s-empty-shell-pro",
    title: "SP2S 一代空殼 Pro 版｜盒裝殼",
    description: "SP2S 一代空殼 Pro 版盒裝殼，正版空殼現貨。",
    productName: "SP2S 一代空殼 Pro 版",
  },
  "/product/cartoon": {
    path: "/product/cartoon",
    title: "卡通限量版主機｜一代通配電子煙",
    description: "卡通限量版一代通配主機，多種配色可選。SP2S 官方商城。",
    productName: "卡通限量版主機",
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

/** catalog/tokyo-magic-box-host 已 301 至商品頁，不列入 sitemap */
const CATALOG_SITEMAP_EXCLUDE = new Set(["tokyo-magic-box-host"]);

/** 供 build 生成 sitemap.xml */
export const SITEMAP_PATHS: string[] = [
  ...Object.values(STATIC_SEO_ROUTES)
    .filter((m) => !m.noindex)
    .map((m) => m.path),
  ...pinkyImportedCatalog
    .filter((item) => !CATALOG_SITEMAP_EXCLUDE.has(item.id))
    .map((item) => `/catalog/${item.id}`),
];

function catalogSeo(id: string, path: string): SeoMeta | null {
  const item = findPinkyCatalogItemById(id);
  if (!item) return null;
  return {
    path,
    title: `${item.title}｜SP2S 官方商城`,
    description: `${item.title}（${item.category}）現貨選購。SP2S 思博瑞官方商城，僅限 18 歲以上。`,
    ogImage: absoluteShopAssetUrl(getPinkyImportedCatalogImage(item.id)),
    productName: item.title,
  };
}

export function getSeoForPath(pathname: string): SeoMeta {
  const base = pathname.split("?")[0] || "/";
  if (STATIC_SEO_ROUTES[base]) return STATIC_SEO_ROUTES[base];

  const catalogMatch = base.match(/^\/catalog\/([^/]+)$/);
  if (catalogMatch) {
    const catalogSeoMeta = catalogSeo(catalogMatch[1], base);
    if (catalogSeoMeta) return catalogSeoMeta;
  }

  if (base.startsWith("/product/")) {
    const slug = base.replace("/product/", "");
    return {
      path: base,
      title: `${slug}｜SP2S 官方精選`,
      description: `瀏覽 ${slug} 產品詳情與選購。SP2S 思博瑞官方商城。`,
    };
  }

  return {
    path: base,
    title: DEFAULT_SITE_TITLE,
    description: DEFAULT_SITE_DESCRIPTION,
    ogImage: OG_DEFAULT,
    noindex: base !== "/",
  };
}

export function isProductPath(path: string): boolean {
  return path.startsWith("/product/") || path.startsWith("/catalog/");
}

export function getProductStructuredDataForPath(pathname: string): ProductStructuredDataMeta | null {
  const base = pathname.split("?")[0] || "/";
  return PRODUCT_STRUCTURED_DATA_BY_PATH[base] ?? null;
}
