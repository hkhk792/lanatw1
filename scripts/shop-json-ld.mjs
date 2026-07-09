/** Build-time homepage JSON-LD for index.html (CSR crawl fallback). */
export function buildHomeJsonLd(env) {
  const site = (env.VITE_SHOP_SITE_URL || "https://sp2spods.com").trim().replace(/\/+$/, "");
  const isLana = site.includes("lanatw1") || env.VITE_SHOP_JSON_LD_BRAND === "LANA";
  const orgName = env.VITE_SHOP_ORG_NAME?.trim() || (isLana ? "LANA 官方" : "SP2S 官方精選");
  const siteName = env.VITE_SHOP_WEBSITE_NAME?.trim() || (isLana ? "LANA 電子煙官方商城" : "SP2S 煙彈官方商城");
  const brand = env.VITE_SHOP_JSON_LD_BRAND?.trim() || (isLana ? "LANA" : "SP2S");
  const description =
    env.VITE_SHOP_HOME_DESCRIPTION?.trim() ||
    (isLana
      ? "LANA 小蠻腰煙彈官方商城，提供 LANA 皮革主機、煙彈與通配系列，台灣現貨快速出貨。"
      : "SP2S 思博瑞官方商城：煙彈、主機與拋棄式電子煙現貨。");
  const ogImage = `${site}/huan-taiwan-vape-banner.webp`;
  const lineUrl = "https://line.me/ti/p/2_fR9iUP_1";
  const sameAs = isLana
    ? [lineUrl, "https://podpickguide.com", "https://podpickguide.com/taiwan"]
    : [lineUrl];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site}/#organization`,
        name: orgName,
        url: site,
        logo: { "@type": "ImageObject", url: `${site}/favicon.svg`, width: 512, height: 512 },
        image: ogImage,
        sameAs,
        description,
        areaServed: { "@type": "Country", name: "Taiwan" },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          areaServed: "TW",
          availableLanguage: ["zh-Hant"],
          url: lineUrl,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${site}/#website`,
        name: siteName,
        url: site,
        inLanguage: "zh-Hant-TW",
        publisher: { "@id": `${site}/#organization` },
      },
      {
        "@type": "OnlineStore",
        "@id": `${site}/#store`,
        name: siteName,
        url: site,
        brand: { "@type": "Brand", name: brand },
        areaServed: { "@type": "Country", name: "Taiwan" },
        currenciesAccepted: "TWD",
        paymentAccepted: "Cash on Delivery, Convenience Store Pickup",
        knowsAbout: isLana
          ? ["電子煙", "煙彈", "LANA", "SP2S", "台灣現貨"]
          : ["電子煙", "煙彈", "SP2S"],
      },
      {
        "@type": "FAQPage",
        "@id": `${site}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "是否限定購買年齡？",
            acceptedAnswer: {
              "@type": "Answer",
              text: "是。本站僅供 18 歲以上使用者選購。",
            },
          },
          {
            "@type": "Question",
            name: "是否支援超商取貨付款？",
            acceptedAnswer: {
              "@type": "Answer",
              text: "本站支援台灣超商取貨付款流程，詳見配送說明頁。",
            },
          },
          {
            "@type": "Question",
            name: "台灣現貨多久可以出貨？",
            acceptedAnswer: {
              "@type": "Answer",
              text: "訂單確認後盡快安排出貨，多數地區可透過超商取貨付款，實際到貨時間依物流與地區而異。",
            },
          },
        ],
      },
    ],
  };
}
