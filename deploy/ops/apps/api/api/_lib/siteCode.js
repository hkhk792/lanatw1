import { AsyncLocalStorage } from "node:async_hooks";
import { getEnv } from "./db.js";

/** @typedef {{ siteCode: string; originHost: string }} RequestStore */

export const requestContext = new AsyncLocalStorage();

/** Host (lowercase, no port) → SITE_CODE */
export const ORIGIN_SITE_CODE_MAP = {
  "lanatw1.com": "lanatw1",
  "www.lanatw1.com": "lanatw1",
  "sp2s-1.lanatw1.com": "sp2s-1",
  "sp2s-2.lanatw1.com": "sp2s-2",
  "sp2s-4.lanatw1.com": "sp2s-4",
  "sp2s-5.lanatw1.com": "sp2s-5",
  "sp2spods.com": "sp2spods",
  "www.sp2spods.com": "sp2spods",
  "sp2o.vip": "sp2s-6",
  "www.sp2o.vip": "sp2s-6",
  "ops.lanatw1.com": "lanatw1",
};

const ALLOWED_ORIGINS = new Set(
  Object.keys(ORIGIN_SITE_CODE_MAP).map((h) => `https://${h}`)
);

export function isAllowedOrigin(origin) {
  if (!origin || typeof origin !== "string") return false;
  try {
    const u = new URL(origin);
    return ALLOWED_ORIGINS.has(`${u.protocol}//${u.hostname}`);
  } catch {
    return false;
  }
}

export function hostFromUrlish(value) {
  if (!value || typeof value !== "string") return "";
  try {
    if (value.includes("://")) {
      return new URL(value).hostname.toLowerCase();
    }
  } catch {
    /* ignore */
  }
  return value.split("/")[0].split(":")[0].trim().toLowerCase();
}

/**
 * Resolve SITE_CODE for an inbound request.
 * Priority: X-Site-Code → Origin/Referer map → SITE_CODE env → default
 */
export function resolveSiteCodeFromRequest(req) {
  const header =
    typeof req?.headers?.["x-site-code"] === "string"
      ? req.headers["x-site-code"].trim()
      : "";
  if (header) return header;

  const originHost = hostFromUrlish(req?.headers?.origin || "");
  const refererHost = hostFromUrlish(req?.headers?.referer || "");
  const host = originHost || refererHost;

  if (host && ORIGIN_SITE_CODE_MAP[host]) {
    return ORIGIN_SITE_CODE_MAP[host];
  }

  const fromEnv = getEnv("SITE_CODE");
  if (fromEnv) return fromEnv;

  return "default";
}

export function getSiteCode() {
  const store = requestContext.getStore();
  if (store?.siteCode) return store.siteCode;
  return getEnv("SITE_CODE") || "default";
}

export function runWithRequestContext(store, fn) {
  return requestContext.run(store, fn);
}
