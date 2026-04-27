import { Plus } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useNavigate } from "react-router-dom";
import { flushHomeScrollPosition } from "@/lib/homeScrollRestore";
import { BrandSp2s } from "@/components/BrandSp2s";
import { cn } from "@/lib/utils";

interface Props {
  image: string;
  name: string;
  flavor: string;
  price: string;
  index: number;
  id: string;
  /** 兩欄手機格：上圖下文；md+ 仍為底欄疊圖 */
  variant?: "default" | "dense";
}

const renderTitle = (name: string) => {
  if (/^SP2S/i.test(name)) {
    return (
      <>
        <BrandSp2s className="text-inherit group-hover:text-gradient-gold" />
        {name.slice(4)}
      </>
    );
  }
  return name;
};

const QUICK_ADD_PRODUCTS: Record<
  string,
  { title: string; variant: string; priceTwd: number; route: string }
> = {
  cartoon: {
    title: "NINGA 蠟筆小新卡通一代通用主機",
    variant: "蠟筆小新",
    priceTwd: 550,
    route: "/product/cartoon",
  },
  lanna: {
    title: "SP2S Legend S 思博瑞一代升級煙桿 傳奇版",
    variant: "炫正紅",
    priceTwd: 500,
    route: "/product/lanna",
  },
  bullet: {
    title: "SP2S 思博瑞 一代通用主機",
    variant: "丁香紫",
    priceTwd: 450,
    route: "/product/bullet",
  },
  pro: {
    title: "SP2S Pro 二代旗艦霧化主機",
    variant: "海棠粉",
    priceTwd: 880,
    route: "/product/pro",
  },
  atomizer: {
    title: "原子棒電子煙主機",
    variant: "綠色",
    priceTwd: 680,
    route: "/product/atomizer",
  },
  diya: {
    title: "DIYA 叮啞電子煙主機霧化桿（2.5ML 大容量，一代煙彈通用）",
    variant: "光影藍綠",
    priceTwd: 320,
    route: "/product/diya",
  },
  "disp-vapengin": {
    title: "VENUS金星主機可充電霧化電子煙主機（台灣現貨）",
    variant: "口味待選",
    priceTwd: 240,
    route: "/product/venus-host",
  },
  "disp-mohoo-box": {
    title: "TOKYO MOHOO BOX 東京魔盒煙彈（多種口味台灣現貨）",
    variant: "口味待選",
    priceTwd: 450,
    route: "/product/mohoo-tokyo-box",
  },
  "disp-hebat": {
    title: "HEBAT 喜貝六代 10000 口拋棄式一次性電子煙（15ml 台灣現貨）",
    variant: "口味待選",
    priceTwd: 340,
    route: "/product/hebat-gen6",
  },
  "disp-diya-7500": {
    title: "DIYA 叮啞拋棄式 7500 口大容量可充電一次性電子煙",
    variant: "口味待選",
    priceTwd: 249,
    route: "/product/diya-7500",
  },
  "disp-jupiter": {
    title: "JUPITER 木星套裝 6500 口（換彈拋棄式電子煙，台灣現貨）",
    variant: "套裝待選",
    priceTwd: 480,
    route: "/product/jupiter-6500",
  },
  "disp-vapor-storm": {
    title: "VAPOR STORM 風暴 5000 口拋棄式飛霧發光一次性電子煙桿",
    variant: "口味待選",
    priceTwd: 290,
    route: "/product/vapor-storm-5000",
  },
  "showcase-gen5": {
    title: "Vapor Storm 風暴五代煙彈（五代主機通用）",
    variant: "口味待選",
    priceTwd: 129,
    route: "/product/vapor-storm-gen5-pods",
  },
  "showcase-e-liquid": {
    title: "拉娜 LANA 煙油小瓶裝（30ml）",
    variant: "口味待選",
    priceTwd: 350,
    route: "/product/lana-e-liquid-30ml",
  },
  "showcase-gear": {
    title: "電子煙配件 思博瑞 SP2S 主機矽膠保護套（多色可選）",
    variant: "規格待選",
    priceTwd: 120,
    route: "/product/sp2s-silicone-sleeve",
  },
};

