/** Build 脚本读取与 src/lib/siteConfig.ts 一致的商城环境变量 */

export function shopSiteUrl() {
  return (process.env.VITE_SHOP_SITE_URL || "https://sp2spods.com").trim().replace(/\/+$/, "");
}

export function shopHomeTitle() {
  return (
    process.env.VITE_SHOP_HOME_TITLE?.trim() ||
    "SP2S 煙彈官方商城｜思博瑞電子煙現貨"
  );
}

export function shopHomeDescription() {
  return (
    process.env.VITE_SHOP_HOME_DESCRIPTION?.trim() ||
    "SP2S 思博瑞官方商城：SP2S 煙彈、一代／二代通用菸彈、主機與拋棄式電子煙現貨。陶瓷芯、多口味選購，僅限 18 歲以上。"
  );
}
