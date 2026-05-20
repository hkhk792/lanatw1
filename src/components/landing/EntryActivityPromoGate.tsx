import { useCallback, useState } from "react";
import { LINE_OFFICIAL_CUSTOMER_URL } from "@/constants/lineOfficial";
import { productPhoto } from "@/lib/productPhotos";

const STORAGE_PROMO_DISMISSED = "sp2s-entry-activity-promo-dismissed";

/** 查詢參數：更換海報檔後遞增，避免 CDN／瀏覽器沿用舊快取 */

const posterPrimary = `${productPhoto("entry-promo-splash.png")}?v=1`;
const posterLegacy = `${productPhoto("entry-buy5-splash.png")}?v=1`;

type Props = {
  /** 關閉活動層後觸發（例如接續顯示 LINE 二維碼門檻） */
  onAfterDismiss?: () => void;
};

const EntryActivityPromoGate = ({ onAfterDismiss }: Props) => {
  const [dismissedLocal, setDismissedLocal] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const [useLegacyPoster, setUseLegacyPoster] = useState(false);

  const posterSrc = useLegacyPoster ? posterLegacy : posterPrimary;

  const canShow =
    !dismissedLocal && sessionStorage.getItem(STORAGE_PROMO_DISMISSED) !== "yes";

  const dismiss = useCallback(() => {
    sessionStorage.setItem(STORAGE_PROMO_DISMISSED, "yes");
    setDismissedLocal(true);
    onAfterDismiss?.();
  }, [onAfterDismiss]);

  const onPosterError = useCallback(() => {
    if (!useLegacyPoster) {
      setUseLegacyPoster(true);
      return;
    }
    setPosterFailed(true);
  }, [useLegacyPoster]);

  if (!canShow) return null;

  return (
    <div
      className="fixed inset-0 z-[58] flex flex-col overflow-y-auto overscroll-contain bg-[#050505] animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="entry-promo-title"
    >
      <div className="mx-auto flex min-h-full w-full max-w-3xl flex-1 flex-col">
        {/* 活動海報（新檔優先；無則回退舊圖／內建版式） */}
        <div className="relative flex flex-1 flex-col items-center justify-center px-2 pt-4 pb-2 sm:px-4 sm:pt-6">
          <h1 id="entry-promo-title" className="sr-only">
            超值活動：全場買 10 送 1、煙彈買 5 送 1、首單包郵、滿千送三百現金券
          </h1>
          {!posterFailed ? (
            <img
              src={posterSrc}
              alt="買越多省越多：全場買 10 送 1、煙彈買 5 送 1、首單包郵、消費滿一千送三百現金券"
              className="max-h-[min(88dvh,calc(100dvh-9rem))] w-full max-w-2xl object-contain object-top"
              loading="eager"
              decoding="async"
              onError={onPosterError}
            />
          ) : (
            <div className="relative w-full overflow-hidden px-4 pb-10 pt-12 sm:px-8 sm:pb-14 sm:pt-16">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.18),transparent_55%)]" />
              <p className="relative mb-4 flex items-center gap-2 text-[10px] uppercase tracking-luxury text-gold/90">
                <span className="inline-block h-2 w-2 rounded-full bg-gold shadow-[0_0_12px_hsl(var(--gold)/0.6)]" />
                超值活動 · 雙重贈品
              </p>
              <h2 className="relative font-serif text-3xl leading-[1.08] tracking-tight text-gradient-gold sm:text-5xl sm:leading-[1.02]">
                全場買 10 送 1
              </h2>
              <p className="relative mt-3 text-sm text-foreground/75 sm:text-base">
                付費滿 10 件 · 私訊 LINE 客服自選 1 份贈品
              </p>
              <div className="relative mt-10 grid grid-cols-2 gap-3 sm:gap-4">
                <div className="hairline border border-gold/25 bg-card/20 p-3 text-center sm:p-4">
                  <p className="text-[9px] uppercase tracking-luxury text-gold/80">LANAVAPE 煙彈</p>
                  <p className="mt-1 font-serif text-lg text-foreground sm:text-xl">買 5 送 1</p>
                </div>
                <div className="hairline border border-gold/25 bg-card/20 p-3 text-center sm:p-4">
                  <p className="text-[9px] uppercase tracking-luxury text-gold/80">SP2S 煙彈</p>
                  <p className="mt-1 font-serif text-lg text-foreground sm:text-xl">買 5 送 1</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部操作：暫不收合 LINE 二維碼，僅保留進站與文字客服連結 */}
        <div className="sticky bottom-0 z-[1] mt-auto border-t border-gold/20 bg-gradient-to-t from-[#050505] via-[#050505]/98 to-transparent px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-8">
          <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3">
            <button
              type="button"
              onClick={dismiss}
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-gradient-to-r from-red-600 to-red-500 px-6 py-3.5 text-sm font-semibold tracking-wide text-white shadow-lg transition-all hover:brightness-110 sm:max-w-xs"
            >
              進入官網
            </button>
            <a
              href={LINE_OFFICIAL_CUSTOMER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-muted-foreground underline decoration-gold/40 underline-offset-4 transition-colors hover:text-gold"
            >
              活動／現貨諮詢請聯繫 LINE 客服
            </a>
            <p className="text-center text-[10px] leading-relaxed text-muted-foreground/75">
              活動內容以門市與客服公告為準；僅限 18 歲以上。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryActivityPromoGate;
