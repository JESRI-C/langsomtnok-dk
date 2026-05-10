/**
 * Build a JSON-LD FAQPage schema script entry for use in TanStack head().
 * Pass the same items array used by FAQAccordion to keep schema and UI in sync.
 */
export interface FaqSchemaItem {
  question: string;
  answer: string;
}

export function buildFaqSchemaScript(items: FaqSchemaItem[]) {
  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map((it) => ({
        "@type": "Question",
        name: it.question,
        acceptedAnswer: { "@type": "Answer", text: it.answer },
      })),
    }),
  };
}
