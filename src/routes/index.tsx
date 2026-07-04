import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowRight, Truck, ShieldCheck, RotateCcw, MessageCircle } from "lucide-react";

import { ProductCard } from "@/components/ProductCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ImageSlot, IMAGE_SLOTS } from "@/components/ImageSlot";
import { HeroVideo } from "@/components/landing/HeroVideo";
import { VideoShowcase } from "@/components/VideoShowcase";
import { BundleSection } from "@/components/landing/BundleSection";
import { MestElskede } from "@/components/landing/MestElskede";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { STORIES as UNIVERSET_STORIES } from "@/lib/universet";
import { StoryCard as UniversetHomeStoryCard } from "@/components/universet/StoryCard";
import { KeramikHomeSection } from "@/components/KeramikHomeSection";
import { HeroOffer } from "@/components/landing/HeroOffer";
import { StartRitualetBundle } from "@/components/landing/StartRitualetBundle";

const UNIVERSET_HOME_STORIES = UNIVERSET_STORIES.slice(0, 3);

import heroPoster from "@/assets/hero-kitchen.jpg";

const HERO_VIDEO_SRC = "/videos/frontpage-hero-loop.mp4";

const MATERIAL_STEEL = "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/ln-material-damascus-01.png?v=1778143706";
const MATERIAL_WALNUT = "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/ln-material-walnut-01.png?v=1778143731";
const MATERIAL_STONE = "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/ln-material-whetstone-01.png?v=1778143769";

interface HomeLoaderData {
  mestElskede: ShopifyProduct[];
  featured: ShopifyProduct[];
}

async function fetchHomeProducts(): Promise<HomeLoaderData> {
  // "Mest elskede" hentes via Shopify-tag `mest-elsket` — kunden tagger
  // produkter i Shopify admin. Fallback til bestsellers / første 4 produkter
  // så sektionen aldrig er tom ved koldstart.
  // TODO: skift `tag:mest-elsket` hvis kurateringen skal styres et andet sted.
  try {
    const [mestData, fallbackData] = await Promise.all([
      storefrontApiRequest(PRODUCTS_QUERY, { first: 4, query: "tag:mest-elsket" }),
      storefrontApiRequest(PRODUCTS_QUERY, { first: 8 }),
    ]);
    const featured: ShopifyProduct[] = fallbackData?.data?.products?.edges ?? [];
    let mestElskede: ShopifyProduct[] = mestData?.data?.products?.edges ?? [];
    if (mestElskede.length === 0) mestElskede = featured.slice(0, 4);
    return { mestElskede, featured };
  } catch {
    return { mestElskede: [], featured: [] };
  }
}

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    return context.queryClient.ensureQueryData({
      queryKey: ["home-products"],
      queryFn: fetchHomeProducts,
    });
  },
  head: () => ({
    meta: [
      { title: "Langsomt Nok — Tid. Håndværk. Ro." },
      {
        name: "description",
        content:
          "Nordisk premium køkkenbrand. Knive, slibesten og magnetiske holdere i træ, stål og sten — skabt til hænder, der gerne vil mærke forskellen.",
      },
      { property: "og:title", content: "Langsomt Nok — Tid. Håndværk. Ro." },
      {
        property: "og:description",
        content: "Køkkenredskaber til hænder, der gerne vil mærke forskellen.",
      },
      { property: "og:image", content: heroPoster },
    ],
    links: [{ rel: "canonical", href: "https://langsomtnok.dk" }],
  }),
  component: HomePage,
});

const CATEGORIES = [
  {
    title: "Knive",
    text: "Til dig, der vil lave mad med bedre grej.",
    handle: "knive",
    slot: IMAGE_SLOTS.categories.knives,
  },
  {
    title: "Slibning & pleje",
    text: "Gør dine knive skarpe igen — i ro og mag.",
    handle: "slibesten",
    slot: IMAGE_SLOTS.categories.sharpeningStones,
  },
  {
    title: "Magnetisk opbevaring",
    text: "Få knivene væk fra skuffen. Sættes op uden boremaskine.",
    handle: "magnetiske-holdere",
    slot: IMAGE_SLOTS.categories.magneticHolders,
  },
  {
    title: "Gaver",
    text: "Gaver, der føles udvalgt — ikke tilfældige.",
    handle: "gaver",
    slot: IMAGE_SLOTS.categories.giftSets,
  },
] as const;

