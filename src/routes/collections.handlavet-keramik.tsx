/**
 * /collections/handlavet-keramik
 * Dedikeret atelier-template til keramik-kategorien.
 * Mere specifik end collections.$handle.tsx → tager forrang.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ImageSlot } from "@/components/ImageSlot";
import {
  storefrontApiRequest,
  COLLECTION_BY_HANDLE_QUERY,
  PRODUCTS_QUERY,
  type ShopifyProduct,
} from "@/lib/shopify";

const SUBCATEGORIES = [
  {
    handle: "susan-riel",
    title: "Susan Riel",
    text: "Keramik med spor af hænder, glasur og ro.",
  },
  {
    handle: "keramikkopper",
    title: "Kopper",
    text: "Til kaffe, te og små pauser i dagen.",
  },
  {
    handle: "keramikskale",
    title: "Skåle",
    text: "Til servering, samling og stille hverdagsritualer.",
  },
  {
    handle: "keramikvaser",
    title: "Vaser",
    text: "Små former til grene, blomster og rolige rum.",
  },
  {
    handle: "keramikunika",
    title: "Unika",
    text: "Ét værk. Ét hjem. Én stille videre rejse.",
  },
] as const;

const PAGE_TITLE = "Håndlavet keramik — Langsomt Nok";
const PAGE_DESC =
  "Håndlavet keramik fra Susan Riel og kommende kunstnere. Kopper, skåle, vaser og unika skabt i hænder, ler og tid.";

export const Route = createFileRoute("/collections/handlavet-keramik")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESC },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESC },
    ],
  }),
  component: KeramikCollectionPage,
});

function KeramikCollectionPage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storefrontApiRequest(COLLECTION_BY_HANDLE_QUERY, {
      handle: "handlavet-keramik",
      first: 50,
      sortKey: "COLLECTION_DEFAULT",
      reverse: false,
    })
      .then(async (data) => {
        const edges = data?.data?.collection?.products?.edges ?? [];
        if (edges.length > 0) {
          setProducts(edges);
          return;
        }
        // Fallback: Storefront API kan ikke se kollektionen (ikke publiceret
        // til Headless/Online Store sales channel) — hent på product_type.
        const fb = await storefrontApiRequest(PRODUCTS_QUERY, {
          first: 50,
          query: "product_type:Keramik",
        });
        setProducts(fb?.data?.products?.edges ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-background">
      {/* ── Hero / intro ───────────────────────────── */}
      <section className="relative pt-28 pb-16 md:pb-24 bg-soft/50 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://cdn.shopify.com/s/files/1/0915/7227/3488/files/Rusic_ceramics_on_a_cozy_shelf.png?v=1778397635')",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-background/40 md:bg-gradient-to-r md:from-background/75 md:via-background/35 md:to-transparent" aria-hidden="true" />
        <div className="container-calm relative">
          <div className="max-w-2xl">
            <span className="text-[11px] tracking-[0.25em] uppercase text-copper">
              Atelier
            </span>
            <h1 className="font-serif text-4xl md:text-6xl mt-3 mb-6 leading-[1.05]">
              Håndlavet keramik
            </h1>
            <p className="font-serif text-2xl md:text-3xl text-foreground/80 leading-snug mb-8">
              Keramik bærer spor.<br />
              Af hænder.<br />
              Af ler.<br />
              Af tid.<br />
              Hver form er skabt langsomt — og ingen er helt ens.
            </p>
            <p className="text-editorial text-muted-foreground max-w-xl">
              Her finder du håndlavet keramik fra Susan Riel og kommende
              kunstnere i Langsomt Nok-universet. Kopper, skåle, vaser og små
              objekter skabt til rolige rum og sanselige hverdagsritualer.
            </p>
          </div>
        </div>
      </section>

      {/* ── Underkategori-kort ─────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="container-calm">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {SUBCATEGORIES.map((sub) => (
              <Link
                key={sub.handle}
                to="/collections/$handle"
                params={{ handle: sub.handle }}
                className="group block rounded-lg p-5 md:p-6 bg-soft hover:bg-linen/60 transition-all duration-500 hover:-translate-y-0.5"
                style={{ border: "1px solid rgba(45,45,45,0.12)" }}
                data-track={`keramik_subcat_${sub.handle}`}
              >
                <h3 className="font-serif text-lg md:text-xl mb-2 group-hover:text-walnut transition-colors">
                  {sub.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {sub.text}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Produktgrid eller tom-tilstand ─────────── */}
      <section className="pb-20 md:pb-28">
        <div className="container-calm">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-linen rounded-lg mb-4" />
                  <div className="h-4 bg-linen rounded w-2/3 mb-2" />
                  <div className="h-3 bg-linen rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="max-w-xl mx-auto text-center py-16 md:py-24">
              <h2 className="font-serif text-3xl md:text-4xl mb-5">
                Keramikken er på vej
              </h2>
              <p className="text-editorial text-muted-foreground mb-8">
                De første værker fra Susan Riel er ved at blive gjort klar.
                Snart lander kopper, skåle og små objekter her — skabt i
                hænder og i roligt tempo.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-md bg-cta text-cta-foreground px-6 py-3 text-sm font-medium hover:bg-[#3F4B3D] transition-colors"
              >
                Gå tilbage til forsiden
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Mød kunstneren ─────────────────────────── */}
      <section className="section-padding bg-soft/60">
        <div className="container-calm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="rounded-lg overflow-hidden bg-linen">
              <ImageSlot
                name="susan-riel-portrait"
                ratio="4/5"
                motif="Rolig portræt eller atelierbillede af keramiker Susan Riel ved drejeskive med ler og glasurer, blødt naturligt lys"
                alt="Susan Riel i sit atelier"
                variant="warm"
                className="rounded-none"
              />
            </div>
            <div className="max-w-md">
              <span className="text-[11px] tracking-[0.25em] uppercase text-copper">
                Kunstneren
              </span>
              <h2 className="font-serif text-3xl md:text-4xl mt-3 mb-5 leading-tight">
                Mød Susan Riel
              </h2>
              <p className="text-editorial text-foreground/75 leading-relaxed mb-8">
                Susan Riel skaber keramik med levende glasurer, rolige former
                og tydelige spor af hænder. Hvert værk har sin egen lille
                forskydning, sin egen farvebevægelse og sin egen stille
                karakter.
              </p>
              <Link
                to="/collections/$handle"
                params={{ handle: "susan-riel" }}
                className="inline-flex items-center gap-2 rounded-md bg-cta text-cta-foreground px-6 py-3 text-sm font-medium hover:bg-[#3F4B3D] transition-colors"
                data-track="keramik_susan_riel_cta"
              >
                Se Susan Riels keramik
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
