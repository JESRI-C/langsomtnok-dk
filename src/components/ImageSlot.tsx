/**
 * ============================================================================
 * IMAGE SLOT — Langsomt Nok Brand Image System
 * ============================================================================
 *
 * Auto-resolves images from the image library by slot name.
 * Falls back to branded placeholder when no image is available.
 *
 * USAGE:
 *   <ImageSlot name="homepage-hero-main" ratio="16/9" />
 *   <ImageSlot name="homepage-hero-main" ratio="16/9" src="/custom.jpg" alt="..." />
 * ============================================================================
 */

import { getImageForSlot, getAltForSlot } from "@/lib/image-library";

interface ImageSlotProps {
  /** Unique slot identifier, e.g. "homepage-hero-main" */
  name: string;
  /** CSS aspect-ratio value, e.g. "16/9", "4/5", "1/1", "21/9" */
  ratio: string;
  /** What this image is used for */
  useCase?: string;
  /** Recommended photographic motif */
  motif?: string;
  /** Alt text for accessibility and SEO */
  alt?: string;
  /** Image source — when provided, renders the actual image */
  src?: string;
  /** Additional CSS classes */
  className?: string;
  /** Placeholder background variant */
  variant?: "light" | "warm" | "dark";
  /** Whether to load eagerly (above fold) or lazily */
  priority?: boolean;
}

