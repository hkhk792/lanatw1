/**
 * 匯出前將 order_items.product_model 還原為「固定品名」（與 src/lib/orderProductModels.ts 同步）。
 * 舊訂單若把規格寫進 product_model，在此依 variant 併回同一欄位以利 Excel 合併。
 */
const B = {
  LANNA: "SP2S Legend S 一代升級煙桿 多種配色可選",
  NINGA: "NINGA 卡通一代通用主機 多種配色可選",
  BULLET: "SP2S 一代通用主機 sp2s 電子煙主機",
  ATOMIZER: "原子棒電子煙主機 可調功率 · 曲線輸出",
  PRO: "SP2S Pro 二代旗艦霧化主機 智慧感應 · LED 炫彩",
  SP2S_PODS: "SP2S 一代通用煙彈",
  LANA_PODS: "LANA 煙彈 3 顆裝（通用一代主機）",
  DIYA_PODS: "DIYA 叮啞電子煙彈一盒三入 / 通用一代主機",
  DIYA_DEV: "DIYA 叮啞霧化桿：2.5ML 大容量兼容／一代通用",
  VENUS: "VENUS金星主機可充電霧化電子煙主機（台灣現貨）",
  MOHOO: "TOKYO MOHOO BOX 東京魔盒煙彈（多種口味台灣現貨）",
  JUPITER: "JUPITER 木星套裝 6500 口（換彈拋棄式電子煙，台灣現貨）",
  VS5000: "VAPOR STORM 風暴 5000 口拋棄式飛霧發光一次性電子煙桿",
  HEBAT: "HEBAT 喜貝六代 10000 口拋棄式一次性電子煙（15ml 台灣現貨）",
  DIYA7500: "DIYA 叮啞拋棄式 7500 口大容量可充電一次性電子煙",
  LANA_ELiquid: "拉娜 LANA 煙油小瓶裝（30ml）",
  SILICONE: "電子煙配件 思博瑞 SP2S 主機矽膠保護套（多色可選）",
  VS_GEN5: "Vapor Storm 風暴五代煙彈（五代主機通用）",
};

function normalizeLanna(pm, v) {
  const raw = String(pm ?? "").trim();
  if (!raw.includes("SP2S Legend S") || !raw.includes("一代升級煙桿")) {
    return raw;
  }
  const prefix = "SP2S Legend S ";
  if (!raw.startsWith(prefix)) return raw;
  const after = raw.slice(prefix.length);
  const idx = after.indexOf("一代升級煙桿");
  if (idx < 0) return raw;
  const colorInString = idx === 0 ? "" : after.slice(0, idx).trim();
  if (colorInString === "") return B.LANNA;
  if (v && colorInString === String(v).trim()) return B.LANNA;
  return raw;
}

/** pm === base + " " + variant */
function collapseTrailing(pm, v, base) {
  const raw = String(pm ?? "").trim();
  const variant = String(v ?? "").trim();
  if (!variant || !raw) return raw;
  if (raw === `${base} ${variant}`) return base;
  return raw;
}

/**
 * @param {string} productModel
 * @param {string} variant
 * @returns {string}
 */
export function normalizeShipmentProductModel(productModel, variant) {
  let pm = String(productModel ?? "").trim();
  const v = String(variant ?? "").trim();

  pm = normalizeLanna(pm, v);

  if (v) {
    const m1 = pm.match(/^NINGA\s+(.+?)卡通一代通用主機\s+多種配色可選$/);
    if (m1 && m1[1] === v) pm = B.NINGA;

    const m2 = pm.match(/^SP2S\s+(.+?)\s+一代通用主機\s+sp2s\s+電子煙主機$/);
    if (m2 && m2[1] === v) pm = B.BULLET;

    const m3 = pm.match(/^原子棒電子煙主機\s+(.+?)\s+可調功率 · 曲線輸出$/);
    if (m3 && m3[1] === v) pm = B.ATOMIZER;

    const m4 = pm.match(/^SP2S Pro\s+(.+?)\s+二代旗艦霧化主機 智慧感應 · LED 炫彩$/);
    if (m4 && m4[1] === v) pm = B.PRO;

    const m5a = pm.match(/^SP2S 一代通用煙[彈弹]\s+(.+)$/);
    if (m5a && m5a[1] === v) pm = B.SP2S_PODS;

    const m6 = pm.match(/^LANA 煙彈 3 顆裝\s+(.+)$/);
    if (m6 && m6[1] === v) pm = B.LANA_PODS;

    const m7 = pm.match(/^DIYA 叮啞煙彈 3 顆裝\s+(.+)$/);
    if (m7 && m7[1] === v) pm = B.DIYA_PODS;

    const m8 = pm.match(
      /^VENUS 金星主機（(.+?)）可充電霧化主機 VAPENGIN 2ml Mesh$/
    );
    if (m8 && m8[1] === v) pm = B.VENUS;

    const m9 = pm.match(/^TOKYO MOHOO BOX（(.+?)）東京魔盒煙彈 12ml 大容量$/);
    if (m9 && m9[1] === v) pm = B.MOHOO;

    const m10 = pm.match(/^JUPITER 木星套裝 6500 口（(.+?)）換彈拋棄式 台灣現貨$/);
    if (m10 && m10[1] === v) pm = B.JUPITER;

    const m11 = pm.match(/^VAPOR STORM 風暴 5000 口（(.+?)）飛霧發光拋桿$/);
    if (m11 && m11[1] === v) pm = B.VS5000;

    const m12 = pm.match(
      /^HEBAT 喜貝六代（(.+?)）10000 口拋棄式[｜\s]*15ml\s*台灣現貨$/
    );
    if (m12 && m12[1] === v) pm = B.HEBAT;

    const m13 = pm.match(/^DIYA 叮啞 7500 口（(.+?)）大容量可充電一次性$/);
    if (m13 && m13[1] === v) pm = B.DIYA7500;

    const m14 = pm.match(/^拉娜 LANA 煙油 30ml（(.+?)）[｜\s]+鹽尼小瓶裝$/);
    if (m14 && m14[1] === v) pm = B.LANA_ELiquid;

    const m15 = pm.match(/^思博瑞 SP2S 矽膠保護套／掛繩（(.+?)）$/);
    if (m15 && m15[1] === v) pm = B.SILICONE;

    const m16 = pm.match(/^Vapor Storm 風暴五代煙彈（(.+?)）\s*五代主機通用$/);
    if (m16 && m16[1] === v) pm = B.VS_GEN5;

    const m17 = pm.match(/^DIYA 叮啞\s+(.+?)\s+霧化桿｜/);
    if (m17 && m17[1] === v) pm = B.DIYA_DEV;
  }

  pm = collapseTrailing(pm, v, B.SP2S_PODS);
  pm = collapseTrailing(pm, v, B.LANA_PODS);
  pm = collapseTrailing(pm, v, B.DIYA_PODS);
  pm = collapseTrailing(pm, v, B.DIYA_DEV);
  pm = collapseTrailing(pm, v, B.LANNA);

  return pm;
}

/**
 * @param {object} item
 * @returns {object}
 */
export function normalizeOrderItemForShipment(item) {
  const variant = String(item.variant ?? "").trim();
  const merged = normalizeShipmentProductModel(String(item.product_model ?? ""), variant);
  return { ...item, product_model: merged || item.product_model };
}
