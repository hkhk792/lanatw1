import { useCallback, useMemo, useState } from "react";
import { LINE_OFFICIAL_CUSTOMER_URL } from "@/constants/lineOfficial";

const STORAGE_PROMO_DISMISSED = "sp2s-entry-activity-promo-dismissed";

function isAgeOrLineGateOk() {
  return (
    sessionStorage.getItem("sp2s-line-welcome-dismissed") === "yes" ||
    sessionStorage.getItem("sp2s-age-verified") === "yes"
  );
}

const posterSrc = `${import.meta.env.BASE_URL}promo/entry-activity.jpg`;

type Props = {
  /** 與 AgeGate 解鎖後連動，強制重新判斷是否顯示 */
  gateEpoch: number;
};

const EntryActivityPromoGate = ({ gateEpoch }: Props) => {
  const [dismissedLocal, setDismissedLocal] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);

  const qrSrc = useMemo(() => {
    const u = encodeURIComponent(LINE_OFFICIAL_CUSTOMER_URL);
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${u}`;
  }, []);

  const canShow =
    !dismissedLocal &&
    sessionStorage.getItem(STORAGE_PROMO_DISMISSED) !== "yes" &&
    isAgeOrLineGateOk();

  const dismiss = useCallback(() => {
    sessionStorage.setItem(STORAGE_PROMO_DISMISSED, "yes");
    setDismissedLocal(true);
  }, []);

  if (!canShow) return null;

  return (
    <div
      key={gateEpoch}
      className="fixed inset-0 z-[58] flex flex-col overflow-y-auto overscroll-contain bg-[#050505] animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="entry-promo-title"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
        {/* 活動海報：有圖用圖，無圖用內建黑金版式 */}
        <div className="relative w-full shrink-0 border-b border-gold/25">
          {!posterFailed ? (
            <img
              src={posterSrc}
              alt="期間限定活動：全場買十送一、滿額免運等優惠"
              className="block w-full object-cover object-top"
              loading="eager"
              decoding="async"
              onError={() => setPosterFailed(true)}
            />
          ) : (
            <div className="relative overflow-hidden px-4 pb-10 pt-12 sm:px-8 sm:pb-14 sm:pt-16">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.18),transparent_55%)]" />
              <p className="relative mb-4 flex items-center gap-2 text-[10px] uppercase tracking-luxury text-gold/90">
                <span className="inline-block h-2 w-2 rounded-full bg-gold shadow-[0_0_12px_hsl(var(--gold)/0.6)]" />
                限時狂歡 · 多買多送 · 優惠不設限
              </p>
              <h1
                id="entry-promo-title"
                className="relative font-serif text-3xl leading-[1.08] tracking-tight text-gradient-gold sm:text-5xl sm:leading-[1.02]"
              >
                全場買 10 送 1
              </h1>
              <p className="relative mt-3 text-sm text-foreground/75 sm:text-base">滿 NT$1500 免運費</p>
              <div className="relative mt-10 grid grid-cols-2 gap-3 sm:gap-4">
                <div className="hairline border border-gold/25 bg-card/20 p-3 text-center sm:p-4">
                  <p className="text-[9px] uppercase tracking-luxury text-gold/80">LANA</p>
                  <p className="mt-1 font-serif text-lg text-foreground sm:text-xl">買 5 送 1</p>
                </div>
                <div className="hairline border border-gold/25 bg-card/20 p-3 text-center sm:p-4">
                  <p className="text-[9px] uppercase tracking-luxury text-gold/80">SP2S</p>
                  <p className="mt-1 font-serif text-lg text-foreground sm:text-xl">買 5 送 1</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 與海報拼接：LINE 掃碼區 */}
        <div className="relative flex flex-col items-center gap-5 bg-gradient-to-b from-[#0a0a0a] to-[#050505] px-4 py-10 sm:gap-6 sm:px-8 sm:py-12">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold/50 to-transparent sm:w-24" />
          <p className="text-center text-[10px] uppercase tracking-luxury text-gold/85">官方客服</p>
          <h2 className="text-center font-serif text-xl text-foreground sm:text-2xl">掃碼加入 LINE 客服</h2>
          <p className="max-w-md text-center text-xs leading-relaxed text-muted-foreground sm:text-sm">
            諮詢現貨、活動細節與下單方式；掃描下方 QR Code 或點按鈕即可開啟 LINE。
          </p>
          <a
            href={LINE_OFFICIAL_CUSTOMER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-white p-3 shadow-[0_0_40px_rgba(0,0,0,0.45)] ring-1 ring-gold/30 transition-opacity hover:opacity-95"
          >
            <img src={qrSrc} alt="LINE 官方客服 QR Code" width={240} height={240} className="block h-48 w-48 sm:h-56 sm:w-56" decoding="async" />
          </a>
          <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={LINE_OFFICIAL_CUSTOMER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] flex-1 items-center justify-center bg-[#06C755] px-6 py-3.5 text-[11px] font-semibold uppercase tracking-luxury text-white shadow-lg transition-all hover:brightness-110 sm:min-w-[11rem]"
            >
              開啟 LINE
            </a>
            <button
              type="button"
              onClick={dismiss}
              className="inline-flex min-h-[48px] flex-1 items-center justify-center bg-gradient-gold px-6 py-3.5 text-[11px] font-medium uppercase tracking-luxury text-primary-foreground transition-all hover:shadow-gold sm:min-w-[11rem]"
            >
              進入官網
            </button>
          </div>
          <p className="max-w-md text-center text-[10px] leading-relaxed text-muted-foreground/75">
            活動內容以客服與門市公告為準；僅限 18 歲以上。
          </p>
        </div>
      </div>
    </div>
  );
};

export default EntryActivityPromoGate;
