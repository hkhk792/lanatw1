/**
 * GET/POST /api/pcsc-callback
 * 7-ELEVEN（Presco）选店完成后回传；须为顶层 api 路径（嵌套 api/cvs/* 在 Vercel 会 404）。
 */
import { parse as parseQuery } from "node:querystring";

function pickField(body, keys) {
  if (!body || typeof body !== "object") return "";
  for (const key of keys) {
    const v = body[key];
    if (v != null && String(v).trim()) return String(v).trim();
  }
  return "";
}

function parseStore(body) {
  return {
    storeId: pickField(body, [
      "storeid",
      "StoreID",
      "CVSStoreID",
      "cvsStoreId",
      "storeId",
    ]),
    storeName: pickField(body, [
      "storename",
      "StoreName",
      "CVSStoreName",
      "cvsStoreName",
    ]),
    storeAddress: pickField(body, [
      "storeaddress",
      "StoreAddress",
      "CVSAddress",
      "address",
      "cvsAddress",
    ]),
  };
}

function readUrlEncodedBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? parseQuery(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

async function parseRequestBody(req) {
  if (req.method === "GET") return req.query ?? {};
  const parsed = req.body;
  if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
    return parsed;
  }
  if (typeof parsed === "string" && parsed.trim()) {
    return parseQuery(parsed);
  }
  return readUrlEncodedBody(req);
}

function buildCallbackHtml(store, origin) {
  const payload = JSON.stringify({
    type: "sp2s-pcsc-cvs-store",
    store,
  });
  const q = new URLSearchParams({
    cvs_storeid: store.storeId,
    cvs_storename: store.storeName,
    cvs_storeaddress: store.storeAddress,
  });
  const checkoutUrl = `${origin}/checkout?${q.toString()}`;

  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>門市選擇完成</title>
  <style>
    body { font-family: system-ui, sans-serif; display: grid; place-items: center; min-height: 100vh; margin: 0; background: #fafafa; color: #171717; }
    p { font-size: 14px; }
  </style>
</head>
<body>
  <p>門市資料已送出，正在返回結帳頁…</p>
  <script>
    (function () {
      var payload = ${payload};
      var checkoutUrl = ${JSON.stringify(checkoutUrl)};
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(payload, ${JSON.stringify(origin)});
          window.close();
          return;
        }
      } catch (e) { /* ignore */ }
      window.location.replace(checkoutUrl);
    })();
  </script>
</body>
</html>`;
}

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") {
    res.setHeader("Allow", "POST, GET");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const body = await parseRequestBody(req);
    const store = parseStore(body);

    const proto = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host || "";
    const origin = host ? `${proto}://${host}` : "";

    if (!store.storeId) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.status(400).send(
        `<!DOCTYPE html><html lang="zh-Hant"><body><p>未取得門市資料，請返回<a href="${origin}/checkout">結帳頁</a>重新選擇門市。</p></body></html>`
      );
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(buildCallbackHtml(store, origin));
  } catch {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(500).send(
      `<!DOCTYPE html><html lang="zh-Hant"><body><p>處理門市資料時發生錯誤，請返回<a href="/checkout">結帳頁</a>重試。</p></body></html>`
    );
  }
}
