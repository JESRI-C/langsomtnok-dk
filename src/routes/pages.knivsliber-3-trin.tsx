import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { DirectAddToCart } from "@/components/knivsliber-landing/DirectAddToCart";
import { StickyBuyBar } from "@/components/knivsliber-landing/StickyBuyBar";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { KNIVSLIBER_CONFIG } from "@/lib/knivsliber-config";
import { trackEvent, trackProductView } from "@/lib/analytics";
import heroImg from "@/assets/knivsliber-landing/hero-funktion.png.asset.json";
import stepImg from "@/assets/knivsliber-landing/hero-sommerhus.png.asset.json";
import closeImg from "@/assets/knivsliber-landing/hero-campingvogn.png.asset.json";

const SOURCE_PAGE = "/pages/knivsliber-3-trin";
const CAMPAIGN = "3_trin_forklaring";

const FAQ = [
  { question: "Er knivsliberen svær at bruge?", answer: "Nej. Tre trin — grov, fin og polér — i den rækkefølge. Følg altid produktets anvisning ved brug." },
  { question: "Hvornår bruger jeg grov?", answer: "Når kniven er blevet tydeligt sløv og ikke længere skærer rent gennem fx en tomat." },
  { question: "Hvornår bruger jeg fin og polér?", answer: "Fin bruges til den daglige skarphed. Polér er den rolige afslutning, der gør kniven klar til brug." },
  { question: "Kan den ligge i køkkenskuffen?", answer: "Ja. Formatet er tænkt til at kunne stå fremme eller ligge i skuffen mellem brug." },
];

const STEPS = [
  { num: "01", title: "Grov", body: "Start her, når kniven er blevet tydeligt sløv.", img: stepImg.url, alt: "Still — trin 1 grov" },
  { num: "02", title: "Fin", body: "Her samler du den daglige skarphed.", img: closeImg.url, alt: "Still — trin 2 fin" },
  { num: "03", title: "Polér", body: "Afslut her, og gør kniven klar til brug.", img: heroImg.url, alt: "Still — trin 3 polér" },
];

export const Route = createFileRoute("/pages/knivsliber-3-trin")({
  head: () => ({
    meta: [
      { title: "Sådan virker knivsliberen | Grov, fin og polér | Langsomt Nok" },
      { name: "description", content: "Tre trin til knive, der igen føles klar til brug. Se hvordan grov, fin og polér fungerer." },
      { property: "og:title", content: "Grov. Fin. Polér." },
      { property: "og:description", content: "En enkel måde at gøre knivene klar til brug igen." },
      { property: "og:type", content: "product" },
      { property: "og:url", content: "https://langsomtnok.dk/pages/knivsliber-3-trin" },
      { property: "og:image", content: `https://langsomtnok.dk${heroImg.url}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://langsomtnok.dk/pages/knivsliber-3-trin" }],
  }),
  component: TreTrinPage,
});

function TreTrinPage() {
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
            <p className="text-xs uppercase tracking-[0.2em] text-[#4C574A] mb-6">3 trin · Spar 24 %</p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] mb-6 text-[#2D2D2D]">
              Grov. Fin.
              <br />
              <span className="text-[#5A3B2E]">Polér.</span>
            </h1>
            <p className="text-base md:text-lg text-foreground/70 leading-relaxed mb-10 max-w-md">
              En enkel måde at gøre knivene klar til brug igen. Tre trin. En mærkbar forskel.
            </p>
            <div className="max-w-md">
              <DirectAddToCart
                productHandle={KNIVSLIBER_CONFIG.PRODUCT_HANDLE}
                variantId={KNIVSLIBER_CONFIG.DEFAULT_VARIANT_ID}
                sourcePage={SOURCE_PAGE}
                campaignName={CAMPAIGN}
              />
              <a href="#saadan-virker-den" className="mt-5 inline-block text-sm text-foreground/60 hover:text-[#4C574A] underline underline-offset-4 decoration-foreground/20">
                Se hvordan den virker
              </a>
            </div>
          </div>
          <div className="order-1 md:order-2 relative h-[45vh] md:h-auto bg-[#E6E0D7]">
            <img src={heroImg.url} alt="Knivsliber i valnød — rolig produktkomposition" className="absolute inset-0 w-full h-full object-cover" loading="eager" fetchPriority="high" />
          </div>
        </div>
      </section>

      {/* Sektion 2 — vertikal trin-guide */}
      <section id="saadan-virker-den" className="py-20 md:py-28 bg-[#F8F6F3]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl mb-14 max-w-xl leading-tight">Sådan virker den.</h2>
          <div className="space-y-16">
            {STEPS.map((s, i) => (
              <div key={s.num} className={`grid gap-8 md:grid-cols-2 items-center ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
                <div className="relative aspect-[4/5] rounded-md overflow-hidden bg-[#E6E0D7]">
                  <img src={s.img} alt={s.alt} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div>
                  <p className="font-serif text-5xl text-[#5A3B2E] mb-4">{s.num}</p>
                  <h3 className="font-serif text-2xl mb-3 text-[#2D2D2D]">{s.title}</h3>
                  <p className="text-foreground/70 leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-12 text-xs text-foreground/50 italic">Følg altid produktets anvisninger ved brug.</p>
        </div>
      </section>

      {/* Sektion 3 — video / still */}
      <section className="py-20 md:py-28 bg-[#E6E0D7]/40 border-y border-[#E6E0D7]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl mb-4 max-w-xl leading-tight">Det behøver ikke være svært.</h2>
          <p className="text-foreground/70 mb-10 max-w-lg">Se hvordan de tre trin bruges i praksis.</p>
          <div className="relative aspect-video rounded-md overflow-hidden bg-[#2D2D2D]/5">
            <img src={heroImg.url} alt="Still fra rolig video med Jesper" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Sektion 4 — mærkbar forskel */}
      <section className="py-20 md:py-28 bg-[#F8F6F3]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-6 leading-tight">Den mærkbare forskel ligger i næste snit.</h2>
          <p className="text-foreground/70 max-w-xl mx-auto leading-relaxed">
            Det handler ikke om fart. Det handler om, at redskabet igen gør det, det skal.
          </p>
        </div>
      </section>

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
          <p className="mt-10 text-center font-serif text-lg text-foreground/70 italic">Til knive, du allerede holder af.</p>
        </div>
      </section>

      <StickyBuyBar sourcePage={SOURCE_PAGE} campaignName={CAMPAIGN} />
    </main>
  );
}
