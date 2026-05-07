import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ImageSlot, IMAGE_SLOTS } from "@/components/ImageSlot";
import { CollectionCard } from "@/components/landing/CollectionCard";
import { RitualBlock } from "@/components/landing/RitualBlock";
import { MaterialBlock } from "@/components/landing/MaterialBlock";
import { BundleRecommendationBlock } from "@/components/landing/BundleRecommendationBlock";
import { TrustBar } from "@/components/landing/TrustBar";
import { CalmCTASection } from "@/components/landing/CalmCTASection";
import { storefrontApiRequest, PRODUCTS_QUERY, BUNDLE_PLACEHOLDERS, formatPrice, type ShopifyProduct } from "@/lib/shopify";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Langsomt Nok — Tid. Håndværk. Ro." },
      { name: "description", content: "Køkkenredskaber skabt til dem, der ikke skynder sig gennem det vigtige. Knive, slibesten, holdere og plejeritualer." },
      { property: "og:title", content: "Langsomt Nok — Tid. Håndværk. Ro." },
      { property: "og:description", content: "Køkkenredskaber skabt til dem, der ikke skynder sig gennem det vigtige." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    storefrontApiRequest(PRODUCTS_QUERY, { first: 6 })
      .then((data) => {
        if (data?.data?.products?.edges) {
          setProducts(data.data.products.edges);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      {/* ── 1. Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <ImageSlot
            name={IMAGE_SLOTS.heroes.homepageHeroMain.name}
            ratio="16/9"
            motif={IMAGE_SLOTS.heroes.homepageHeroMain.motif}
            alt={IMAGE_SLOTS.heroes.homepageHeroMain.alt}
            variant="dark"
            className="w-full h-full rounded-none"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-deep/80 via-deep/50 to-transparent" />
        </div>
        <div className="container-calm relative z-10 pt-20">
          <div className="max-w-xl fade-in-up">
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-deep-foreground leading-[0.95] mb-6">
              Tid.<br />Håndværk.<br />Ro.
            </h1>
            <p className="text-lg md:text-xl text-deep-foreground/70 leading-relaxed mb-10 max-w-md">
              Køkkenredskaber skabt til dem, der ikke skynder sig gennem det vigtige.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" asChild>
                <Link to="/shop">Udforsk ritualerne</Link>
              </Button>
              <Button variant="hero-outline" className="border-deep-foreground/30 text-deep-foreground hover:bg-deep-foreground/10" asChild>
                <Link to="/pages/den-forste-rigtige-kokkekniv">Find din første kniv</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Manifest ─────────────────────────────────────────────── */}
      <section className="section-padding bg-soft">
        <div className="container-calm text-center max-w-3xl mx-auto fade-in-up">
          <p className="font-serif text-2xl md:text-4xl leading-relaxed mb-6 text-walnut">
            Træ, stål, olie, tid.
          </p>
          <p className="font-serif text-xl md:text-2xl text-copper mb-8">
            Fire elementer. Ét formål.
          </p>
          <p className="text-editorial mx-auto text-muted-foreground">
            Langsomt Nok er skabt til køkkenet som fristed. Til hænder, der mærker forskellen. Til måltider, der gerne må tage lidt længere tid.
          </p>
        </div>
      </section>

      {/* ── Trust Bar ───────────────────────────────────────────────── */}
      <TrustBar />

      {/* ── 3. Product Categories with ImageSlot ────────────────────── */}
      <section className="section-padding">
        <div className="container-calm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Knive", desc: "Hvert snit fortæller en historie om stål og tålmodighed.", handle: "knive", slot: IMAGE_SLOTS.categories.knives },
              { title: "Slibesten", desc: "Giv bladet nyt liv. Langsomt og med omtanke.", handle: "slibesten", slot: IMAGE_SLOTS.categories.sharpeningStones },
              { title: "Magnetiske holdere", desc: "Træ møder stål. Ophæng med sjæl.", handle: "magnetiske-holdere", slot: IMAGE_SLOTS.categories.magneticHolders },
              { title: "Pleje & ritualer", desc: "Forlæng glæden. Olie, voks og nærvær.", handle: "pleje-ritualer", slot: IMAGE_SLOTS.categories.careProducts },
            ].map((cat) => (
              <Link key={cat.title} to="/collections/$handle" params={{ handle: cat.handle }} className="group block">
                <ImageSlot
                  name={cat.slot.name}
                  ratio="3/4"
                  motif={cat.slot.motif}
                  alt={cat.title}
                  variant="warm"
                  className="mb-4"
                />
                <h3 className="font-serif text-xl mb-1 group-hover:text-walnut transition-colors">{cat.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{cat.desc}</p>
                <span className="text-sm font-medium text-cta">Udforsk →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Find dit køkkenritual ────────────────────────────────── */}
      <RitualBlock />

      {/* ── 5. Featured Products from Shopify ───────────────────────── */}
      <section className="section-padding">
        <div className="container-calm">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl">Udvalgte redskaber</h2>
              <p className="text-muted-foreground mt-2">Skabt til dem, der mærker forskellen.</p>
            </div>
            <Link to="/shop" className="text-sm font-medium text-cta hover:text-cta/80 hidden md:flex items-center gap-1">
              Se alle <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.slice(0, 3).map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <ImageSlot name={`product-placeholder-${i}`} ratio="4/5" motif="Produktbillede" variant="warm" className="mb-4" />
                  <div className="h-4 bg-soft rounded w-3/4 mb-2" />
                  <div className="h-3 bg-soft rounded w-1/2" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 6. Materials ────────────────────────────────────────────── */}
      <MaterialBlock
        title="Materialerne bag ritualet"
        subtitle="Hvert materiale er valgt med omtanke. Ingen tilfældigheder."
        materials={[
          { name: "Damascus stål", description: "Lag på lag af stål smedet til ét formål: et snit der holder.", imageSlotName: IMAGE_SLOTS.materials.damascusSteel.name, motif: IMAGE_SLOTS.materials.damascusSteel.motif },
          { name: "Valnøddetræ", description: "Varme og dybde i hvert greb. Ældes smukt med tiden.", imageSlotName: IMAGE_SLOTS.materials.walnut.name, motif: IMAGE_SLOTS.materials.walnut.motif },
          { name: "Oliventræ", description: "Blødere i hånden. Levende i sit mønster. Naturens egen kunst.", imageSlotName: IMAGE_SLOTS.materials.oliveWood.name, motif: IMAGE_SLOTS.materials.oliveWood.motif },
          { name: "Slibesten", description: "Tålmodighedens redskab. Langsomt giver den bladet nyt liv.", imageSlotName: IMAGE_SLOTS.materials.sharpeningStone.name, motif: IMAGE_SLOTS.materials.sharpeningStone.motif },
        ]}
      />

      {/* ── 7. Bundles ──────────────────────────────────────────────── */}
      <BundleRecommendationBlock
        title="Sæt ro sammen"
        subtitle="Sammensatte ritualer for det komplette køkken."
      />

      {/* ── 8. Cirklen Teaser ───────────────────────────────────────── */}
      <CalmCTASection
        headline="Et stille fællesskab for dem, der tror på tid."
        text="Langsomt Cirklen er vores rum for guides, ritualer, historier og små breve fra køkkenet."
        cta={{ label: "Bliv en del af Cirklen", to: "/cirklen" }}
        variant="warm"
      />

      {/* ── 9. Newsletter ───────────────────────────────────────────── */}
      <NewsletterSignup />
    </div>
  );
}