export function ImageSlot({
  name,
  ratio,
  useCase,
  motif,
  alt,
  src,
  className = "",
  variant = "light",
  priority = false,
}: ImageSlotProps) {
  const bgMap = {
    light: "bg-soft",
    warm: "bg-linen",
    dark: "bg-deep",
  };
  const textMap = {
    light: "text-foreground/20",
    warm: "text-walnut/20",
    dark: "text-deep-foreground/15",
  };
  const borderMap = {
    light: "border-border/40",
    warm: "border-walnut/10",
    dark: "border-deep-foreground/10",
  };
  const labelMap = {
    light: "text-foreground/30 bg-background/60",
    warm: "text-walnut/40 bg-background/50",
    dark: "text-deep-foreground/25 bg-deep/40",
  };

  if (src) {
    return (
      <div
        className={`overflow-hidden rounded-lg ${className}`}
        style={{ aspectRatio: ratio }}
      >
        <img
          src={src}
          alt={alt || name}
          className="w-full h-full object-cover"
          loading={priority ? "eager" : "lazy"}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg border ${bgMap[variant]} ${borderMap[variant]} ${className}`}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={alt || motif || name}
    >
      {/* Decorative diagonal line for premium feel */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-[120%] h-px ${variant === "dark" ? "bg-deep-foreground/5" : "bg-foreground/5"} rotate-[-15deg]`} />
      </div>

      {/* Brand mark */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 gap-3">
        <span className={`font-serif text-lg md:text-xl tracking-tight ${textMap[variant]}`}>
          Langsomt Nok
        </span>
        {motif && (
          <span className={`text-[11px] md:text-xs text-center max-w-[280px] leading-relaxed ${textMap[variant]}`}>
            {motif}
          </span>
        )}
      </div>

      {/* Slot label */}
      <div className={`absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 ${labelMap[variant]}`}>
        <span className={`text-[9px] font-mono tracking-wider uppercase px-2 py-1 rounded backdrop-blur-sm ${labelMap[variant]}`}>
          {name}
        </span>
        <span className={`text-[9px] font-mono tracking-wider px-2 py-1 rounded backdrop-blur-sm ${labelMap[variant]}`}>
          {ratio.replace("/", ":")}
        </span>
      </div>

      {/* Top-right use case badge */}
      {useCase && (
        <span className={`absolute top-3 right-3 text-[9px] font-mono tracking-wider px-2 py-1 rounded backdrop-blur-sm ${labelMap[variant]}`}>
          {useCase}
        </span>
      )}
    </div>
  );
}

/**
 * ============================================================================
 * IMAGE SLOT CATALOG
 * ============================================================================
 * Complete catalog of all image slots used across the Langsomt Nok website.
 * Import and reference these when creating pages.
 * ============================================================================
 */
export const IMAGE_SLOTS = {
  // ── Hero Images ────────────────────────────────────────────────────
  heroes: {
    homepageHeroMain: {
      name: "homepage-hero-main",
      ratio: "16/9",
      useCase: "Homepage hero background",
      motif: "Damaskus kokkekniv på mørkt valnøddetræ i roligt naturligt lys",
      alt: "Damaskus kokkekniv på mørkt valnøddetræ i roligt naturligt lys",
    },
    firstKnifeLandingHero: {
      name: "first-knife-landing-hero",
      ratio: "21/9",
      useCase: "Landing page: Den første rigtige kokkekniv",
      motif: "En hånd der holder en kokkekniv over et skærebræt med friske urter, varmt sidlys",
      alt: "Hånd med kokkekniv over skærebræt med friske urter",
    },
    giftLandingHero: {
      name: "gift-landing-hero",
      ratio: "21/9",
      useCase: "Landing page: Gave til madelskeren",
      motif: "Smukt indpakket kniv i naturpapir med tørret lavendel, set ovenfra",
      alt: "Gavepakket kokkekniv i naturpapir med tørret lavendel",
    },
    sharpeningLandingHero: {
      name: "sharpening-landing-hero",
      ratio: "21/9",
      useCase: "Landing page: Slibning",
      motif: "Slibesten med vanddrober i close-up, knivblad i baggrunden, roligt lys",
      alt: "Slibesten med vanddrober og knivblad i roligt lys",
    },
    damascusLandingHero: {
      name: "damascus-landing-hero",
      ratio: "21/9",
      useCase: "Landing page: Damaskus kniv",
      motif: "Extreme close-up af damaskus stålmønster med synlige lag, dramatisk lys",
      alt: "Damaskus stålmønster i extreme close-up med dramatisk lys",
    },
    woodenKnifeHolderLandingHero: {
      name: "wooden-knife-holder-landing-hero",
      ratio: "21/9",
      useCase: "Landing page: Knivholder i træ",
      motif: "Magnetisk knivholder i valnød på hvid køkkenvæg med 3 knive, naturligt lys",
      alt: "Magnetisk knivholder i valnøddetræ med tre knive på hvid køkkenvæg",
    },
  },

  // ── Product Category Images ────────────────────────────────────────
  categories: {
    knives: {
      name: "category-knives",
      ratio: "3/4",
      useCase: "Knive kategori-billede",
      motif: "Række af kokkeknive set ovenfra på mørkt skærebræt, minimalistisk",
      alt: "Kollektion af kokkeknive på mørkt skærebræt",
    },
    sharpeningStones: {
      name: "category-sharpening-stones",
      ratio: "3/4",
      useCase: "Slibesten kategori-billede",
      motif: "Slibesten med vand og knivblad, tæt på, naturligt lys ovenfra",
      alt: "Slibesten med vand og knivblad i naturligt lys",
    },
    magneticHolders: {
      name: "category-magnetic-holders",
      ratio: "3/4",
      useCase: "Magnetiske holdere kategori-billede",
      motif: "Magnetisk knivholder i valnød på lys væg, 4 knive, set let fra siden",
      alt: "Magnetisk valnøddetræ knivholder på lys væg med fire knive",
    },
    careProducts: {
      name: "category-care-products",
      ratio: "3/4",
      useCase: "Plejeprodukter kategori-billede",
      motif: "Plejeolie, læderstrop og voks arrangeret på linnedserviet",
      alt: "Plejeolie, læderstrop og voks arrangeret på linnedserviet",
    },
    giftSets: {
      name: "category-gift-sets",
      ratio: "3/4",
      useCase: "Gaveæsker kategori-billede",
      motif: "Åben gaveæske med kniv og plejesæt, set ovenfra, naturpapir",
      alt: "Åben gaveæske med kniv og plejesæt i naturpapir",
    },
  },

  // ── Material Close-ups ─────────────────────────────────────────────
  materials: {
    damascusSteel: {
      name: "material-damascus-steel",
      ratio: "1/1",
      useCase: "Materiale close-up",
      motif: "Extreme close-up af damaskus stålmønster, synlige lag, koldt lys",
      alt: "Close-up af damaskus stålmønster med synlige lag",
    },
    walnut: {
      name: "material-walnut",
      ratio: "1/1",
      useCase: "Materiale close-up",
      motif: "Valnøddetræ overflade med synlig åretegning, varmt naturligt lys",
      alt: "Valnøddetræ overflade med synlig åretegning",
    },
    acacia: {
      name: "material-acacia",
      ratio: "1/1",
      useCase: "Materiale close-up",
      motif: "Acacia træ overflade, lysere toner, organisk mønster",
      alt: "Acacia træ overflade med organisk mønster",
    },
    oliveWood: {
      name: "material-olive-wood",
      ratio: "1/1",
      useCase: "Materiale close-up",
      motif: "Oliventræ close-up med karakteristisk hvirvlende mønster, varmt lys",
      alt: "Oliventræ close-up med hvirvlende mønster",
    },
    leather: {
      name: "material-leather",
      ratio: "1/1",
      useCase: "Materiale close-up",
      motif: "Naturligt læder overflade, læderstrop til hvæsning, tæt på tekstur",
      alt: "Naturligt læder overflade til knivhvæsning",
    },
    sharpeningStone: {
      name: "material-sharpening-stone",
      ratio: "1/1",
      useCase: "Materiale close-up",
      motif: "Japansk slibesten overflade, våd med vandfilm, tæt på tekstur",
      alt: "Japansk slibesten overflade med vandfilm",
    },
    oilOnWood: {
      name: "material-oil-on-wood",
      ratio: "1/1",
      useCase: "Materiale close-up",
      motif: "Olie der trækker ind i træoverflade, halvt oliet halvt tørt",
      alt: "Olie der trækker ind i træoverflade",
    },
  },

  // ── Product Page Images ────────────────────────────────────────────
  product: {
    mainImage: {
      name: "product-main-image",
      ratio: "1/1",
      useCase: "Produktside hovedbillede",
      motif: "Produkt centreret på neutral baggrund, roligt studielys",
      alt: "Produktbillede — hovedvisning",
    },
    detailBlade: {
      name: "product-detail-blade",
      ratio: "16/9",
      useCase: "Produktside blad-detalje",
      motif: "Close-up af knivblad, skarphed synlig, damaskus mønster",
      alt: "Close-up af knivblad med damaskus mønster",
    },
    detailHandle: {
      name: "product-detail-handle",
      ratio: "16/9",
      useCase: "Produktside skaft-detalje",
      motif: "Close-up af skaft, træets åretegning, ergonomisk form",
      alt: "Close-up af træskaft med synlig åretegning",
    },
    inHand: {
      name: "product-in-hand",
      ratio: "4/5",
      useCase: "Produktside i-hånden",
      motif: "Hånd der holder kniven i naturlig grebsposition, set fra siden",
      alt: "Kniv i naturlig grebsposition",
    },
    careRitual: {
      name: "product-care-ritual",
      ratio: "16/9",
      useCase: "Produktside plejeritual",
      motif: "Hænder der olierer et skaft eller sliber et blad, roligt lys",
      alt: "Plejeritual med olie og kniv",
    },
    bundleImage: {
      name: "product-bundle-image",
      ratio: "4/3",
      useCase: "Bundle/kit billede",
      motif: "Komplet sæt arrangeret på linnedserviet, set ovenfra",
      alt: "Komplet sæt med kniv, slibesten og plejeolie",
    },
  },

  // ── Blog & Guide Images ────────────────────────────────────────────
  blog: {
    articleHero: {
      name: "article-hero",
      ratio: "21/9",
      useCase: "Artikel hero-billede",
      motif: "Atmosfærisk køkkenbillede relateret til artiklens emne",
      alt: "Artikel hero-billede",
    },
    articleInlineMaterial: {
      name: "article-inline-material",
      ratio: "16/9",
      useCase: "Artikel inline materiale-billede",
      motif: "Close-up af materiale nævnt i artiklen",
      alt: "Materiale close-up",
    },
    articleInlineProcess: {
      name: "article-inline-process",
      ratio: "16/9",
      useCase: "Artikel inline proces-billede",
      motif: "Hænder i aktion — slibning, skæring, oliering",
      alt: "Procession billede af køkkenritual",
    },
    articleRelatedGuide: {
      name: "article-related-guide",
      ratio: "3/2",
      useCase: "Relateret guide thumbnail",
      motif: "Mindre version af guide-emnet, atmosfærisk",
      alt: "Relateret guide billede",
    },
  },
} as const;
