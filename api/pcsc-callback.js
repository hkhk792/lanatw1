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

function buildCheckoutRedirectUrl(store, origin) {
  const q = new URLSearchParams({
    cvs_storeid: store.storeId,
    cvs_storename: store.storeName,
    cvs_storeaddress: store.storeAddress,
  });
  return `${origin}/checkout?${q.toString()}`;
}

/** 彈窗選店時仍用 HTML + postMessage；同頁跳轉則直接 HTTP 重定向（較快）。 */
function buildCallbackHtml(store, origin, checkoutUrl) {
  const payload = JSON.stringify({
    type: "sp2s-pcsc-cvs-store",
    store,
  });

  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0;url=${encodeURI(checkoutUrl)}" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>門市選擇完成</title>
</head>
<body>
  <p>正在返回結帳頁…<a href="${checkoutUrl}">若未自動跳轉請點此</a></p>
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

    const checkoutUrl = buildCheckoutRedirectUrl(store, origin);
    res.setHeader("Cache-Control", "no-store");

    // 結帳頁為同頁跳轉選店：直接 303 回結帳，略過 HTML/JS 中轉（較快）
    const wantsHtmlBridge =
      String(req.headers["x-pcsc-bridge"] || "") === "1" ||
      String(req.query?.bridge || "") === "1";

    if (!wantsHtmlBridge) {
      res.setHeader("Location", checkoutUrl);
      return res.status(303).end();
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(buildCallbackHtml(store, origin, checkoutUrl));
  } catch {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(500).send(
      `<!DOCTYPE html><html lang="zh-Hant"><body><p>處理門市資料時發生錯誤，請返回<a href="/checkout">結帳頁</a>重試。</p></body></html>`
    );
  }
}
