import { Link, Navigate, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import HealthWarning from "@/components/landing/HealthWarning";
import { ContentHubLinks } from "@/components/seo/ContentHubLinks";
import { KeyTakeaways } from "@/components/seo/KeyTakeaways";
import { QuickAnswer } from "@/components/seo/QuickAnswer";
import { getContentPageBySlug } from "@/data/contentPages";
import { deriveKeyTakeaways, deriveQuickAnswer } from "@/lib/content-geo";

const ContentPage = () => {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\/+/, "").split("/")[0];
  const page = getContentPageBySlug(slug);

  if (!page) return <Navigate to="/" replace />;

  const quickAnswer = deriveQuickAnswer(page.title, page.intro);
  const takeaways = deriveKeyTakeaways(
    page.sections.flatMap((s) => s.bullets ?? []).slice(0, 5),
    [page.intro],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-16 container max-w-3xl">
        <nav aria-label="麵包屑" className="text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-gold">
            首頁
          </Link>
          <span className="mx-2">/</span>
          <span>{page.title}</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-serif tracking-vogue">{page.title}</h1>
          <QuickAnswer data={quickAnswer} />
          <p className="mt-4 text-muted-foreground leading-relaxed">{page.intro}</p>
          <p className="text-xs text-muted-foreground mt-3">最後更新：{page.updated}</p>
        </header>

        {takeaways.length > 0 ? (
          <div className="mb-10">
            <KeyTakeaways items={takeaways} />
          </div>
        ) : null}

        <div className="space-y-10">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold mb-3">{section.heading}</h2>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                {section.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              {section.bullets ? (
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

        <ContentHubLinks />
      </main>
      <Footer />
      <HealthWarning />
    </div>
  );
};

export default ContentPage;
