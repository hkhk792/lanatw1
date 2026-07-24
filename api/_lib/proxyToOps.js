/**
 * Forward a Vercel serverless request to the self-hosted ops API.
 * Needed because Vercel invokes local /api/* functions before applying rewrites.
 */
export function getOpsApiBase() {
  const raw = process.env.OPS_API_BASE || "https://ops.lanatw1.com";
  return raw.replace(/\/$/, "");
}

function getSiteCode() {
  const v = process.env.SITE_CODE;
  return typeof v === "string" && v.trim() ? v.trim() : "";
}

/**
 * @param {import("http").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 * @param {string} [pathOverride] absolute path including /api/...
 */
export async function proxyToOps(req, res, pathOverride) {
  const base = getOpsApiBase();
  const url = new URL(req.url || "/", "http://localhost");
  const path = pathOverride || url.pathname;
  const target = `${base}${path}${url.search || ""}`;

  const headers = {
    accept: req.headers.accept || "*/*",
    "content-type": req.headers["content-type"] || "application/json",
  };
  if (req.headers.authorization) headers.authorization = req.headers.authorization;
  if (req.headers.origin) headers.origin = req.headers.origin;
  if (req.headers.referer) headers.referer = req.headers.referer;
  if (req.headers["x-pcsc-bridge"]) headers["x-pcsc-bridge"] = req.headers["x-pcsc-bridge"];

  const site = getSiteCode();
  if (site) headers["x-site-code"] = site;

  /** @type {RequestInit} */
  const init = {
    method: req.method || "GET",
    headers,
    redirect: "manual",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    if (req.body != null) {
      init.body =
        typeof req.body === "string" || Buffer.isBuffer(req.body)
          ? req.body
          : JSON.stringify(req.body);
    }
  }

  const upstream = await fetch(target, init);
  const buf = Buffer.from(await upstream.arrayBuffer());

  res.statusCode = upstream.status;
  upstream.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (k === "transfer-encoding" || k === "content-encoding" || k === "content-length") return;
    res.setHeader(key, value);
  });
  // Ensure CORS-friendly if shop called directly (usually same-origin via Vercel)
  if (req.headers.origin) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("X-Ops-Proxy", "1");
  return res.end(buf);
}
