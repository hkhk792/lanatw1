import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { pcscCallbackDevMiddleware } from "./scripts/pcsc-callback-dev.mjs";
import { buildHomeJsonLd } from "./scripts/shop-json-ld.mjs";

function shopHtmlEnv(mode: string) {
  const env = loadEnv(mode, process.cwd(), "");
  const site = (env.VITE_SHOP_SITE_URL || "https://sp2spods.com").trim().replace(/\/+$/, "");
  const isLana = site.includes("lanatw1") || env.VITE_SHOP_JSON_LD_BRAND === "LANA";
  const title =
    env.VITE_SHOP_HOME_TITLE?.trim() ||
    (isLana ? "LANA 小蠻腰煙彈官方商城｜LANA Pod Taiwan 現貨配送" : "SP2S 煙彈官方商城｜思博瑞電子煙現貨");
  const description =
    env.VITE_SHOP_HOME_DESCRIPTION?.trim() ||
    (isLana
      ? "LANA 小蠻腰煙彈官方商城，提供 LANA 皮革主機、煙彈 3 顆裝與一代通配系列，台灣現貨快速出貨、超商取貨付款，滿額免運。僅限 18 歲以上選購。"
      : "SP2S 思博瑞官方商城：SP2S 煙彈、一代／二代通用菸彈、主機與拋棄式電子煙現貨。陶瓷芯、多口味選購，僅限 18 歲以上。");
  const ogImage = `${site}/huan-taiwan-vape-banner.webp`;
  const jsonLd = JSON.stringify(buildHomeJsonLd(env));
  return { site, title, description, ogImage, jsonLd };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const htmlEnv = shopHtmlEnv(mode);

  return {
  server: {
    host: "127.0.0.1",
    port: 5173,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    {
      name: "inject-shop-site-html",
      transformIndexHtml(html) {
        return html
          .replaceAll("__SHOP_SITE_URL__", htmlEnv.site)
          .replaceAll("__SHOP_HOME_TITLE__", htmlEnv.title)
          .replaceAll("__SHOP_HOME_DESCRIPTION__", htmlEnv.description)
          .replaceAll("__SHOP_OG_IMAGE__", htmlEnv.ogImage)
          .replaceAll("__SHOP_JSON_LD__", htmlEnv.jsonLd)
          .replace(/(<link rel="stylesheet"[^>]*)\s+crossorigin/g, "$1");
      },
    },
    {
      name: "pcsc-callback-dev",
      configureServer(server) {
        server.middlewares.use(pcscCallbackDevMiddleware());
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  };
});
