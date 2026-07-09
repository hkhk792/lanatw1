import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import HealthWarning from "@/components/landing/HealthWarning";
import { QuickAnswer } from "@/components/seo/QuickAnswer";
import {
  CATEGORY_LABELS,
  type KnowledgeCategory,
  articlePath,
  getArticlesByCategory,
  knowledgeArticles,
} from "@/data/knowledgeArticles";

const HUB_SECTIONS: { category: KnowledgeCategory; path: string; blurb: string }[] = [
  { category: "guide", path: "/guides", blurb: "保存、漏油、口味挑選、通配說明" },
  { category: "blog", path: "/blog", blurb: "品牌介紹、使用心得、拋棄式比較" },
  { category: "compare", path: "/compare", blurb: "LANA vs SP2S 等品牌對比" },
  { category: "flavor", path: "/flavors", blurb: "口味分類與選購建議" },
  { category: "brand", path: "/brands", blurb: "LANA 等品牌完整指南" },
];

const KnowledgeCenterPage = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Navbar />
    <main className="pt-24 pb-16 container max-w-4xl">
      <nav className="text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-gold">
          首頁
        </Link>
        <span className="mx-2">/</span>
        <span>知識中心</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-serif tracking-vogue mb-4">知識中心 Knowledge Hub</h1>
      <QuickAnswer
        data={{
          question: "lanatw1.com 知識中心是什麼？",
          answer:
            "本站知識中心整理 LANA、SP2S、DIYA 等電子煙的選購指南、口味比較、品牌介紹與常見問題，協助台灣使用者在購買前做出 informed 決策，並連結至相關商品頁。",
        }}
      />
      <p className="text-muted-foreground my-8 leading-relaxed">
        採用 Topic Cluster 結構：指南、部落格、比較、口味與品牌分類互相連結，方便搜尋引擎與 AI 理解本站專業範圍。
        您也可前往
        <Link to="/faq" className="text-gold mx-1 hover:underline">
          常見問題
        </Link>
        與
        <Link to="/about" className="text-gold mx-1 hover:underline">
          關於我們
        </Link>
        了解配送與信任資訊。
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        {HUB_SECTIONS.map((s) => (
          <Link
            key={s.category}
            to={s.path}
            className="rounded-2xl border border-gold/20 bg-card/40 p-5 hover:border-gold/40 transition-colors"
          >
            <h2 className="text-lg font-bold text-primary">{CATEGORY_LABELS[s.category]}</h2>
            <p className="text-sm text-muted-foreground mt-1">{s.blurb}</p>
            <p className="text-xs text-gold mt-2">{getArticlesByCategory(s.category).length} 篇文章</p>
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">最新文章</h2>
      <ul className="space-y-4">
        {knowledgeArticles.slice(0, 8).map((a) => (
          <li key={`${a.category}-${a.slug}`}>
            <Link to={articlePath(a)} className="group block">
              <span className="text-[10px] uppercase tracking-luxury text-gold">
                {CATEGORY_LABELS[a.category]}
              </span>
              <p className="font-medium group-hover:text-gold">{a.title}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{a.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
    <Footer />
    <HealthWarning />
  </div>
);

export default KnowledgeCenterPage;
