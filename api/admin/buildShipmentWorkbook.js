import ExcelJS from "exceljs";
import { normalizeOrderItemForShipment } from "./shipmentItemNormalize.js";

const HEADERS = [
  "收件人姓名",
  "收件人手機",
  "收件門市／地址",
  "收件門市編號",
  "訂單金額 TWD",
  "品牌",
  "名稱（規格／口味）",
  "數量",
  "訂單總數量",
  "備註",
];

/**
 * 依批次訂單產出「合併儲存格」出貨表（每筆訂單一區塊）。
 * @param {Array<object>} orders — 含 order_items
 */
export async function buildShipmentWorkbookBuffer(orders) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "obsidian-vapor-zen";
  const ws = wb.addWorksheet("出貨單", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  const headerFill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFFFCC" },
  };

  ws.getRow(1).values = HEADERS;
  ws.getRow(1).font = { bold: true };
  ws.getRow(1).alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  ws.getRow(1).eachCell((cell) => {
    cell.fill = headerFill;
  });

  ws.columns = [
    { width: 12 },
    { width: 14 },
    { width: 30 },
    { width: 14 },
    { width: 12 },
    { width: 30 },
    { width: 18 },
    { width: 8 },
    { width: 12 },
    { width: 40 },
  ];

  const thin = { style: "thin", color: { argb: "FFCCCCCC" } };

  let rowPtr = 2;

  for (const order of orders) {
    let items = [...(order.order_items ?? [])]
      .map((it) => normalizeOrderItemForShipment(it))
      .sort((a, b) => {
        const ma = String(a.product_model ?? "");
        const mb = String(b.product_model ?? "");
        const c = ma.localeCompare(mb, "zh-Hans-CN");
        if (c !== 0) return c;
        return String(a.variant ?? "").localeCompare(String(b.variant ?? ""), "zh-Hans-CN");
      });

    if (items.length === 0) {
      items = [{ product_model: "（無明細）", variant: "", quantity: 0 }];
    }

    const n = items.length;
    const start = rowPtr;
    const end = start + n - 1;
    const sumQty = items.reduce((s, it) => s + (Number(it.quantity) || 0), 0);
    const span = end > start;

    if (span) {
      for (const c of [1, 2, 3, 4, 5]) {
        ws.mergeCells(start, c, end, c);
      }
    }

    ws.getCell(start, 1).value = String(order.customer_name ?? "").trim();
    ws.getCell(start, 1).alignment = { vertical: "middle", horizontal: "left", wrapText: true };

    ws.getCell(start, 2).value = String(order.phone ?? "").trim();
    ws.getCell(start, 2).alignment = { vertical: "middle", wrapText: true };

    ws.getCell(start, 3).value = String(order.shipping_address ?? "").trim();
    ws.getCell(start, 3).alignment = { vertical: "middle", wrapText: true };

    ws.getCell(start, 4).value = String(order.pickup_store_code ?? "").trim();
    ws.getCell(start, 4).alignment = { vertical: "middle", wrapText: true };

    ws.getCell(start, 5).value = Number(order.total_twd) || 0;
    ws.getCell(start, 5).alignment = { vertical: "middle", horizontal: "right" };
    ws.getCell(start, 5).numFmt = "#,##0";

    const modelKey = (it) => String(it.product_model ?? "").trim() || "（未命名商品）";

    let i = 0;
    while (i < items.length) {
      const model = modelKey(items[i]);
      let j = i + 1;
      while (j < items.length && modelKey(items[j]) === model) {
        j++;
      }
      const r1 = start + i;
      const r2 = start + j - 1;
      if (r2 > r1) {
        ws.mergeCells(r1, 6, r2, 6);
      }
      ws.getCell(r1, 6).value = model;
      ws.getCell(r1, 6).alignment = { vertical: "middle", horizontal: "left", wrapText: true };
      i = j;
    }

    for (let k = 0; k < items.length; k++) {
      const r = start + k;
      const it = items[k];
      const variant = String(it.variant ?? "").trim() || "（無規格／口味）";
      ws.getCell(r, 7).value = variant;
    }

    let hi = 0;
    while (hi < items.length) {
      const mk = modelKey(items[hi]);
      let hj = hi + 1;
      while (hj < items.length && modelKey(items[hj]) === mk) {
        hj++;
      }
      const r1 = start + hi;
      const r2 = start + hj - 1;
      const slice = items.slice(hi, hj);
      const q0 = Number(slice[0]?.quantity) || 0;
      const allSameQty = slice.every((it) => (Number(it.quantity) || 0) === q0);
      if (allSameQty && r2 > r1) {
        ws.mergeCells(r1, 8, r2, 8);
        ws.getCell(r1, 8).value = q0;
        ws.getCell(r1, 8).alignment = { horizontal: "center", vertical: "middle" };
      } else {
        for (let k = hi; k < hj; k++) {
          const r = start + k;
          ws.getCell(r, 8).value = Number(items[k].quantity) || 0;
          ws.getCell(r, 8).alignment = { horizontal: "center", vertical: "middle" };
        }
      }
      hi = hj;
    }

    if (span) {
      ws.mergeCells(start, 9, end, 9);
    }
    ws.getCell(start, 9).value = sumQty;
    ws.getCell(start, 9).alignment = { vertical: "middle", horizontal: "center" };

    if (span) {
      ws.mergeCells(start, 10, end, 10);
    }
    const noteCell = ws.getCell(start, 10);
    noteCell.value = String(order.notes ?? "").trim();
    noteCell.alignment = { vertical: "top", horizontal: "left", wrapText: true };
    noteCell.font = { color: { argb: "FFFF0000" } };

    for (let r = start; r <= end; r++) {
      for (let c = 1; c <= 10; c++) {
        const cell = ws.getCell(r, c);
        cell.border = {
          top: thin,
          left: thin,
          bottom: thin,
          right: thin,
        };
      }
    }

    rowPtr = end + 2;
  }

  const buf = await wb.xlsx.writeBuffer();
  return Buffer.from(buf);
}
