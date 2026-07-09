/** 站群：每套 Vercel 部署用环境变量区分主域与品牌 SEO（方案 B） */

function trimSiteUrl(raw: string | undefined): string {
  const base = (raw?.trim() || "https://sp2spods.com").replace(/\/+$/, "");
  if (base === "https://lanatw1.com" || base === "http://lanatw1.com") {
    return "https://www.lanatw1.com";
  }
  return base;
}

function env(key: string, fallback: string): string {
  const v = import.meta.env[key as keyof ImportMetaEnv];
  if (typeof v === "string" && v.trim()) return v.trim();
  return fallback;
}

/** 当前部署的主域（canonical、sitemap、超商回调） */
export const SHOP_SITE_URL = trimSiteUrl(import.meta.env.VITE_SHOP_SITE_URL);

const SP2S_HOME_TITLE = "SP2S 煙彈官方商城｜思博瑞電子煙現貨";
const SP2S_HOME_DESCRIPTION =
  "SP2S 思博瑞官方商城：SP2S 煙彈、一代／二代通用菸彈、主機與拋棄式電子煙現貨。陶瓷芯、多口味選購，僅限 18 歲以上。";

const LANA_HOME_TITLE = "LANA 小蠻腰煙彈官方商城｜LANA Pod Taiwan 現貨配送";
const LANA_HOME_DESCRIPTION =
  "LANA 小蠻腰煙彈官方商城，提供 LANA 皮革主機、煙彈 3 顆裝與一代通配系列，台灣現貨快速出貨、超商取貨付款，滿額免運。僅限 18 歲以上選購，支援 LINE 客服確認口味與庫存。";

function defaultHomeTitle(): string {
  const site = trimSiteUrl(import.meta.env.VITE_SHOP_SITE_URL);
  if (site.includes("lanatw1")) return LANA_HOME_TITLE;
  const brand = (import.meta.env.VITE_SHOP_JSON_LD_BRAND as string | undefined)?.trim();
  if (brand === "LANA") return LANA_HOME_TITLE;
  return SP2S_HOME_TITLE;
}

function defaultHomeDescription(): string {
  const site = trimSiteUrl(import.meta.env.VITE_SHOP_SITE_URL);
  if (site.includes("lanatw1")) return LANA_HOME_DESCRIPTION;
  const brand = (import.meta.env.VITE_SHOP_JSON_LD_BRAND as string | undefined)?.trim();
  if (brand === "LANA") return LANA_HOME_DESCRIPTION;
  return SP2S_HOME_DESCRIPTION;
}

export const SITE_HOME_TITLE = env("VITE_SHOP_HOME_TITLE", defaultHomeTitle());
export const SITE_HOME_DESCRIPTION = env("VITE_SHOP_HOME_DESCRIPTION", defaultHomeDescription());
export const SITE_ORG_NAME = env("VITE_SHOP_ORG_NAME", "SP2S 官方精選");
export const SITE_WEBSITE_NAME = env("VITE_SHOP_WEBSITE_NAME", "SP2S 煙彈官方商城");
/** JSON-LD Product.brand；未设时沿用 SP2S */
export const SITE_JSON_LD_BRAND = env("VITE_SHOP_JSON_LD_BRAND", "SP2S");

export const DEFAULT_SITE_TITLE = SITE_ORG_NAME;
export const DEFAULT_SITE_DESCRIPTION = SITE_HOME_DESCRIPTION;

export const SHOP_OG_DEFAULT = `${SHOP_SITE_URL}/huan-taiwan-vape-banner.webp`;
