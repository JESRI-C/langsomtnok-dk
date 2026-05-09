import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FaqEntry } from "@/lib/universet";

export function UniversetFAQ({ items, title = "Korte svar" }: { items: FaqEntry[]; title?: string }) {
  if (!items?.length) return null;
  return (
    <section className="py-12 md:py-16 border-t border-border/40" data-block="universet-faq">
      <div className="container-calm max-w-3xl">
        <h2 className="font-serif text-2xl md:text-3xl mb-8 text-foreground">{title}</h2>
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-border/30">
              <AccordionTrigger className="text-left font-serif text-lg py-5 hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed pb-6">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
