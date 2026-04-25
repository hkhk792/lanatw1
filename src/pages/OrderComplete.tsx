import { Link } from "react-router-dom";
import { CheckoutFooter, CheckoutProgress } from "@/components/checkout/CheckoutChrome";
import { requestHomeScrollRestore } from "@/lib/homeScrollRestore";

const OrderComplete = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900">
      <CheckoutProgress step="complete" />

      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <Link
            to="/"
            onClick={() => requestHomeScrollRestore()}
            className="text-sm font-semibold tracking-wide text-neutral-900 hover:opacity-70"
          >
            ← 返回商城
          </Link>
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
            SP2S 電子菸線上商城
          </span>
        </div>
      </header>

      <main className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-6 grid h-16 w-16 place-items-center rounded-full border-2 border-neutral-900">
          <span className="text-2xl">✓</span>
        </div>
        <h1 className="text-2xl font-semibold text-neutral-900">訂單完成</h1>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600">
          感謝您的購買。我們已收到訂單，將盡快為您安排出貨。若有疑問請透過右下角 LINE 聯繫客服。
        </p>
        <Link
          to="/"
          onClick={() => requestHomeScrollRestore()}
          className="mt-10 inline-flex bg-neutral-950 px-10 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-neutral-800"
        >
          返回首頁
        </Link>
      </main>

      <CheckoutFooter />
    </div>
  );
};

export default OrderComplete;
