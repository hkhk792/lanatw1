import { listOrdersForExport } from "../_lib/ordersDb.js";

const EXPORT_STATUSES = ["待确认", "已发出"];

function getEnv(name) {
  const v = process.env[name];
  return typeof v === "string" && v.trim() ? v.trim() : "";
}

function unauthorized(res) {
  return res.status(401).json({ error: "未授權" });
}

function checkAuth(req) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  const secret = getEnv("ADMIN_SECRET");
  return Boolean(secret && token === secret);
}

function csvEscape(value) {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function formatItems(items) {
  if (!items?.length) return "";
  return items
    .map((i) => {
      const v = String(i.variant ?? "").trim();
      return `${i.product_model}${v ? `（${v}）` : ""} ×${i.quantity}`;
    })
    .join("；");
}

/** 揀貨表：同批次內按商品型號 + 口味加總件數 */
function buildPickingCsv(rows, batchDate, siteCodeLabel) {
  const siteLine = siteCodeLabel
    ? `站點篩選,${csvEscape(siteCodeLabel)},`
    : `站點,全部,`;
  const meta = [
    `批次日期,${csvEscape(batchDate)},`,
    siteLine,
    `说明,僅統計狀態為「待確認」「已發出」的訂單明細,,`,
    ",,",
  ];

  const header = ["品牌（商品型號）", "名稱（規格／口味）", "數量（件）"];
  const lines = [...meta, header.map(csvEscape).join(",")];

  let totalPieces = 0;
  for (const row of rows) {
    totalPieces += row.qty;
    lines.push([row.brand, row.name, String(row.qty)].map(csvEscape).join(","));
  }

  lines.push("");
  lines.push(["本批次總件數（所有口味合計）", "", String(totalPieces)].map(csvEscape).join(","));

  return `\ufeff${lines.join("\n")}\n`;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!checkAuth(req)) {
    return unauthorized(res);
  }

  const batchDate =
    typeof req.query?.batchDate === "string"
      ? req.query.batchDate.trim()
      : typeof req.query?.batchDate === "object" && req.query.batchDate?.[0]
        ? String(req.query.batchDate[0]).trim()
        : "";

  if (!/^\d{4}-\d{2}-\d{2}$/.test(batchDate)) {
    return res.status(400).json({ error: "batchDate 格式須為 YYYY-MM-DD" });
  }

  const siteCode =
    typeof req.query?.siteCode === "string"
      ? req.query.siteCode.trim()
      : Array.isArray(req.query?.siteCode)
        ? String(req.query.siteCode[0] ?? "").trim()
        : "";

  const format =
    typeof req.query?.format === "string"
      ? req.query.format.trim().toLowerCase()
      : typeof req.query?.format === "object" && req.query?.format?.[0]
        ? String(req.query.format[0]).trim().toLowerCase()
        : "detail";

  try {
    const data = await listOrdersForExport({ batchDate, siteCode });

    if (format === "xlsx") {
      const { buildShipmentWorkbookBuffer } = await import("./buildShipmentWorkbook.js");
      const buf = await buildShipmentWorkbookBuffer(data ?? []);
      const filename = `出貨單_${batchDate}.xlsx`;

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
      return res.status(200).send(buf);
    }

    if (format === "picking") {
      const agg = new Map();
      for (const o of data ?? []) {
        for (const it of o.order_items ?? []) {
          const brand = String(it.product_model ?? "").trim() || "（未命名商品）";
          const name = String(it.variant ?? "").trim() || "（無規格／口味）";
          const n = Number(it.quantity) || 0;
          const key = JSON.stringify([brand, name]);
          agg.set(key, (agg.get(key) ?? 0) + n);
        }
      }

      const rows = [...agg.entries()]
        .map(([key, qty]) => {
          const [brand, name] = JSON.parse(key);
          return { brand, name, qty };
        })
        .sort((a, b) => {
          const c = a.brand.localeCompare(b.brand, "zh-Hans-CN");
          if (c !== 0) return c;
          return a.name.localeCompare(b.name, "zh-Hans-CN");
        });

      const csv = buildPickingCsv(rows, batchDate, siteCode);
      const filename = `揀貨匯總_${batchDate}.csv`;

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
      return res.status(200).send(csv);
    }

    const header = [
      "订单号",
      "站点",
      "买家姓名",
      "电话",
      "国家或地区",
      "LINE ID",
      "收货地址",
      "收货门市号",
      "订单备注",
      "小计TWD",
      "运费TWD",
      "合计TWD",
      "付款方式",
      "商品规格",
      "状态",
    ];
    const lines = [header.map(csvEscape).join(",")];

    for (const o of data ?? []) {
      const spec = formatItems(o.order_items);
      const pay = String(o.payment_method ?? "").trim() === "cod" ? "貨到付款" : String(o.payment_method ?? "");
      lines.push(
        [
          o.order_number,
          o.site_code,
          o.customer_name,
          o.phone,
          o.country,
          o.line_id,
          o.shipping_address,
          o.pickup_store_code,
          o.notes,
          String(o.subtotal_twd ?? ""),
          String(o.shipping_twd ?? ""),
          String(o.total_twd ?? ""),
          pay,
          spec,
          o.status,
        ]
          .map(csvEscape)
          .join(",")
      );
    }

    const csv = `\ufeff${lines.join("\n")}\n`;
    const filename = `出貨單_${batchDate}.csv`;

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
    return res.status(200).send(csv);
  } catch (e) {
    return res.status(500).json({
      error: e instanceof Error ? e.message : "匯出失敗",
    });
  }
}