const RITUAL_CHOICES = [
  {
    title: "Jeg vil have min første rigtige kniv",
    text: "Til dig, der vil starte med ét godt redskab.",
    to: "/collections/knive",
    cta: "Se knivene",
  },
  {
    title: "Jeg vil passe bedre på mine redskaber",
    text: "Slibning, olie og pleje til hverdagen.",
    to: "/collections/pleje-ritualer",
    cta: "Se plejen",
  },
  {
    title: "Jeg vil give en gave med mening",
    text: "Noget der bliver brugt — og husket.",
    to: "/collections/gaver",
    cta: "Se gaverne",
  },
] as const;

const GUIDES = [
  {
    title: "Sådan vælger du din første kokkekniv",
    excerpt: "Stål, balance og greb. Tre ting, der gør forskellen — roligt forklaret.",
    slug: "hvilken-kokkekniv-skal-jeg-vaelge",
  },
  {
    title: "Slibning som ritual",
    excerpt: "Hvordan en slibesten forvandler vedligehold til et stille øjeblik.",
    slug: "hvordan-sliber-man-en-kniv",
  },
  {
    title: "Træ, stål og tid",
    excerpt: "Hvorfor materialer, der ældes smukt, er en investering værd.",
    slug: "gode-koekkenredskaber-der-holder",
  },
] as const;

