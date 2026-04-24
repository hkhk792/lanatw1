import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { BrandSp2s } from "@/components/BrandSp2s";

const Footer = () => {
  const cols = [
    { title: "購物", items: ["一次性產品", "彈匣", "電子煙油", "配飾"] },
    { title: "工坊", items: ["品牌故事", "工藝", "可持續發展", "媒體報導"] },
    { title: "客服", items: ["聯絡我們", "配送", "保固", "常見問題"] },
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
              <BrandSp2s className="font-serif text-3xl tracking-vogue text-gradient-gold" />
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed tracking-vogue">
              蒸氣藝術巔峰，透過極致工藝和低調奢華精煉而成。
              東京設計，全球配送。
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
            <p className="text-[10px] uppercase tracking-luxury text-gold mb-6">私人會員名單</p>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed tracking-vogue">
              優先獲取限量版發布和工坊故事。
            </p>
            <form className="flex border-b hairline border-b-gold/20 focus-within:border-b-gold transition-colors duration-500">
              <input
                type="email"
                placeholder="您的電子郵件"
                className="flex-1 bg-transparent py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none"
              />
              <button
                type="submit"
                className="text-[10px] uppercase tracking-luxury text-gold/80 hover:text-gold transition-colors"
              >
                加入
              </button>
            </form>
          </div>
        </div>

        <div className="mt-24 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-luxury text-muted-foreground">
          <p className="inline-flex flex-wrap items-center gap-x-1">
            © 2026 <BrandSp2s className="font-serif tracking-vogue text-gradient-gold" /> 工坊。版權所有。
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold transition-colors">隱私政策</a>
            <a href="#" className="hover:text-gold transition-colors">服務條款</a>
            <a href="#" className="hover:text-gold transition-colors">合規說明</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
