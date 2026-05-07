/**
 * Curated product sets section — fetches real products from Shopify.
 * Replaces previous mock/placeholder bundles.
 */

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { fetchProductsByHandles, type ShopifyProduct } from "@/lib/shopify";

/** Curated sets of real Shopify product handles */
const CURATED_SETS = [
  "damascus-chef-knife-8-5-olive-wood",
  "double-sided-whetstone-1000-5000",
  "walnut-sharpener-xz-mdq01-htm",
  "magnetic-knife-display-stand-walnut",
  "magnetic-knife-holder-acacia-19-6",
  "magnetic-knife-display-stand-acacia",
];

interface BundleRecommendationBlockProps {
  title?: string;
  subtitle?: string;
}

export function BundleRecommendationBlock({ title = "Sæt dit ritual sammen", subtitle }: BundleRecommendationBlockProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    fetchProductsByHandles(CURATED_SETS).then(setProducts);
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="section-padding bg-soft">
      <div className="container-calm">
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl md:text-3xl mb-3">{title}</h2>
          {subtitle && <p className="text-muted-foreground text-editorial mx-auto">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.node.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
