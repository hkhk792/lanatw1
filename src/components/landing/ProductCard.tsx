import { Plus } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useNavigate } from "react-router-dom";
import { flushHomeScrollPosition } from "@/lib/homeScrollRestore";
import { BrandSp2s } from "@/components/BrandSp2s";
import { ResponsiveAssetImg, type ResponsiveImageSet } from "@/components/ResponsiveAssetImg";
import { cn } from "@/lib/utils";
import {
  LANNA_ORDER_PRODUCT_MODEL,
  ORDER_MODEL_ATOMIZER_HOST,
  ORDER_MODEL_DIYA_7500,
  ORDER_MODEL_DIYA_DEVICE,
  ORDER_MODEL_HEBAT_GEN6,
  ORDER_MODEL_JUPITER_SET,
  ORDER_MODEL_LANA_ELiquid_30ML,
  ORDER_MODEL_MOHOO_BOX,
  ORDER_MODEL_NINGA_CARTOON,
  ORDER_MODEL_SP2S_GEN1_DEVICE,
  ORDER_MODEL_SP2S_PRO,
  ORDER_MODEL_SP2S_SILICONE_SLEEVE,
  ORDER_MODEL_VAPOR_STORM_5000,
  ORDER_MODEL_VENUS_HOST,
  ORDER_MODEL_VSTORM_GEN5_PODS,
} from "@/lib/orderProductModels";

interface Props {
  image: string;
  name: string;
  flavor: string;
  price: string;
  index: number;
  id: string;
  /** 兩欄手機格：上圖下文；md+ 仍為底欄疊圖 */
  variant?: "default" | "dense";
  /** 與 image 同圖時傳入，啟用 srcSet（首頁大圖） */
  responsive?: ResponsiveImageSet;
  /** 搭配 responsive；預設適合三欄商品格 */
  responsiveSizes?: string;
  /** 無 QUICK_ADD 對應時，整卡與「+」導向此外部路徑（例如匯入目錄詳情） */
  detailHref?: string;
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
    title: ORDER_MODEL_NINGA_CARTOON,
    variant: "蠟筆小新",
    priceTwd: 550,
    route: "/product/cartoon",
  },
  lanna: {
    title: LANNA_ORDER_PRODUCT_MODEL,
    variant: "炫正紅",
    priceTwd: 500,
    route: "/product/lanna",
  },
  bullet: {
    title: ORDER_MODEL_SP2S_GEN1_DEVICE,
    variant: "丁香紫",
    priceTwd: 450,
    route: "/product/bullet",
  },
  pro: {
    title: ORDER_MODEL_SP2S_PRO,
    variant: "海棠粉",
    priceTwd: 450,
    route: "/product/pro",
  },
  atomizer: {
    title: ORDER_MODEL_ATOMIZER_HOST,
    variant: "綠色",
    priceTwd: 290,
    route: "/product/atomizer",
  },
  diya: {
    title: ORDER_MODEL_DIYA_DEVICE,
    variant: "光影藍綠",
    priceTwd: 320,
    route: "/product/diya",
  },
  "disp-vapengin": {
    title: ORDER_MODEL_VENUS_HOST,
    variant: "口味待選",
    priceTwd: 240,
    route: "/product/venus-host",
  },
  "disp-mohoo-box": {
    title: ORDER_MODEL_MOHOO_BOX,
    variant: "口味待選",
    priceTwd: 450,
    route: "/product/mohoo-tokyo-box",
  },
  "disp-hebat": {
    title: ORDER_MODEL_HEBAT_GEN6,
    variant: "口味待選",
    priceTwd: 340,
    route: "/product/hebat-gen6",
  },
  "disp-diya-7500": {
    title: ORDER_MODEL_DIYA_7500,
    variant: "口味待選",
    priceTwd: 249,
    route: "/product/diya-7500",
  },
  "disp-jupiter": {
    title: ORDER_MODEL_JUPITER_SET,
    variant: "套裝待選",
    priceTwd: 480,
    route: "/product/jupiter-6500",
  },
  "disp-vapor-storm": {
    title: ORDER_MODEL_VAPOR_STORM_5000,
    variant: "口味待選",
    priceTwd: 290,
    route: "/product/vapor-storm-5000",
  },
  "showcase-gen5": {
    title: ORDER_MODEL_VSTORM_GEN5_PODS,
    variant: "口味待選",
    priceTwd: 129,
    route: "/product/vapor-storm-gen5-pods",
  },
  "showcase-e-liquid": {
    title: ORDER_MODEL_LANA_ELiquid_30ML,
    variant: "口味待選",
    priceTwd: 350,
    route: "/product/lana-e-liquid-30ml",
  },
  "showcase-gear": {
    title: ORDER_MODEL_SP2S_SILICONE_SLEEVE,
    variant: "規格待選",
    priceTwd: 120,
    route: "/product/sp2s-silicone-sleeve",
  },
};

const DENSE_CARD_SIZES =
  "(max-width: 480px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 28vw, 380px";

const ProductCard = ({
  image,
  name,
  flavor,
  price,
  index,
  id,
  variant = "default",
  responsive,
  responsiveSizes,
  detailHref,
}: Props) => {
  const ref = useReveal<HTMLDivElement>();
  const navigate = useNavigate();
  const dense = variant === "dense";

  const quickAdd = QUICK_ADD_PRODUCTS[id];
  const isNavigable = Boolean(quickAdd) || Boolean(detailHref);

  const goDetail = () => {
    if (quickAdd) {
      flushHomeScrollPosition();
      navigate(quickAdd.route);
      return;
    }
    if (detailHref) {
      flushHomeScrollPosition();
      navigate(detailHref);
    }
  };

  const handleClick = () => {
    goDetail();
  };

  const handlePlusClick: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    goDetail();
  };

  return (
    <div
      ref={ref}
      onClick={isNavigable ? handleClick : undefined}
      className={cn(
        "reveal group relative transition-shadow duration-700 hover:shadow-gold glass overflow-hidden",
        isNavigable && "cursor-pointer",
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
          {responsive ? (
            <ResponsiveAssetImg
              set={responsive}
              sizes={responsiveSizes ?? DENSE_CARD_SIZES}
              alt={`${name} — ${flavor}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[1400ms] ease-luxury group-hover:scale-110"
            />
          ) : (
            <img
              src={image}
              alt={`${name} — ${flavor}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[1400ms] ease-luxury group-hover:scale-110"
            />
          )}
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
          {isNavigable ? (
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

        {isNavigable ? (
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
