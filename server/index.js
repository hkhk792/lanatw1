import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import {
  isAllowedOrigin,
  resolveSiteCodeFromRequest,
  runWithRequestContext,
  hostFromUrlish,
} from "../api/_lib/siteCode.js";
import { getEnv } from "../api/_lib/db.js";

import health from "../api/health.js";
import orders from "../api/orders.js";
import customerStatus from "../api/checkout/customer-status.js";
import adminOrders from "../api/admin/orders.js";
import adminExport from "../api/admin/export.js";
import pcscCallback from "../api/pcsc-callback.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const adminDist = process.env.ADMIN_DIST_DIR
  ? path.resolve(process.env.ADMIN_DIST_DIR)
  : path.join(rootDir, "dist");

const PORT = Number(process.env.PORT || 3010);
const HOST = process.env.HOST || "127.0.0.1";

function vercelCompat(handler) {
  return (req, res) => {
    const siteCode = resolveSiteCodeFromRequest(req);
    const originHost = hostFromUrlish(req.headers.origin || req.headers.referer || "");
    return runWithRequestContext({ siteCode, originHost }, () => handler(req, res));
  };
}

const app = express();
app.set("trust proxy", true);
app.disable("x-powered-by");

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type, X-Site-Code, X-Pcsc-Bridge"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  }
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

app.get("/api/health", vercelCompat(health));
app.post("/api/orders", vercelCompat(orders));
app.post("/api/checkout/customer-status", vercelCompat(customerStatus));
app.all("/api/admin/orders", vercelCompat(adminOrders));
app.get("/api/admin/export", vercelCompat(adminExport));
app.all("/api/pcsc-callback", vercelCompat(pcscCallback));
app.all("/api/cvs/pcsc-callback", vercelCompat(pcscCallback));

if (existsSync(adminDist)) {
  app.use(express.static(adminDist, { index: false, maxAge: "1h" }));
  app.get("/admin2589", (_req, res) => {
    res.sendFile(path.join(adminDist, "index.html"));
  });
  app.get("/admin2589/{*path}", (_req, res) => {
    res.sendFile(path.join(adminDist, "index.html"));
  });
  app.get("/", (_req, res) => {
    res.redirect(302, "/admin2589");
  });
} else {
  app.get("/", (_req, res) => {
    res.status(200).json({
      ok: true,
      message: "lanatw1 ops API (admin dist not built yet)",
      adminHint: "/admin2589",
    });
  });
}

app.use((err, _req, res, _next) => {
  console.error("[ops-api]", err);
  res.status(500).json({ error: err instanceof Error ? err.message : "Internal Server Error" });
});

app.listen(PORT, HOST, () => {
  console.log(`[ops-api] listening on http://${HOST}:${PORT}`);
  console.log(`[ops-api] DATABASE_URL set: ${Boolean(getEnv("DATABASE_URL"))}`);
  console.log(`[ops-api] admin dist: ${existsSync(adminDist) ? adminDist : "(missing)"}`);
});
