import { useEffect, useMemo } from "react";

const cancelIdle =
  typeof window !== "undefined" && "cancelIdleCallback" in window
    ? window.cancelIdleCallback.bind(window)
    : (id: number) => clearTimeout(id);

const requestIdle =
  typeof window !== "undefined" && "requestIdleCallback" in window
    ? window.requestIdleCallback.bind(window)
    : (cb: () => void, opts?: { timeout?: number }) =>
        window.setTimeout(cb, opts?.timeout ?? 1) as unknown as number;

function preloadOne(src: string): Promise<void> {
  return new Promise((resolve) => {
    if (!src) {
      resolve();
      return;
    }
    const img = new Image();
    let finished = false;
    const done = () => {
      if (finished) return;
      finished = true;
      if ("decode" in img && typeof img.decode === "function") {
        img.decode().catch(() => {});
      }
      resolve();
    };

    const el = img as HTMLImageElement & { fetchPriority?: string };
    try {
      el.fetchPriority = "low";
    } catch {
      /* ignore */
    }
    img.onload = done;
    img.onerror = done;
    img.src = src;
    if (img.complete && img.naturalWidth > 0) {
      done();
    }
  });
}

type UsePreloadImagesOptions = {
  /** 每批並行數，避免手機 Safari / 微信同開過多連線 @default 4 */
  concurrency?: number;
  /** 最晚多久內開始預載（毫秒） @default 1200 */
  idleTimeoutMs?: number;
};

/**
 * 在瀏覽器空檔分批預載圖片（下載 + decode），適合詳情頁多圖切換。
 * 建議傳模組級 `readonly string[]`；若陣列引用不穩定，請傳 `urlsKey`。
 */
export function usePreloadImages(
  urls: readonly string[],
  urlsKey?: string,
  options?: UsePreloadImagesOptions
): void {
  const concurrency = options?.concurrency ?? 4;
  const idleTimeoutMs = options?.idleTimeoutMs ?? 1200;
  const key = useMemo(() => urlsKey ?? urls.join("\0"), [urls, urlsKey]);

  useEffect(() => {
    let cancelled = false;
    const list = urls.filter(Boolean);
    if (list.length === 0) return;

    const run = async () => {
      for (let i = 0; i < list.length && !cancelled; i += concurrency) {
        const slice = list.slice(i, i + concurrency);
        await Promise.all(slice.map((src) => preloadOne(src)));
      }
    };

    const idleId = requestIdle(
      () => {
        void run();
      },
      { timeout: idleTimeoutMs }
    );

    return () => {
      cancelled = true;
      cancelIdle(idleId);
    };
  }, [key, urls, concurrency, idleTimeoutMs]);
}
