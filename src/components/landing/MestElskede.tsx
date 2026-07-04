/**
 * MEST ELSKEDE — kurateret produktrække på forsiden.
 *
 * Hentes SSR via loader'en i src/routes/index.tsx (så første HTML har
 * produkterne — vigtigt for Meta-annoncetrafik og SEO).
 *
 * Kilde: Shopify-tag `mest-elsket` (kunden kan tagge produkter i Shopify
 * admin for at kuratere sektionen).
 * TODO: skift til Shopify metaobject eller anden kilde hvis kurateringen
 * skal styres et andet sted end via tags.
 */

import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import type { ShopifyProduct } from "@/lib/shopify";

interface Props {
  products: ShopifyProduct[];
}

export function MestElskede({ products }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="section-padding bg-background">
      <div className="container-calm">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-12">
          <div>
            <span className="text-[11px] tracking-[0.25em] uppercase text-copper">
              Mest elskede
            </span>
            <h2 className="font-serif text-3xl md:text-5xl mt-2">
              De ting, kunderne vender tilbage til
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl leading-relaxed">
              Et lille udvalg af de produkter, der oftest bliver valgt. Skabt til brug,
              ikke til showroom.
            </p>
          </div>
          <Link
            to="/shop"
            className="text-sm font-semibold text-cta inline-flex items-center gap-1.5 hover:gap-2.5 transition-all whitespace-nowrap"
            data-event="section_cta_click"
            data-section="mest_elskede"
          >
            Se alle produkter <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.node.id} product={product} section="homepage_mest_elskede" />
          ))}
        </div>
      </div>
    </section>
  );
}
