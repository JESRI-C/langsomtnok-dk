import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { ProductRecommendationBlock } from "@/components/landing/ProductRecommendationBlock";
import { TrustBar } from "@/components/landing/TrustBar";
import { CalmCTASection } from "@/components/landing/CalmCTASection";
import { IMAGE_SLOTS } from "@/components/ImageSlot";
import { fetchProductsByQuery, type ShopifyProduct } from "@/lib/shopify";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/ritualer/rolig-opbevaring")({
  head: () => ({
    meta: [
      { title: "Magnetiske knivholdere i træ | Langsomt Nok" },
      { name: "description", content: "Magnetiske knivlister og knivstandere i træ til rolig, synlig og smuk opbevaring af dine køkkenknive." },
      { property: "og:title", content: "Magnetiske knivholdere i træ | Langsomt Nok" },
      { property: "og:description", content: "Rolig opbevaring af dine køkkenknive — magnetisk, synlig, smuk." },
    ],
  }),
  component: OpbevaringPage,
});

const CHOICES = [
  {
    title: "Knivliste på væggen",
    bullets: ["giver mere plads på bordet", "skaber ro på væggen", "holder redskaberne synlige"],
  },
  {
    title: "Knivstander på bordet",
    bullets: ["kræver ingen boring", "står tæt på hånden", "fungerer som et roligt objekt i køkkenet"],
  },
];

const MATERIALS = [
  { title: "Valnød", text: "Varm, mørk og rolig." },
  { title: "Akacie", text: "Lys, moderne og balanceret." },
];

function OpbevaringPage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    trackEvent("landing_page_view" as never, { page: "rolig_opbevaring" });
    fetchProductsByQuery("product_type:'The Calm Kitchen'", 20).then(setProducts);
  }, []);

  return (
    <div data-page-type="campaign_landing" data-campaign="rolig_opbevaring" data-product-category="storage">
      <LandingPageHero
        headline="Når knivene får en fast plads, falder køkkenet til ro."
        subheadline="Magnetiske knivlister og standere i træ til redskaber, der gerne må være synlige."
        primaryCta={{ label: "Find din holder", to: "/ritualer/rolig-opbevaring" }}
        imageSlot={{ name: IMAGE_SLOTS.heroes.giftLandingHero.name, motif: "Lyst skandinavisk køkken med magnetisk knivlist i valnød over stenbordplade" }}
        variant="overlay"
      />

      <TrustBar />

      {/* Problem */}
      <section className="section-padding">
        <div className="container-calm max-w-2xl text-center">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Væk fra skuffen</h2>
          <p className="text-editorial text-muted-foreground">
            Knive, der ligger løst, mister både plads og nærvær.<br />
            Når de får en fast plads, bliver køkkenet lettere at bruge.
          </p>
        </div>
      </section>

      {/* Choice guide */}
      <section className="section-padding bg-soft">
        <div className="container-calm max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl md:text-3xl mb-3">Væg eller bord?</h2>
            <p className="text-muted-foreground text-editorial mx-auto">To rolige måder at give knivene en fast plads.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CHOICES.map((c) => (
              <div key={c.title} className="p-6 rounded-lg border border-border bg-background">
                <h3 className="font-serif text-lg mb-4">{c.title}</h3>
                <ul className="space-y-2">
                  {c.bullets.map((b) => (
                    <li key={b} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-copper">·</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductRecommendationBlock
        title="Knivlister og standere"
        subtitle="Rolig opbevaring i træ, hvor knivene gerne må ses."
        products={products}
      />

      {/* Material guide */}
      <section className="section-padding bg-soft">
        <div className="container-calm max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl md:text-3xl mb-3">Vælg dit træ</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MATERIALS.map((m) => (
              <div key={m.title} className="p-6 rounded-lg border border-border bg-background text-center">
                <h3 className="font-serif text-lg mb-2">{m.title}</h3>
                <p className="text-sm text-muted-foreground">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CalmCTASection
        headline="Skab ro i køkkenet"
        text="Når redskaberne har et hjem, har hverdagen et."
        cta={{ label: "Find din holder", to: "/ritualer/rolig-opbevaring" }}
        variant="warm"
      />
    </div>
  );
}
