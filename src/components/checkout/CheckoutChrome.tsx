import { Link } from "react-router-dom";
import { ResponsiveAssetImg } from "@/components/ResponsiveAssetImg";
import { LINE_OFFICIAL_CUSTOMER_URL } from "@/constants/lineOfficial";
import { LineWelcomeGate } from "@/lib/responsiveImageVariants.generated";

export type CheckoutStep = "cart" | "checkout" | "complete";

const stepClass = (active: boolean) =>
  active
    ? "font-semibold text-neutral-900 underline underline-offset-4 decoration-neutral-900"
    : "text-neutral-500";

export function CheckoutProgress({ step }: { step: CheckoutStep }) {
  return (
    <div className="border-b border-neutral-200 bg-white py-6 text-center text-[11px] uppercase tracking-[0.2em] text-neutral-600 sm:text-xs">
      <span className={stepClass(step === "cart")}>購物車</span>
      <span className="mx-2 text-neutral-400 sm:mx-4">→</span>
      <span className={stepClass(step === "checkout")}>結帳</span>
      <span className="mx-2 text-neutral-400 sm:mx-4">→</span>
      <span className={stepClass(step === "complete")}>訂單完成</span>
    </div>
  );
}

export function CheckoutFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          <div className="flex flex-col items-center md:items-start">
            <a
              href={LINE_OFFICIAL_CUSTOMER_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="掃描加入官方 LINE 客服"
              className="block h-36 w-36 border border-white/20 bg-white p-2 transition-opacity hover:opacity-95"
            >
              <ResponsiveAssetImg
                set={LineWelcomeGate}
                sizes="144px"
                alt="加入官方 LINE 客服"
                className="h-full w-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </a>
            <p className="mt-3 max-w-[10rem] text-center text-[10px] text-neutral-400 md:text-left">
              掃描加入官方 LINE，即時回覆訂單與售後諮詢
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white">產品分類</h3>
            <ul className="mt-4 space-y-2 text-sm text-neutral-400">
              <li>
                <a href="/#home-catalog-host" className="hover:text-white">
                  SP2S 主機
                </a>
              </li>
              <li>
                <a href="/#home-catalog-pods" className="hover:text-white">
                  SP2S 煙彈
                </a>
              </li>
              <li>
                <a href="/#home-catalog-pods" className="hover:text-white">
                  LANA 煙彈
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white">常用的連結</h3>
            <ul className="mt-4 space-y-2 text-sm text-neutral-400">
              <li>
                <Link to="/" className="hover:text-white">
                  關於我們
                </Link>
              </li>
              <li>
                <a href="/checkout" className="hover:text-white">
                  結帳流程
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  隱私權政策
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-white/10 pt-8 text-center text-[11px] text-neutral-500">
          © {year} SP2S 電子菸線上商城 · 僅供展示用途
        </p>
      </div>
    </footer>
  );
}