const ProductCard = ({ image, name, flavor, price, index, id, variant = "default" }: Props) => {
  const ref = useReveal<HTMLDivElement>();
  const navigate = useNavigate();
  const dense = variant === "dense";

  const quickAdd = QUICK_ADD_PRODUCTS[id];

  const handleClick = () => {
    if (quickAdd) {
      flushHomeScrollPosition();
      navigate(quickAdd.route);
    }
  };

  const handlePlusClick: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    if (quickAdd) {
      flushHomeScrollPosition();
      navigate(quickAdd.route);
    }
  };

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={cn(
        "reveal group relative cursor-pointer transition-shadow duration-700 hover:shadow-gold glass overflow-hidden",
        dense
          ? "max-md:flex max-md:flex-col max-md:h-auto max-md:min-h-0 max-md:aspect-auto shadow-none sm:shadow-none md:aspect-[4/5] md:overflow-hidden md:hover:shadow-gold"
          : "aspect-[4/5]"
      )}
      style={{ transitionDelay: `${(dense ? index % 2 : index % 3) * 80}ms` }}
    >
      {/* 圖片區：dense 手機上為固定比例圖層，md+ 鋪滿卡片 */}
      <div
        className={cn(
          "overflow-hidden",
          dense
            ? "relative w-full max-md:aspect-square max-md:min-h-0 min-[480px]:max-md:aspect-[3/4] max-md:shrink-0 md:absolute md:inset-0"
            : "absolute inset-0"
        )}
      >
        <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 spotlight" />

        <div className={cn("h-full w-full", dense && "relative md:absolute md:inset-0", !dense && "absolute inset-0")}>
          <img
            src={image}
            alt={`${name} — ${flavor}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-luxury group-hover:scale-110"
          />
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-700 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent",
              dense
                ? "max-md:opacity-0 md:opacity-80 md:group-hover:opacity-95"
                : "opacity-80 group-hover:opacity-95"
            )}
          />
        </div>
      </div>

      {/* 角標：僅在 md+ 顯示於圖上（dense 手機改到下方資訊區） */}
      <div
        className={cn(
          "absolute z-10",
          dense ? "top-2 left-2 sm:top-5 sm:left-5 max-md:hidden" : "top-5 left-5"
        )}
      >
        <span className="text-[9px] uppercase tracking-luxury text-foreground/60 transition-colors duration-500 group-hover:text-gold">
          0{index + 1} / 系列
        </span>
      </div>

      {/* dense · 手機：標題與價格在照片下方，回到實心底＋可讀字 */}
      {dense && (
        <div className="z-20 shrink-0 border-t border-gold/10 bg-card/50 p-2.5 max-md:block md:hidden">
          <p className="mb-1.5 text-[8px] uppercase tracking-luxury text-muted-foreground">
            0{index + 1} / 系列
          </p>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-sm leading-tight text-foreground line-clamp-2 break-words transition-all duration-500 group-hover:text-gradient-gold sm:text-base">
                {renderTitle(name)}
              </h3>
              <p className="mt-1 line-clamp-2 text-[9px] uppercase tracking-luxury text-muted-foreground">
                {flavor}
              </p>
            </div>
            <p className="shrink-0 text-right font-sans text-sm font-light text-gold">{price}</p>
          </div>
          {quickAdd ? (
            <button
              type="button"
              onClick={handlePlusClick}
              className="mt-2.5 flex w-full items-center justify-between border-t border-gold/15 hairline pt-2 text-left transition-opacity cursor-pointer"
            >
              <span className="text-[9px] uppercase tracking-luxury text-foreground/70">查看詳情</span>
              <span className="grid h-6 w-6 place-items-center shrink-0 rounded-full bg-gradient-gold text-primary-foreground transition-transform group-hover:scale-105">
                <Plus className="h-3 w-3" />
              </span>
            </button>
          ) : (
            <div className="mt-2.5 flex items-center justify-between border-t border-gold/20 hairline pt-2">
              <span className="text-[9px] uppercase tracking-luxury text-foreground/70">查看詳情</span>
              <span className="grid h-6 w-6 place-items-center shrink-0 rounded-full bg-gradient-gold text-primary-foreground">
                <Plus className="h-3 w-3" />
              </span>
            </div>
          )}
        </div>
      )}

      {/* md+（dense 與 default）：底欄疊圖，維持原樣式 */}
      <div
        className={cn(
          "z-10 glass-strong p-5 transition-all duration-700 ease-luxury",
          dense && "max-md:hidden",
          dense
            ? "absolute inset-x-0 bottom-0 translate-y-1 opacity-95 group-hover:translate-y-0 group-hover:opacity-100"
            : "absolute inset-x-4 bottom-4 translate-y-4 opacity-90 group-hover:translate-y-0 group-hover:opacity-100"
        )}
      >
        <div
          className={cn(
            "flex justify-between gap-2 min-[400px]:gap-4",
            dense ? "flex-col items-stretch min-[400px]:flex-row min-[400px]:items-end" : "items-end"
          )}
        >
          <div className="min-w-0">
            <h3 className="font-serif text-2xl text-foreground line-clamp-2 break-words transition-all duration-500 group-hover:text-gradient-gold group-hover:[text-shadow:0_0_24px_hsl(var(--gold)/0.5)]">
              {renderTitle(name)}
            </h3>
            <p className="mt-1 line-clamp-2 break-words text-[10px] uppercase tracking-luxury text-foreground/60">
              {flavor}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-sans text-sm font-light text-gold">{price}</p>
          </div>
        </div>

        {quickAdd ? (
          <button
            type="button"
            onClick={handlePlusClick}
            className="mt-4 flex w-full items-center justify-between border-t border-gold/20 hairline pt-4 text-left opacity-90 transition-opacity delay-100 duration-500 group-hover:opacity-100"
          >
            <span className="text-[10px] uppercase tracking-luxury text-foreground/70">查看詳情</span>
            <span className="grid h-7 w-7 place-items-center shrink-0 rounded-full bg-gradient-gold text-primary-foreground transition-transform group-hover:scale-105">
              <Plus className="h-3.5 w-3.5" />
            </span>
          </button>
        ) : (
          <div className="mt-4 flex items-center justify-between border-t border-gold/20 hairline pt-4 opacity-0 transition-opacity delay-100 duration-500 group-hover:opacity-100">
            <span className="text-[10px] uppercase tracking-luxury text-foreground/70">查看詳情</span>
            <span className="grid h-7 w-7 place-items-center shrink-0 rounded-full bg-gradient-gold text-primary-foreground">
              <Plus className="h-3.5 w-3.5" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
