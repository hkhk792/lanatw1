import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import HealthWarning from "@/components/landing/HealthWarning";
import { ContentHubLinks } from "@/components/seo/ContentHubLinks";
import {
  CATEGORY_LABELS,
  type KnowledgeCategory,
  articlePath,
  getArticlesByCategory,
} from "@/data/knowledgeArticles";

type Props = {
  category: KnowledgeCategory;
  intro: string;
};

export function KnowledgeCategoryIndexPage({ category, intro }: Props) {
  const items = getArticlesByCategory(category);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-16 container max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-gold">
            首頁
          </Link>
          <span className="mx-2">/</span>
          <Link to="/knowledge" className="hover:text-gold">
            知識中心
          </Link>
          <span className="mx-2">/</span>
          <span>{CATEGORY_LABELS[category]}</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-serif tracking-vogue mb-4">{CATEGORY_LABELS[category]}</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">{intro}</p>
        <ul className="space-y-5">
          {items.map((a) => (
            <li key={a.slug} className="border-b border-gold/10 pb-5">
              <Link to={articlePath(a)} className="group">
                <h2 className="text-lg font-semibold group-hover:text-gold">{a.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
              </Link>
            </li>
          ))}
        </ul>
        <ContentHubLinks />
      </main>
      <Footer />
      <HealthWarning />
    </div>
  );
}
