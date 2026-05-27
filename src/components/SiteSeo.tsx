import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { SHOP_SITE_URL } from "@/lib/domains";
import { getSeoForPath } from "@/lib/seoRoutes";

const SiteSeo = () => {
  const { pathname } = useLocation();
  const meta = getSeoForPath(pathname);
  const canonical = `${SHOP_SITE_URL}${meta.path === "/" ? "/" : meta.path}`;
  const ogImage = meta.ogImage ?? `${SHOP_SITE_URL}/huan-taiwan-vape-banner.webp`;

  return (
    <Helmet>
      <html lang="zh-Hant-TW" />
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={canonical} />
      {meta.noindex ? <meta name="robots" content="noindex, nofollow" /> : null}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SiteSeo;
