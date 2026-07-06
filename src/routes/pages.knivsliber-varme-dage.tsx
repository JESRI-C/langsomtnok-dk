import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { DirectAddToCart } from "@/components/knivsliber-landing/DirectAddToCart";
import { StickyBuyBar } from "@/components/knivsliber-landing/StickyBuyBar";
import { ThreeSteps } from "@/components/knivsliber-landing/ThreeSteps";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { KNIVSLIBER_CONFIG } from "@/lib/knivsliber-config";
import { trackEvent, trackProductView } from "@/lib/analytics";
import heroImg from "@/assets/knivsliber-landing/hero-sommerhus.png.asset.json";
import demoImg from "@/assets/knivsliber-landing/hero-funktion.png.asset.json";

const SOURCE_PAGE = "/pages/knivsliber-varme-dage";
const CAMPAIGN = "varme_dage";

const FAQ = [
  { question: "Er knivsliberen svær at bruge?", answer: "Nej. Tre trin — grov, fin og polér — i den rækkefølge. Følg altid produktets anvisning ved brug." },
  { question: "Hvornår bruger jeg grov?", answer: "Når kniven er blevet tydeligt sløv og ikke længere skærer rent gennem fx en tomat." },
  { question: "Hvornår bruger jeg fin og polér?", answer: "Fin bruges til den daglige skarphed. Polér er den rolige afslutning, der gør kniven klar til brug." },
  { question: "Kan den ligge i køkkenskuffen?", answer: "Ja. Formatet er tænkt til at kunne stå fremme eller ligge i skuffen mellem brug." },
];

export const Route = createFileRoute("/pages/knivsliber-varme-dage")({
  head: () => ({
    meta: [
      { title: "Knivsliber til varme dage | Sommerrabat | Langsomt Nok" },
      { name: "description", content: "Klar til grill, salater og lange aftener. Knivsliber i valnød med sommerrabat. Tre rolige trin, og knivene er klar til sommermaden." },
      { property: "og:title", content: "Skarpe knive til varme dage." },
      { property: "og:description", content: "Til grill, salater og lange aftener. Tre rolige trin — og knivene er klar." },
      { property: "og:type", content: "product" },
      { property: "og:url", content: "https://langsomtnok.dk/pages/knivsliber-varme-dage" },
      { property: "og:image", content: `https://langsomtnok.dk${heroImg.url}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://langsomtnok.dk/pages/knivsliber-varme-dage" }],
  }),
  component: VarmeDagePage,
});

function VarmeDagePage() {
  useEffect(() => {
    trackEvent("landing_page_view", { page: SOURCE_PAGE, campaign: CAMPAIGN });
    trackProductView({
      product_id: "gid://shopify/Product/10326655697232",
      product_title: KNIVSLIBER_CONFIG.PRODUCT_TITLE,
      variant_id: KNIVSLIBER_CONFIG.DEFAULT_VARIANT_ID,
      variant_title: "Valnød",
      price: 379,
      currency: "DKK",
      product_type: "The Ritual Set",
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#F8F6F3] text-[#2D2D2D] pb-24 md:pb-0">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="grid md:grid-cols-2 min-h-[70vh] md:min-h-[85vh]">
          <div className="order-2 md:order-1 px-6 md:px-16 py-12 md:py-24 flex flex-col justify-center max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[#4C574A] mb-6">Sommerrabat · Spar 24 %</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] mb-6 text-[#2D2D2D]">
              Skarpe knive til <span className="text-[#5A3B2E]">varme dage.</span>
            </h1>
            <p className="text-base md:text-lg text-foreground/70 leading-relaxed mb-10 max-w-md">
              Til grill, salater og lange aftener. Tre rolige trin, og knivene er klar til sommermaden.
            </p>
            <div className="max-w-md">
              <DirectAddToCart
                productHandle={KNIVSLIBER_CONFIG.PRODUCT_HANDLE}
                variantId={KNIVSLIBER_CONFIG.DEFAULT_VARIANT_ID}
                sourcePage={SOURCE_PAGE}
                campaignName={CAMPAIGN}
              />
              <a href="#saadan-virker-det" className="mt-5 inline-block text-sm text-foreground/60 hover:text-[#4C574A] underline underline-offset-4 decoration-foreground/20">
                Se hvordan den virker
              </a>
            </div>
          </div>
          <div className="order-1 md:order-2 relative h-[45vh] md:h-auto bg-[#E6E0D7]">
            <img src={heroImg.url} alt="Knivsliber i valnød på sommerbord med citron og krydderurter" className="absolute inset-0 w-full h-full object-cover" loading="eager" fetchPriority="high" />
          </div>
        </div>
      </section>

      {/* Sektion 2 — brugssituationer */}
      <section className="py-20 md:py-28 bg-[#F8F6F3]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl mb-14 max-w-xl leading-tight">Til det, der bliver skåret hele sommeren.</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: "Tomater", body: "Når snittet gerne må være rent." },
              { title: "Grønt", body: "Til salater, urter og sommermad." },
              { title: "Grill", body: "Når aftensmaden flytter udenfor." },
            ].map((p) => (
              <div key={p.title} className="rounded-md bg-[#F8F6F3] border border-[#E6E0D7] p-6">
                <p className="font-serif text-lg text-[#2D2D2D] mb-2">{p.title}</p>
                <p className="text-sm text-foreground/70 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sektion 3 — Tre trin */}
      <ThreeSteps eyebrow="Tre trin før maden" heading="Tre trin før maden kommer på bordet." />

      {/* Sektion 4 — Video / still */}
      <section id="saadan-virker-det" className="py-20 md:py-28 bg-[#E6E0D7]/40 border-y border-[#E6E0D7]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl mb-4 max-w-xl leading-tight">Sådan gør du.</h2>
          <p className="text-foreground/70 mb-10 max-w-lg">Ét redskab. Tre trin. Klar til næste måltid.</p>
          <div className="relative aspect-video rounded-md overflow-hidden bg-[#2D2D2D]/5">
            <img src={demoImg.url} alt="Still fra rolig produktdemo af knivsliberen" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-[#F8F6F3]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl mb-10">Spørgsmål inden du lægger den i kurven.</h2>
          <FAQAccordion items={FAQ} />
        </div>
      </section>

      {/* Sektion 5 — købskort igen */}
      <section className="py-20 md:py-28 bg-[#F8F6F3]">
        <div className="max-w-md mx-auto px-6">
          <DirectAddToCart productHandle={KNIVSLIBER_CONFIG.PRODUCT_HANDLE} variantId={KNIVSLIBER_CONFIG.DEFAULT_VARIANT_ID} sourcePage={SOURCE_PAGE} campaignName={CAMPAIGN} />
          <p className="mt-10 text-center font-serif text-lg text-foreground/70 italic">Sommermad begynder med et bedre snit.</p>
        </div>
      </section>

      <StickyBuyBar sourcePage={SOURCE_PAGE} campaignName={CAMPAIGN} />
    </main>
  );
}
