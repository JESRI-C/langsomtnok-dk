import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { DirectAddToCart } from "@/components/knivsliber-landing/DirectAddToCart";
import { StickyBuyBar } from "@/components/knivsliber-landing/StickyBuyBar";
import { ThreeSteps } from "@/components/knivsliber-landing/ThreeSteps";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { KNIVSLIBER_CONFIG } from "@/lib/knivsliber-config";
import { trackEvent, trackProductView } from "@/lib/analytics";
import heroImg from "@/assets/knivsliber-landing/hero-sommerhus.png.asset.json";
import demoImg from "@/assets/knivsliber-landing/hero-campingvogn.png.asset.json";

const SOURCE_PAGE = "/pages/knivsliber-sommerhus";
const CAMPAIGN = "sommerhus_problem";

const FAQ = [
  { question: "Er knivsliberen svær at bruge?", answer: "Nej. Tre trin — grov, fin og polér — i den rækkefølge. Følg altid produktets anvisning ved brug." },
  { question: "Hvornår bruger jeg grov?", answer: "Når kniven er blevet tydeligt sløv og ikke længere skærer rent gennem fx en tomat." },
  { question: "Hvornår bruger jeg fin og polér?", answer: "Fin bruges til den daglige skarphed. Polér er den rolige afslutning, der gør kniven klar til brug." },
  { question: "Kan den ligge i køkkenskuffen?", answer: "Ja. Formatet er tænkt til at kunne stå fremme eller ligge i skuffen mellem brug." },
];

export const Route = createFileRoute("/pages/knivsliber-sommerhus")({
  head: () => ({
    meta: [
      { title: "Sløve knive i sommerhuset? | Knivsliber fra Langsomt Nok" },
      { name: "description", content: "Du kender det. Du kommer frem, og knivene kan knap skære. Gør feriekøkkenet klar med tre rolige trin." },
      { property: "og:title", content: "Du kender det. Knivene kan knap skære." },
      { property: "og:description", content: "Tre rolige trin — og feriekøkkenet er klar igen." },
      { property: "og:type", content: "product" },
      { property: "og:url", content: "https://langsomtnok.dk/pages/knivsliber-sommerhus" },
      { property: "og:image", content: `https://langsomtnok.dk${heroImg.url}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://langsomtnok.dk/pages/knivsliber-sommerhus" }],
  }),
  component: SommerhusProblemPage,
});

function SommerhusProblemPage() {
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
            <p className="text-xs uppercase tracking-[0.2em] text-[#4C574A] mb-6">Sommerhus · Spar 24 %</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] mb-6 text-[#2D2D2D]">
              Du kender det.
              <br />
              <span className="text-[#5A3B2E]">Knivene kan knap skære.</span>
            </h1>
            <p className="text-base md:text-lg text-foreground/70 leading-relaxed mb-10 max-w-md">
              Første aften i sommerhuset. Maden er købt ind. Knivene er trætte. Tre rolige trin, og feriekøkkenet er klar igen.
            </p>
            <div className="max-w-md">
              <DirectAddToCart
                productHandle={KNIVSLIBER_CONFIG.PRODUCT_HANDLE}
                variantId={KNIVSLIBER_CONFIG.DEFAULT_VARIANT_ID}
                sourcePage={SOURCE_PAGE}
                campaignName={CAMPAIGN}
              />
              <a href="#et-lille-ritual" className="mt-5 inline-block text-sm text-foreground/60 hover:text-[#4C574A] underline underline-offset-4 decoration-foreground/20">
                Se hvordan den virker
              </a>
            </div>
          </div>
          <div className="order-1 md:order-2 relative h-[45vh] md:h-auto bg-[#E6E0D7]">
            <img src={heroImg.url} alt="Knivsliber i valnød ved sommerhuskøkken med krydderurter i naturligt lys" className="absolute inset-0 w-full h-full object-cover" loading="eager" fetchPriority="high" />
          </div>
        </div>
      </section>

      {/* Sektion 2 — problem */}
      <section className="py-20 md:py-28 bg-[#F8F6F3]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl mb-4 max-w-xl leading-tight">Det er ikke maden, der er problemet.</h2>
          <p className="text-foreground/70 mb-14 max-w-lg">Det kan heldigvis løses uden at købe nye knive.</p>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: "Tomaterne bliver mast.", body: "Sløve knive presser i stedet for at skære." },
              { title: "Brødet flosser.", body: "Skorpen giver efter, og krummen falder fra hinanden." },
              { title: "Det tager længere tid.", body: "Forberedelsen bliver tungere, end den behøver." },
            ].map((p) => (
              <div key={p.title} className="rounded-md bg-[#F8F6F3] border border-[#E6E0D7] p-6">
                <p className="font-serif text-lg text-[#2D2D2D] mb-2">{p.title}</p>
                <p className="text-sm text-foreground/70 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sektion 3 — video / ritual */}
      <section id="et-lille-ritual" className="py-20 md:py-28 bg-[#E6E0D7]/40 border-y border-[#E6E0D7]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl mb-4 max-w-xl leading-tight">Et lille ritual før aftensmaden.</h2>
          <p className="text-foreground/70 mb-10 max-w-lg">Start med grov. Fortsæt med fin. Slut af med polering.</p>
          <div className="relative aspect-video rounded-md overflow-hidden bg-[#2D2D2D]/5">
            <img src={demoImg.url} alt="Still fra rolig video med Jesper i udekøkkenet" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Sektion 4 — let at tage med */}
      <section className="py-20 md:py-28 bg-[#F8F6F3]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-4 leading-tight">Let at tage med.<br />Nem at lægge væk.</h2>
          <p className="text-foreground/70 max-w-xl mx-auto leading-relaxed">Knivsliberen passer til sommerhuset, feriekøkkenet og køkkenskuffen derhjemme.</p>
        </div>
      </section>

      {/* Tre trin */}
      <ThreeSteps eyebrow="Tre trin" heading="Grov. Fin. Polér — i den rækkefølge, kniven fortjener." />

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-[#F8F6F3]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl mb-10">Spørgsmål inden du lægger den i kurven.</h2>
          <FAQAccordion items={FAQ} />
        </div>
      </section>

      {/* Købskort igen */}
      <section className="py-20 md:py-28 bg-[#F8F6F3]">
        <div className="max-w-md mx-auto px-6">
          <DirectAddToCart productHandle={KNIVSLIBER_CONFIG.PRODUCT_HANDLE} variantId={KNIVSLIBER_CONFIG.DEFAULT_VARIANT_ID} sourcePage={SOURCE_PAGE} campaignName={CAMPAIGN} />
          <p className="mt-10 text-center font-serif text-lg text-foreground/70 italic">Til det køkken, der bliver brugt hele ferien.</p>
        </div>
      </section>

      <StickyBuyBar sourcePage={SOURCE_PAGE} campaignName={CAMPAIGN} />
    </main>
  );
}
