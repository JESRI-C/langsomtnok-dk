import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { CalmCTASection } from "@/components/landing/CalmCTASection";
import { ProductCard } from "@/components/ProductCard";
import { fetchProductsByQuery, type ShopifyProduct } from "@/lib/shopify";
import { trackEvent } from "@/lib/analytics";

interface Props {
  campaign: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  introTitle: string;
  introBody: string;
  productQuery: string;
  emptyText: string;
  ritualTitle: string;
  ritualBody: string;
  finalHeadline: string;
  finalBody: string;
  imageName: string;
  imageMotif: string;
  imageSrc?: string;
}

export function KeramikCategoryTemplate(p: Props) {
  const [products, setProducts] = useState<ShopifyProduct[] | null>(null);

  useEffect(() => {
    trackEvent("landing_page_view", { page: p.campaign });
    fetchProductsByQuery(p.productQuery, 12).then(setProducts).catch(() => setProducts([]));
  }, [p.campaign, p.productQuery]);

  return (
    <div data-page-type="keramik_landing" data-campaign={p.campaign}>
      <LandingPageHero
        headline={p.headline}
        subheadline={p.subheadline}
        primaryCta={{ label: "Se værkerne", to: "#vaerker" }}
        imageSlot={{ name: p.imageName, motif: p.imageMotif, src: p.imageSrc }}
        variant="overlay"
      />

      <section className="section-padding">
        <div className="container-calm max-w-2xl text-center">
          <span className="text-[10px] font-medium text-copper uppercase tracking-[0.2em]">{p.eyebrow}</span>
          <h2 className="font-serif text-2xl md:text-3xl mt-3 mb-6">{p.introTitle}</h2>
          <p className="text-editorial text-muted-foreground whitespace-pre-line">{p.introBody}</p>
        </div>
      </section>

      <section id="vaerker" className="section-padding bg-soft">
        <div className="container-calm">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl md:text-3xl mb-3">{p.ritualTitle}</h2>
            <p className="text-muted-foreground text-editorial mx-auto max-w-xl">{p.ritualBody}</p>
          </div>

          {products === null ? (
            <p className="text-center text-muted-foreground text-sm">Henter værker …</p>
          ) : products.length === 0 ? (
            <div className="max-w-xl mx-auto text-center p-8 rounded-lg border border-border bg-background">
              <p className="text-editorial text-muted-foreground mb-4">{p.emptyText}</p>
              <Link to="/cirklen" className="text-xs text-cta font-medium uppercase tracking-wider">
                Få besked når værkerne er klar →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CalmCTASection
        headline={p.finalHeadline}
        text={p.finalBody}
        cta={{ label: "Se hele keramik-universet", to: "/keramik" }}
        variant="warm"
      />
    </div>
  );
}
