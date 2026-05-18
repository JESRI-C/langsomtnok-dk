import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { ProductRecommendationBlock } from "@/components/landing/ProductRecommendationBlock";
import { TrustBar } from "@/components/landing/TrustBar";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { CalmCTASection } from "@/components/landing/CalmCTASection";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ImageSlot, IMAGE_SLOTS } from "@/components/ImageSlot";
import { fetchProductsByHandles, type ShopifyProduct } from "@/lib/shopify";

export const Route = createFileRoute("/pages/sadan-holder-du-din-kniv-skarp")({
  head: () => ({
    meta: [
      { title: "Sådan holder du din kniv skarp — Langsomt Nok" },
      { name: "description", content: "En skarp kniv er ikke tilfældig. Den er plejet. Lær den rolige måde at holde din kniv skarp på." },
      { property: "og:title", content: "Sådan holder du din kniv skarp — Langsomt Nok" },
      { property: "og:description", content: "En skarp kniv er ikke tilfældig. Den er plejet." },
    ],
    links: [{ rel: "canonical", href: "https://langsomtnok.dk/pages/sadan-holder-du-din-kniv-skarp" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Forside", item: "https://langsomtnok.dk/" },
            { "@type": "ListItem", position: 2, name: "Guides", item: "https://langsomtnok.dk/guides" },
            { "@type": "ListItem", position: 3, name: "Sådan holder du din kniv skarp", item: "https://langsomtnok.dk/pages/sadan-holder-du-din-kniv-skarp" },
          ],
        }),
      },
    ],
  }),
  component: SharpeningPage,
});

const RECOMMENDED_HANDLES = [
  "double-sided-whetstone-1000-5000",
  "double-sided-whetstone-3000-8000",
  "leather-strop-green-and-yellow-compound",
  "sharpening-stone-holder-acacia",
];

function SharpeningPage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    fetchProductsByHandles(RECOMMENDED_HANDLES).then(setProducts);
  }, []);

  return (
    <div>
      <LandingPageHero
        headline="En skarp kniv er ikke tilfældig. Den er plejet."
        subheadline="Lær den rolige måde at holde din kniv skarp på — uden maskiner, stress eller gætværk."
        primaryCta={{ label: "Se slibesten og pleje", to: "/shop" }}
        secondaryCta={{ label: "Læs guiden", to: "/guides/hvordan-sliber-man-en-kniv" }}
        imageSlot={{ name: IMAGE_SLOTS.heroes.sharpeningLandingHero.name, motif: IMAGE_SLOTS.heroes.sharpeningLandingHero.motif }}
        variant="overlay"
      />

      <TrustBar />

      <section className="section-padding">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Hvorfor knive bliver sløve</h2>
          <div className="space-y-4 text-muted-foreground text-editorial">
            <p>Selv det bedste stål mister sin æg med tiden. Det er ikke en fejl — det er fysik. Hver gang bladet møder et skærebræt, bøjes den mikroskopiske æg en smule.</p>
            <p>Løsningen er ikke en ny kniv. Det er en god sten, lidt vand og tålmodighed.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-soft">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Slibesten forklaret</h2>
          <div className="space-y-6">
            {[
              { grit: "1000", title: "Medium sten (Grundstenen)", text: "Den vigtigste sten. Genskaber æggen og giver en solid grundskarphed. Her begynder de fleste." },
              { grit: "3000–5000", title: "Fin sten", text: "Polerer æggen og giver en silkeblød skarphed. Til den der vil have det ekstra." },
              { grit: "8000", title: "Polérsten", text: "Den sidste finish. Giver en spejlblank æg for maksimal præcision." },
            ].map((stone) => (
              <div key={stone.grit} className="flex gap-5 items-start p-5 rounded-lg border border-border bg-background">
                <span className="flex-shrink-0 text-xs font-mono text-copper bg-copper/10 px-2 py-1 rounded">{stone.grit}</span>
                <div>
                  <h3 className="font-serif text-base mb-1">{stone.title}</h3>
                  <p className="text-sm text-muted-foreground">{stone.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-calm max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <ImageSlot name="sharpening-leather-strop" ratio="4/5" motif="Læderstrop med kniv i hvæsningsbevægelse" variant="warm" />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="font-serif text-2xl md:text-3xl mb-4">Læderstrop og vedligeholdelse</h2>
              <p className="text-muted-foreground text-editorial mb-4">
                Mellem slibningerne holder en læderstrop æggen rettet op. Et par strøg inden brug er alt, der skal til.
              </p>
              <p className="text-muted-foreground text-editorial">
                Det tager 30 sekunder og forlænger knivens skarphed markant mellem slibninger.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5-step guide */}
      <section className="section-padding bg-soft">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-8">5 trin til en skarp kniv</h2>
          <div className="space-y-6">
            {[
              { step: "1", title: "Fugt stenen", text: "Læg din slibesten i vand i 10-15 minutter. Stenen skal være mættet." },
              { step: "2", title: "Find vinklen", text: "Hold kniven i 15-20 graders vinkel mod stenen. Konsistens er vigtigere end perfektion." },
              { step: "3", title: "Slib den ene side", text: "Træk bladet i jævne strøg fra hæl til spids. 5-10 strøg pr. sektion." },
              { step: "4", title: "Vend og gentag", text: "Slib den anden side med samme antal strøg." },
              { step: "5", title: "Afslut med strop", text: "Et par strøg på læderstroppen giver den sidste polering. Skyl kniven og tør grundigt af." },
            ].map((item) => (
              <div key={item.step} className="flex gap-5 items-start">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-cta text-cta-foreground flex items-center justify-center font-serif">{item.step}</span>
                <div>
                  <h3 className="font-serif text-base mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductRecommendationBlock
        title="Anbefalede plejeprodukter"
        subtitle="Alt hvad du behøver til vedligeholdelse af dine knive."
        products={products}
      />

      <FAQAccordion items={[
        { question: "Hvor ofte skal jeg slibe min kniv?", answer: "For de fleste hjemmekokke anbefaler vi slibning med jævne mellemrum. Brug en læderstrop mellem slibningerne." },
        { question: "Hvad er forskellen på 1000 og 5000 grit?", answer: "1000 grit genskaber æggen — det er den vigtigste. 5000 grit polerer og forfiner for en silkeblød skarphed." },
        { question: "Skal stenen altid blødlægges?", answer: "De fleste japanske vandsten skal blødlægges 10-15 minutter. Tjek din stens anvisninger." },
      ]} />

      <CalmCTASection
        headline="Giv dit blad nyt liv."
        text="Slibning er ikke en pligt. Det er en måde at forlænge glæden på."
        cta={{ label: "Se slibesten og pleje", to: "/shop" }}
        secondaryCta={{ label: "Læs slibeguiden", to: "/guides/hvordan-sliber-man-en-kniv" }}
        variant="dark"
      />

      <NewsletterSignup />
    </div>
  );
}
