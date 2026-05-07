import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { ProductRecommendationBlock } from "@/components/landing/ProductRecommendationBlock";
import { TrustBar } from "@/components/landing/TrustBar";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { CalmCTASection } from "@/components/landing/CalmCTASection";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { IMAGE_SLOTS } from "@/components/ImageSlot";
import { fetchProductsByHandles, type ShopifyProduct } from "@/lib/shopify";

export const Route = createFileRoute("/pages/den-forste-rigtige-kokkekniv")({
  head: () => ({
    meta: [
      { title: "Den første rigtige kokkekniv — Langsomt Nok" },
      { name: "description", content: "Din første rigtige kokkekniv skal ikke vælges i hast. Lær hvad der gør en god kniv, og find det rigtige sted at starte." },
      { property: "og:title", content: "Den første rigtige kokkekniv — Langsomt Nok" },
      { property: "og:description", content: "Din første rigtige kokkekniv skal ikke vælges i hast." },
    ],
  }),
  component: FirstKnifePage,
});

const RECOMMENDED_HANDLES = [
  "damascus-chef-knife-8-5-olive-wood",
  "double-sided-whetstone-1000-5000",
  "magnetic-knife-stand-acacia",
];

function FirstKnifePage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    fetchProductsByHandles(RECOMMENDED_HANDLES).then(setProducts);
  }, []);

  return (
    <div>
      <LandingPageHero
        headline="Din første rigtige kokkekniv skal ikke vælges i hast."
        subheadline="En god kniv skal føles rigtig i hånden, holde skarpheden og gøre madlavning mere rolig. Her starter du."
        primaryCta={{ label: "Find din første kniv", to: "/shop" }}
        secondaryCta={{ label: "Læs hvordan du vælger", to: "/guides/vaelg-din-foerste-kniv" }}
        imageSlot={{ name: IMAGE_SLOTS.heroes.firstKnifeLandingHero.name, motif: IMAGE_SLOTS.heroes.firstKnifeLandingHero.motif }}
        variant="overlay"
      />

      <TrustBar />

      {/* Why cheap knives disappoint */}
      <section className="section-padding">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Hvorfor billige knive skuffer</h2>
          <div className="space-y-4 text-muted-foreground text-editorial">
            <p>En billig kniv føles fin de første uger. Så begynder den at glide, klemme og frustrere. Du skærer hårdere i stedet for smartere. Maden lider. Glæden forsvinder.</p>
            <p>Problemet er ikke dig. Det er stålet. Billigt stål mister sin æg hurtigt, og ingen mængde hvæsning kan kompensere for et blad, der ikke holder.</p>
            <p>En rigtig kokkekniv er anderledes. Den holder skarphed. Den guider din hånd. Den gør madlavning til noget, du faktisk ser frem til.</p>
          </div>
        </div>
      </section>

      {/* What makes a good knife */}
      <section className="section-padding bg-soft">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Hvad gør en kniv god?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "Stålet", text: "Højt kulstofindhold og korrekt hærdning giver et blad, der holder skarphed." },
              { title: "Balancen", text: "En god kniv hviler naturligt i hånden. Tyngdepunktet ligger ved bolsteren." },
              { title: "Skaftet", text: "Træ, der ældes med dig. Oliventræ, valnød eller acacia giver varme og greb." },
              { title: "Geometrien", text: "Bladets profil bestemmer, hvad kniven er god til. En kokkekniv er alsidig." },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="font-serif text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended products from Shopify */}
      <ProductRecommendationBlock
        title="Din første kniv"
        subtitle="Vi anbefaler at starte med én god kokkekniv. Ikke ti middelmådige."
        products={products}
      />

      {/* Care steps */}
      <section className="section-padding">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Pleje af din første gode kniv</h2>
          <div className="space-y-6">
            {[
              { step: "1", title: "Håndvask altid", text: "Aldrig opvaskemaskine. Varmt vand, mild sæbe, tør af med det samme." },
              { step: "2", title: "Opbevar korrekt", text: "Magnetisk holder eller knivblok. Aldrig løst i en skuffe." },
              { step: "3", title: "Slib regelmæssigt", text: "Hver 2-3 måned med en slibesten. Det er nemmere end du tror." },
              { step: "4", title: "Olie skaftet", text: "Hver 4-6 uge med en fødevaresikker olie. Det holder træet levende." },
            ].map((item) => (
              <div key={item.step} className="flex gap-5 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cta/10 text-cta flex items-center justify-center font-serif text-sm">{item.step}</span>
                <div>
                  <h3 className="font-serif text-base mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQAccordion items={[
        { question: "Hvilken størrelse kokkekniv skal jeg vælge?", answer: "De fleste starter bedst med en 20-21 cm kokkekniv. Den er alsidig nok til det meste." },
        { question: "Kan jeg bruge kniven til alt?", answer: "En kokkekniv er utroligt alsidig — den hakker, snipper, terninger og rokker. For brød og udskæring anbefaler vi specialiserede knive." },
        { question: "Hvad hvis jeg aldrig har slibet en kniv før?", answer: "Det er nemmere end du tror. Start med en 1000/5000 slibesten og følg vores guide." },
        { question: "Hvor lang tid holder en god kokkekniv?", answer: "Med korrekt pleje — hele livet. En god kniv er en investering, der giver glæde i årtier." },
      ]} />

      <CalmCTASection
        headline="Begynd roligt. Begynd rigtigt."
        text="Din første rigtige kokkekniv venter. Og den behøver ikke koste en formue."
        cta={{ label: "Find din første kniv", to: "/shop" }}
        secondaryCta={{ label: "Læs mere om knivvalg", to: "/guides/vaelg-din-foerste-kniv" }}
        variant="dark"
      />

      <NewsletterSignup />
    </div>
  );
}
