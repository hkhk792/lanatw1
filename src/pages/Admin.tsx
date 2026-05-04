import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type OrderItemRow = {
  product_model: string;
  variant: string;
  quantity: number;
  line_total_twd: number;
};

export type AdminOrder = {
  id: string;
  order_number: string;
  site_code?: string;
  status: string;
  batch_date: string;
  customer_name: string;
  phone: string;
  shipping_address?: string;
  pickup_store_code?: string;
  line_id?: string;
  notes?: string;
  subtotal_twd?: number;
  shipping_twd?: number;
  total_twd: number;
  country?: string;
  payment_method?: string;
  created_at: string;
  order_items: OrderItemRow[] | null;
};

const STORAGE_KEY = "sp2s-admin-secret";

function taipeiCalendarDateIso(d = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const get = (t: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === t)?.value ?? "";
  const y = get("year");
  const m = get("month");
  const day = get("day");
  return `${y}-${m}-${day}`;
}

function formatTwd(n: number) {
  return `NT$${n.toLocaleString("zh-TW")}`;
}

function formatItems(items: OrderItemRow[] | null) {
  if (!items?.length) return "—";
  return items
    .map((i) => {
      const v = i.variant?.trim();
      return `${i.product_model}${v ? `（${v}）` : ""} ×${i.quantity}`;
    })
    .join("；");
}

function formatPaymentMethod(code?: string | null) {
  const c = String(code ?? "").trim();
  if (!c || c === "cod") return "貨到付款";
  return c;
}

