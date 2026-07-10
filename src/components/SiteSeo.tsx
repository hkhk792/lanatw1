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
import { getArticleBySlug, articlePath, knowledgeArticles } from "@/data/knowledgeArticles";
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
  itemListNode,
  productJsonLdWithFaq,
} from "@/lib/structuredData";

const TOP_PRODUCT_PATHS = [
  "/product/lanna",
  "/product/lana-pods",
  "/product/sp2s-universal-pods",
  "/product/bullet",
  "/product/diya-7500",
] as const;

const KNOWLEDGE_SEGMENT_TO_CATEGORY: Record<string, "guide" | "blog" | "compare" | "flavor" | "brand"> = {
  guide: "guide",
  blog: "blog",
  compare: "compare",
  flavors: "flavor",
  brands: "brand",
};

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

    const knowledgeMatch = meta.path.match(/^\/(guide|blog|compare|flavors|brands)\/([^/]+)$/);
    if (knowledgeMatch) {
      const category = KNOWLEDGE_SEGMENT_TO_CATEGORY[knowledgeMatch[1]];
      const article = category ? getArticleBySlug(category, knowledgeMatch[2]) : undefined;
      if (article) {
        return articleJsonLd({
          title: article.title,
          description: article.description,
          path: meta.path,
          datePublished: article.updated,
          dateModified: article.updated,
          breadcrumbs: breadcrumbsForPath(meta.path),
          faq: article.faq,
        });
      }
    }

    if (isProductPath(meta.path) && productSeo) {
      const showcase = getShowcaseReviewsForPath(meta.path);
      const aggregate = aggregateShowcaseReviews(showcase);
      return productJsonLdWithFaq(
        productSeo,
        meta.path,
        ogImage,
        productGeo?.faq ?? [],
        breadcrumbsForPath(meta.path),
        toSchemaReviews(showcase),
        aggregate,
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
      extra: (() => {
        const nodes: Record<string, unknown>[] = [];

        if (isHome) {
          nodes.push(
            itemListNode(
              "熱門商品",
              TOP_PRODUCT_PATHS.map((path) => {
                const structured = PRODUCT_STRUCTURED_DATA_BY_PATH[path];
                return {
                  name: structured?.name ?? path,
                  url: `${SHOP_SITE_URL}${path}`,
                };
              }),
            ),
            itemListNode(
              "知識中心精選",
              knowledgeArticles.slice(0, 8).map((a) => ({
                name: a.title,
                url: `${SHOP_SITE_URL}${articlePath(a)}`,
              })),
            ),
          );
        }

        const collectionPages: Record<string, string> = {
          "/knowledge": "知識中心",
          "/guides": "選購指南",
          "/blog": "部落格",
          "/compare": "產品比較",
          "/flavors": "口味專區",
          "/brands": "品牌介紹",
        };
        const collectionName = collectionPages[meta.path];
        if (collectionName) {
          nodes.push({
            "@type": "CollectionPage",
            name: collectionName,
            url: `${SHOP_SITE_URL}${meta.path}`,
            inLanguage: "zh-Hant-TW",
          });
        }

        return nodes.length ? nodes : undefined;
      })(),
    });

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
