import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { SHOP_SITE_URL } from "@/lib/domains";
import {
  SITE_JSON_LD_BRAND,
  SITE_ORG_NAME,
  SITE_WEBSITE_NAME,
} from "@/lib/siteConfig";
import { getProductStructuredDataForPath, getSeoForPath, isProductPath } from "@/lib/seoRoutes";

const SiteSeo = () => {
  const { pathname } = useLocation();
  const meta = getSeoForPath(pathname);
  const canonical = `${SHOP_SITE_URL}${meta.path === "/" ? "/" : meta.path}`;
  const ogImage = meta.ogImage ?? `${SHOP_SITE_URL}/huan-taiwan-vape-banner.webp`;
  const productSeo = getProductStructuredDataForPath(pathname);

  const jsonLd = useMemo(() => {
    const graph: Record<string, unknown>[] = [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_ORG_NAME,
        url: SHOP_SITE_URL,
        logo: `${SHOP_SITE_URL}/favicon.svg`,
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_WEBSITE_NAME,
        url: SHOP_SITE_URL,
        inLanguage: "zh-Hant-TW",
        publisher: { "@type": "Organization", name: SITE_ORG_NAME },
      },
    ];

    if (isProductPath(meta.path) && meta.productName && !meta.noindex) {
      graph.push({
        "@context": "https://schema.org",
        "@type": "Product",
        name: meta.productName,
        description: meta.description,
        image: productSeo?.image ?? ogImage,
        url: canonical,
        sku: meta.path.replace("/product/", ""),
        brand: { "@type": "Brand", name: SITE_JSON_LD_BRAND },
        offers: productSeo
          ? {
              "@type": "Offer",
              url: canonical,
              priceCurrency: "TWD",
              price: productSeo.priceTwd.toString(),
              availability: "https://schema.org/InStock",
              itemCondition: "https://schema.org/NewCondition",
            }
          : undefined,
      });
    }

    return graph;
  }, [meta, canonical, ogImage, productSeo]);

  return (
    <Helmet>
      <html lang="zh-Hant-TW" />
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={canonical} />
      {meta.noindex ? <meta name="robots" content="noindex, nofollow" /> : null}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="zh_TW" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={ogImage} />
      {jsonLd.map((item, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
};

export default SiteSeo;
