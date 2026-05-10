import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { ProductRecommendationBlock } from "@/components/landing/ProductRecommendationBlock";
import { TrustBar } from "@/components/landing/TrustBar";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { CalmCTASection } from "@/components/landing/CalmCTASection";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ImageSlot } from "@/components/ImageSlot";
import { InternalLinksSection } from "@/components/landing/InternalLinksSection";
import { PaymentTrustSection } from "@/components/landing/PaymentTrustSection";
import { fetchProductsByHandles, type ShopifyProduct } from "@/lib/shopify";
import { buildFaqSchemaScript } from "@/lib/faq-schema";

const PAGE_SLUG = "slibesten-guide";
const CATEGORY = "sharpening";

const FAQ_ITEMS = [
  { question: "Hvor tit skal jeg slibe min kniv?", answer: "Til hjemmebrug typisk hver 2.–3. måned. Bruger du kniven dagligt, måske oftere." },
  { question: "Kan jeg slibe alle knive på samme sten?", answer: "Næsten alle. Meget hårde japanske knive (over HRC 62) trives bedst med japanske vandsten." },
  { question: "Hvad gør jeg, hvis jeg ikke kan finde vinklen?", answer: "Læg en mønt under bagkanten af bladet — det giver en god udgangsvinkel." },
];

export const Route = createFileRoute("/pages/slibesten-guide")({
  head: () => ({
    meta: [
      { title: "Slibning behøver ikke være svært — Langsomt Nok" },
      { name: "description", content: "Vælg den rette slibesten og lær teknikken trin for trin. En rolig guide til skarpe knive derhjemme." },
      { property: "og:title", content: "Slibning behøver ikke være svært" },
      { property: "og:description", content: "Vælg den rette slibesten og lær teknikken trin for trin." },
      { property: "og:image", content: "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/minimal_wooden_Sharpening_stone_setup.png?v=1778398237" },
    ],
    links: [{ rel: "canonical", href: "https://langsomtnok.dk/pages/slibesten-guide" }],
    scripts: [buildFaqSchemaScript(FAQ_ITEMS)],
  }),
  component: Page,
});

const HANDLES = ["sharpening-stone-1000-5000", "walnut-sharpener-xz-mdq01-htm"];

