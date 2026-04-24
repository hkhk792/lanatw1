import { Plus } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BrandSp2s } from "@/components/BrandSp2s";
import { useCart } from "@/contexts/CartContext";

interface Props {
  image: string;
  name: string;
  flavor: string;
  price: string;
  index: number;
  id: string;
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
};

const ProductCard = ({ image, name, flavor, price, index, id }: Props) => {
  const ref = useReveal<HTMLDivElement>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const quickAdd = QUICK_ADD_PRODUCTS[id];

  const handleClick = () => {
    if (quickAdd) navigate(quickAdd.route);
  };

  const handleAddToCart: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    if (!quickAdd) return;
    addToCart({
      productId: id,
      title: quickAdd.title,
      variant: quickAdd.variant,
      priceTwd: quickAdd.priceTwd,
      quantity: 1,
    });
    toast.success("已加入購物車", { description: `${quickAdd.variant} x1` });
  };

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className="reveal group relative aspect-[4/5] overflow-hidden glass cursor-pointer transition-shadow duration-700 hover:shadow-gold"
      style={{ transitionDelay: `${(index % 3) * 80}ms` }}
    >
      <div className="absolute inset-0 spotlight opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="absolute inset-0 overflow-hidden">
        <img
          src={image}
          alt={`${name} — ${flavor}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-luxury group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-700" />
      </div>

      <div className="absolute top-5 left-5 z-10">
        <span className="text-[9px] uppercase tracking-luxury text-foreground/60 group-hover:text-gold transition-colors duration-500">
          0{index + 1} / 系列
        </span>
      </div>

      <div className="absolute inset-x-4 bottom-4 z-10 glass-strong p-5 translate-y-4 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-luxury">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-serif text-2xl text-foreground truncate group-hover:text-gradient-gold group-hover:[text-shadow:0_0_24px_hsl(var(--gold)/0.5)] transition-all duration-500">
              {renderTitle(name)}
            </h3>
            <p className="mt-1 text-[10px] uppercase tracking-luxury text-foreground/60 truncate">{flavor}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-sans text-sm font-light text-gold">{price}</p>
          </div>
        </div>

        {quickAdd ? (
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full text-left mt-4 pt-4 border-t hairline border-gold/20 flex items-center justify-between transition-opacity duration-500 delay-100 opacity-90 group-hover:opacity-100 cursor-pointer"
          >
            <span className="text-[10px] uppercase tracking-luxury text-foreground/70">加入購物車</span>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-gold text-primary-foreground group-hover:scale-105 transition-transform">
              <Plus className="h-3.5 w-3.5" />
            </span>
          </button>
        ) : (
          <div className="mt-4 pt-4 border-t hairline flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            <span className="text-[10px] uppercase tracking-luxury text-foreground/70">加入購物車</span>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-gold text-primary-foreground">
              <Plus className="h-3.5 w-3.5" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