const Admin = () => {
  const [secret, setSecret] = useState("");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [openBatches, setOpenBatches] = useState<Record<string, boolean>>({});
  const [exportingBatch, setExportingBatch] = useState<string | null>(null);
  /** 空字串 = 全部站點 */
  const [siteFilter, setSiteFilter] = useState("");
  const [knownSites, setKnownSites] = useState<string[]>([]);

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  const todayBatch = useMemo(() => taipeiCalendarDateIso(), []);

  const stats = useMemo(() => {
    const inBatch = orders.filter((o) => o.batch_date === todayBatch);
    const total = inBatch.length;
    const cancelled = inBatch.filter((o) => o.status === "已取消").length;
    const effective = total - cancelled;
    return { total, cancelled, effective };
  }, [orders, todayBatch]);

  const grouped = useMemo(() => {
    const map = new Map<string, AdminOrder[]>();
    for (const o of orders) {
      const key = o.batch_date || "";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(o);
    }
    return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : a[0] > b[0] ? -1 : 0));
  }, [orders]);

  const fetchOrders = useCallback(async (token: string, siteCodeFilter = "") => {
    setLoading(true);
    try {
      const qs = siteCodeFilter
        ? `?siteCode=${encodeURIComponent(siteCodeFilter)}`
        : "";
      const res = await fetch(`/api/admin/orders${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        setAuthorized(false);
        sessionStorage.removeItem(STORAGE_KEY);
        toast.error("密鑰錯誤或未設定後台環境變數");
        return;
      }
      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const raw = await res.text();
        const looksLikeHtml = /<!doctype\s+html/i.test(raw) || raw.trimStart().startsWith("<html");
        throw new Error(
          looksLikeHtml
            ? "後台 API 未啟用（回傳了網頁）。請確認網域已連到本專案的 Vercel，先開啟 /api/health 應顯示 JSON。"
            : "回應格式異常，請稍後再試。"
        );
      }
      const data = (await res.json()) as { orders?: AdminOrder[]; error?: string };
      if (!res.ok) throw new Error(data.error || "載入失敗");
      setOrders(data.orders ?? []);
      setKnownSites((prev) => {
        const merged = new Set(prev);
        for (const o of data.orders ?? []) {
          const sc = (o as AdminOrder).site_code?.trim();
          if (sc) merged.add(sc);
        }
        return Array.from(merged).sort();
      });
      setAuthorized(true);
      sessionStorage.setItem(STORAGE_KEY, token);
      const keys = [...new Set((data.orders ?? []).map((o) => o.batch_date))];
      const nextOpen: Record<string, boolean> = {};
      keys.forEach((k) => {
        nextOpen[k] = true;
      });
      setOpenBatches((prev) => ({ ...nextOpen, ...prev }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "載入失敗");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSecret(saved);
      void fetchOrders(saved, "");
    }
  }, [fetchOrders]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret.trim()) {
      toast.message("請輸入管理密鑰");
      return;
    }
    void fetchOrders(secret.trim(), siteFilter);
  };

  const updateStatus = async (orderId: string, status: string) => {
    const token = sessionStorage.getItem(STORAGE_KEY) || secret.trim();
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, status }),
      });
      const data = (await res.json()) as { order?: AdminOrder; error?: string };
      if (!res.ok) throw new Error(data.error || "更新失敗");
      if (data.order) {
        const next = data.order as AdminOrder;
        setOrders((prev) =>
          prev.map((o) =>
            o.id === next.id
              ? { ...o, ...next, order_items: next.order_items ?? o.order_items }
              : o
          )
        );
      }
      toast.success("狀態已更新");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "更新失敗");
    }
  };

  const toggleBatch = (batchDate: string) => {
    setOpenBatches((prev) => ({ ...prev, [batchDate]: !prev[batchDate] }));
  };

  const exportBatchCsv = async (batchDate: string) => {
    const token = sessionStorage.getItem(STORAGE_KEY) || secret.trim();
    if (!token) {
      toast.error("請先登入後台");
      return;
    }
    setExportingBatch(batchDate);
    try {
      const params = new URLSearchParams({ batchDate });
      if (siteFilter.trim()) {
        params.set("siteCode", siteFilter.trim());
      }
      const res = await fetch(`/api/admin/export?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        toast.error("未授權，請檢查 ADMIN_SECRET");
        return;
      }
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(j?.error || "匯出失敗");
      }
      const blob = await res.blob();
      const dispo = res.headers.get("Content-Disposition");
      let filename = `出貨單_${batchDate}.csv`;
      const m = /filename\*=UTF-8''([^;]+)/i.exec(dispo || "");
      if (m?.[1]) {
        try {
          filename = decodeURIComponent(m[1].replace(/(^")|("$)/g, ""));
        } catch {
          /* ignore */
        }
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("已下載出貨單 CSV（僅含待確認／已發出）");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "匯出失敗");
    } finally {
      setExportingBatch(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">後台</p>
            <h1 className="text-lg font-semibold text-neutral-900">訂單管理</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <span className="whitespace-nowrap text-neutral-500">站點</span>
              <select
                value={siteFilter}
                onChange={(e) => {
                  const v = e.target.value;
                  setSiteFilter(v);
                  const tok = sessionStorage.getItem(STORAGE_KEY) || secret.trim();
                  if (tok) void fetchOrders(tok, v);
                }}
                className="min-w-[8rem] rounded-sm border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900"
              >
                <option value="">全部</option>
                {knownSites.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <Link to="/" className="text-sm text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline">
              返回商城
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {!authorized ? (
          <form onSubmit={handleLogin} className="mx-auto max-w-md rounded-sm border border-neutral-200 bg-white p-6 shadow-sm">
            <label className="block text-sm font-medium text-neutral-800">管理密鑰</label>
            <p className="mt-1 text-xs text-neutral-500">
              與伺服器環境變數 <code className="rounded bg-neutral-100 px-1">ADMIN_SECRET</code>{" "}
              相同（僅存於此瀏覽器 session）。請勿將後台連結公開；正式環境務必使用強隨機密鑰。
            </p>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="mt-3 w-full rounded-sm border border-neutral-900 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900"
              placeholder="請輸入密鑰"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-neutral-950 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
            >
              {loading ? "驗證中…" : "進入後台"}
            </button>
          </form>
        ) : (
          <>
            <section className="mb-8 rounded-sm border border-neutral-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-neutral-900">今日批次統計（台北日曆日）</h2>
              <p className="mt-1 text-xs text-neutral-500">
                批次日期：<span className="font-medium text-neutral-800">{todayBatch}</span>
              </p>
              <dl className="mt-4 grid grid-cols-3 gap-4 text-center sm:grid-cols-3">
                <div className="rounded-sm border border-neutral-100 bg-neutral-50/80 py-3">
                  <dt className="text-xs text-neutral-500">總單數</dt>
                  <dd className="mt-1 text-2xl font-semibold tabular-nums text-neutral-900">{stats.total}</dd>
                </div>
                <div className="rounded-sm border border-neutral-100 bg-neutral-50/80 py-3">
                  <dt className="text-xs text-neutral-500">已取消</dt>
                  <dd className="mt-1 text-2xl font-semibold tabular-nums text-red-600">{stats.cancelled}</dd>
                </div>
                <div className="rounded-sm border border-neutral-100 bg-neutral-50/80 py-3">
                  <dt className="text-xs text-neutral-500">有效單數</dt>
                  <dd className="mt-1 text-2xl font-semibold tabular-nums text-emerald-700">{stats.effective}</dd>
                </div>
              </dl>
            </section>

            <section>
              <h2 className="mb-4 text-sm font-semibold text-neutral-900">訂單列表</h2>
              {loading && orders.length === 0 ? (
                <p className="text-sm text-neutral-500">載入中…</p>
              ) : orders.length === 0 ? (
                <p className="text-sm text-neutral-500">尚無訂單</p>
              ) : (
                <div className="space-y-4">
                  {grouped.map(([batchDate, list]) => {
                    const open = openBatches[batchDate] !== false;
                    return (
                      <div key={batchDate} className="overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-sm">
                        <div className="flex flex-wrap items-stretch gap-2 border-b border-neutral-100 bg-neutral-50/90 px-3 py-2 sm:px-4 sm:py-3">
                          <button
                            type="button"
                            onClick={() => toggleBatch(batchDate)}
                            className="flex min-h-[44px] min-w-0 flex-1 items-center justify-between gap-2 rounded-sm px-1 py-1 text-left hover:bg-neutral-100/80"
                          >
                            <span className="text-sm font-medium text-neutral-900">
                              {batchDate} 批次
                              <span className="ml-2 font-normal text-neutral-500">（{list.length} 筆）</span>
                            </span>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 shrink-0 text-neutral-500 transition-transform",
                                open ? "rotate-180" : ""
                              )}
                            />
                          </button>
                          <button
                            type="button"
                            disabled={exportingBatch === batchDate}
                            onClick={() => void exportBatchCsv(batchDate)}
                            className="shrink-0 rounded-sm border border-neutral-900 bg-neutral-950 px-3 py-2 text-xs font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
                          >
                            {exportingBatch === batchDate ? "匯出中…" : "匯出本批次出貨單"}
                          </button>
                        </div>
                        {open ? (
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[720px] text-left text-sm">
                              <thead>
                                <tr className="border-b border-neutral-100 bg-white text-xs uppercase tracking-wide text-neutral-500">
                                  <th className="px-3 py-2 font-medium">訂單號</th>
                                  <th className="px-3 py-2 font-medium">商品</th>
                                  <th className="px-3 py-2 font-medium">金額</th>
                                  <th className="px-3 py-2 font-medium">買家</th>
                                  <th className="px-3 py-2 font-medium text-right">操作</th>
                                </tr>
                              </thead>
                              <tbody>
                                {list.map((o) => {
                                  const cancelled = o.status === "已取消";
                                  const rowMuted = cancelled ? "bg-neutral-100/90 text-neutral-500" : "";
                                  const strike = cancelled ? "line-through decoration-neutral-400" : "";
                                  const notesText = (o.notes ?? "").trim();
                                  return (
                                    <Fragment key={o.id}>
                                      <tr className={cn("border-b border-neutral-100", rowMuted)}>
                                        <td className={cn("px-3 py-3 align-top font-mono text-xs", strike)}>
                                          {o.order_number}
                                          {(o.site_code ?? "").trim() ? (
                                            <span className="ml-1.5 inline-block rounded bg-neutral-200 px-1.5 py-0.5 font-sans text-[10px] font-medium text-neutral-800">
                                              {(o.site_code ?? "").trim()}
                                            </span>
                                          ) : null}
                                          <span
                                            className={cn(
                                              "ml-2 inline-block rounded px-1.5 py-0.5 text-[10px] font-normal [text-decoration:none]",
                                              o.status === "已取消" && "bg-red-100 text-red-800",
                                              o.status === "已发出" && "bg-emerald-100 text-emerald-800",
                                              o.status === "待确认" && "bg-amber-100 text-amber-900",
                                              o.status === "异常" && "bg-violet-100 text-violet-900"
                                            )}
                                          >
                                            {o.status}
                                          </span>
                                        </td>
                                        <td className={cn("max-w-[240px] px-3 py-3 align-top text-xs leading-snug", strike)}>
                                          {formatItems(o.order_items)}
                                        </td>
                                        <td className={cn("whitespace-nowrap px-3 py-3 align-top tabular-nums", strike)}>
                                          {formatTwd(o.total_twd)}
                                        </td>
                                        <td className={cn("px-3 py-3 align-top text-xs", strike)}>
                                          <div className={cn("font-medium", cancelled ? "text-neutral-600" : "text-neutral-900")}>
                                            {o.customer_name}
                                          </div>
                                          <div className="mt-0.5 text-neutral-600">{o.phone}</div>
                                        </td>
                                        <td className="bg-white px-3 py-3 align-top text-right">
                                          <div className="flex flex-wrap justify-end gap-1.5 [text-decoration:none]">
                                            <button
                                              type="button"
                                              onClick={() => void updateStatus(o.id, "待确认")}
                                              className="rounded-sm border border-neutral-300 bg-white px-2 py-1 text-[11px] text-neutral-800 hover:bg-neutral-50"
                                            >
                                              待確認
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => void updateStatus(o.id, "已发出")}
                                              className="rounded-sm border border-neutral-800 bg-neutral-900 px-2 py-1 text-[11px] text-white hover:bg-neutral-800"
                                            >
                                              已發出
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => void updateStatus(o.id, "已取消")}
                                              className="rounded-sm border border-red-400 bg-red-50 px-2 py-1 text-[11px] font-medium text-red-700 hover:bg-red-100"
                                            >
                                              已取消
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                      <tr className={cn("border-b border-neutral-200 bg-neutral-50/90", rowMuted)}>
                                        <td colSpan={5} className="px-3 py-3 text-xs leading-relaxed text-neutral-700">
                                          <p className="mb-2 font-medium text-neutral-900">客戶填寫資料</p>
                                          <dl className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3">
                                            <div className="min-w-0 sm:col-span-1">
                                              <dt className="text-[11px] uppercase tracking-wide text-neutral-500">站點標識</dt>
                                              <dd className="font-mono text-neutral-900">{(o.site_code ?? "").trim() || "—"}</dd>
                                            </div>
                                            <div className="min-w-0 sm:col-span-1">
                                              <dt className="text-[11px] uppercase tracking-wide text-neutral-500">國家／地區</dt>
                                              <dd className="text-neutral-900">{(o.country ?? "").trim() || "—"}</dd>
                                            </div>
                                            <div className="min-w-0 sm:col-span-1">
                                              <dt className="text-[11px] uppercase tracking-wide text-neutral-500">付款方式</dt>
                                              <dd className="text-neutral-900">{formatPaymentMethod(o.payment_method)}</dd>
                                            </div>
                                            <div className="min-w-0 sm:col-span-1">
                                              <dt className="text-[11px] uppercase tracking-wide text-neutral-500">LINE ID</dt>
                                              <dd className="break-all font-mono text-neutral-900">{(o.line_id ?? "").trim() || "—"}</dd>
                                            </div>
                                            <div className="min-w-0 sm:col-span-2 lg:col-span-3">
                                              <dt className="text-[11px] uppercase tracking-wide text-neutral-500">收貨地址</dt>
                                              <dd className="text-neutral-900">{(o.shipping_address ?? "").trim() || "—"}</dd>
                                            </div>
                                            <div className="min-w-0">
                                              <dt className="text-[11px] uppercase tracking-wide text-neutral-500">收貨門市號</dt>
                                              <dd className="font-mono text-neutral-900">{(o.pickup_store_code ?? "").trim() || "—"}</dd>
                                            </div>
                                            <div className="min-w-0 sm:col-span-2">
                                              <dt className="text-[11px] uppercase tracking-wide text-neutral-500">金額</dt>
                                              <dd className="tabular-nums text-neutral-900">
                                                小計 {formatTwd(o.subtotal_twd ?? 0)} · 運費 {formatTwd(o.shipping_twd ?? 0)} · 合計{" "}
                                                {formatTwd(o.total_twd)}
                                              </dd>
                                            </div>
                                            <div className="min-w-0 sm:col-span-2 lg:col-span-3">
                                              <dt className="text-[11px] uppercase tracking-wide text-neutral-500">訂單備註</dt>
                                              <dd className="whitespace-pre-wrap text-neutral-900">{notesText || "—"}</dd>
                                            </div>
                                          </dl>
                                        </td>
                                      </tr>
                                    </Fragment>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;
