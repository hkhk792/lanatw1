/** Helpers for GEO-friendly content blocks and schema wiring (繁體中文). */

export type QuickAnswer = {
  question: string;
  answer: string;
};

export function deriveQuickAnswer(title: string, intro: string, explicit?: QuickAnswer): QuickAnswer {
  if (explicit) return explicit;
  const question = title.trim().endsWith("？") ? title : `${title.replace(/\s*\|.*$/, "").trim()}是什麼？`;
  return { question, answer: intro };
}

export function deriveKeyTakeaways(explicit?: string[], ...candidates: (string[] | undefined)[]): string[] {
  if (explicit && explicit.length > 0) return explicit.slice(0, 6);
  for (const list of candidates) {
    if (list && list.length > 0) return list.slice(0, 6);
  }
  return [];
}

export function formatContentDate(iso: string): string {
  return new Date(iso).toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" });
}
