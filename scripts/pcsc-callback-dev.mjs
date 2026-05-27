/**
 * Vite dev：本地模拟 /api/pcsc-callback（7-11 选店 POST 回传）
 */
import { parse as parseQuery } from "node:querystring";

function pickField(body, keys) {
  for (const key of keys) {
    const v = body[key];
    if (v != null && String(v).trim()) return String(v).trim();
  }
  return "";
}

function parseStore(body) {
  return {
    storeId: pickField(body, ["storeid", "StoreID", "CVSStoreID", "storeId"]),
    storeName: pickField(body, ["storename", "StoreName", "CVSStoreName"]),
    storeAddress: pickField(body, [
      "storeaddress",
      "StoreAddress",
      "CVSAddress",
      "address",
    ]),
  };
}

function buildCallbackHtml(store, origin) {
  const payload = JSON.stringify({ type: "sp2s-pcsc-cvs-store", store });
  const q = new URLSearchParams({
    cvs_storeid: store.storeId,
    cvs_storename: store.storeName,
    cvs_storeaddress: store.storeAddress,
  });
  const checkoutUrl = `${origin}/checkout?${q.toString()}`;

  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head><meta charset="utf-8" /><title>門市選擇完成</title></head>
<body><p>門市資料已送出，正在返回結帳頁…</p>
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
  } catch (e) {}
  window.location.replace(checkoutUrl);
})();
</script></body></html>`;
}

function readUrlencodedBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      try {
        resolve(parseQuery(Buffer.concat(chunks).toString("utf8")));
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

export function pcscCallbackDevMiddleware() {
  return async (req, res, next) => {
    const url = req.url?.split("?")[0] ?? "";
    if (url !== "/api/pcsc-callback") return next();

    if (req.method !== "POST" && req.method !== "GET") {
      res.statusCode = 405;
      res.end("Method Not Allowed");
      return;
    }

    try {
      let body = {};
      if (req.method === "POST") {
        body = await readUrlencodedBody(req);
      } else {
        const q = req.url?.includes("?") ? req.url.split("?")[1] : "";
        body = parseQuery(q);
      }

      const store = parseStore(body);
      const host = req.headers.host ?? "127.0.0.1:5173";
      const origin = `http://${host}`;

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      if (!store.storeId) {
        res.statusCode = 400;
        res.end(
          `<!DOCTYPE html><html lang="zh-Hant"><body><p>未取得門市資料，請返回<a href="${origin}/checkout">結帳頁</a>重選。</p></body></html>`
        );
        return;
      }

      res.statusCode = 200;
      res.end(buildCallbackHtml(store, origin));
    } catch {
      res.statusCode = 500;
      res.end("Callback error");
    }
  };
}
