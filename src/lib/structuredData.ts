import { LINE_OFFICIAL_CUSTOMER_URL } from "@/constants/lineOfficial";
import {
  aggregateShowcaseReviews,
  getShowcaseReviewsForPath,
  toSchemaReviews,
} from "@/data/productShowcaseReviews";
import { SITE_LOGO_HEIGHT, SITE_LOGO_PATH, SITE_LOGO_WIDTH, SITE_SAME_AS } from "@/data/site";
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

export function itemListNode(name: string, items: { name: string; url: string }[]) {
  return {
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
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

/** 台灣配送 Offer schema（超商取貨／滿額免運）。 */
export function offerShippingDetailsTw() {
  const destination = { "@type": "DefinedRegion", addressCountry: "TW" };
  const deliveryTime = {
    "@type": "ShippingDeliveryTime",
    handlingTime: {
      "@type": "QuantitativeValue",
      minValue: 1,
      maxValue: 2,
      unitCode: "DAY",
    },
    transitTime: {
      "@type": "QuantitativeValue",
      minValue: 2,
      maxValue: 5,
      unitCode: "DAY",
    },
  };
  return [
    {
      "@type": "OfferShippingDetails",
      shippingDestination: destination,
      deliveryTime,
      shippingRate: {
        "@type": "MonetaryAmount",
        value: "0",
        currency: "TWD",
      },
      name: "滿 NT$1,500 免運（依活動為準）",
    },
    {
      "@type": "OfferShippingDetails",
      shippingDestination: destination,
      deliveryTime,
      name: "超商取貨付款（運費依結帳頁為準）",
    },
  ];
}

function organizationNode() {
  return {
    "@type": "Organization",
    "@id": `${SHOP_SITE_URL}/#organization`,
    name: SITE_ORG_NAME,
    url: SHOP_SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SHOP_SITE_URL}${SITE_LOGO_PATH}`,
      width: SITE_LOGO_WIDTH,
      height: SITE_LOGO_HEIGHT,
    },
    image: SHOP_OG_DEFAULT,
    sameAs: SITE_SAME_AS,
    description: SITE_HOME_DESCRIPTION,
    areaServed: { "@type": "Country", name: "Taiwan" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      areaServed: "TW",
      availableLanguage: ["zh-Hant"],
      url: LINE_OFFICIAL_CUSTOMER_URL,
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
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SHOP_SITE_URL}/#home-catalog-host`,
      },
      "query-input": "required name=search_term_string",
    },
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
      shippingDetails: offerShippingDetailsTw(),
    },
  };
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
  breadcrumbs?: BreadcrumbEntry[];
  faq?: FaqEntry[];
}) {
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Article",
      headline: article.title,
      description: article.description,
      image: SHOP_OG_DEFAULT,
      mainEntityOfPage: absoluteShopUrl(article.path),
      inLanguage: "zh-Hant-TW",
      datePublished: article.datePublished ?? "2026-01-01",
      dateModified: article.dateModified ?? article.datePublished ?? "2026-01-01",
      author: { "@id": `${SHOP_SITE_URL}/#organization` },
      publisher: { "@id": `${SHOP_SITE_URL}/#organization` },
    },
  ];

  if (article.breadcrumbs?.length) {
    graph.push(breadcrumbNode(article.breadcrumbs));
  }

  if (article.faq?.length) {
    graph.push(faqPageNode(article.faq, `${article.path}#faq`));
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export type SchemaReviewInput = {
  author: string;
  rating: number;
  body: string;
  createdAt: string;
};

export function attachProductReviews(
  product: Record<string, unknown>,
  reviews: SchemaReviewInput[],
  rating?: { average: number; count: number },
) {
  if (rating && rating.count > 0) {
    product.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.average,
      reviewCount: rating.count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (reviews.length > 0) {
    product.review = reviews.map((review) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      author: { "@type": "Person", name: review.author },
      reviewBody: review.body,
      datePublished: review.createdAt,
    }));
  }

  return product;
}

export function productNodeWithShowcaseReviews(
  meta: ProductStructuredDataMeta,
  path: string,
  image?: string,
) {
  const showcase = getShowcaseReviewsForPath(path);
  const aggregate = aggregateShowcaseReviews(showcase);
  return attachProductReviews(productNode(meta, path, image), toSchemaReviews(showcase), aggregate);
}

export function productJsonLdWithFaq(
  meta: ProductStructuredDataMeta,
  path: string,
  image: string | undefined,
  faq: FaqEntry[],
  breadcrumbs?: BreadcrumbEntry[],
  reviews?: SchemaReviewInput[],
  rating?: { average: number; count: number },
) {
  const showcase = reviews ?? toSchemaReviews(getShowcaseReviewsForPath(path));
  const aggregate =
    rating ??
    (reviews
      ? aggregateShowcaseReviews(
          reviews.map((review, index) => ({
            id: `${path}-${index}`,
            ...review,
          })),
        )
      : aggregateShowcaseReviews(getShowcaseReviewsForPath(path)));
  const product = attachProductReviews(productNode(meta, path, image), showcase, aggregate);

  const graph: Record<string, unknown>[] = [product];
  if (breadcrumbs?.length) graph.push(breadcrumbNode(breadcrumbs));
  if (faq.length) graph.push(faqPageNode(faq, `${path}#product-faq`));
  return { "@context": "https://schema.org", "@graph": graph };
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
    graph.push(productNodeWithShowcaseReviews(p.meta, p.path, p.image));
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

  const knowledgeListLabels: Record<string, { label: string; path: string }> = {
    knowledge: { label: "知識中心", path: "/knowledge" },
    guides: { label: "選購指南", path: "/guides" },
    guide: { label: "選購指南", path: "/guides" },
    blog: { label: "部落格", path: "/blog" },
    compare: { label: "產品比較", path: "/compare" },
    flavors: { label: "口味專區", path: "/flavors" },
    brands: { label: "品牌介紹", path: "/brands" },
  };

  const segments = base.split("/").filter(Boolean);
  if (segments[0] && knowledgeListLabels[segments[0]]) {
    const hub = knowledgeListLabels[segments[0]];
    crumbs.push({ name: "知識中心", path: "/knowledge" });
    crumbs.push({ name: hub.label, path: hub.path });
    if (segments[1]) {
      crumbs.push({ name: segments[1], path: base });
    }
    return crumbs;
  }

  if (base === "/knowledge") {
    crumbs.push({ name: "知識中心", path: "/knowledge" });
    return crumbs;
  }

  crumbs.push({ name: base.replace(/^\//, ""), path: base });
  return crumbs;
}
