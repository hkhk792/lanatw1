import { Plus } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useNavigate } from "react-router-dom";

interface Props {
  image: string;
  name: string;
  flavor: string;
  price: string;
  index: number;
  id: string;
}

const ProductCard = ({ image, name, flavor, price, index, id }: Props) => {
  const ref = useReveal<HTMLDivElement>();
  const navigate = useNavigate();

  const handleClick = () => {
    if (id === "cartoon") {
      navigate("/product/cartoon");
    }
  };

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className="reveal group relative aspect-[4/5] overflow-hidden glass cursor-pointer transition-shadow duration-700 hover:shadow-gold"
      style={{ transitionDelay: `${(index % 3) * 80}ms` }}
    >
      {/* Spotlight backdrop */}
      <div className="absolute inset-0 spotlight opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={image}
          alt={`${name} — ${flavor}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-luxury group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-700" />
      </div>

      {/* Top tag */}
      <div className="absolute top-5 left-5 z-10">
        <span className="text-[9px] uppercase tracking-luxury text-foreground/60 group-hover:text-gold transition-colors duration-500">
          0{index + 1} / 系列
        </span>
      </div>

      {/* Glassmorphism hover panel */}
      <div className="absolute inset-x-4 bottom-4 z-10 glass-strong p-5 translate-y-4 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-luxury">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-serif text-2xl text-foreground truncate group-hover:text-gradient-gold group-hover:[text-shadow:0_0_24px_hsl(var(--gold)/0.5)] transition-all duration-500">
              {name}
            </h3>
            <p className="mt-1 text-[10px] uppercase tracking-luxury text-foreground/60 truncate">
              {flavor}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-sans text-sm font-light text-gold">{price}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t hairline flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          <span className="text-[10px] uppercase tracking-luxury text-foreground/70">加入購物車</span>
          <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-gold text-primary-foreground">
            <Plus className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
