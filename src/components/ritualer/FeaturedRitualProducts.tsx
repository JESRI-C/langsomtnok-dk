/**
 * FeaturedRitualProducts — premium "Start her" section placed high on
 * ritual pages. One large featured product card on the left, two smaller
 * stacked product cards on the right. Copper stars, moss green CTAs,
 * warm beige panel.
 */
import { Link } from "@tanstack/react-router";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";

interface FeaturedRitualProductsProps {
  title?: string;
  subtitle?: string;
  /** Score label, e.g. "Ritual Score", "Care Score", "Display Score" */
  scoreLabel: string;
  /** Score number, e.g. "4.8" */
  scoreNumber?: string;
  /** Optional small label above featured product, e.g. "Et godt sted at begynde" */
  featuredLabel?: string;
  /** Optional benefit line under featured title */
  featuredBenefit?: string;
  /** Benefit lines per secondary product, by handle */
  secondaryBenefits?: Record<string, string>;
  /** Featured product (large left card) */
  featured?: ShopifyProduct;
  /** Up to two secondary products */
  secondary?: ShopifyProduct[];
}

function Stars({ value = 5 }: { value?: number }) {
  const full = Math.floor(value);
  return (
    <span
      className="inline-flex tracking-tight leading-none text-sm"
      style={{ color: "#A67C52" }}
      aria-label={`${value} ud af 5 stjerner`}
    >
      {"★".repeat(full)}
      <span className="opacity-25">{"★".repeat(5 - full)}</span>
    </span>
  );
}

export function FeaturedRitualProducts({
  title = "Start her",
  subtitle = "Tre udvalgte produkter, der gør det nemt at begynde.",
  scoreLabel,
  scoreNumber = "4.8",
  featuredLabel = "Et godt sted at begynde",
  featuredBenefit,
  secondaryBenefits = {},
  featured,
  secondary = [],
}: FeaturedRitualProductsProps) {
  if (!featured && secondary.length === 0) return null;

  return (
    <section className="section-padding" style={{ backgroundColor: "#F8F6F3" }}>
      <div className="container-calm">
        <div className="text-center mb-10 md:mb-12">
          <h2
            className="font-serif text-3xl md:text-4xl mb-3"
            style={{ color: "#2D2D2D" }}
          >
            {title}
          </h2>
          <p
            className="text-base md:text-lg max-w-xl mx-auto"
            style={{ color: "rgba(45,45,45,0.72)" }}
          >
            {subtitle}
          </p>
        </div>

        <div
          className="rounded-[18px] p-5 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-7"
          style={{
            backgroundColor: "#E6E0D7",
            border: "1px solid rgba(90,59,46,0.16)",
          }}
        >
          {/* Large featured card */}
          {featured && (
            <Link
              to="/products/$handle"
              params={{ handle: featured.node.handle }}
              className="group block rounded-[14px] overflow-hidden bg-white border transition-shadow hover:shadow-md"
              style={{ borderColor: "rgba(90,59,46,0.14)" }}
            >
              <div className="aspect-[5/4] overflow-hidden" style={{ backgroundColor: "#F3EEE7" }}>
                {featured.node.images.edges[0]?.node ? (
                  <img
                    src={featured.node.images.edges[0].node.url}
                    alt={featured.node.images.edges[0].node.altText || featured.node.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/50 font-serif">
                    Langsomt Nok
                  </div>
                )}
              </div>
              <div className="p-5 md:p-6">
                <span
                  className="inline-block text-[10px] font-medium uppercase tracking-[0.18em] mb-3 px-2 py-1 rounded-full"
                  style={{
                    color: "#5A3B2E",
                    backgroundColor: "rgba(166,124,82,0.12)",
                  }}
                >
                  {featuredLabel}
                </span>
                <h3
                  className="font-serif text-xl md:text-2xl mb-2 leading-snug"
                  style={{ color: "#2D2D2D" }}
                >
                  {featured.node.title}
                </h3>
                {featuredBenefit && (
                  <p
                    className="text-sm md:text-[15px] leading-relaxed mb-4"
                    style={{ color: "rgba(45,45,45,0.72)" }}
                  >
                    {featuredBenefit}
                  </p>
                )}
                <div className="flex items-center gap-2 mb-4">
                  <Stars value={5} />
                  <span className="text-xs md:text-sm" style={{ color: "rgba(45,45,45,0.7)" }}>
                    {scoreNumber} {scoreLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <span className="font-serif text-lg" style={{ color: "#2D2D2D" }}>
                    {formatPrice(
                      featured.node.priceRange.minVariantPrice.amount,
                      featured.node.priceRange.minVariantPrice.currencyCode,
                    )}
                  </span>
                  <span
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md text-sm font-medium transition-colors"
                    style={{ backgroundColor: "#4C574A", color: "#F8F6F3" }}
                  >
                    Tilføj til ritualet →
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Two stacked smaller cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
            {secondary.slice(0, 2).map((p) => {
              const node = p.node;
              const img = node.images.edges[0]?.node;
              const benefit = secondaryBenefits[node.handle];
              return (
                <Link
                  key={node.id}
                  to="/products/$handle"
                  params={{ handle: node.handle }}
                  className="group flex flex-col sm:flex-row lg:flex-row rounded-[14px] overflow-hidden bg-white border transition-shadow hover:shadow-md"
                  style={{ borderColor: "rgba(90,59,46,0.14)" }}
                >
                  <div
                    className="sm:w-2/5 lg:w-2/5 aspect-[4/5] sm:aspect-auto overflow-hidden flex-shrink-0"
                    style={{ backgroundColor: "#F3EEE7" }}
                  >
                    {img ? (
                      <img
                        src={img.url}
                        alt={img.altText || node.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/50 font-serif text-sm">
                        Langsomt Nok
                      </div>
                    )}
                  </div>
                  <div className="p-4 md:p-5 flex-1 flex flex-col">
                    {node.productType && (
                      <span
                        className="text-[10px] font-medium uppercase tracking-[0.16em] mb-1"
                        style={{ color: "#A67C52" }}
                      >
                        {node.productType}
                      </span>
                    )}
                    <h3
                      className="font-serif text-base md:text-lg leading-snug mb-1.5"
                      style={{ color: "#2D2D2D" }}
                    >
                      {node.title}
                    </h3>
                    {benefit && (
                      <p
                        className="text-xs md:text-sm leading-relaxed mb-2"
                        style={{ color: "rgba(45,45,45,0.7)" }}
                      >
                        {benefit}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <Stars value={5} />
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-serif text-base" style={{ color: "#2D2D2D" }}>
                        {formatPrice(
                          node.priceRange.minVariantPrice.amount,
                          node.priceRange.minVariantPrice.currencyCode,
                        )}
                      </span>
                      <span
                        className="text-xs font-medium border-b pb-0.5 transition-all group-hover:gap-2"
                        style={{ color: "#4C574A", borderColor: "rgba(76,87,74,0.35)" }}
                      >
                        Se produktet →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
