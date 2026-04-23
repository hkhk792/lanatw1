import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";

const links = [
  { label: "Disposables", href: "#disposables" },
  { label: "Pods & Liquid", href: "#pods" },
  { label: "Accessories", href: "#accessories" },
  { label: "Manifesto", href: "#manifesto" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
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
        scrolled ? "glass-strong py-3" : "bg-transparent py-6"
      }`}
    >
      <div className="container flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-gold-soft text-gradient-gold font-serif text-sm transition-all duration-500 group-hover:border-gold">
            S
          </span>
          <span className="font-serif text-2xl tracking-vogue text-gradient-gold">
            SP2S
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[11px] uppercase tracking-luxury text-foreground/60 hover:text-gradient-gold hover:text-gold transition-colors duration-500"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            aria-label="Cart"
            className="relative grid h-10 w-10 place-items-center rounded-full hairline border hover:border-gold transition-colors duration-500"
          >
            <ShoppingBag className="h-4 w-4 text-gold" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-gold" />
          </button>
          <button
            aria-label="Menu"
            className="md:hidden grid h-10 w-10 place-items-center rounded-full hairline border"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-4 w-4 text-gold" /> : <Menu className="h-4 w-4 text-gold" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden glass-strong border-t hairline mt-3">
          <div className="container py-6 flex flex-col gap-5">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-xs uppercase tracking-luxury text-foreground/70 hover:text-gold"
              >
                {l.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