function Page() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  useEffect(() => { fetchProductsByHandles(HANDLES).then(setProducts); }, []);

  const grits = [
    { range: "200–400", label: "Grov", use: "Til reparation af skår og meget sløve æg." },
    { range: "800–1200", label: "Mellem", use: "Den vigtigste sten. Genskaber skarphed på dagligdagsknive." },
    { range: "3000–5000", label: "Fin", use: "Polerer ægget. Giver den rene, ubesværede skarphed." },
    { range: "6000+", label: "Spejl", use: "Til den, der vil længere ind i ritualet." },
  ];

  return (
    <div>
      <LandingPageHero
        headline="Slibning behøver ikke være svært."
        subheadline="En rolig stund. Lidt vand. Den rette sten. Resten kommer af sig selv."
        primaryCta={{ label: "Begynd her", to: "/shop", intent: "view_products" }}
        secondaryCta={{ label: "Se hvordan det føles", to: "/pages/saadan-sliber-du-din-kniv", intent: "watch_guide" }}
        imageSlot={{
          name: "image_slibesten_hero",
          motif: "Slibesten på træbord med kniv og vand i naturligt lys",
          alt: "Slibesten på træbord med kniv og vand i naturligt lys",
          src: "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/minimal_wooden_Sharpening_stone_setup.png?v=1778398237",
        }}
        variant="overlay"
        trackingPage={PAGE_SLUG}
        trackingCategory={CATEGORY}
      />

      <TrustBar />

      <section className="section-padding">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Hvorfor en skarp kniv betyder noget</h2>
          <div className="space-y-4 text-muted-foreground text-editorial">
            <p>En sløv kniv kræver mere kraft. Mere kraft betyder mindre kontrol. Mindre kontrol betyder flere uheld — og en grovere madlavning.</p>
            <p>En skarp kniv glider igennem løget uden at trykke det fladt. Tomaten beholder sin saft. Hånden arbejder roligere. Hele køkkenet bliver lidt langsommere.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-soft">
        <div className="container-calm max-w-4xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-8">Hvilken grit skal du vælge?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {grits.map((g) => (
              <div key={g.range} className="p-5 rounded-lg border border-border bg-background">
                <span className="text-[10px] font-medium text-copper uppercase tracking-wider">{g.label}</span>
                <h3 className="font-serif text-lg mt-1 mb-1">{g.range} grit</h3>
                <p className="text-sm text-muted-foreground">{g.use}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-editorial mt-6">Tip: Til de fleste hjem er en kombineret 1000/5000 sten alt, der skal til.</p>
        </div>
      </section>

      <section id="guide" className="section-padding">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-8">Slib din kniv i 5 rolige trin</h2>
          <ol className="space-y-6">
            {[
              { t: "Læg stenen i blød", d: "10–15 minutter i vand, indtil den ikke længere bobler." },
              { t: "Find vinklen", d: "Cirka 15–20 grader. Hold den jævnt med begge hænder." },
              { t: "Slib den ene side", d: "Træk kniven roligt fra hæl til spids — samme tryk hele vejen." },
              { t: "Vend, og slib den anden", d: "Samme antal strøg. Æggen skal blive jævn på begge sider." },
              { t: "Polér på den fine side", d: "Skift til 5000-siden. Lette strøg. Skyl, tør, læg på plads." },
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
          <div className="mt-10">
            <ImageSlot name="video_slibning" ratio="16/9" motif="Video: slibning trin for trin på en japansk slibesten" alt="Video: slibning trin for trin på en japansk slibesten" variant="warm" />
            <p className="text-center text-sm text-muted-foreground mt-4 max-w-xl mx-auto">
              Videoen lægges ind her, når optagelsen er klar. Indtil da kan du gå direkte til produkterne eller læse guiden trin for trin.
            </p>
          </div>
          <div className="text-center mt-6">
            <Link
              to="/pages/saadan-sliber-du-din-kniv"
              className="cta-video-watch text-sm font-medium text-cta hover:text-cta/80"
              data-track-event="landing_video_cta_click"
              data-track-page={PAGE_SLUG}
              data-track-intent="watch_guide"
              data-track-product-category={CATEGORY}
            >
              Se den fulde video-guide →
            </Link>
          </div>
        </div>
      </section>

      <ProductRecommendationBlock title="Slibesten og plejeudstyr" subtitle="De redskaber, der gør ritualet roligt." products={products} />

      <PaymentTrustSection />

      <FAQAccordion items={FAQ_ITEMS} />

      <CalmCTASection
        headline="Find roen i ritualet."
        text="En sten, en kande vand, ti minutter. Det er hele opskriften."
        cta={{ label: "Se slibesten", to: "/shop" }}
        secondaryCta={{ label: "Find dit ritual", to: "/find-dit-ritual" }}
        variant="warm"
        trackingPage={PAGE_SLUG}
        trackingCategory={CATEGORY}
      />

      <InternalLinksSection
        page={PAGE_SLUG}
        links={[
          { to: "/pages/saadan-sliber-du-din-kniv", title: "Sådan sliber du din kniv", description: "Video og trin-for-trin gennemgang.", category: "sharpening" },
          { to: "/pages/gaver-med-ro", title: "Gaver, der bliver brugt", description: "En slibesten er en gave til den, der allerede har en kniv.", category: "gifts" },
          { to: "/pages/koekkenet-som-fristed", title: "Køkkenet som fristed", description: "Hele Langsomt Noks univers samlet.", category: "brand_universe" },
        ]}
      />

      <NewsletterSignup variant="dark" />
    </div>
  );
}
