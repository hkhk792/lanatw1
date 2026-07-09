import { useLocation } from "react-router-dom";
import { getProductGeo } from "@/data/productGeo";
import { BestFor } from "./BestFor";
import { KeyTakeaways } from "./KeyTakeaways";
import { QuickAnswer } from "./QuickAnswer";
import { ProductShowcaseReviews } from "./ProductShowcaseReviews";
import { ProductEditorialSection } from "./ProductEditorialSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/** 商品頁 GEO 區塊：快速解答、重點、適合對象、FAQ、評價與長文（置於購買區下方）。 */
export function ProductGeoSection() {
  const { pathname } = useLocation();
  const geo = getProductGeo(pathname);
  if (!geo) return null;

  return (
    <section
      aria-label="商品說明與常見問題"
      id="product-geo-content"
      className="mt-16 space-y-4 border-t border-gray-200 pt-10"
    >
      <QuickAnswer data={geo.quickAnswer} variant="product" />
      <KeyTakeaways items={geo.keyTakeaways} variant="product" />
      <BestFor bestFor={geo.bestFor} avoidFor={geo.avoidFor} variant="product" />
      {geo.faq.length > 0 ? (
        <section aria-labelledby="product-geo-faq" className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
          <h2 id="product-geo-faq" className="text-lg font-bold mb-3">
            常見問題
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {geo.faq.map((item, i) => (
              <AccordionItem key={item.question} value={`geo-faq-${i}`}>
                <AccordionTrigger className="text-left text-sm">{item.question}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      ) : null}
      <ProductShowcaseReviews variant="product" />
      <ProductEditorialSection variant="product" />
    </section>
  );
}
