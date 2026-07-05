import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DirectAddToCart } from "@/components/knivsliber-landing/DirectAddToCart";
import { StickyBuyBar } from "@/components/knivsliber-landing/StickyBuyBar";
import { KNIVSLIBER_CONFIG } from "@/lib/knivsliber-config";
import { trackEvent, trackProductView } from "@/lib/analytics";
import { ChevronDown } from "lucide-react";
import heroImg from "@/assets/knivsliber-landing/hero-funktion.png.asset.json";

const SOURCE_PAGE = "/pages/saadan-virker-knivsliberen";
const CAMPAIGN = "funktion";

const FAQ = [
  {
    q: "Er den svær at bruge?",
    a: "Nej. Du fører kniven roligt gennem sporet — først grov, så fin, til sidst polér. Tre rolige gennemtræk pr. trin er som regel nok.",
  },
  {
    q: "Hvornår bruger jeg grov?",
    a: "Grov-sporet bruges, når kniven er tydeligt sløv og skal have en ny begyndelse. Til daglig vedligehold hopper du direkte til fin.",
  },
  {
    q: "Hvad er forskellen på fin og polér?",
    a: "Fin samler skarpheden, du mærker i hverdagen. Polér giver den rolige afslutning — en jævn æg, der bider blødt gennem tomat og løg.",
  },
  {
    q: "Kan den ligge i køkkenskuffen?",
    a: "Ja. Den er let og formet i massivt valnød, så den ligger stille i skuffen — eller står pænt fremme på bordet.",
  },
] as const;

export const Route = createFileRoute("/pages/saadan-virker-knivsliberen")({
  head: () => ({
    meta: [
      { title: "Grov. Fin. Polér — Sådan virker knivsliberen | Langsomt Nok" },
      {
        name: "description",
        content:
          "Tre rolige trin til at give knivene den skarphed, de fortjener. Se hvordan 3-trins knivsliberen virker — og læg den direkte i kurven.",
      },
      { property: "og:title", content: "Grov. Fin. Polér." },
      {
        property: "og:description",
        content: "En enkel måde at give knivene den opmærksomhed, de fortjener.",
      },
      { property: "og:type", content: "product" },
      { property: "og:image", content: `https://langsomtnok.dk${heroImg.url}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index,follow" },
    ],
  }),
  component: FunktionPage,
});

function FunktionPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="grid md:grid-cols-2 min-h-[70vh] md:min-h-[85vh]">
          <div className="order-2 md:order-1 px-6 md:px-16 py-12 md:py-24 flex flex-col justify-center max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[#4C574A] mb-6">
              3 trin
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.02] mb-6">
              Grov. Fin.
              <br />
              <span className="text-[#5A3B2E]">Polér.</span>
            </h1>
            <p className="text-base md:text-lg text-foreground/70 leading-relaxed mb-10 max-w-md">
              En enkel måde at give knivene den opmærksomhed, de fortjener.
            </p>
            <div className="max-w-md">
              <DirectAddToCart
                productHandle={KNIVSLIBER_CONFIG.PRODUCT_HANDLE}
                variantId={KNIVSLIBER_CONFIG.DEFAULT_VARIANT_ID}
                sourcePage={SOURCE_PAGE}
                campaignName={CAMPAIGN}
              />
            </div>
          </div>
          <div className="order-1 md:order-2 relative h-[45vh] md:h-auto bg-[#E6E0D7]">
            <img
              src={heroImg.url}
              alt="Demonstration af knivsliber i valnød med de tre spor: grov, fin og polér"
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
      </section>

      {/* ── Sådan virker det — tre store trin ───────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#F8F6F3]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl mb-16 max-w-xl leading-tight">
            Sådan virker det.
          </h2>
          <div className="space-y-16">
            {[
              { num: "01", title: "Grov", body: "Begynd her, når kniven er blevet tydeligt sløv." },
              { num: "02", title: "Fin", body: "Fortsæt her for at samle skarpheden." },
              { num: "03", title: "Polér", body: "Afslut med et roligt sidste trin." },
            ].map((s) => (
              <div
                key={s.num}
                className="grid md:grid-cols-[120px_1fr] gap-6 md:gap-12 border-t border-[#5A3B2E]/20 pt-8"
              >
                <p className="font-serif text-6xl text-[#5A3B2E]">{s.num}</p>
                <div>
                  <h3 className="font-serif text-2xl mb-3 text-[#2D2D2D]">{s.title}</h3>
                  <p className="text-foreground/70 leading-relaxed max-w-md">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-12 text-xs text-foreground/50 italic">
            Følg altid produktets anvisninger ved brug.
          </p>
        </div>
      </section>

      {/* ── Forskellen ligger i næste snit ──────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#E6E0D7]/40 border-y border-[#E6E0D7]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl mb-10 max-w-xl leading-tight">
            Den mærkbare forskel ligger i næste snit.
          </h2>
          <div className="aspect-video rounded-md overflow-hidden bg-[#2D2D2D]/5 mb-8">
            <img
              src={heroImg.url}
              alt="Kniv gennem tomat — den skarpe kniv skærer roligt igennem"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <p className="text-foreground/70 leading-relaxed max-w-2xl italic">
            Det handler ikke om fart. Det handler om, at redskabet igen gør det, det skal.
          </p>
        </div>
      </section>

      {/* ── Købskort igen ───────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#F8F6F3]">
        <div className="max-w-md mx-auto px-6">
          <DirectAddToCart
            productHandle={KNIVSLIBER_CONFIG.PRODUCT_HANDLE}
            variantId={KNIVSLIBER_CONFIG.DEFAULT_VARIANT_ID}
            sourcePage={SOURCE_PAGE}
            campaignName={CAMPAIGN}
          />
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#F8F6F3] border-t border-[#E6E0D7]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl mb-10 leading-tight">
            Rolige spørgsmål.
          </h2>
          <div className="space-y-2">
            {FAQ.map((item, i) => {
              const open = openFaq === i;
              return (
                <div key={item.q} className="border-b border-[#E6E0D7]">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenFaq(open ? null : i);
                      if (!open) trackEvent("faq_open", { label: item.q });
                    }}
                    className="w-full flex items-center justify-between text-left py-5 gap-4"
                    aria-expanded={open}
                  >
                    <span className="font-serif text-lg text-[#2D2D2D]">{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-foreground/50 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  {open && (
                    <p className="pb-5 text-foreground/70 leading-relaxed max-w-2xl">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <StickyBuyBar sourcePage={SOURCE_PAGE} campaignName={CAMPAIGN} />
    </main>
  );
}
