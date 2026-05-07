import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  title?: string;
  items: FAQItem[];
  variant?: "light" | "section";
}

export function FAQAccordion({ title = "Ofte stillede spørgsmål", items, variant = "section" }: FAQAccordionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const content = (
    <div className="border border-border rounded-lg overflow-hidden">
      {items.map((faq, i) => (
        <div key={i} className={i > 0 ? "border-t border-border" : ""}>
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-soft/30 transition-colors"
          >
            <span className="text-sm font-medium pr-4 leading-relaxed">{faq.question}</span>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                openIdx === i ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`grid transition-all duration-300 ${
              openIdx === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (variant === "section") {
    return (
      <section className="section-padding">
        <div className="container-calm max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl mb-8 text-center">{title}</h2>
          {content}
        </div>
      </section>
    );
  }

  return (
    <div className="max-w-3xl">
      {title && <h2 className="font-serif text-2xl mb-6">{title}</h2>}
      {content}
    </div>
  );
}
