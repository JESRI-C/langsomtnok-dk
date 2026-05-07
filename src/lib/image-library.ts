/**
 * ============================================================================
 * LANGSOMT NOK — Image Library
 * ============================================================================
 *
 * Central mapping of all existing brand images.
 * Each image has an id, src, alt text, category, and recommended uses.
 *
 * TO ADD A NEW IMAGE:
 * 1. Place it in src/assets/
 * 2. Import it below
 * 3. Add an entry to IMAGES with proper metadata
 * 4. Reference it via getImage(id) or getImagesByCategory(cat)
 *
 * The ImageSlot component auto-resolves images from this library by slot name.
 * ============================================================================
 */

import heroKitchen from "@/assets/hero-kitchen.jpg";
import materialOlive from "@/assets/material-olive.jpg";
import materialSteel from "@/assets/material-steel.jpg";
import materialStone from "@/assets/material-stone.jpg";
import materialWalnut from "@/assets/material-walnut.jpg";

export interface BrandImage {
  id: string;
  src: string;
  alt: string;
  category: "hero" | "material" | "product" | "lifestyle" | "category";
  recommendedUse: string[];
  mood: string;
}

/**
 * All available brand images.
 * Each image can serve multiple roles across the site.
 */
export const IMAGES: BrandImage[] = [
  {
    id: "hero-kitchen",
    src: heroKitchen,
    alt: "Damaskus kokkekniv på mørkt valnøddetræ i roligt naturligt lys",
    category: "hero",
    recommendedUse: [
      "homepage-hero-main",
      "first-knife-landing-hero",
      "category-knives",
    ],
    mood: "dark, cinematic, calm, tactile, premium",
  },
  {
    id: "material-steel",
    src: materialSteel,
    alt: "Nærbillede af damaskus-stål med synligt lagmønster",
    category: "material",
    recommendedUse: [
      "material-damascus-steel",
      "damascus-landing-hero",
      "product-detail-blade",
      "article-inline-material",
    ],
    mood: "cold, precise, detailed, metallic",
  },
  {
    id: "material-walnut",
    src: materialWalnut,
    alt: "Valnøddetræ overflade med synlig åretegning i varmt lys",
    category: "material",
    recommendedUse: [
      "material-walnut",
      "wooden-knife-holder-landing-hero",
      "product-detail-handle",
      "category-magnetic-holders",
    ],
    mood: "warm, organic, tactile, natural",
  },
  {
    id: "material-olive",
    src: materialOlive,
    alt: "Oliventræ close-up med karakteristisk hvirvlende mønster",
    category: "material",
    recommendedUse: [
      "material-olive-wood",
      "category-care-products",
      "material-oil-on-wood",
    ],
    mood: "warm, living, organic, varied",
  },
  {
    id: "material-stone",
    src: materialStone,
    alt: "Japansk slibesten overflade med vandfilm i roligt lys",
    category: "material",
    recommendedUse: [
      "material-sharpening-stone",
      "sharpening-landing-hero",
      "category-sharpening-stones",
      "article-inline-process",
    ],
    mood: "calm, meditative, textural, precise",
  },
];

/**
 * Mapping from IMAGE_SLOTS slot names → image id.
 * This lets ImageSlot auto-resolve images without explicit src props.
 */
export const SLOT_IMAGE_MAP: Record<string, string> = {
  // Heroes
  "homepage-hero-main": "hero-kitchen",
  "first-knife-landing-hero": "hero-kitchen",
  "damascus-landing-hero": "material-steel",
  "sharpening-landing-hero": "material-stone",
  "wooden-knife-holder-landing-hero": "material-walnut",
  "gift-landing-hero": "material-olive",

  // Categories
  "category-knives": "hero-kitchen",
  "category-sharpening-stones": "material-stone",
  "category-magnetic-holders": "material-walnut",
  "category-care-products": "material-olive",

  // Materials
  "material-damascus-steel": "material-steel",
  "material-walnut": "material-walnut",
  "material-olive-wood": "material-olive",
  "material-sharpening-stone": "material-stone",
  "material-oil-on-wood": "material-olive",

  // Product details (best available match)
  "product-detail-blade": "material-steel",
  "product-detail-handle": "material-walnut",
  "product-care-ritual": "material-stone",

  // Articles
  "article-hero": "hero-kitchen",
  "article-inline-material": "material-steel",
  "article-inline-process": "material-stone",

  // Other
  "cirklen-stories": "hero-kitchen",
  "about-brand-portrait": "hero-kitchen",
};

/** Get a specific image by ID */
export function getImage(id: string): BrandImage | undefined {
  return IMAGES.find((img) => img.id === id);
}

/** Get all images for a category */
export function getImagesByCategory(category: BrandImage["category"]): BrandImage[] {
  return IMAGES.filter((img) => img.category === category);
}

/** Get the resolved image src for a slot name, or undefined if none mapped */
export function getImageForSlot(slotName: string): string | undefined {
  const imageId = SLOT_IMAGE_MAP[slotName];
  if (!imageId) return undefined;
  return getImage(imageId)?.src;
}

/** Get the resolved alt text for a slot name */
export function getAltForSlot(slotName: string): string | undefined {
  const imageId = SLOT_IMAGE_MAP[slotName];
  if (!imageId) return undefined;
  return getImage(imageId)?.alt;
}
