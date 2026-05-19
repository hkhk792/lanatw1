/** 台灣手機：正規化為 09 開頭 10 碼；無法辨識則回傳空字串。 */
export function normalizeTaiwanMobile(input: string): string {
  const digits = String(input ?? "").replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("09")) return digits;
  if (digits.length === 9 && digits.startsWith("9")) return `0${digits}`;
  if (digits.length === 12 && digits.startsWith("8869")) return `0${digits.slice(3)}`;
  if (digits.length === 11 && digits.startsWith("886")) return `0${digits.slice(3)}`;
  return "";
}

export function isValidTaiwanMobile(input: string): boolean {
  return /^09\d{8}$/.test(normalizeTaiwanMobile(input));
}
