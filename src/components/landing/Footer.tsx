import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { BrandSp2s } from "@/components/BrandSp2s";
import { SITE_ORG_NAME } from "@/lib/siteConfig";

const Footer = () => {
  const shopLinks = [
    { to: "/product/lanna", label: "LANA 主機" },
    { to: "/product/lana-pods", label: "LANA 煙彈" },
    { to: "/product/sp2s-universal-pods", label: "SP2S 煙彈" },
    { to: "/#home-catalog-disposable", label: "拋棄式" },
  ];

  const trustLinks = [
    { to: "/about", label: "關於我們" },
    { to: "/shipping", label: "配送說明" },
    { to: "/returns", label: "退換貨" },
    { to: "/faq", label: "常見問題" },
    { to: "/guides", label: "選購指南" },
  ];

  const legalLinks = [
    { to: "/privacy", label: "隱私政策" },
    { to: "/terms", label: "服務條款" },
    { to: "/age-verification", label: "年齡驗證" },
  ];

  return (
    <footer
      id="contact"
      className="relative scroll-mt-24 border-t hairline pt-20 pb-24 sm:scroll-mt-28 sm:pt-28 sm:pb-28 md:pt-36 md:pb-36"
    >
      <div className="container max-sm:px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          <div className="md:col-span-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-gold-soft text-gradient-gold font-serif">
                S
              </span>
              <BrandSp2s className="font-serif text-3xl tracking-vogue text-gradient-gold" />
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed tracking-vogue">
              {SITE_ORG_NAME} — 台灣現貨電子煙主機、煙彈與拋棄式選品。僅限 18 歲以上。
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

          <div className="md:col-span-3">
            <p className="text-[10px] uppercase tracking-luxury text-gold mb-6">購物</p>
            <ul className="space-y-3">
              {shopLinks.map((it) => (
                <li key={it.to}>
                  <Link
                    to={it.to}
                    className="text-sm text-foreground/70 hover:text-gold transition-colors duration-300"
                  >
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-[10px] uppercase tracking-luxury text-gold mb-6">客服與信任</p>
            <ul className="space-y-3">
              {trustLinks.map((it) => (
                <li key={it.to}>
                  <Link
                    to={it.to}
                    className="text-sm text-foreground/70 hover:text-gold transition-colors duration-300"
                  >
                    {it.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-24 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-luxury text-muted-foreground">
          <p className="inline-flex flex-wrap items-center gap-x-1">
            © 2026 <BrandSp2s className="font-serif tracking-vogue text-gradient-gold" />。版權所有。
          </p>
          <div className="flex flex-wrap gap-6">
            {legalLinks.map((it) => (
              <Link key={it.to} to={it.to} className="hover:text-gold transition-colors">
                {it.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
