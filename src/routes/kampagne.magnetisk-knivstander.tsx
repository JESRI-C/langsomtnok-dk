import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/kampagne/knivstander/Hero";
import { ProblemSolution } from "@/components/kampagne/knivstander/ProblemSolution";
import { Trust } from "@/components/kampagne/knivstander/Trust";
import { FaqCta } from "@/components/kampagne/knivstander/FaqCta";

// 👉 Indsæt Shopify-produkt-URL her (kunden vælger træsort på Shopify)
const SHOPIFY_BUY_URL =
  "https://langsomtnok.dk/products/magnetic-knife-display-stand-walnut";

export const Route = createFileRoute("/kampagne/magnetisk-knivstander")({
  head: () => ({
    meta: [
      { title: "Magnetisk knivstander — 399 kr | Langsomt Nok" },
      {
        name: "description",
        content:
          "Magnetisk knivstander i massivt træ. Flytter med — terrasse, sommerhus, grill. Sommerferie-tilbud: 399 kr (før 699 kr).",
      },
      { property: "og:title", content: "Tag din skarpe kniv med derud — 399 kr" },
      {
        property: "og:description",
        content:
          "Magnetisk knivstander i massivt træ. Ingen skruer, ingen væg — bare stil den på bordet.",
      },
    ],
  }),
  component: KampagnePage,
});

function KampagnePage() {
  return (
    <main
      className="min-h-screen bg-[#F4F1EA] text-[#2D2D2D]"
      style={{ fontFamily: '"Inter", system-ui, sans-serif' }}
    >
      <style>{`
        .font-serif { font-family: "Fraunces", "Playfair Display", Georgia, serif; }
      `}</style>
      <Hero buyUrl={SHOPIFY_BUY_URL} />
      <ProblemSolution />
      <Trust />
      <FaqCta buyUrl={SHOPIFY_BUY_URL} />
    </main>
  );
}
