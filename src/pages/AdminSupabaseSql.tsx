import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type Snippet = { id: string; title: string; hint: string; sql: string };

const SNIPPETS: Snippet[] = [
  {
    id: "flat-lines",
    title: "出貨明細（一行一商品，最接近 Excel）",
    hint: "使用資料庫裡的檢視表 orders_shippable_lines：每筆訂單的每個品項各占一行，表頭欄位會重複出現，方便篩選、排序。",
    sql: `SELECT
  order_number,
  site_code,
  status,
  batch_date,
  customer_name,
  phone,
  shipping_address,
  pickup_store_code,
  line_id,
  order_notes,
  subtotal_twd,
  shipping_twd,
  total_twd,
  country,
  payment_method,
  product_model,
  variant,
  quantity,
  unit_price_twd,
  line_total_twd,
  created_at
FROM public.orders_shippable_lines
ORDER BY created_at DESC
LIMIT 300;`,
  },
  {
    id: "batch-today",
    title: "依「台北日曆日」批次篩選",
    hint: "把下面日期改成後台訂單列表上的批次日期；只列出待確認與已發出（與匯出出貨單習慣一致，可自行刪掉條件）。",
    sql: `SELECT *
FROM public.orders_shippable_lines
WHERE batch_date = (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Taipei')::date
  AND status IN ('待确认', '已发出')
ORDER BY order_number, order_item_id;`,
  },
  {
    id: "picking-roll",
    title: "揀貨：依商品＋口味加總件數",
    hint: "類似「揀貨表（口味匯總）」的邏輯；同樣可依 batch_date 改條件。",
    sql: `SELECT
  product_model,
  NULLIF(TRIM(variant), '') AS variant,
  SUM(quantity)::bigint AS total_qty
FROM public.orders_shippable_lines
WHERE batch_date = (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Taipei')::date
  AND status IN ('待确认', '已发出')
GROUP BY product_model, NULLIF(TRIM(variant), '')
ORDER BY product_model, variant;`,
  },
  {
    id: "orders-only",
    title: "只看訂單主檔（不含品項明細）",
    hint: "若覺得明細太長，可只看 orders 一張表；要對品項請用上一段檢視表。",
    sql: `SELECT
  order_number,
  site_code,
  status,
  batch_date,
  customer_name,
  phone,
  total_twd,
  created_at
FROM public.orders
ORDER BY created_at DESC
LIMIT 200;`,
  },
  {
    id: "inventory",
    title: "庫存一覽",
    hint: "對應購物車 product_id 的 on_hand。",
    sql: `SELECT product_id, title, on_hand
FROM public.inventory
ORDER BY title NULLS LAST, product_id;`,
  },
  {
    id: "tables",
    title: "列出 public 底下所有資料表",
    hint: "不確定表名時在 SQL Editor 跑一次即可。",
    sql: `SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;`,
  },
];

function CopyBlock({ label, text }: { label: string; text: string }) {
  const [done, setDone] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      toast.success("已複製到剪貼簿");
      setTimeout(() => setDone(false), 2000);
    } catch {
      toast.error("複製失敗，請手動全選複製");
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => void copy()}
        className="absolute right-2 top-2 rounded-sm border border-neutral-300 bg-white px-2 py-1 text-xs font-medium text-neutral-800 shadow-sm hover:bg-neutral-50"
      >
        {done ? "已複製" : label}
      </button>
      <pre className="max-h-[min(24rem,50vh)] overflow-auto rounded-sm border border-neutral-200 bg-neutral-950 p-3 pr-24 pt-10 text-xs leading-relaxed text-emerald-100">
        <code>{text}</code>
      </pre>
    </div>
  );
}

const AdminSupabaseSql = () => {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">後台輔助</p>
            <h1 className="text-lg font-semibold text-neutral-900">SQL 查詢範本</h1>
          </div>
          <Link to="/admin2589" className="text-sm text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline">
            返回訂單後台
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
        <section className="rounded-sm border border-emerald-200 bg-emerald-50/80 p-5 text-sm leading-relaxed text-emerald-950">
          <h2 className="font-semibold text-emerald-950">怎麼用（ops Postgres / 舊 Supabase）</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>
              優先在伺服器執行：<code className="rounded bg-emerald-100/80 px-1">docker exec -it lanatw1-ops-postgres psql -U lanatw1 -d lanatw1_ops</code>
              （說明見 <code className="rounded bg-emerald-100/80 px-1">docs/OPS-SELFHOST.md</code>）。
            </li>
            <li>
              或暫時仍可用舊 Supabase → <span className="font-medium">SQL Editor</span> → New query。
            </li>
            <li>
              從下面任一段按「複製 SQL」貼上後執行；結果可匯出 CSV。
            </li>
          </ol>
          <p className="mt-3 text-xs text-emerald-900/90">
            本頁<span className="font-medium">不會</span>代你連資料庫；只整理常用 SELECT，方便對照出貨明細。
          </p>
        </section>

        <section className="rounded-sm border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-neutral-900">為什麼用 orders_shippable_lines？</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            訂單主表 <code className="rounded bg-neutral-100 px-1">orders</code> 與明細{" "}
            <code className="rounded bg-neutral-100 px-1">order_items</code>{" "}
            是分開的兩張表；檢視表把它們
            <span className="font-medium text-neutral-800">展開成一行一個品項</span>
            ，欄位順序接近「出貨單／揀貨」思維，在 SQL 結果或匯出 CSV 時會比直接看關聯表直覺。
          </p>
        </section>

        {SNIPPETS.map((s) => (
          <section key={s.id} className="rounded-sm border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-neutral-900">{s.title}</h2>
            <p className="mt-2 text-sm text-neutral-600">{s.hint}</p>
            <div className="mt-4">
              <CopyBlock label="複製 SQL" text={s.sql} />
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default AdminSupabaseSql;
