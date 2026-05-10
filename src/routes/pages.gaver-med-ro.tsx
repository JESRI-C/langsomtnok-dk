import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { ProductRecommendationBlock } from "@/components/landing/ProductRecommendationBlock";
import { TrustBar } from "@/components/landing/TrustBar";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { CalmCTASection } from "@/components/landing/CalmCTASection";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ImageSlot } from "@/components/ImageSlot";
import { fetchProductsByHandles, type ShopifyProduct } from "@/lib/shopify";

export const Route = createFileRoute("/pages/gaver-med-ro")({
  head: () => ({
    meta: [
      { title: "Gaver, der bliver brugt — Langsomt Nok" },
      { name: "description", content: "Gaver med ro. Find den rette gave efter pris eller modtager — pakket i naturpapir, klar til at blive brugt." },
      { property: "og:title", content: "Gaver, der bliver brugt" },
      { property: "og:description", content: "Find gaven efter pris eller modtager. Pakket i naturpapir." },
    ],
  }),
  component: Page,
});

const HANDLES = [
  "damascus-chef-knife-8-5-olive-wood",
  "walnut-sharpener-xz-mdq01-htm",
  "magnetic-knife-display-stand-acacia",
  "sharpening-stone-1000-5000",
];

function Page() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  useEffect(() => { fetchProductsByHandles(HANDLES).then(setProducts); }, []);

  const byPrice = [
    { tier: "Under 300 kr.", desc: "Små gaver med karakter — en kop, en olie, et plejekit." },
    { tier: "300–800 kr.", desc: "Slibesten, knivsliber eller en magnetisk holder." },
    { tier: "Over 800 kr.", desc: "En kokkekniv, en hånddrejet skål — eller et komplet sæt." },
  ];

  const byRecipient = [
    { who: "Til den, der elsker at lave mad", desc: "En skarp kokkekniv eller en sten til at holde den skarp." },
    { who: "Til den nye lejlighed", desc: "En knivstander til bordet og en hånddrejet kop til kaffen." },
    { who: "Til ham, der har alt", desc: "En polérsten eller en læderstrop — pleje frem for nyt." },
  ];

  return (
    <div>
      <LandingPageHero
        headline="Gaver, der bliver brugt."
        subheadline="Ikke pyntet væk i en skuffe. Brugt — hver morgen, hver aften."
        primaryCta={{ label: "Se udvalget", to: "/shop" }}
        secondaryCta={{ label: "Find gaven", to: "#gavefinder" }}
        imageSlot={{ name: "image_gave_hero", motif: "Gaveindpakning i naturpapir med tørret lavendel", src: "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/Gaveindpakning_med_naturlige_detaljer.png?v=1778399967" }}
        variant="overlay"
      />

      <TrustBar />

      <section id="gavefinder" className="section-padding bg-soft">
        <div className="container-calm max-w-4xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-8">Find gaven efter pris</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {byPrice.map((p) => (
              <div key={p.tier} className="p-5 rounded-lg border border-border bg-background">
                <span className="text-[10px] font-medium text-copper uppercase tracking-wider">Prisinterval</span>
                <h3 className="font-serif text-lg mt-1 mb-2">{p.tier}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-calm max-w-4xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-8">Find gaven efter modtager</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {byRecipient.map((r) => (
              <div key={r.who} className="p-5 rounded-lg border border-border">
                <h3 className="font-serif text-lg mb-2">{r.who}</h3>
                <p className="text-sm text-muted-foreground">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductRecommendationBlock title="Gaver med ro" subtitle="Udvalgte produkter, der bliver en del af hverdagen." products={products} />

      <section className="section-padding bg-soft">
        <div className="container-calm max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <ImageSlot name="gift-packaging" ratio="4/3" motif="Gaveindpakning i naturpapir med snor og kort" variant="warm" />
            <div>
              <h2 className="font-serif text-2xl md:text-3xl mb-4">Pakket med ro</h2>
              <p className="text-muted-foreground text-editorial mb-3">Naturpapir, bomuldssnor og et håndskrevet kort, hvis du ønsker det. Indpakningen er en del af gaven.</p>
              <p className="text-muted-foreground text-editorial">Tilvælges i kassen — uden ekstra omkostning.</p>
            </div>
          </div>
        </div>
      </section>

      <FAQAccordion items={[
        { question: "Kan jeg tilføje et personligt kort?", answer: "Ja. Skriv din besked i kassen — vi skriver det i hånden på vores kort." },
        { question: "Kan modtageren bytte gaven?", answer: "Ja. Vi har 30 dages returret — også på gaver, uden at modtageren ser prisen." },
        { question: "Sender I direkte til modtageren?", answer: "Ja. Vælg leveringsadresse i kassen og tilføj en personlig hilsen." },
      ]} />

      <CalmCTASection
        headline="En gave, der bliver brugt."
        text="Vælg roligt. Pak roligt. Det huskes længere."
        cta={{ label: "Se udvalget", to: "/shop" }}
        secondaryCta={{ label: "Se keramik", to: "/pages/haandlavet-keramik" }}
        variant="warm"
      />

      <NewsletterSignup variant="dark" />
    </div>
  );
}
