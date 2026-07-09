import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getProductEditorial } from "@/data/productEditorial";
import { articlePath, resolveRelatedArticle } from "@/data/knowledgeArticles";

/** 商品頁底部長文與相關文章內鏈 */
export function ProductEditorialSection({ variant = "product" }: { variant?: "landing" | "product" }) {
  const { pathname } = useLocation();
  const editorial = getProductEditorial(pathname);
  if (!editorial) return null;

  const box =
    variant === "product"
      ? "mt-10 space-y-8 border-t border-gray-200 pt-10"
      : "mt-10 space-y-8";

  return (
    <div className={box} aria-label="商品詳細說明">
      <h2 className="text-xl font-bold text-gray-900">商品詳細說明</h2>
      {editorial.sections.map((section) => (
        <section key={section.heading}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.heading}</h3>
          {section.paragraphs.map((p) => (
            <p key={p} className="text-sm text-gray-600 leading-relaxed mb-3">
              {p}
            </p>
          ))}
          {section.bullets?.length ? (
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              {section.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
      {editorial.relatedArticleRefs.length > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-base font-semibold mb-2">相關文章</h3>
          <ul className="space-y-2 text-sm">
            {editorial.relatedArticleRefs.map((ref) => {
              const a = resolveRelatedArticle(ref);
              if (!a) return null;
              return (
                <li key={ref}>
                  <Link to={articlePath(a)} className="text-blue-700 hover:underline">
                    {a.title}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link to="/knowledge" className="text-blue-700 hover:underline">
                瀏覽知識中心更多文章 →
              </Link>
            </li>
          </ul>
        </section>
      ) : null}
    </div>
  );
}
