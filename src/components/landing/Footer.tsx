import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  const cols = [
    { title: "Shop", items: ["Devices", "Pods", "Limited Editions", "Accessories"] },
    { title: "Atelier", items: ["Our Story", "Craftsmanship", "Sustainability", "Press"] },
    { title: "Care", items: ["Contact", "Shipping", "Warranty", "FAQs"] },
  ];

  return (
    <footer className="relative pt-24 pb-10 border-t hairline">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/50 text-gold font-serif">
                N
              </span>
              <span className="font-serif text-2xl tracking-wider-2">
                NOIRE<span className="text-gold">.</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Pursuing the pinnacle of vapor through obsessive engineering and quiet luxury.
              Crafted in Tokyo. Shipped globally.
            </p>

            <div className="mt-8 flex items-center gap-3">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social"
                  className="grid h-10 w-10 place-items-center rounded-full hairline border hover:border-gold hover:text-gold transition-colors duration-500"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Cols */}
          {cols.map((c) => (
            <div key={c.title} className="md:col-span-2">
              <p className="text-[10px] uppercase tracking-luxury text-gold mb-5">{c.title}</p>
              <ul className="space-y-3">
                {c.items.map((it) => (
                  <li key={it}>
                    <a
                      href="#"
                      className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300"
                    >
                      {it}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="md:col-span-3">
            <p className="text-[10px] uppercase tracking-luxury text-gold mb-5">Private List</p>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              Early access to limited drops and atelier stories.
            </p>
            <form className="flex border-b hairline border-b-foreground/20 focus-within:border-b-gold transition-colors duration-500">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-transparent py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none"
              />
              <button
                type="submit"
                className="text-[10px] uppercase tracking-luxury text-foreground/70 hover:text-gold transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Compliance */}
        <div className="mt-20 p-6 hairline border bg-card/30">
          <p className="text-[10px] uppercase tracking-wider-2 text-destructive mb-2">
            Warning · Health Notice
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This product contains nicotine. Nicotine is an addictive chemical. NOIRE products
            are intended for adults of legal smoking age (21+) only. Not for use by minors,
            women who are pregnant or breastfeeding, or persons with or at risk of heart disease,
            high blood pressure, diabetes, or taking medicine for depression or asthma.
            Keep out of reach of children and pets.
          </p>
        </div>

        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-luxury text-muted-foreground">
          <p>© 2026 Noire Atelier. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
