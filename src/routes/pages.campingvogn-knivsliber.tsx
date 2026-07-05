import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { DirectAddToCart } from "@/components/knivsliber-landing/DirectAddToCart";
import { StickyBuyBar } from "@/components/knivsliber-landing/StickyBuyBar";
import { ThreeSteps } from "@/components/knivsliber-landing/ThreeSteps";
import { KNIVSLIBER_CONFIG } from "@/lib/knivsliber-config";
import { trackEvent, trackProductView } from "@/lib/analytics";
import heroImg from "@/assets/knivsliber-landing/hero-campingvogn.png.asset.json";

const SOURCE_PAGE = "/pages/campingvogn-knivsliber";
const CAMPAIGN = "campingvogn";

export const Route = createFileRoute("/pages/campingvogn-knivsliber")({
  head: () => ({
    meta: [
      { title: "Lille nok til campingvognen — Knivsliber i valnød | Langsomt Nok" },
      {
        name: "description",
        content:
          "Let i hånden. Nem i skuffen. En 3-trins knivsliber i massivt valnød til campingkøkkenet — lægges direkte i din kurv.",
      },
      { property: "og:title", content: "Lille nok til campingvognen." },
      {
        property: "og:description",
        content: "Pæn på bordet. Nem i skuffen. Klar til aftensmaden.",
      },
      { property: "og:type", content: "product" },
      { property: "og:image", content: `https://langsomtnok.dk${heroImg.url}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index,follow" },
    ],
  }),
  component: CampingvognPage,
});

function CampingvognPage() {
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
              Campingvogn
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] mb-6">
              Lille nok til campingvognen.
              <br />
              <span className="text-[#5A3B2E]">Klar til feriekøkkenet.</span>
            </h1>
            <p className="text-base md:text-lg text-foreground/70 leading-relaxed mb-10 max-w-md">
              Let i hånden. Nem i skuffen. Pæn nok til at stå fremme.
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
              alt="Knivsliber i valnød på bord ved krukker med krydderurter — feriestemning"
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
      </section>

      {/* ── Argumenter ──────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#F8F6F3]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl mb-14 max-w-xl leading-tight">
            Når pladsen er lille, tæller det, der bliver.
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              "Let at tage med.",
              "Let at gemme væk.",
              "Klar, når maden skal på bordet.",
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
            Tre trin. Ét mindre irritationsmoment på ferien.
          </h2>
          <div className="relative aspect-video rounded-md overflow-hidden bg-[#2D2D2D]/5 mt-8">
            <img
              src={heroImg.url}
              alt="Jesper holder knivsliberen i hånden — still fra camping-video"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ── Materialesplit ──────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#F8F6F3]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="aspect-square md:aspect-[4/5] rounded-md overflow-hidden bg-[#E6E0D7]">
            <img
              src={heroImg.url}
              alt="Nærbillede af valnøddetræ, stål og de tre spor i knivsliberen"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <h2 className="font-serif text-3xl md:text-4xl mb-6 leading-tight">
              Valnød. Stål. Ro.
            </h2>
            <p className="text-foreground/70 leading-relaxed">
              Et redskab, der ikke kræver meget plads. Men som gør en mærkbar forskel, når du står
              med aftensmaden.
            </p>
          </div>
        </div>
      </section>

      <ThreeSteps eyebrow="Tre trin" heading="Grov. Fin. Polér." />

      {/* ── Købskort igen ───────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-[#F8F6F3]">
        <div className="max-w-md mx-auto px-6">
          <DirectAddToCart
            productHandle={KNIVSLIBER_CONFIG.PRODUCT_HANDLE}
            variantId={KNIVSLIBER_CONFIG.DEFAULT_VARIANT_ID}
            sourcePage={SOURCE_PAGE}
            campaignName={CAMPAIGN}
          />
          <p className="mt-10 text-center font-serif text-lg text-foreground/70 italic">
            Pæn på bordet. Nem i skuffen. Klar til næste måltid.
          </p>
        </div>
      </section>

      <StickyBuyBar sourcePage={SOURCE_PAGE} campaignName={CAMPAIGN} />
    </main>
  );
}
