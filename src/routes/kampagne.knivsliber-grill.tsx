import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { DirectAddToCart } from "@/components/knivsliber-landing/DirectAddToCart";
import { StickyBuyBar } from "@/components/knivsliber-landing/StickyBuyBar";
import { ThreeSteps } from "@/components/knivsliber-landing/ThreeSteps";
import { TrustBlok } from "@/components/TrustBlok";
import { ImageSlot } from "@/components/ImageSlot";
import { KNIVSLIBER_CONFIG } from "@/lib/knivsliber-config";
import { trackEvent, trackProductView } from "@/lib/analytics";

const SOURCE_PAGE = "/kampagne/knivsliber-grill";
const CAMPAIGN = "knivsliber-grill";

export const Route = createFileRoute("/kampagne/knivsliber-grill")({
  head: () => ({
    meta: [
      {
        title:
          "Skarp kniv til grillen — 3-trins knivsliber i valnød | Langsomt Nok",
      },
      {
        name: "description",
        content:
          "En skarp kniv gør sommermaden lettere. 3-trins knivsliber i massivt valnød — grov, fin, polér. Læg direkte i kurven. 379 kr. Fri fragt over 499 kr.",
      },
      { property: "og:title", content: "Skarp kniv til grillen." },
      {
        property: "og:description",
        content:
          "Tomat, agurk, urter, kød. Alt bliver lettere med en skarp kniv. 3-trins sliber i valnød — pæn på terrassen, nem i skuffen.",
      },
      { property: "og:type", content: "product" },
      { property: "og:url", content: "https://langsomtnok.dk/kampagne/knivsliber-grill" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index,follow" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://langsomtnok.dk/kampagne/knivsliber-grill",
      },
    ],
  }),
  component: GrillKampagnePage,
});

function GrillKampagnePage() {
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
              Sommer · Terrasse · Grill
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] mb-6">
              Skarp kniv til grillen.
              <br />
              <span className="text-[#5A3B2E]">Roligere sommeraftener.</span>
            </h1>
            <p className="text-base md:text-lg text-foreground/70 leading-relaxed mb-10 max-w-md">
              Tomat, agurk, friske urter, det gode kød. Alt bliver lettere,
              når kniven bider igen. Tre trin — grov, fin, polér.
            </p>
            <div className="max-w-md">
              <DirectAddToCart
                productHandle={KNIVSLIBER_CONFIG.PRODUCT_HANDLE}
                variantId={KNIVSLIBER_CONFIG.DEFAULT_VARIANT_ID}
                sourcePage={SOURCE_PAGE}
                campaignName={CAMPAIGN}
              />
              <div className="mt-8">
                <TrustBlok />
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 relative h-[45vh] md:h-auto bg-[#E6E0D7]">
            <ImageSlot
              name="kampagne-knivsliber-grill-hero"
              ratio="4/5"
              motif="Knivsliber i valnød på træbord ved grillen — tomater, urter, sommerlys"
              alt="3-trins knivsliber i valnød på terrassebord ved grillen"
              variant="warm"
              priority
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* ── Argumenter ──────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#F8F6F3]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl mb-14 max-w-xl leading-tight">
            Sommermad kræver ikke meget. Bare en skarp kniv.
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              "Rene snit i tomat og agurk.",
              "Urter, der duftes — ikke moses.",
              "Kød, der skæres, ikke rives.",
            ].map((t) => (
              <div
                key={t}
                className="rounded-md bg-[#F8F6F3] border border-[#E6E0D7] p-6"
              >
                <p className="font-serif text-lg text-[#2D2D2D]">{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Video / still ───────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#E6E0D7]/40 border-y border-[#E6E0D7]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl mb-4 max-w-xl leading-tight">
            Tre trin. To minutter. En hel sommer med skarpe knive.
          </h2>
          <p className="text-foreground/70 max-w-xl leading-relaxed">
            Træk kniven roligt gennem hvert spor. Grov retter kanten. Fin
            skærper. Polér giver den ro.
          </p>
          <div className="relative aspect-video rounded-md overflow-hidden bg-[#2D2D2D]/5 mt-10">
            <ImageSlot
              name="kampagne-knivsliber-grill-video-still"
              ratio="16/9"
              motif="Still fra video — hånd trækker kniv gennem sliber ved grillbord"
              alt="Still fra video — knivsliberen bruges ved grillen"
              variant="warm"
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* ── Materialesplit ──────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#F8F6F3]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="aspect-square md:aspect-[4/5] rounded-md overflow-hidden bg-[#E6E0D7]">
            <ImageSlot
              name="kampagne-knivsliber-grill-materiale"
              ratio="4/5"
              motif="Nærbillede — valnøddetræ, tre slibespor, varm sommeraften"
              alt="Nærbillede af valnøddetræ og de tre slibespor"
              variant="warm"
              className="w-full h-full"
            />
          </div>
          <div>
            <h2 className="font-serif text-3xl md:text-4xl mb-6 leading-tight">
              Valnød. Stål. Ro på terrassen.
            </h2>
            <p className="text-foreground/70 leading-relaxed">
              Massivt valnøddetræ, der bliver smukkere med årene. Slibespor i
              hærdet stål. Pæn nok til at ligge fremme, når gæsterne kommer.
              Nem nok til at ryge i skuffen igen bagefter.
            </p>
          </div>
        </div>
      </section>

      <ThreeSteps eyebrow="Sådan gør du" heading="Grov. Fin. Polér." />

      {/* ── Købskort igen ───────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#F8F6F3]">
        <div className="max-w-md mx-auto px-6">
          <DirectAddToCart
            productHandle={KNIVSLIBER_CONFIG.PRODUCT_HANDLE}
            variantId={KNIVSLIBER_CONFIG.DEFAULT_VARIANT_ID}
            sourcePage={SOURCE_PAGE}
            campaignName={CAMPAIGN}
          />
          <div className="mt-8">
            <TrustBlok />
          </div>
          <p className="mt-10 text-center font-serif text-lg text-foreground/70 italic">
            En skarp kniv gør sommermaden lettere. Resten passer sig selv.
          </p>
        </div>
      </section>

      <StickyBuyBar sourcePage={SOURCE_PAGE} campaignName={CAMPAIGN} />
    </main>
  );
}
