import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import HealthWarning from "@/components/landing/HealthWarning";
import { ContentHubLinks } from "@/components/seo/ContentHubLinks";
import { KeyTakeaways } from "@/components/seo/KeyTakeaways";
import { QuickAnswer } from "@/components/seo/QuickAnswer";
import { PODPICK_GUIDE_TAIWAN_URL } from "@/data/site";

const GUIDE_QUICK_ANSWER = {
  question: "第一次買 LANA 煙彈該怎麼選？",
  answer:
    "建議先確認主機規格（一代通配），再從果味或涼感較低的口味入門。可搭配 LANA 皮革主機與 LANA 煙彈 3 顆裝，或參考 PodPick Guide 台灣專區的 SP2S／LANA 評測文章。",
};

const GUIDE_TAKEAWAYS = [
  "換彈式適合長期使用、口味多元",
  "拋棄式適合即開即用、免充電",
  "下單前 LINE 確認口味庫存",
  "僅限 18 歲以上選購",
  "配送支援超商取貨付款",
];

const GUIDE_LINKS = [
  {
    title: "SP2S vs LANA 怎麼選（台灣）",
    href: "https://podpickguide.com/sp2s-vs-lana-pod-how-to-choose",
    external: true,
  },
  {
    title: "新手如何挑選第一顆煙彈口味",
    href: "https://podpickguide.com/how-to-pick-first-pod-flavor",
    external: true,
  },
  {
    title: "SP2S 32 款口味完整評測",
    href: "https://podpickguide.com/sp2s-pod-flavor-guide",
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
    title: "台灣專區更多指南",
    href: PODPICK_GUIDE_TAIWAN_URL,
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
        <QuickAnswer data={GUIDE_QUICK_ANSWER} />
        <div className="my-8">
          <KeyTakeaways items={GUIDE_TAKEAWAYS} />
        </div>
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
        <ContentHubLinks />
      </main>
      <Footer />
      <HealthWarning />
    </div>
  );
};

export default GuidesHubPage;
