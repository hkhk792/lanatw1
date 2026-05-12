import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { BrandSp2s } from "@/components/BrandSp2s";
import { useCart } from "@/contexts/CartContext";

const links = [
  { label: "產品系列", href: "#disposables" },
  { label: "科技工藝", href: "#pods" },
  { label: "口味系列", href: "#accessories" },
  { label: "品牌日誌", href: "#manifesto" },
  { label: "聯絡我們", href: "#contact" },
];

const Navbar = () => {
  const { itemCount, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-700 ease-luxury ${
        scrolled ? "glass-strong py-3" : "bg-transparent py-5 sm:py-6"
      }`}
    >
      <div className="safe-area-pt">
        <div className="container flex items-center gap-2 sm:gap-4">
          <div className="flex min-w-0 flex-1 items-center justify-start">
            <a href="#" className="flex min-w-0 items-center gap-2 sm:gap-3 group">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold-soft text-gradient-gold font-serif text-sm transition-all duration-500 group-hover:border-gold">
                S
              </span>
              <BrandSp2s className="min-w-0 truncate font-serif text-lg tracking-vogue text-gradient-gold sm:text-xl md:text-2xl" />
            </a>
          </div>

          <p className="pointer-events-none shrink-0 text-center text-xs font-medium tracking-wide text-gold sm:text-sm md:text-base">
            货到付款
          </p>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-4 md:gap-8">
            <nav className="hidden min-w-0 items-center gap-6 lg:gap-10 md:flex">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="shrink-0 text-[10px] uppercase tracking-luxury text-foreground/60 hover:text-gradient-gold hover:text-gold transition-colors duration-500 lg:text-[11px]"
                >
                  {l.label}
                </a>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2 sm:gap-4">
              <button
                type="button"
                aria-label="購物車"
                onClick={openCart}
                className="relative grid h-11 min-h-[44px] min-w-[44px] w-11 place-items-center rounded-full hairline border hover:border-gold transition-colors duration-500"
              >
                <ShoppingBag className="h-4 w-4 text-gold" />
                {itemCount > 0 ? (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[1.15rem] h-[1.15rem] px-0.5 rounded-full bg-gold text-[10px] font-medium leading-none text-primary-foreground flex items-center justify-center">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                ) : null}
              </button>
              <button
                aria-label="Menu"
                className="md:hidden grid h-11 min-h-[44px] min-w-[44px] w-11 place-items-center rounded-full hairline border"
                onClick={() => setOpen(!open)}
              >
                {open ? <X className="h-4 w-4 text-gold" /> : <Menu className="h-4 w-4 text-gold" />}
              </button>
            </div>
          </div>
        </div>

      {open && (
        <nav className="md:hidden glass-strong border-t hairline mt-2 sm:mt-3">
          <div className="container py-5 sm:py-6 flex flex-col gap-4 sm:gap-5">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-1 text-sm uppercase tracking-luxury text-foreground/70 hover:text-gold active:text-gold"
              >
                {l.label}
              </a>
            ))}
          </div>
        </nav>
      )}
      </div>
    </header>
  );
};

export default Navbar;
