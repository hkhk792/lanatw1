import { SHOP_SITE_URL } from "@/lib/domains";
import {
  SHOP_OG_DEFAULT,
  SITE_HOME_DESCRIPTION,
  SITE_JSON_LD_BRAND,
  SITE_ORG_NAME,
  SITE_WEBSITE_NAME,
} from "@/lib/siteConfig";
import type { ProductStructuredDataMeta } from "@/lib/seoRoutes";

export type BreadcrumbEntry = { name: string; path: string };

export type FaqEntry = { question: string; answer: string };

const INDEX_ROBOTS =
  "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

export function indexRobotsMeta(): string {
  return INDEX_ROBOTS;
}

export function absoluteShopUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  return `${SHOP_SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function breadcrumbNode(items: BreadcrumbEntry[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteShopUrl(item.path),
    })),
  };
}

export function faqPageNode(items: FaqEntry[], idSuffix = "#faq") {
  return {
    "@type": "FAQPage",
    "@id": `${SHOP_SITE_URL}/${idSuffix.replace(/^\//, "")}`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

function organizationNode() {
  return {
    "@type": "Organization",
    "@id": `${SHOP_SITE_URL}/#organization`,
    name: SITE_ORG_NAME,
    url: SHOP_SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SHOP_SITE_URL}/favicon.svg`,
      width: 512,
      height: 512,
    },
    image: SHOP_OG_DEFAULT,
    description: SITE_HOME_DESCRIPTION,
    areaServed: { "@type": "Country", name: "Taiwan" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      areaServed: "TW",
      availableLanguage: ["zh-Hant"],
      url: `${SHOP_SITE_URL}/#contact`,
    },
  };
}

function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": `${SHOP_SITE_URL}/#website`,
    name: SITE_WEBSITE_NAME,
    url: SHOP_SITE_URL,
    inLanguage: "zh-Hant-TW",
    publisher: { "@id": `${SHOP_SITE_URL}/#organization` },
  };
}

function onlineStoreNode() {
  return {
    "@type": "OnlineStore",
    "@id": `${SHOP_SITE_URL}/#store`,
    name: SITE_WEBSITE_NAME,
    url: SHOP_SITE_URL,
    logo: `${SHOP_SITE_URL}/favicon.svg`,
    image: SHOP_OG_DEFAULT,
    currenciesAccepted: "TWD",
    paymentAccepted: "Cash on Delivery, Convenience Store Pickup",
    parentOrganization: { "@id": `${SHOP_SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "Taiwan" },
    knowsAbout: [
      "電子煙",
      "煙彈",
      "霧化主機",
      "拋棄式電子煙",
      SITE_JSON_LD_BRAND,
    ],
    brand: { "@type": "Brand", name: SITE_JSON_LD_BRAND },
  };
}

export function productNode(meta: ProductStructuredDataMeta, path: string, image?: string) {
  return {
    "@type": "Product",
    "@id": `${absoluteShopUrl(path)}#product`,
    name: meta.name,
    description: `${meta.name}，台灣現貨配送，僅限 18 歲以上選購。`,
    image: image ?? SHOP_OG_DEFAULT,
    url: absoluteShopUrl(path),
    brand: { "@type": "Brand", name: SITE_JSON_LD_BRAND },
    offers: {
      "@type": "Offer",
      url: absoluteShopUrl(path),
      priceCurrency: "TWD",
      price: meta.priceTwd.toString(),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${SHOP_SITE_URL}/#organization` },
    },
  };
}

export function buildSiteGraph(options?: {
  faq?: FaqEntry[];
  products?: { meta: ProductStructuredDataMeta; path: string; image?: string }[];
  breadcrumbs?: BreadcrumbEntry[];
  extra?: Record<string, unknown>[];
}) {
  const graph: Record<string, unknown>[] = [
    organizationNode(),
    websiteNode(),
    onlineStoreNode(),
  ];

  if (options?.faq?.length) {
    graph.push(faqPageNode(options.faq));
  }

  for (const p of options?.products ?? []) {
    graph.push(productNode(p.meta, p.path, p.image));
  }

  if (options?.breadcrumbs?.length) {
    graph.push(breadcrumbNode(options.breadcrumbs));
  }

  if (options?.extra?.length) {
    graph.push(...options.extra);
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function breadcrumbsForPath(pathname: string): BreadcrumbEntry[] {
  const base = pathname.split("?")[0] || "/";
  if (base === "/") return [{ name: "首頁", path: "/" }];

  const crumbs: BreadcrumbEntry[] = [{ name: "首頁", path: "/" }];

  if (base.startsWith("/product/")) {
    crumbs.push({ name: "商品", path: "/#home-catalog-host" });
    crumbs.push({ name: base.replace("/product/", ""), path: base });
    return crumbs;
  }

  if (base.startsWith("/catalog/")) {
    crumbs.push({ name: "目錄", path: "/#home-catalog-pods" });
    crumbs.push({ name: base.replace("/catalog/", ""), path: base });
    return crumbs;
  }

  crumbs.push({ name: base.replace(/^\//, ""), path: base });
  return crumbs;
}
