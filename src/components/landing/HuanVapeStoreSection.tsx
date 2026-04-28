import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useReveal } from "@/hooks/useReveal";
import promoBanner from "@/assets/huan-taiwan-vape-banner.jpg";
import iconTruck from "@/assets/huan-icon-truck.png";
import icon711 from "@/assets/huan-icon-711.png";
import iconStore from "@/assets/huan-icon-store.png";
import iconSupport from "@/assets/huan-icon-support.png";

const LINE_SUPPORT_ID = "abs791012";

/** 公開路徑備援（預覽／子路徑部署）；主線用 `import` 由 Vite 產出穩定網址 */
const PROMO_BANNER_PUBLIC = `${import.meta.env.BASE_URL}huan-taiwan-vape-banner.jpg`;

const highlights = [
  {
    img: iconTruck,
    alt: "配送免運示意",
    lines: ["現貨滿額免運", "全館滿1500免運"],
  },
  {
    img: icon711,
    alt: "7-ELEVEN 物流配送",
    lines: ["7-11極速配", "下訂後24小時內發貨"],
  },
  {
    img: iconStore,
    alt: "正品專櫃保障",
    lines: ["正品保障專櫃品質，", "100%原廠販售！"],
  },
  {
    img: iconSupport,
    alt: "售後客服",
    lines: ["售後保障", "非人為質量問題免費退換貨！"],
  },
] as const;

const HuanVapeStoreSection = () => {
  const copyRef = useReveal<HTMLDivElement>();
  const bannerRef = useReveal<HTMLDivElement>();
  const gridRef = useReveal<HTMLDivElement>();

  const copyLineId = async () => {
    try {
      await navigator.clipboard.writeText(LINE_SUPPORT_ID);
      toast({
        title: "已複製官方客服 LINE",
        description: LINE_SUPPORT_ID,
      });
    } catch {
      toast({
        title: "無法複製",
        description: "請手動記下客服 ID：" + LINE_SUPPORT_ID,
        variant: "destructive",
      });
    }
  };

  return (
    <section
      id="taiwan-vape-store"
      className="relative border-y hairline bg-background py-14 sm:py-20 md:py-28"
      aria-labelledby="taiwan-vape-store-heading"
    >
      <div className="absolute inset-0 pointer-events-none spotlight opacity-20" />
      <div className="container relative max-sm:px-3">
        <div ref={copyRef} className="reveal mx-auto max-w-3xl">
          <p className="mb-4 text-center text-[10px] uppercase tracking-luxury text-gold">
            Taiwan-VAPE
          </p>
          <h2
            id="taiwan-vape-store-heading"
            className="mb-4 text-center font-serif text-2xl leading-tight text-gradient-gold sm:text-3xl md:text-4xl"
          >
            <span aria-hidden className="mr-1 inline-block">
              🏆
            </span>
            Taiwan-VAPE 電子煙專賣店
          </h2>
          <p className="mb-10 text-center text-sm font-medium tracking-wide text-foreground/90 sm:text-base">
            【100% 正品保證 ｜ 台灣現貨 ｜ 快速到貨】
          </p>

          <div className="space-y-6 text-[13px] leading-relaxed tracking-vogue text-muted-foreground sm:text-sm">
            <p className="text-foreground/95">我們深知您對品質的追求，Taiwan-VAPE 承諾：</p>
            <ul className="space-y-4 border-l border-gold/25 pl-4">
              <li>
                <span className="font-medium text-foreground">正品保障：</span>
                全系列產品均來自官方授權供應商，嚴格品檢。
              </li>
              <li>
                <span className="font-medium text-foreground">完善保固：</span>
                享製造商原廠保固，售後無憂。
              </li>
              <li>
                <span className="font-medium text-foreground">極速配送：</span>
                全台超商取貨付款（店到店），下單後約 3 天快速送達。
              </li>
              <li>
                <span className="font-medium text-foreground">安心購物：</span>
                提供 7 天鑑賞期，保障您的消費權益。
              </li>
            </ul>
            <p className="rounded-sm border border-gold/15 bg-card/30 px-4 py-3 text-[13px] sm:text-sm">
              <span className="mr-1.5" aria-hidden>
                💡
              </span>
              <span className="font-medium text-foreground">溫馨提示：</span>
              若遇到網站無法下單，請直接聯繫客服手動下單。
            </p>
            <p className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <span>
                <span className="mr-1.5" aria-hidden>
                  🔗
                </span>
                <span className="font-medium text-foreground">官方客服 LINE：</span>
                <span className="select-all font-mono text-foreground/90">{LINE_SUPPORT_ID}</span>
              </span>
              <button
                type="button"
                onClick={copyLineId}
                className={cn(
                  "w-fit rounded-full border border-gold/30 bg-gold/5 px-4 py-2 text-[11px] uppercase tracking-luxury text-gold",
                  "transition-colors hover:border-gold/50 hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
                )}
              >
                點擊複製
              </button>
            </p>
          </div>
        </div>

        <div
          ref={bannerRef}
          className={cn(
            "reveal mx-auto mt-10 max-w-5xl overflow-hidden rounded-sm bg-[hsl(0_0%_2%)]",
            "flex min-h-[12rem] justify-center px-3 py-8 sm:mt-14 sm:min-h-[14rem] sm:px-6 sm:py-10 md:mt-16 md:min-h-[16rem] md:py-12"
          )}
        >
          <img
            src={promoBanner}
            alt="Taiwan-VAPE 電子煙專賣店形象橫幅"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            onError={(e) => {
              const el = e.currentTarget;
              if (el.src !== PROMO_BANNER_PUBLIC) el.src = PROMO_BANNER_PUBLIC;
            }}
            className="mx-auto block h-auto max-h-[min(52vw,22rem)] w-auto max-w-full object-contain object-center sm:max-h-[min(48vw,26rem)] md:max-h-[min(40vw,28rem)] lg:max-h-[30rem]"
          />
        </div>

        <div
          ref={gridRef}
          className={cn(
            "reveal mt-10 grid grid-cols-2 gap-6 sm:mt-14 sm:gap-8 md:mt-16 md:grid-cols-4 md:gap-6 lg:gap-10"
          )}
        >
          {highlights.map((item) => (
            <div
              key={item.alt}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-3 flex h-[4.25rem] w-full items-center justify-center sm:h-20 md:h-24">
                <img
                  src={item.img}
                  alt=""
                  loading="lazy"
                  className="max-h-full w-auto max-w-[min(100%,7.5rem)] object-contain object-center sm:max-w-[8.5rem]"
                />
              </div>
              <div className="space-y-0.5 text-[11px] leading-snug text-muted-foreground sm:text-xs md:text-[13px]">
                {item.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HuanVapeStoreSection;
