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

export const Route = createFileRoute("/pages/damaskus-kniv")({
  head: () => ({
    meta: [
      { title: "Damaskus kniv — Langsomt Nok" },
      { name: "description", content: "Damaskus-stål er ikke kun mønster. Det er lag, rytme og tradition. Udforsk vores kokkeknive i damaskus-stål." },
      { property: "og:title", content: "Damaskus kniv — Langsomt Nok" },
      { property: "og:description", content: "Damaskus-stål er ikke kun mønster. Det er lag, rytme og tradition." },
    ],
    links: [{ rel: "canonical", href: "https://langsomtnok.dk/pages/damaskus-kniv" }],
  }),
  component: DamascusPage,
});

const RECOMMENDED_HANDLES = [
  "damascus-chef-knife-8-5-olive-wood",
  "damascus-utility-knife-5-3-olive-wood",
  "walnut-sharpener-xz-mdq01-htm",
];

function DamascusPage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    fetchProductsByHandles(RECOMMENDED_HANDLES).then(setProducts);
  }, []);

  return (
    <div>
      <LandingPageHero
        headline="Damaskus-stål er ikke kun mønster. Det er lag, rytme og tradition."
        subheadline="Her får du roligt overblik over stålet, skarpheden, balancen og følelsen i hånden."
        primaryCta={{ label: "Udforsk knivene", to: "/shop" }}
        secondaryCta={{ label: "Læs om stålet", to: "/guides/damaskus-kniv-hvad-betyder-det" }}
        imageSlot={{ name: IMAGE_SLOTS.heroes.damascusLandingHero.name, motif: IMAGE_SLOTS.heroes.damascusLandingHero.motif }}
        variant="overlay"
      />

      <TrustBar />

      <section className="section-padding">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Hvad er damaskus-stål?</h2>
          <div className="space-y-4 text-muted-foreground text-editorial">
            <p>Damaskus-stål er ikke én type stål. Det er mange. Lag på lag af forskellige ståltyper smedet sammen under ekstrem varme. Resultatet er et blad med unik styrke, fleksibilitet og det karakteristiske bølgemønster.</p>
            <p>Hvert blad er unikt. Mønsteret afslører lagene — og historien om det håndværk, der skabte det.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-soft">
        <div className="container-calm max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <ImageSlot name="damascus-layers-closeup" ratio="1/1" motif="Extreme close-up af damaskus stållag, synlige linjer" variant="warm" />
            <div>
              <h2 className="font-serif text-2xl md:text-3xl mb-4">Hvorfor lagene betyder noget</h2>
              <p className="text-muted-foreground text-editorial mb-4">
                De ydre lag af blødere stål absorberer stød og beskytter kernen. Kernen holder skarpheden. Det giver det bedste af begge verdener.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Handle and feel */}
      <section className="section-padding">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Skaft, balance og følelse</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Oliventræ", text: "Levende, varmt og unikt. Hvert skaft har sin egen karakter." },
              { title: "Balance", text: "Tyngdepunktet hviler naturligt. Let nok til præcision, tungt nok til kontrol." },
              { title: "Følelsen", text: "Et redskab skabt til at ligge naturligt i hånden — dag efter dag." },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-lg border border-border bg-soft/30">
                <h3 className="font-serif text-base mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductRecommendationBlock
        title="Udvalgte damaskus-knive"
        subtitle="Hvert blad er unikt. Find den, der passer dig."
        products={products}
      />

      {/* Care */}
      <section className="section-padding bg-soft">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Pleje af damaskus-stål</h2>
          <div className="space-y-4 text-muted-foreground text-editorial">
            <p>Damaskus-stål er robust, men det fortjener respekt. Håndvask altid — aldrig opvaskemaskine. Tør bladet af med det samme og opbevar det på en magnetisk holder.</p>
            <p>Med tiden kan mønsteret i stålet blive mere udtalt. Det er meningen. Din kniv fortæller historien om sit liv i dit køkken.</p>
          </div>
        </div>
      </section>

      <FAQAccordion items={[
        { question: "Er damaskus-stål bedre end normalt stål?", answer: "Det kombinerer det bedste fra flere ståltyper — skarphed fra kernen og modstandsdygtighed fra de ydre lag." },
        { question: "Kan mønsteret slides af?", answer: "Nej. Mønsteret er stålets struktur, ikke en overflade-effekt. Det går hele vejen igennem bladet." },
        { question: "Er damaskus-stål sværere at slibe?", answer: "Ikke sværere, men det tager lidt længere tid. En 1000/5000 vandsten er ideel." },
        { question: "Kan damaskus-stål ruste?", answer: "Vores stål er modstandsdygtigt, men ikke rustfrit. Tør altid bladet efter brug og opbevar det tørt." },
      ]} />

      <CalmCTASection
        headline="Lag, styrke, tradition."
        text="Et damaskus-blad er ikke bare et redskab. Det er et stykke håndværk, du holder i hånden hver dag."
        cta={{ label: "Udforsk knivene", to: "/shop" }}
        secondaryCta={{ label: "Læs om stålet", to: "/guides/damaskus-kniv-hvad-betyder-det" }}
        variant="dark"
      />

      <NewsletterSignup />
    </div>
  );
}
