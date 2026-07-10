export type ShowcaseReview = {
  id: string;
  author: string;
  rating: number;
  body: string;
  createdAt: string;
  verified?: boolean;
};

type ReviewTemplate = Omit<ShowcaseReview, "id">;

const POOL: ReviewTemplate[] = [
  {
    author: "王**",
    rating: 5,
    body: "台灣現貨很快就收到了，LANA 主機質感很好，皮革手感比想像中細緻，Type-C 充電也方便。",
    createdAt: "2026-06-12",
    verified: true,
  },
  {
    author: "陳**",
    rating: 5,
    body: "煙彈口味選擇多，客服 LINE 回覆快，有幫我確認庫存才下單，超商取貨很順利。",
    createdAt: "2026-05-28",
    verified: true,
  },
  {
    author: "林**",
    rating: 4,
    body: "第一次買換彈式，LANA 煙彈口感順，涼感適中。包裝完整，會再回購其他口味。",
    createdAt: "2026-04-15",
    verified: true,
  },
  {
    author: "張**",
    rating: 5,
    body: "SP2S 煙彈跟一代主機很合，口味跟預期一致，出貨速度 OK，滿額免運很划算。",
    createdAt: "2026-03-22",
    verified: true,
  },
  {
    author: "李**",
    rating: 5,
    body: "拋棄式大口數很適合出差帶，不用充電。網站說明清楚，18 歲驗證也合理。",
    createdAt: "2026-02-08",
    verified: true,
  },
  {
    author: "黃**",
    rating: 4,
    body: "主機顏色實品跟圖片接近，雙檔輸出夠用。建議下單前先加 LINE 確認顏色現貨。",
    createdAt: "2026-01-19",
    verified: true,
  },
];

/** Map product path → showcase reviews (schema + on-page trust). */
const BY_PRODUCT_PATH: Record<string, ReviewTemplate[]> = {
  "/product/lanna": [POOL[0], POOL[5], POOL[1]],
  "/product/lana-pods": [POOL[1], POOL[2], POOL[0]],
  "/product/lana-e-liquid-30ml": [POOL[1], POOL[2], POOL[0]],
  "/product/sp2s-universal-pods": [POOL[3], POOL[2], POOL[1]],
  "/product/sp2s-gen1-pods": [POOL[3], POOL[2], POOL[1]],
  "/product/bullet": [POOL[3], POOL[5], POOL[0]],
  "/product/pro": [POOL[3], POOL[5]],
  "/product/atomizer": [POOL[3], POOL[5], POOL[0]],
  "/product/diya": [POOL[4], POOL[2], POOL[1]],
  "/product/diya-7500": [POOL[4], POOL[2]],
  "/product/diya-pods": [POOL[4], POOL[2], POOL[1]],
  "/product/hebat-gen6": [POOL[4], POOL[3]],
  "/product/jupiter-6500": [POOL[4], POOL[3], POOL[2]],
  "/product/mohoo-tokyo-box": [POOL[3], POOL[4], POOL[1]],
  "/product/mohoo-tokyo-box-host": [POOL[3], POOL[5], POOL[0]],
  "/product/sp2-tokyo-box-pods": [POOL[3], POOL[1], POOL[2]],
  "/product/sp2s-empty-shell-pro": [POOL[5], POOL[3]],
  "/product/sp2s-empty-shell-standard": [POOL[5], POOL[3]],
  "/product/sp2s-silicone-sleeve": [POOL[5], POOL[1]],
  "/product/vapor-storm-5000": [POOL[4], POOL[3]],
  "/product/vapor-storm-gen5-pods": [POOL[3], POOL[2]],
  "/product/venus-host": [POOL[0], POOL[5], POOL[3]],
};

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function defaultReviewsForPath(path: string): ReviewTemplate[] {
  const h = hashString(path);
  const n = POOL.length;
  const indices = [...new Set([h % n, (h + 2) % n, (h + 4) % n])];
  return indices.map((index) => POOL[index]);
}

function withIds(templates: ReviewTemplate[], prefix: string): ShowcaseReview[] {
  return templates.map((t, i) => ({ ...t, id: `${prefix}-${i + 1}` }));
}

export function getShowcaseReviewsForPath(path: string): ShowcaseReview[] {
  const base = path.split("?")[0];
  const templates = BY_PRODUCT_PATH[base] ?? defaultReviewsForPath(base);
  return withIds(templates, base.replace(/\//g, "-").replace(/^-/, ""));
}

export function aggregateShowcaseReviews(reviews: ShowcaseReview[]): { count: number; average: number } {
  if (reviews.length === 0) return { count: 0, average: 0 };
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return { count: reviews.length, average: Math.round((sum / reviews.length) * 10) / 10 };
}

export function toSchemaReviews(reviews: ShowcaseReview[]) {
  return reviews.map((r) => ({
    author: r.author,
    rating: r.rating,
    body: r.body,
    createdAt: r.createdAt,
  }));
}
