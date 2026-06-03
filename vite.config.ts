import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { pcscCallbackDevMiddleware } from "./scripts/pcsc-callback-dev.mjs";

function shopHtmlEnv(mode: string) {
  const env = loadEnv(mode, process.cwd(), "");
  const site = (env.VITE_SHOP_SITE_URL || "https://sp2spods.com").trim().replace(/\/+$/, "");
  const title =
    env.VITE_SHOP_HOME_TITLE?.trim() || "SP2S 煙彈官方商城｜思博瑞電子煙現貨";
  const description =
    env.VITE_SHOP_HOME_DESCRIPTION?.trim() ||
    "SP2S 思博瑞官方商城：SP2S 煙彈、一代／二代通用菸彈、主機與拋棄式電子煙現貨。陶瓷芯、多口味選購，僅限 18 歲以上。";
  const ogImage = `${site}/huan-taiwan-vape-banner.webp`;
  return { site, title, description, ogImage };
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
