/** @param {string} input */
export function normalizeTaiwanMobile(input) {
  const digits = String(input ?? "").replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("09")) return digits;
  if (digits.length === 9 && digits.startsWith("9")) return `0${digits}`;
  if (digits.length === 12 && digits.startsWith("8869")) return `0${digits.slice(3)}`;
  if (digits.length === 11 && digits.startsWith("886")) return `0${digits.slice(3)}`;
  return "";
}

/** @param {string} input */
export function isValidTaiwanMobile(input) {
  return /^09\d{8}$/.test(normalizeTaiwanMobile(input));
}

/** @param {string} lineId */
export function normalizeLineId(lineId) {
  return String(lineId ?? "")
    .trim()
    .replace(/^@+/, "")
    .toLowerCase();
}
