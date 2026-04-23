import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  const cols = [
    { title: "購物", items: ["裝置", "煙彈", "限量版", "配件"] },
    { title: "工坊", items: ["品牌故事", "工藝精神", "永續發展", "媒體報導"] },
    { title: "客服", items: ["聯絡我們", "運送說明", "保固服務", "常見問題"] },
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
              透過極致工藝與靜奢美學，追求蒸氣藝術的巔峰。
              東京精心打造，全球配送。
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
            <p className="text-[10px] uppercase tracking-luxury text-gold mb-5">私人會員</p>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              優先獲取限量發售與工坊故事。
            </p>
            <form className="flex border-b hairline border-b-foreground/20 focus-within:border-b-gold transition-colors duration-500">
              <input
                type="email"
                placeholder="您的電子郵件"
                className="flex-1 bg-transparent py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none"
              />
              <button
                type="submit"
                className="text-[10px] uppercase tracking-luxury text-foreground/70 hover:text-gold transition-colors"
              >
                加入
              </button>
            </form>
          </div>
        </div>

        {/* Compliance */}
        <div className="mt-20 p-6 hairline border bg-card/30">
          <p className="text-[10px] uppercase tracking-wider-2 text-destructive mb-2">
            警告 · 健康聲明
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            本產品含有尼古丁。尼古丁是一種成癮性化學物質。NOIRE 產品僅供
            法定吸菸年齡（18歲以上）成人使用。未成年人、孕婦或哺乳婦女，
            以及患有心臟病、高血壓、糖尿病或服用憂鬱症或哮喘藥物者請勿使用。
            請置於兒童和寵物無法接觸之處。
          </p>
        </div>

        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-luxury text-muted-foreground">
          <p>© 2026 Noire Atelier. 版權所有。</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">隱私權</a>
            <a href="#" className="hover:text-foreground transition-colors">服務條款</a>
            <a href="#" className="hover:text-foreground transition-colors">合規說明</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
