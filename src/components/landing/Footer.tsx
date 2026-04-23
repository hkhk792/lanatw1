import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  const cols = [
    { title: "Shop", items: ["Disposables", "Pods", "E-Liquids", "Accessories"] },
    { title: "Atelier", items: ["Story", "Craft", "Sustainability", "Press"] },
    { title: "Support", items: ["Contact", "Shipping", "Warranty", "FAQ"] },
  ];

  return (
    <footer id="contact" className="relative pt-36 pb-36 border-t hairline">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-gold-soft text-gradient-gold font-serif">
                S
              </span>
              <span className="font-serif text-3xl tracking-vogue text-gradient-gold">
                SP2S
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed tracking-vogue">
              The pinnacle of vapor, refined through obsessive craft and quiet
              luxury. Designed in Tokyo. Shipped worldwide.
            </p>

            <div className="mt-10 flex items-center gap-3">
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
              <p className="text-[10px] uppercase tracking-luxury text-gold mb-6">{c.title}</p>
              <ul className="space-y-3">
                {c.items.map((it) => (
                  <li key={it}>
                    <a
                      href="#"
                      className="text-sm text-foreground/70 hover:text-gold transition-colors duration-300"
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
            <p className="text-[10px] uppercase tracking-luxury text-gold mb-6">Private List</p>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed tracking-vogue">
              Early access to limited releases and atelier stories.
            </p>
            <form className="flex border-b hairline border-b-gold/20 focus-within:border-b-gold transition-colors duration-500">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-transparent py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none"
              />
              <button
                type="submit"
                className="text-[10px] uppercase tracking-luxury text-gold/80 hover:text-gold transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-24 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-luxury text-muted-foreground">
          <p>© 2026 SP2S Atelier. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold transition-colors">Privacy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms</a>
            <a href="#" className="hover:text-gold transition-colors">Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
