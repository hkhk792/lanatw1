import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { ChevronRight, ExternalLink } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import HealthWarning from "@/components/landing/HealthWarning";
import { BestFor } from "@/components/seo/BestFor";
import { ContentHubLinks } from "@/components/seo/ContentHubLinks";
import { KeyTakeaways } from "@/components/seo/KeyTakeaways";
import { QuickAnswer } from "@/components/seo/QuickAnswer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CATEGORY_LABELS,
  type KnowledgeCategory,
  articlePath,
  getArticleBySlug,
  resolveRelatedArticle,
} from "@/data/knowledgeArticles";
import { deriveKeyTakeaways, deriveQuickAnswer } from "@/lib/content-geo";

const SEGMENT_TO_LIST_PATH: Record<string, string> = {
  guide: "/guides",
  blog: "/blog",
  compare: "/compare",
  flavors: "/flavors",
  brands: "/brands",
};

const SEGMENT_TO_CATEGORY: Record<string, KnowledgeCategory> = {
  guide: "guide",
  blog: "blog",
  compare: "compare",
  flavors: "flavor",
  brands: "brand",
};

const KnowledgeArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { pathname } = useLocation();
  const segment = pathname.split("/").filter(Boolean)[0] ?? "";
  const category = SEGMENT_TO_CATEGORY[segment];

  if (!slug || !category) {
    return <Navigate to="/knowledge" replace />;
  }

  const article = getArticleBySlug(category, slug);
  if (!article) return <Navigate to="/knowledge" replace />;

  const quickAnswer = deriveQuickAnswer(article.title, article.intro, article.quickAnswer);
  const takeaways = deriveKeyTakeaways(article.keyTakeaways);
  const listPath = SEGMENT_TO_LIST_PATH[segment] ?? "/knowledge";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-16 container max-w-3xl">
        <nav aria-label="麵包屑" className="text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-gold">
            首頁
          </Link>
          <span className="mx-2">/</span>
          <Link to="/knowledge" className="hover:text-gold">
            知識中心
          </Link>
          <span className="mx-2">/</span>
          <Link to={listPath} className="hover:text-gold">
            {CATEGORY_LABELS[article.category]}
          </Link>
          <span className="mx-2">/</span>
          <span className="line-clamp-1">{article.title}</span>
        </nav>

        <header className="mb-8">
          <p className="text-[10px] uppercase tracking-luxury text-gold mb-2">
            {CATEGORY_LABELS[article.category]}
            {article.readTime ? ` · ${article.readTime}` : ""}
          </p>
          <h1 className="text-3xl md:text-4xl font-serif tracking-vogue">{article.title}</h1>
          <QuickAnswer data={quickAnswer} />
          <p className="mt-4 text-muted-foreground leading-relaxed">{article.intro}</p>
          <p className="text-xs text-muted-foreground mt-3">最後更新：{article.updated}</p>
        </header>

        {takeaways.length > 0 ? (
          <div className="mb-8">
            <KeyTakeaways items={takeaways} />
          </div>
        ) : null}

        {article.pros?.length || article.cons?.length ? (
          <div className="mb-8">
            <BestFor bestFor={article.pros ?? []} avoidFor={article.cons} />
          </div>
        ) : null}

        <div className="space-y-10">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold mb-3">{section.heading}</h2>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                {section.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              {section.bullets?.length ? (
                <ul className="mt-4 space-y-2">
                  {section.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-muted-foreground">
                      <ChevronRight className="w-4 h-4 mt-1 text-gold shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        {article.relatedProducts?.length ? (
          <section className="mt-12 rounded-2xl border border-gold/20 bg-card/40 p-5">
            <h2 className="text-lg font-bold mb-3">相關商品</h2>
            <ul className="space-y-2">
              {article.relatedProducts.map((p) => (
                <li key={p}>
                  <Link to={p} className="text-gold hover:underline">
                    前往商品頁：{p.replace("/product/", "")}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {article.relatedArticles?.length ? (
          <section className="mt-8 rounded-2xl border border-gold/15 bg-card/30 p-5">
            <h2 className="text-lg font-bold mb-3">相關文章</h2>
            <ul className="space-y-2">
              {article.relatedArticles.map((ref) => {
                const related = resolveRelatedArticle(ref);
                if (!related) return null;
                return (
                  <li key={ref}>
                    <Link to={articlePath(related)} className="text-foreground hover:text-gold">
                      {related.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {article.externalLinks?.length ? (
          <section className="mt-8">
            <h2 className="text-lg font-bold mb-3">延伸閱讀（PodPick Guide）</h2>
            <ul className="space-y-2">
              {article.externalLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gold hover:underline"
                  >
                    {l.label}
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {article.faq?.length ? (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4">常見問題</h2>
            <Accordion type="single" collapsible>
              {article.faq.map((item, i) => (
                <AccordionItem key={item.question} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ) : null}

        <ContentHubLinks />
      </main>
      <Footer />
      <HealthWarning />
    </div>
  );
};

export default KnowledgeArticlePage;
