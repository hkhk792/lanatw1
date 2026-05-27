import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { pcscCallbackDevMiddleware } from "./scripts/pcsc-callback-dev.mjs";

// https://vitejs.dev/config/
export default defineConfig({
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
});
