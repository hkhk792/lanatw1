import { useEffect, useState } from "react";
import { LINE_OFFICIAL_CUSTOMER_URL } from "@/constants/lineOfficial";
import lineWelcomeImage from "@/assets/line-welcome-gate.webp";

const STORAGE_DISMISSED = "sp2s-line-welcome-dismissed";
/** 舊版年齡門檻鍵：已通過者不再顯示本頁 */
const STORAGE_LEGACY_AGE = "sp2s-age-verified";

const AgeGate = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed =
      sessionStorage.getItem(STORAGE_DISMISSED) === "yes" ||
      sessionStorage.getItem(STORAGE_LEGACY_AGE) === "yes";
    if (!dismissed) setOpen(true);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_DISMISSED, "yes");
    sessionStorage.setItem(STORAGE_LEGACY_AGE, "yes");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-obsidian/95 backdrop-blur-xl animate-fade-in p-4 sm:p-6">
      <div className="absolute inset-0 spotlight opacity-40 pointer-events-none" />
      <div className="relative max-h-[min(92dvh,40rem)] w-full max-w-lg overflow-y-auto overscroll-contain glass-strong p-6 text-center shadow-luxury animate-fade-in-up sm:p-10 md:max-w-xl md:p-12">
        <p className="mb-3 text-[10px] uppercase tracking-luxury text-gold">官方客服</p>
        <h2 className="mb-3 font-serif text-2xl leading-tight text-gradient-gold sm:text-3xl md:text-4xl">
          歡迎來訪，請加入 LINE 客服
        </h2>
        <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed tracking-vogue text-muted-foreground">
          諮詢現貨、下單與售後請透過官方 LINE 聯繫我們。點擊下方圖片或按鈕即可開啟 LINE。
        </p>

        <a
          href={LINE_OFFICIAL_CUSTOMER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-6 block overflow-hidden rounded-sm ring-1 ring-gold/20 transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
        >
          <img
            src={lineWelcomeImage}
            alt="加入官方 LINE 客服"
            className="mx-auto block h-auto max-h-[min(48vh,20rem)] w-full object-contain object-center sm:max-h-[22rem]"
            loading="eager"
            decoding="async"
          />
        </a>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={LINE_OFFICIAL_CUSTOMER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] flex-1 items-center justify-center bg-[#06C755] px-6 py-3.5 text-[11px] font-semibold uppercase tracking-luxury text-white shadow-lg transition-all hover:brightness-110 sm:flex-initial sm:min-w-[12rem]"
          >
            開啟 LINE 客服
          </a>
          <button
            type="button"
            onClick={dismiss}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center hairline border px-6 py-3.5 text-[11px] uppercase tracking-luxury text-foreground/80 transition-colors hover:border-gold/40 hover:text-gold sm:flex-initial sm:min-w-[12rem]"
          >
            繼續瀏覽網站
          </button>
        </div>
        <p className="mt-6 text-[10px] leading-relaxed text-muted-foreground/80">
          本站資訊僅供參考；實際規格與購買方式以 LINE 客服回覆為準。
        </p>
      </div>
    </div>
  );
};

export default AgeGate;
