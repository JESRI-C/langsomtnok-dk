import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { ProductRecommendationBlock } from "@/components/landing/ProductRecommendationBlock";
import { TrustBar } from "@/components/landing/TrustBar";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { CalmCTASection } from "@/components/landing/CalmCTASection";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ImageSlot, IMAGE_SLOTS } from "@/components/ImageSlot";
import { fetchProductsByHandles, type ShopifyProduct } from "@/lib/shopify";

export const Route = createFileRoute("/pages/saadan-sliber-du-din-kniv")({
  head: () => ({
    meta: [
      { title: "Sådan sliber du din kniv med slibesten — Langsomt Nok" },
      { name: "description", content: "Video-guide og trin-for-trin gennemgang af, hvordan du sliber din kniv på en japansk vandsten. Roligt, præcist og uden hast." },
      { property: "og:title", content: "Sådan sliber du din kniv med slibesten" },
      { property: "og:description", content: "Video og trin-for-trin guide til slibning på vandsten." },
    ],
  }),
  component: Page,
});

const HANDLES = ["sharpening-stone-1000-5000", "walnut-sharpener-xz-mdq01-htm"];

function Page() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  useEffect(() => { fetchProductsByHandles(HANDLES).then(setProducts); }, []);

  return (
    <div>
      <LandingPageHero
        headline="Sådan sliber du din kniv."
        subheadline="Se hvordan det føles. Træk roligt. Find vinklen. Lad stenen gøre arbejdet."
        primaryCta={{ label: "Se hvordan det føles", to: "#video" }}
        secondaryCta={{ label: "Se slibesten", to: "/shop" }}
        imageSlot={{ name: IMAGE_SLOTS.heroes.sharpeningLandingHero.name, motif: IMAGE_SLOTS.heroes.sharpeningLandingHero.motif, src: "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/minimal_wooden_Sharpening_stone_setup.png?v=1778398237" }}
        variant="overlay"
      />

      <TrustBar />

      <section id="video" className="section-padding">
        <div className="container-calm max-w-4xl">
          <div className="aspect-video rounded-lg overflow-hidden mb-6">
            <ImageSlot name="video_slibning" ratio="16/9" motif="Video: hånd sliber kniv på japansk vandsten i roligt lys" variant="warm" />
          </div>
          <p className="text-center text-sm text-muted-foreground">Video kommer her — fuld guide, fra første dråbe vand til sidste polering.</p>
        </div>
      </section>

      <section className="section-padding bg-soft">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-8">Trin for trin</h2>
          <ol className="space-y-6">
            {[
              { t: "Forbered stenen", d: "Læg den i vand i 10–15 minutter, indtil boblerne stopper." },
              { t: "Læg et håndklæde under", d: "Stenen må ikke kunne glide. Et fugtigt klæde er nok." },
              { t: "Hold vinklen jævn", d: "15–20 grader. Brug begge hænder — den ene styrer, den anden trykker." },
              { t: "Træk fra hæl til spids", d: "Roligt. Samme tryk hele vejen. Lyt til lyden — den fortæller dig, hvor du er." },
              { t: "Vend kniven, og gentag", d: "Samme antal strøg på den anden side. Æggen skal blive lige." },
              { t: "Polér på den fine side", d: "Skift til 5000-grit. Lette strøg. Skyl, tør, læg på plads." },
            ].map((s, i) => (
              <li key={s.t} className="flex gap-5 items-start">
                <span className="font-serif text-2xl text-copper w-8 shrink-0">{i + 1}</span>
                <div>
                  <h3 className="font-serif text-lg mb-1">{s.t}</h3>
                  <p className="text-sm text-muted-foreground">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Almindelige fejl</h2>
          <ul className="space-y-3">
            {[
              "For meget tryk — stenen sliber bedst, når du ikke kæmper med den.",
              "Vinkel der vandrer — find den, og hold fast.",
              "Tør sten — vandet er en del af processen, ikke et tilbehør.",
              "Stress — slibning er ikke noget, du gør på 30 sekunder.",
            ].map((m) => (
              <li key={m} className="flex gap-3 text-sm text-muted-foreground">
                <span className="text-copper">•</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ProductRecommendationBlock title="Anbefalet til ritualet" subtitle="En sten, en sliber, en plads ved vasken." products={products} />

      <section className="section-padding bg-soft">
        <div className="container-calm max-w-3xl text-center">
          <p className="text-muted-foreground text-editorial mb-4">Vil du forstå, hvilken grit du skal vælge?</p>
          <Link to="/pages/slibesten-guide" className="cta-secondary text-sm font-medium text-cta hover:text-cta/80">
            Læs vores rolige slibesten-guide →
          </Link>
        </div>
      </section>

      <FAQAccordion items={[
        { question: "Hvor lang tid tager det?", answer: "Cirka 10–15 minutter for en almindelig kokkekniv. Mindre, når du kender ritualet." },
        { question: "Kan jeg ødelægge min kniv?", answer: "Det er svært. Med rolige strøg og korrekt vinkel sliber du kun det, der skal væk." },
        { question: "Hvad gør jeg, hvis bladet stadig er sløvt?", answer: "Du har sandsynligvis ikke nået helt ud til ægget. Mærk efter en lille bøjet kant — det er tegnet på, at du er der." },
      ]} />

      <CalmCTASection
        headline="Slib én gang. Skær roligt resten af året."
        text="Den skarpe kniv er ikke et trick. Det er en vane."
        cta={{ label: "Se slibesten", to: "/shop" }}
        secondaryCta={{ label: "Find dit ritual", to: "/find-dit-ritual" }}
        variant="warm"
      />

      <NewsletterSignup variant="dark" />
    </div>
  );
}
