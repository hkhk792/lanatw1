import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import HealthWarning from "@/components/landing/HealthWarning";

const GUIDE_LINKS = [
  {
    title: "新手如何挑選第一顆煙彈口味",
    href: "https://podpickguide.com/how-to-pick-first-pod-flavor",
    external: true,
  },
  {
    title: "SP2S 一代 vs 二代煙彈比較",
    href: "https://podpickguide.com/sp2s-gen1-vs-gen2-pods",
    external: true,
  },
  {
    title: "煙彈漏油排查與保存",
    href: "https://podpickguide.com/pod-leaking-troubleshooting",
    external: true,
  },
  {
    title: "機場與旅行攜帶電子煙注意事項",
    href: "https://podpickguide.com/airport-vaping-guide",
    external: true,
  },
  {
    title: "DIY 煙油入門指南",
    href: "https://podpickguide.com/diy-e-liquid-guide",
    external: true,
  },
] as const;

const GuidesHubPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-16 container max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-gold">
            首頁
          </Link>
          <span className="mx-2">/</span>
          <span>選購指南</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-serif tracking-vogue mb-4">選購指南</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          以下指南協助您了解口味挑選、產品差異與日常使用。您也可前往
          <Link to="/faq" className="text-gold mx-1 hover:underline">
            常見問題
          </Link>
          或瀏覽
          <Link to="/product/lanna" className="text-gold mx-1 hover:underline">
            LANA 主機
          </Link>
          、
          <Link to="/product/lana-pods" className="text-gold mx-1 hover:underline">
            LANA 煙彈
          </Link>
          商品頁。
        </p>
        <ul className="space-y-4">
          {GUIDE_LINKS.map((g) => (
            <li key={g.href}>
              <a
                href={g.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-foreground hover:text-gold transition-colors"
              >
                {g.title}
                <ExternalLink className="w-4 h-4 shrink-0 opacity-60" />
              </a>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
      <HealthWarning />
    </div>
  );
};

export default GuidesHubPage;
