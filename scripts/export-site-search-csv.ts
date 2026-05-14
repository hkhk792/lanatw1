import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getSiteSearchEntries } from "../src/lib/siteSearchIndex.ts";

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "..", "exports", "site-search-index.csv");

const rows = getSiteSearchEntries();
const header = ["id", "title", "href", "category", "keywords"] as const;
const lines = [
  "\ufeff" + header.join(","),
  ...rows.map((e) => [e.id, e.title, e.href, e.category, e.keywords].map(csvEscape).join(",")),
];

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${lines.join("\n")}\n`, "utf8");
console.log(outPath);
