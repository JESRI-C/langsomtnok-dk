/**
 * ============================================================================
 * PRODUCT AUDIT PAGE — /audit
 * ============================================================================
 * Dev-only internal page for reviewing product status, missing images,
 * draft products, inventory issues and suggested improvements.
 * ============================================================================
 */

import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { parseProductDescription } from "@/lib/parse-product-description";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [{ title: "Product Audit — Langsomt Nok (Dev)" }],
  }),
  component: AuditPage,
});

interface AuditProduct {
  product: ShopifyProduct;
  hasImage: boolean;
  hasParsedSections: boolean;
  sectionCount: number;
  faqCount: number;
  fitCount: number;
  materialCount: number;
}

const KNOWN_ISSUES = [
  "Gift of Calm har inventory 0 og mangler billede",
  "Damascus Universalkniv mangler billede",
  "Slibesten 3000/8000 mangler billede",
  "Læderstrop mangler billede",
  "Slibestensholder – Akacie mangler billede",
  "Knivsliber – Ask mangler billede",
  "Magnetisk Knivlist – Valnød 50 cm mangler billede",
  "Magnetisk Knivlist – Akacie 15,7\" er draft",
  "Magnetisk Knivlist – Akacie 50 cm er draft",
  "Magnetisk Knivlist – Valnød 50 cm er draft",
  "Magnetisk Knivstander – Akacie er draft",
  "Magnetisk Knivstander – Valnød er draft",
  "Aktiver ikke draft-produkter før billeder og inventory er verificeret",
];

const SUGGESTED_BUNDLES = [
  { name: "Begynder-ritualet", products: "Damascus Chef Knife + Slibesten 1000/5000 + Magnetisk Knivstander" },
  { name: "Pleje-sættet", products: "Slibesten 1000/5000 + Slibesten 3000/8000 + Læderstrop + Slibestensholder" },
  { name: "Køkkenet komplet", products: "Damascus Chef Knife + Damascus Universalkniv + Magnetisk Knivlist 50 cm" },
  { name: "Gave med omhu", products: "Gift of Calm + Damascus Chef Knife" },
];

const LANDING_PAGE_MAPPINGS = [
  { page: "/pages/den-forste-rigtige-kokkekniv", products: "Damascus Chef Knife, Slibesten 1000/5000, Magnetisk Knivstander" },
  { page: "/pages/sadan-holder-du-din-kniv-skarp", products: "Slibesten 1000/5000, Slibesten 3000/8000, Læderstrop, Slibestensholder" },
  { page: "/pages/knivholder-i-trae", products: "Magnetisk Knivlist Akacie 50 cm, Knivstander Akacie, Knivstander Valnød, Knivlist Valnød 50 cm" },
  { page: "/pages/gave-til-madelskeren", products: "Gift of Calm, Damascus Chef Knife, Knivsliber Valnød, Magnetisk Knivstander" },
  { page: "/pages/damaskus-kniv", products: "Damascus Chef Knife, Damascus Universalkniv" },
];

function AuditPage() {
  if (import.meta.env.PROD) {
    return (
      <div className="pt-24 container-calm min-h-screen">
        <h1 className="font-serif text-2xl">Ikke tilgængelig</h1>
        <p className="text-muted-foreground mt-2">Denne side er kun tilgængelig i udviklingsmiljøet.</p>
      </div>
    );
  }
  return <AuditPageDev />;
}