function HomePage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    storefrontApiRequest(PRODUCTS_QUERY, { first: 8 })
      .then((data) => {
        if (data?.data?.products?.edges) setProducts(data.data.products.edges);
      })
      .catch(console.error);
  }, []);

  const featured = products.slice(0, 4);

  return (
    <div className="bg-background">
      {/* ─────────────────── 1. HERO VIDEO ─────────────────── */}
      <section className="relative min-h-[88vh] md:min-h-[92vh] flex items-end md:items-center">
        <HeroVideo src={HERO_VIDEO_SRC} poster={heroPoster} alt="Roligt nordisk køkken med damaskus kokkekniv" />
        <div className="container-calm relative z-10 pb-16 md:pb-0 pt-24">
          <div className="max-w-2xl fade-in-up">
            <span className="inline-block text-[11px] tracking-[0.25em] uppercase text-deep-foreground/65 mb-6">
              Køkken · Keramik · Hverdagsritualer
            </span>
            <h1 className="font-serif text-deep-foreground leading-[1.02] text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6">
              Et roligere køkken<br />starter med de ting,<br />du bruger hver dag.
            </h1>
            <p className="text-base md:text-lg text-deep-foreground/80 leading-relaxed mb-9 max-w-lg">
              Udvalgte produkter i træ, stål og keramik — skabt til mere orden, bedre hverdagsritualer og et hjem, der føles rart at være i.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link
                to="/shop"
                className="btn-cta"
                data-event="hero_cta_click"
                data-section="homepage_hero"
                data-target="kitchen_collection"
              >
                Se køkkenfavoritter
              </Link>
              <Link
                to="/keramik"
                className="btn-outline-calm border-deep-foreground/35 text-deep-foreground hover:bg-deep-foreground/10"
                data-event="hero_cta_click"
                data-section="homepage_hero"
                data-target="ceramic_collection"
              >
                Udforsk keramik
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-x-5 gap-y-2 max-w-md mb-5 text-[13px] md:text-sm text-deep-foreground/80">
              {[
                "Massiv valnød & stål",
                "Skabt til nordiske hjem",
                "Klar til levering",
                "Fri fragt over 599 kr",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="text-deep-foreground/90 mt-0.5">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs md:text-sm text-deep-foreground/55 tracking-wide">
              Sendes fra Danmark · 1-2 dage · Sikker betaling · 30 dages retur
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────── TRUST: Handel med ro i maven ─────────────────── */}
      <section className="section-padding bg-soft/50">
        <div className="container-calm max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] tracking-[0.25em] uppercase text-copper">Tryghed</span>
            <h2 className="font-serif text-3xl md:text-4xl mt-2 mb-4">Handel med ro i maven</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vi er et nyt dansk køkkenunivers. Derfor bygger vi tillid på det enkle: tryg betaling, tydelige vilkår, ærlige produktbilleder og omhyggelig pakning.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            {[
              { icon: Truck, title: "Sendes fra Danmark", text: "Din ordre pakkes med omhu og sendes fra Danmark." },
              { icon: ShieldCheck, title: "Tryg betaling", text: "Betaling foregår sikkert via webshoppen." },
              { icon: RotateCcw, title: "30 dages returret", text: "Du har tid til at mærke efter." },
              { icon: MessageCircle, title: "Direkte kontakt", text: "Skriv til os, hvis du er i tvivl om et produkt." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-6 rounded-lg bg-background/60 border border-border/40">
                <item.icon className="w-5 h-5 text-cta flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <h3 className="font-serif text-lg mb-1.5 text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── HERO OFFER: Magnetisk knivholder ─────────────────── */}
      <HeroOffer />

      {/* ─────────────────── VIDEO: Magnetisk knivholder ─────────────────── */}
      <VideoShowcase
        eyebrow="Et roligere køkken"
        title="En lille opgradering. Mere ro i køkkenet."
        body="Se hvor enkelt den magnetiske knivholder finder sin plads. Uden boremaskine. Uden støv. Bare ro, orden og knive lige ved hånden."
        background="soft"
        videoSide="right"
        cta={{
          label: "Se knivholderen",
          // TODO: opdatér til specifik produkt-handle, fx /product/$handle med rigtigt handle
          to: "/collections/magnetiske-holdere",
          dataEvent: "video_section_cta_click",
          dataSection: "homepage_knifeholder_video",
          dataProduct: "magnetic_knife_holder",
        }}
      />


      <section className="section-padding">
        <div className="container-calm">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="text-[11px] tracking-[0.25em] uppercase text-copper">Kategorier</span>
              <h2 className="font-serif text-3xl md:text-5xl mt-2">Find det, du leder efter</h2>
            </div>
            <p className="text-muted-foreground max-w-sm">
              Fire indgange til et roligere køkken. Vælg dér, hvor du gerne vil starte.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.handle}
                to="/collections/$handle"
                params={{ handle: cat.handle }}
                className="group block rounded-xl border border-border/70 bg-card p-3 lift-on-hover"
                data-event="category_card_click"
                data-section="homepage_categories"
                data-target={cat.handle}
              >
                <div className="overflow-hidden rounded-lg bg-soft mb-5">
                  <div className="transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                    <ImageSlot
                      name={cat.slot.name}
                      ratio="4/5"
                      motif={cat.slot.motif}
                      alt={cat.title}
                      variant="warm"
                      className="rounded-none"
                    />
                  </div>
                </div>
                <h3 className="font-serif text-xl mb-1.5 text-foreground group-hover:text-walnut transition-colors px-1">
                  {cat.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed px-1">{cat.text}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-cta px-1 group-hover:gap-2.5 transition-all">
                  Se kollektionen <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── 3. FEATURED PRODUCTS ─────────────────── */}
      {featured.length > 0 && (
        <section className="section-padding bg-soft/40">
          <div className="container-calm">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <div>
                <span className="text-[11px] tracking-[0.25em] uppercase text-copper">Udvalgt lige nu</span>
                <h2 className="font-serif text-3xl md:text-5xl mt-2">Et godt sted at starte</h2>
              </div>
              <Link
                to="/shop"
                className="text-sm font-semibold text-cta inline-flex items-center gap-1.5 hover:gap-2.5 transition-all"
                data-event="section_cta_click"
                data-section="featured_products"
                data-target="all_products"
              >
                Se alle produkter <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {featured.map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────── 3b. BUNDLES ─────────────────── */}
      <StartRitualetBundle />
      <BundleSection />

      {/* ─────────────────── 3c. KERAMIK ─────────────────── */}
      <KeramikHomeSection />

      {/* ─────────────────── 4. MATERIALS ─────────────────── */}
      <section className="section-padding bg-deep text-deep-foreground">
        <div className="container-calm">
          <div className="max-w-2xl mb-14">
            <span className="text-[11px] tracking-[0.25em] uppercase text-copper">Materialer</span>
            <h2 className="font-serif text-3xl md:text-5xl mt-2 leading-tight">
              Materialer, der bliver smukkere med brug.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
            {[
              { name: "Stål", text: "Lagdelt. Skarpt. Skabt til præcision.", img: MATERIAL_STEEL, alt: "Langsomt Nok Damascus stål makro med lagdelt mønster" },
              { name: "Træ", text: "Varmt, levende og forskelligt fra håndtag til håndtag.", img: MATERIAL_WALNUT, alt: "Langsomt Nok valnøddetræ makro med varm åretegning" },
              { name: "Sten", text: "Skarphed kræver tålmodighed.", img: MATERIAL_STONE, alt: "Langsomt Nok slibesten med vanddråber og stille tekstur" },
            ].map((m) => (
              <article key={m.name} className="group">
                <div className="overflow-hidden rounded-lg mb-6 aspect-[4/5]">
                  <img
                    src={m.img}
                    alt={m.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <h3 className="font-serif text-2xl mb-2">{m.name}</h3>
                <p className="text-sm text-deep-foreground/65 leading-relaxed max-w-xs">{m.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── 5. FIND YOUR FIRST RITUAL ─────────────────── */}
      <section className="section-padding">
        <div className="container-calm">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] tracking-[0.25em] uppercase text-copper">Vejledning</span>
            <h2 className="font-serif text-3xl md:text-5xl mt-2 mb-4">Find dit første ritual</h2>
            <p className="text-muted-foreground">
              Tre stille indgange. Vælg den, der passer til dig — vi guider dig roligt videre.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {RITUAL_CHOICES.map((c, i) => (
              <Link
                key={c.title}
                to={c.to}
                className="group block p-8 lg:p-10 rounded-lg bg-soft/60 hover:bg-soft transition-colors duration-500 border border-border/40"
              >
                <span className="block font-serif text-copper/70 text-sm mb-6">0{i + 1}</span>
                <h3 className="font-serif text-xl lg:text-2xl mb-3 leading-snug group-hover:text-walnut transition-colors">
                  {c.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{c.text}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-cta group-hover:gap-2.5 transition-all">
                  {c.cta} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href="/find-dit-ritual"
              className="inline-flex items-center gap-2 text-sm font-medium text-walnut border-b border-walnut/30 pb-1 hover:gap-3 transition-all"
            >
              Find dit køkkenritual <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ─────────────────── 6. BRAND PROOF ─────────────────── */}
      <section className="section-padding bg-linen/60">
        <div className="container-calm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="overflow-hidden rounded-lg aspect-[4/5] lg:aspect-[5/6]">
                <img
                  src={MATERIAL_STEEL}
                  alt="Langsomt Nok Damascus stål makro med lagdelt mønster"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="lg:col-span-6 lg:pl-6 order-1 lg:order-2">
              <span className="text-[11px] tracking-[0.25em] uppercase text-copper">Manifest</span>
              <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl mt-3 mb-8 leading-[1.05]">
                Ikke skabt til fart.
              </h2>
              <div className="space-y-5 text-base md:text-lg text-foreground/75 leading-relaxed max-w-xl">
                <p>
                  Langsomt Nok er køkkenredskaber med vægt, ro og materialer, der gerne må mærkes.
                </p>
                <p>Til madlavning, der begynder før gryden koger.</p>
                <p>Til hænder, der vælger med omhu.</p>
              </div>
              <div className="mt-10">
                <Link
                  to="/om"
                  className="inline-flex items-center gap-2 text-sm font-medium text-walnut hover:gap-3 transition-all border-b border-walnut/30 pb-1"
                >
                  Læs vores historie <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── 7. NEWSLETTER ─────────────────── */}
      <NewsletterSignup />

      {/* ─────────────────── 8. GUIDES ─────────────────── */}
      <section className="section-padding">
        <div className="container-calm">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="text-[11px] tracking-[0.25em] uppercase text-copper">Læs</span>
              <h2 className="font-serif text-3xl md:text-5xl mt-2">Fra guiden</h2>
            </div>
            <Link
              to="/guides"
              className="text-sm font-medium text-cta inline-flex items-center gap-1.5 hover:gap-2.5 transition-all"
            >
              Alle guides <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {GUIDES.map((g) => (
              <Link
                key={g.slug}
                to="/guides/$slug"
                params={{ slug: g.slug }}
                className="group block"
              >
                <div className="overflow-hidden rounded-lg mb-5 aspect-[4/3] bg-soft">
                  <div className="transition-transform duration-700 ease-out group-hover:scale-[1.03] h-full">
                    <ImageSlot
                      name={`guide-card-${g.slug}`}
                      ratio="4/3"
                      motif="Atmosfærisk køkkenbillede"
                      alt={g.title}
                      variant="warm"
                      className="rounded-none h-full"
                    />
                  </div>
                </div>
                <h3 className="font-serif text-xl mb-2 leading-snug group-hover:text-walnut transition-colors">
                  {g.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{g.excerpt}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-cta group-hover:gap-2.5 transition-all">
                  Læs guiden <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Universet — fortællinger ──────────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="container-calm">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="text-[11px] tracking-[0.25em] uppercase text-copper">Et roligt univers</span>
              <h2 className="font-serif text-3xl md:text-5xl mt-2">Langsomt Nok Universet</h2>
              <p className="text-muted-foreground mt-3 max-w-xl">
                Fortællinger om ritualer, håndværk og de små bevægelser, der gør hverdagen mere nærværende.
              </p>
            </div>
            <Link
              to="/universet"
              className="text-sm font-medium text-cta inline-flex items-center gap-1.5 hover:gap-2.5 transition-all"
            >
              Træd ind i Universet <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-x-8 md:gap-y-14">
            {UNIVERSET_HOME_STORIES.map((s) => (
              <UniversetHomeStoryCard key={s.slug} story={s} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
