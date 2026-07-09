import { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { getProductGeo } from "@/data/productGeo";
import {
  aggregateShowcaseReviews,
  getShowcaseReviewsForPath,
  toSchemaReviews,
} from "@/data/productShowcaseReviews";
import { getContentPageBySlug } from "@/data/contentPages";
import { siteFaqItems } from "@/data/siteFaq";
import { SHOP_SITE_URL } from "@/lib/domains";
import {
  SITE_JSON_LD_BRAND,
  SITE_ORG_NAME,
  SITE_WEBSITE_NAME,
} from "@/lib/siteConfig";
import {
  getProductStructuredDataForPath,
  getSeoForPath,
  isProductPath,
  PRODUCT_STRUCTURED_DATA_BY_PATH,
} from "@/lib/seoRoutes";
import {
  articleJsonLd,
  breadcrumbsForPath,
  buildSiteGraph,
  indexRobotsMeta,
  productJsonLdWithFaq,
  productNode,
} from "@/lib/structuredData";

const TOP_PRODUCT_PATHS = [
  "/product/lanna",
  "/product/lana-pods",
  "/product/sp2s-universal-pods",
  "/product/bullet",
  "/product/diya-7500",
] as const;

const SiteSeo = () => {
  const { pathname } = useLocation();
  const meta = getSeoForPath(pathname);
  const canonical = `${SHOP_SITE_URL}${meta.path === "/" ? "/" : meta.path}`;
  const ogImage = meta.ogImage ?? `${SHOP_SITE_URL}/huan-taiwan-vape-banner.webp`;
  const productSeo = getProductStructuredDataForPath(pathname);
  const productGeo = getProductGeo(pathname);

  const jsonLd = useMemo(() => {
    const isHome = meta.path === "/";
    const contentSlug = meta.path.replace(/^\//, "");
    const contentPage = getContentPageBySlug(contentSlug);

    if (contentPage) {
      return articleJsonLd({
        title: contentPage.title,
        description: contentPage.description,
        path: `/${contentPage.slug}`,
        datePublished: contentPage.updated,
        dateModified: contentPage.updated,
        breadcrumbs: breadcrumbsForPath(meta.path),
      });
    }

    if (isProductPath(meta.path) && productSeo && productGeo) {
      const showcase = getShowcaseReviewsForPath(meta.path);
      const aggregate = aggregateShowcaseReviews(showcase);
      return productJsonLdWithFaq(
        productSeo,
        meta.path,
        ogImage,
        productGeo.faq,
        breadcrumbsForPath(meta.path),
        showcase.length > 0 ? toSchemaReviews(showcase) : undefined,
        aggregate.count > 0 ? aggregate : undefined,
      );
    }

    const homepageProducts = isHome
      ? TOP_PRODUCT_PATHS.map((path) => {
          const structured = PRODUCT_STRUCTURED_DATA_BY_PATH[path];
          if (!structured) return null;
          return { meta: structured, path };
        }).filter(Boolean) as { meta: NonNullable<typeof productSeo>; path: string }[]
      : [];

    const graph = buildSiteGraph({
      faq: isHome || meta.path === "/faq" ? siteFaqItems : undefined,
      products: isHome
        ? homepageProducts
        : productSeo && isProductPath(meta.path)
          ? [{ meta: productSeo, path: meta.path, image: ogImage }]
          : undefined,
      breadcrumbs: meta.path !== "/" ? breadcrumbsForPath(meta.path) : undefined,
      extra:
        meta.path === "/guides"
          ? [
              {
                "@type": "CollectionPage",
                name: "選購指南",
                url: `${SHOP_SITE_URL}/guides`,
                inLanguage: "zh-Hant-TW",
              },
            ]
          : undefined,
    });

    if (isProductPath(meta.path) && meta.productName && productSeo && !meta.noindex && !productGeo) {
      const existing = graph["@graph"] as Record<string, unknown>[];
      const hasProduct = existing.some((n) => n["@type"] === "Product");
      if (!hasProduct) {
        existing.push(productNode(productSeo, meta.path, ogImage));
      }
    }

    return graph;
  }, [meta, ogImage, productGeo, productSeo]);

  const ogType = isProductPath(meta.path) ? "product" : "website";

  useEffect(() => {
    document.documentElement.dataset.seoReady = "true";
    document.dispatchEvent(new Event("seo-ready"));
  }, [meta.path, meta.title, meta.description, jsonLd, canonical]);

  return (
    <Helmet>
      <html lang="zh-Hant-TW" />
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      {!meta.noindex ? <meta name="robots" content={indexRobotsMeta()} /> : <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="zh-TW" href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />
      <meta property="og:site_name" content={SITE_WEBSITE_NAME} />
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content="zh_TW" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={meta.title} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="application-name" content={SITE_ORG_NAME} />
      <meta name="author" content={SITE_JSON_LD_BRAND} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
};

export default SiteSeo;