function AuditPageDev() {
  const [products, setProducts] = useState<AuditProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storefrontApiRequest(PRODUCTS_QUERY, { first: 50 })
      .then((data) => {
        const edges: ShopifyProduct[] = data?.data?.products?.edges || [];
        const audited = edges.map((p) => {
          const parsed = parseProductDescription(p.node.descriptionHtml || "");
          const sectionCount = [parsed.intro, parsed.story, parsed.care, parsed.crossSell].filter(Boolean).length
            + (parsed.fitPoints.length > 0 ? 1 : 0)
            + (parsed.materials.length > 0 ? 1 : 0)
            + (parsed.faq.length > 0 ? 1 : 0);
          return {
            product: p,
            hasImage: p.node.images.edges.length > 0,
            hasParsedSections: sectionCount > 0,
            sectionCount,
            faqCount: parsed.faq.length,
            fitCount: parsed.fitPoints.length,
            materialCount: parsed.materials.length,
          };
        });
        setProducts(audited);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="pt-24 container-calm min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const withImages = products.filter(p => p.hasImage);
  const withoutImages = products.filter(p => !p.hasImage);

  return (
    <div className="pt-24 pb-16">
      <div className="container-calm max-w-5xl">
        <div className="mb-12">
          <span className="text-xs font-mono text-copper uppercase tracking-widest mb-2 block">Dev Only</span>
          <h1 className="font-serif text-3xl md:text-4xl mb-2">Langsomt Nok Product Page Audit</h1>
          <p className="text-muted-foreground">Overblik over produktstatus, manglende billeder og forbedringsforslag.</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Produkter i alt", value: products.length },
            { label: "Med billede", value: withImages.length },
            { label: "Mangler billede", value: withoutImages.length },
            { label: "Med FAQ", value: products.filter(p => p.faqCount > 0).length },
          ].map(stat => (
            <div key={stat.label} className="p-4 rounded-lg border border-border bg-soft/30 text-center">
              <p className="text-2xl font-serif">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Product table */}
        <section className="mb-12">
          <h2 className="font-serif text-xl mb-4">Produktoversigt</h2>
          <div className="border border-border rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-soft/50">
                  <th className="text-left p-3 font-medium">Produkt</th>
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-center p-3 font-medium">Billede</th>
                  <th className="text-center p-3 font-medium">Sektioner</th>
                  <th className="text-center p-3 font-medium">FAQ</th>
                  <th className="text-center p-3 font-medium">Fit</th>
                </tr>
              </thead>
              <tbody>
                {products.map(({ product, hasImage, sectionCount, faqCount, fitCount }) => (
                  <tr key={product.node.id} className="border-b border-border/50 hover:bg-soft/20">
                    <td className="p-3">
                      <a href={`/product/${product.node.handle}`} className="text-cta hover:underline font-medium">
                        {product.node.title}
                      </a>
                    </td>
                    <td className="p-3 text-muted-foreground">{product.node.productType}</td>
                    <td className="p-3 text-center">{hasImage ? "✓" : <span className="text-copper">✗</span>}</td>
                    <td className="p-3 text-center">{sectionCount}</td>
                    <td className="p-3 text-center">{faqCount}</td>
                    <td className="p-3 text-center">{fitCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Missing images */}
        {withoutImages.length > 0 && (
          <section className="mb-12">
            <h2 className="font-serif text-xl mb-4">Produkter der mangler billede</h2>
            <div className="space-y-2">
              {withoutImages.map(({ product }) => (
                <div key={product.node.id} className="p-3 rounded-lg border border-copper/30 bg-copper/5 flex items-center justify-between">
                  <span className="font-medium text-sm">{product.node.title}</span>
                  <span className="text-xs text-copper font-mono">Indsæt billede i Shopify</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Known issues */}
        <section className="mb-12">
          <h2 className="font-serif text-xl mb-4">Kendte problemer</h2>
          <div className="space-y-2">
            {KNOWN_ISSUES.map((issue) => (
              <div key={issue} className="p-3 rounded-lg border border-border bg-soft/30 text-sm text-muted-foreground">
                {issue}
              </div>
            ))}
          </div>
        </section>

        {/* Suggested bundles */}
        <section className="mb-12">
          <h2 className="font-serif text-xl mb-4">Foreslåede bundles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SUGGESTED_BUNDLES.map((bundle) => (
              <div key={bundle.name} className="p-4 rounded-lg border border-border">
                <h3 className="font-serif text-base mb-2">{bundle.name}</h3>
                <p className="text-xs text-muted-foreground">{bundle.products}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Landing page mappings */}
        <section className="mb-12">
          <h2 className="font-serif text-xl mb-4">Landing page → Produktmapping</h2>
          <div className="border border-border rounded-lg overflow-hidden">
            {LANDING_PAGE_MAPPINGS.map((mapping, i) => (
              <div key={mapping.page} className={`p-4 ${i > 0 ? "border-t border-border/50" : ""}`}>
                <p className="font-mono text-xs text-cta mb-1">{mapping.page}</p>
                <p className="text-sm text-muted-foreground">{mapping.products}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
