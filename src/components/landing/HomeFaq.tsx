import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { siteFaqItems } from "@/data/siteFaq";

const HomeFaq = () => {
  const preview = siteFaqItems.slice(0, 5);

  return (
    <section id="home-faq" className="border-t hairline py-16 md:py-20 scroll-mt-24">
      <div className="container max-w-3xl">
        <p className="text-[10px] uppercase tracking-luxury text-gold mb-3">FAQ</p>
        <h2 className="text-2xl md:text-3xl font-serif tracking-vogue mb-6">常見問題</h2>
        <Accordion type="single" collapsible className="w-full mb-6">
          {preview.map((item, i) => (
            <AccordionItem key={item.question} value={`home-faq-${i}`}>
              <AccordionTrigger className="text-left text-sm md:text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Link to="/faq" className="text-sm text-gold hover:underline">
          查看全部常見問題 →
        </Link>
      </div>
    </section>
  );
};

export default HomeFaq;
