/**
 * ============================================================================
 * LANGSOMT NOK — Shopify Image Library
 * ============================================================================
 *
 * Central registry of all brand images sourced from Shopify Files/CDN.
 * Every image used across the site should be referenced by ID from here.
 *
 * TO UPDATE AN IMAGE:
 * 1. Upload the image to Shopify Files
 * 2. Copy the CDN URL (https://cdn.shopify.com/s/files/...)
 * 3. Replace the src value for the relevant entry below
 *
 * TO ADD A NEW IMAGE:
 * 1. Add an entry to SHOPIFY_IMAGE_LIBRARY with a unique id
 * 2. Use getImageById("your-id") in components
 * 3. Or map it to an ImageSlot name in IMAGE_SLOT_MAP
 *
 * Local asset imports are kept as fallbacks for the 5 original brand images.
 * ============================================================================
 */

// Local asset fallbacks (original 5 brand images)
import heroKitchen from "@/assets/hero-kitchen.jpg";
import materialOlive from "@/assets/material-olive.jpg";
import materialSteel from "@/assets/material-steel.jpg";
import materialStone from "@/assets/material-stone.jpg";
import materialWalnut from "@/assets/material-walnut.jpg";

// ─── Shopify CDN base ────────────────────────────────────────────────────────
// All Shopify Files for this store live under this prefix.
const CDN = "https://cdn.shopify.com/s/files/1/0915/7227/3488/files";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ImageCategory =
  | "hero"
  | "product"
  | "collection"
  | "material"
  | "lifestyle"
  | "ritual"
  | "gift"
  | "sharpening"
  | "damascus"
  | "knife-holder"
  | "blog"
  | "background";

export type ImagePriority = "high" | "medium" | "low";

export interface ShopifyImage {
  id: string;
  src: string;
  alt: string;
  category: ImageCategory;
  recommendedUse: string;
  mood: string;
  ratio: string;
  priority: ImagePriority;
}

// Placeholder prefix — replace with actual Shopify Files URL
const PASTE = "PASTE_SHOPIFY_FILE_URL_HERE";

// ─── Image Library ───────────────────────────────────────────────────────────

export const langsomtNokImageLibrary: ShopifyImage[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // HERO IMAGES
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "homepage-hero-main",
    src: heroKitchen, // Local asset — strongest brand image
    alt: "Damaskus kokkekniv på mørkt valnøddetræ i roligt naturligt lys",
    category: "hero",
    recommendedUse: "Homepage hero, full-width background",
    mood: "dark, calm, tactile, premium",
    ratio: "16:9",
    priority: "high",
  },
  {
    id: "homepage-manifest-image",
    src: `${CDN}/IMG_6159.jpg?v=1773564091`, // High-res lifestyle from knivlist product (4770x3178)
    alt: "Køkkenredskaber i træ og stål arrangeret med omhu",
    category: "lifestyle",
    recommendedUse: "Homepage manifest section, editorial",
    mood: "warm, editorial, tactile",
    ratio: "3:2",
    priority: "medium",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PRODUCT IMAGES — from Shopify product photos
  // ═══════════════════════════════════════════════════════════════════════════

  // Damascus Chef Knife — 3 images
  {
    id: "product-chef-knife-main",
    src: `${CDN}/bd1da167-31b3-4ed6-a01a-4912f29a93ba.png?v=1767435708`,
    alt: "Damascus kokkekniv 21,5 cm med oliventræ-skaft set fra siden",
    category: "product",
    recommendedUse: "Chef knife product hero, landing page feature",
    mood: "clean, premium, detailed",
    ratio: "1:1",
    priority: "high",
  },
  {
    id: "product-chef-knife-detail",
    src: `${CDN}/e9761f1f-6d0e-4be3-b42d-3bdba5162da6.png?v=1767434318`,
    alt: "Damascus kokkekniv detalje med synligt stålmønster",
    category: "damascus",
    recommendedUse: "Product detail, Damascus steel closeup",
    mood: "detailed, precise, premium",
    ratio: "1:1",
    priority: "medium",
  },
  {
    id: "product-chef-knife-angle",
    src: `${CDN}/fb680c7a-bae3-44e9-a27a-960c9defd8ea.png?v=1770926478`,
    alt: "Damascus kokkekniv set fra trekvart vinkel",
    category: "product",
    recommendedUse: "Product gallery, collection card",
    mood: "clean, editorial",
    ratio: "1:1",
    priority: "medium",
  },

  // Slibesten 1000/5000 — 5 images
  {
    id: "product-whetstone-main",
    src: `${CDN}/1_4db435e6-7763-4b47-8ad7-df0a438092fb.png?v=1771057327`,
    alt: "Slibesten 1000/5000 Grundstenen set fra oven",
    category: "sharpening",
    recommendedUse: "Whetstone product hero, sharpening landing",
    mood: "calm, precise, natural",
    ratio: "1:1",
    priority: "high",
  },
  {
    id: "product-whetstone-side",
    src: `${CDN}/2_e0e63eea-0d9a-484c-b9a2-98d004c622d1.png?v=1771057326`,
    alt: "Slibesten set fra siden med synlig dobbeltsidet grit",
    category: "sharpening",
    recommendedUse: "Product detail, sharpening guide",
    mood: "detailed, educational",
    ratio: "1:1",
    priority: "medium",
  },
  {
    id: "product-whetstone-texture",
    src: `${CDN}/3_b016fd98-89f9-442f-a7bf-a67b1c4a02be.png?v=1771057326`,
    alt: "Nærbillede af slibestens overflade med fin tekstur",
    category: "material",
    recommendedUse: "Material section, sharpening guide",
    mood: "textural, meditative",
    ratio: "1:1",
    priority: "low",
  },
  {
    id: "product-whetstone-use",
    src: `${CDN}/4_2cd5d3ff-56d4-42cb-9ec2-c87f47b789f0.png?v=1771057326`,
    alt: "Slibesten i brug med vand på overfladen",
    category: "ritual",
    recommendedUse: "Guide illustration, ritual block",
    mood: "process, calm, meditative",
    ratio: "1:1",
    priority: "medium",
  },
  {
    id: "product-whetstone-set",
    src: `${CDN}/5_07b71d13-38f7-4958-96f9-a9c17b1d5ba6.png?v=1771057326`,
    alt: "Komplet slibesten-setup med holder og tilbehør",
    category: "sharpening",
    recommendedUse: "Bundle image, sharpening kit",
    mood: "organized, complete, premium",
    ratio: "1:1",
    priority: "medium",
  },

  // Knivsliber Valnød — 4 images (1248x832 lifestyle)
  {
    id: "product-sharpener-walnut-main",
    src: `${CDN}/IMG_6176.png?v=1773562374`,
    alt: "Knivsliber i valnøddetræ i roligt køkkenlys",
    category: "product",
    recommendedUse: "Sharpener product hero, lifestyle feature",
    mood: "warm, natural, lifestyle",
    ratio: "3:2",
    priority: "high",
  },
  {
    id: "product-sharpener-walnut-detail",
    src: `${CDN}/IMG_6177.png?v=1773561564`,
    alt: "Knivsliber i valnøddetræ, nærbillede af træoverflade",
    category: "material",
    recommendedUse: "Material detail, walnut texture",
    mood: "warm, tactile, close",
    ratio: "3:2",
    priority: "medium",
  },
  {
    id: "product-sharpener-walnut-angle",
    src: `${CDN}/IMG_6178.png?v=1773561653`,
    alt: "Knivsliber i valnøddetræ set fra siden",
    category: "product",
    recommendedUse: "Product gallery angle shot",
    mood: "clean, editorial",
    ratio: "3:2",
    priority: "low",
  },
  {
    id: "product-sharpener-walnut-context",
    src: `${CDN}/IMG_6179.png?v=1773561948`,
    alt: "Knivsliber i valnøddetræ i køkkenkontekst",
    category: "lifestyle",
    recommendedUse: "Lifestyle context, kitchen scene",
    mood: "lifestyle, warm, ambient",
    ratio: "3:2",
    priority: "medium",
  },

  // Knivstander Valnød "Nattely" — 5 images (1248x832)
  {
    id: "product-stand-walnut-main",
    src: `${CDN}/IMG_6196.png?v=1773563982`,
    alt: "Magnetisk knivstander i valnød med knive",
    category: "knife-holder",
    recommendedUse: "Knife stand product hero",
    mood: "dark, premium, composed",
    ratio: "3:2",
    priority: "high",
  },
  {
    id: "product-stand-walnut-empty",
    src: `${CDN}/IMG_6195.png?v=1773563982`,
    alt: "Magnetisk knivstander i valnød uden knive",
    category: "knife-holder",
    recommendedUse: "Product detail, clean product shot",
    mood: "minimal, clean",
    ratio: "3:2",
    priority: "medium",
  },
  {
    id: "product-stand-walnut-side",
    src: `${CDN}/IMG_6197.png?v=1773563982`,
    alt: "Magnetisk knivstander i valnød set fra siden",
    category: "knife-holder",
    recommendedUse: "Product gallery, construction detail",
    mood: "editorial, structural",
    ratio: "3:2",
    priority: "low",
  },
  {
    id: "product-stand-walnut-detail",
    src: `${CDN}/IMG_6199.png?v=1773563982`,
    alt: "Nærbillede af valnøddetræ-stander med magnetisk overflade",
    category: "material",
    recommendedUse: "Material closeup, walnut texture",
    mood: "tactile, warm, detailed",
    ratio: "3:2",
    priority: "medium",
  },
  {
    id: "product-stand-walnut-lifestyle",
    src: `${CDN}/IMG_6198.png?v=1773563982`,
    alt: "Magnetisk knivstander i valnød placeret i køkken",
    category: "lifestyle",
    recommendedUse: "Lifestyle shot, kitchen context",
    mood: "ambient, warm, domestic",
    ratio: "3:2",
    priority: "medium",
  },

  // Knivstander Akacie "Stille Stand" — 2 images (623x625)
  {
    id: "product-stand-acacia-main",
    src: `${CDN}/Akacia.png?v=1763321838`,
    alt: "Magnetisk knivstander i akacie med knive",
    category: "knife-holder",
    recommendedUse: "Acacia stand product hero",
    mood: "light, natural, Nordic",
    ratio: "1:1",
    priority: "high",
  },
  {
    id: "product-stand-acacia-empty",
    src: `${CDN}/Akacia_uden_kniv.png?v=1763321911`,
    alt: "Magnetisk knivstander i akacie uden knive",
    category: "knife-holder",
    recommendedUse: "Product detail, clean product shot",
    mood: "minimal, light",
    ratio: "1:1",
    priority: "medium",
  },

  // Knivlist Akacie (wall mount) — 4 images
  {
    id: "product-wall-mount-main",
    src: `${CDN}/IMG_6147.jpg?v=1773564482`,
    alt: "Magnetisk knivlist i akacie monteret på væg med knive",
    category: "knife-holder",
    recommendedUse: "Wall mount hero, knife holder landing",
    mood: "lifestyle, warm, kitchen",
    ratio: "3:2",
    priority: "high",
  },
  {
    id: "product-wall-mount-angle",
    src: `${CDN}/IMG_6148.jpg?v=1773564550`,
    alt: "Magnetisk knivlist i akacie set fra en vinkel",
    category: "knife-holder",
    recommendedUse: "Product gallery, angle view",
    mood: "editorial, clean",
    ratio: "3:2",
    priority: "medium",
  },
  {
    id: "product-wall-mount-lifestyle",
    src: `${CDN}/IMG_6159.jpg?v=1773564091`,
    alt: "Magnetisk knivlist i akacie i køkkenmiljø, brede vinkel",
    category: "lifestyle",
    recommendedUse: "Hero alternative, lifestyle, editorial",
    mood: "spacious, kitchen, ambient",
    ratio: "3:2",
    priority: "high",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CATEGORY IMAGES (reuse best product images)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "category-knives",
    src: `${CDN}/bd1da167-31b3-4ed6-a01a-4912f29a93ba.png?v=1767435708`,
    alt: "Kokkeknive fra Langsomt Nok — damaskus og oliventræ",
    category: "collection",
    recommendedUse: "Knife collection card, category grid",
    mood: "premium, clean",
    ratio: "1:1",
    priority: "high",
  },
  {
    id: "category-sharpening-stones",
    src: `${CDN}/1_4db435e6-7763-4b47-8ad7-df0a438092fb.png?v=1771057327`,
    alt: "Slibesten og plejeredskaber fra Langsomt Nok",
    category: "collection",
    recommendedUse: "Sharpening collection card",
    mood: "calm, precise",
    ratio: "1:1",
    priority: "high",
  },
  {
    id: "category-magnetic-holders",
    src: `${CDN}/IMG_6147.jpg?v=1773564482`,
    alt: "Magnetiske knivholdere i træ fra Langsomt Nok",
    category: "collection",
    recommendedUse: "Holder collection card",
    mood: "warm, lifestyle",
    ratio: "3:2",
    priority: "high",
  },
  {
    id: "category-care-products",
    src: `${CDN}/IMG_6179.png?v=1773561948`,
    alt: "Pleje- og vedligeholdelsesprodukter til knive",
    category: "collection",
    recommendedUse: "Care/ritual collection card",
    mood: "process, calm",
    ratio: "3:2",
    priority: "medium",
  },
  {
    id: "category-gift-sets",
    src: "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/Gaveindpakning_med_naturlige_detaljer.png?v=1778399967",
    alt: "Gaveæske med køkkenkniv, linned og håndskrevet kort",
    category: "gift",
    recommendedUse: "Gift collection card",
    mood: "warm, premium, generous",
    ratio: "1:1",
    priority: "medium",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MATERIAL IMAGES (reuse detail shots + local assets)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "material-damascus-steel",
    src: materialSteel, // Local asset
    alt: "Nærbillede af damaskus-stål med synligt lagmønster",
    category: "material",
    recommendedUse: "Damascus steel material section",
    mood: "cold, precise, metallic",
    ratio: "1:1",
    priority: "high",
  },
  {
    id: "material-walnut",
    src: materialWalnut, // Local asset
    alt: "Valnøddetræ overflade med synlig åretegning i varmt lys",
    category: "material",
    recommendedUse: "Walnut material section",
    mood: "warm, organic, tactile",
    ratio: "1:1",
    priority: "high",
  },
  {
    id: "material-olive-wood",
    src: materialOlive, // Local asset
    alt: "Oliventræ close-up med karakteristisk hvirvlende mønster",
    category: "material",
    recommendedUse: "Olive wood material section",
    mood: "warm, living, organic",
    ratio: "1:1",
    priority: "high",
  },
  {
    id: "material-sharpening-stone",
    src: materialStone, // Local asset
    alt: "Japansk slibesten overflade med vandfilm i roligt lys",
    category: "material",
    recommendedUse: "Sharpening stone material section",
    mood: "calm, meditative, textural",
    ratio: "1:1",
    priority: "high",
  },
  {
    id: "material-acacia",
    src: `${CDN}/Akacia_uden_kniv.png?v=1763321911`,
    alt: "Akacie træ med lyst, nordisk mønster",
    category: "material",
    recommendedUse: "Acacia material section",
    mood: "light, Nordic, organic",
    ratio: "1:1",
    priority: "medium",
  },
  {
    id: "material-leather",
    src: PASTE,
    alt: "Læderstrop close-up med fin tekstur",
    category: "material",
    recommendedUse: "Leather strop material, care section",
    mood: "warm, artisan, tactile",
    ratio: "1:1",
    priority: "medium",
  },
  {
    id: "material-oil",
    src: PASTE,
    alt: "Plejeolie på træoverflade, nærbillede",
    category: "material",
    recommendedUse: "Oil care material, ritual section",
    mood: "glossy, nourishing, calm",
    ratio: "1:1",
    priority: "low",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LANDING PAGE HERO IMAGES
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "landing-first-knife",
    src: `${CDN}/bd1da167-31b3-4ed6-a01a-4912f29a93ba.png?v=1767435708`,
    alt: "Din første rigtige kokkekniv — damaskus med oliventræ",
    category: "hero",
    recommendedUse: "First knife landing page hero",
    mood: "inviting, clean, premium",
    ratio: "1:1",
    priority: "high",
  },
  {
    id: "landing-gift",
    src: PASTE,
    alt: "Gaveindpakning med køkkenredskaber i naturpapir",
    category: "gift",
    recommendedUse: "Gift landing page hero",
    mood: "warm, generous, tactile",
    ratio: "16:9",
    priority: "high",
  },
  {
    id: "landing-sharpening",
    src: `${CDN}/1_4db435e6-7763-4b47-8ad7-df0a438092fb.png?v=1771057327`,
    alt: "Slibesten og kniv i roligt setup på træbord",
    category: "sharpening",
    recommendedUse: "Sharpening landing page hero",
    mood: "calm, process, meditative",
    ratio: "1:1",
    priority: "high",
  },
  {
    id: "landing-damascus",
    src: `${CDN}/e9761f1f-6d0e-4be3-b42d-3bdba5162da6.png?v=1767434318`,
    alt: "Nærbillede af damaskus-stålmønster, dybde og lag",
    category: "damascus",
    recommendedUse: "Damascus landing page hero",
    mood: "dark, detailed, premium",
    ratio: "1:1",
    priority: "high",
  },
  {
    id: "landing-knife-holder",
    src: `${CDN}/IMG_6147.jpg?v=1773564482`,
    alt: "Magnetisk knivholder i træ monteret på køkkenvæg",
    category: "knife-holder",
    recommendedUse: "Knife holder landing page hero",
    mood: "warm, lifestyle, Nordic kitchen",
    ratio: "3:2",
    priority: "high",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COMMUNITY / CIRKLEN
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "circle-community-image",
    src: `${CDN}/IMG_6198.png?v=1773563982`,
    alt: "Køkkenritualer og redskaber i rolig atmosfære",
    category: "lifestyle",
    recommendedUse: "Langsomt Cirklen hero, community section",
    mood: "warm, communal, ambient",
    ratio: "3:2",
    priority: "medium",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GUIDE / BLOG IMAGES
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "guide-knife-choice",
    src: `${CDN}/fb680c7a-bae3-44e9-a27a-960c9defd8ea.png?v=1770926478`,
    alt: "Valg af kokkekniv — damaskus kniv fra flere vinkler",
    category: "blog",
    recommendedUse: "Knife choice guide hero",
    mood: "educational, clean",
    ratio: "1:1",
    priority: "medium",
  },
  {
    id: "guide-damascus",
    src: `${CDN}/e9761f1f-6d0e-4be3-b42d-3bdba5162da6.png?v=1767434318`,
    alt: "Damaskus-stål forklaret — lagmønster og struktur",
    category: "blog",
    recommendedUse: "Damascus guide hero",
    mood: "detailed, educational",
    ratio: "1:1",
    priority: "medium",
  },
  {
    id: "guide-sharpening",
    src: `${CDN}/4_2cd5d3ff-56d4-42cb-9ec2-c87f47b789f0.png?v=1771057326`,
    alt: "Slibning af kniv med vandsten — trin for trin",
    category: "blog",
    recommendedUse: "Sharpening guide hero",
    mood: "process, educational, calm",
    ratio: "1:1",
    priority: "medium",
  },
  {
    id: "guide-hrc",
    src: `${CDN}/3_b016fd98-89f9-442f-a7bf-a67b1c4a02be.png?v=1771057326`,
    alt: "Stålhårdhed og kvalitet — nærbillede af sten",
    category: "blog",
    recommendedUse: "HRC hardness guide",
    mood: "textural, technical",
    ratio: "1:1",
    priority: "low",
  },
  {
    id: "guide-gift",
    src: PASTE,
    alt: "Gaver til madelskeren — kurateret køkkensamling",
    category: "blog",
    recommendedUse: "Gift guide hero",
    mood: "warm, generous",
    ratio: "16:9",
    priority: "medium",
  },
  {
    id: "guide-slow-kitchen",
    src: `${CDN}/IMG_6159.jpg?v=1773564091`,
    alt: "Det langsomme køkken — redskaber og ro",
    category: "blog",
    recommendedUse: "Slow kitchen philosophy guide",
    mood: "spacious, ambient, editorial",
    ratio: "3:2",
    priority: "medium",
  },
  {
    id: "guide-materials",
    src: `${CDN}/IMG_6177.png?v=1773561564`,
    alt: "Materialer i fokus — valnøddetræ og stål",
    category: "blog",
    recommendedUse: "Materials guide hero",
    mood: "textural, warm, educational",
    ratio: "3:2",
    priority: "medium",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PRODUCT PAGE ROLES (for generic product page sections)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: "product-main-image",
    src: PASTE,
    alt: "Produktbillede — hovedvisning",
    category: "product",
    recommendedUse: "Generic product hero when no Shopify image",
    mood: "clean, premium",
    ratio: "1:1",
    priority: "high",
  },
  {
    id: "product-detail-blade",
    src: `${CDN}/e9761f1f-6d0e-4be3-b42d-3bdba5162da6.png?v=1767434318`,
    alt: "Nærbillede af knivblad med damaskus-mønster",
    category: "product",
    recommendedUse: "Blade detail section",
    mood: "detailed, precise",
    ratio: "1:1",
    priority: "medium",
  },
  {
    id: "product-detail-handle",
    src: `${CDN}/IMG_6177.png?v=1773561564`,
    alt: "Nærbillede af træskaft med synlig åretegning",
    category: "product",
    recommendedUse: "Handle detail section",
    mood: "warm, tactile",
    ratio: "3:2",
    priority: "medium",
  },
  {
    id: "product-in-hand",
    src: PASTE,
    alt: "Kniv i hånden under brug i køkkenet",
    category: "product",
    recommendedUse: "Product in-use shot",
    mood: "lifestyle, authentic",
    ratio: "3:2",
    priority: "medium",
  },
  {
    id: "product-care-ritual",
    src: `${CDN}/4_2cd5d3ff-56d4-42cb-9ec2-c87f47b789f0.png?v=1771057326`,
    alt: "Plejeritual — slibning og vedligeholdelse af kniv",
    category: "ritual",
    recommendedUse: "Care ritual section on product pages",
    mood: "process, calm, meditative",
    ratio: "1:1",
    priority: "medium",
  },
  {
    id: "product-bundle-image",
    src: `${CDN}/5_07b71d13-38f7-4958-96f9-a9c17b1d5ba6.png?v=1771057326`,
    alt: "Komplet startkit — kniv, slibesten og pleje",
    category: "product",
    recommendedUse: "Bundle product shot",
    mood: "organized, complete, premium",
    ratio: "1:1",
    priority: "medium",
  },
];

// ─── Lookup helpers ──────────────────────────────────────────────────────────

const imageMap = new Map(langsomtNokImageLibrary.map((img) => [img.id, img]));

/** Get a full image entry by ID */
export function getImageById(id: string): ShopifyImage | undefined {
  return imageMap.get(id);
}

/** Get just the src URL for an image ID. Returns undefined if not found or placeholder. */
export function getImageSrc(id: string): string | undefined {
  const img = imageMap.get(id);
  if (!img || img.src === PASTE) return undefined;
  return img.src;
}

/** Get alt text for an image ID */
export function getImageAlt(id: string): string {
  return imageMap.get(id)?.alt ?? "";
}

/** Get all images for a category */
export function getImagesByCategory(category: ImageCategory): ShopifyImage[] {
  return langsomtNokImageLibrary.filter((img) => img.category === category);
}

/** Check if an image has an actual source (not a placeholder) */
export function hasImageSrc(id: string): boolean {
  const img = imageMap.get(id);
  return !!img && img.src !== PASTE;
}

// ─── ImageSlot ↔ Library mapping ─────────────────────────────────────────────
// Maps the old IMAGE_SLOTS names to new library IDs

export const SLOT_IMAGE_MAP: Record<string, string> = {
  // Heroes
  "homepage-hero-main": "homepage-hero-main",
  "first-knife-landing-hero": "landing-first-knife",
  "damascus-landing-hero": "landing-damascus",
  "sharpening-landing-hero": "landing-sharpening",
  "wooden-knife-holder-landing-hero": "landing-knife-holder",
  "gift-landing-hero": "landing-gift",

  // Categories
  "category-knives": "category-knives",
  "category-sharpening-stones": "category-sharpening-stones",
  "category-magnetic-holders": "category-magnetic-holders",
  "category-care-products": "category-care-products",

  // Materials
  "material-damascus-steel": "material-damascus-steel",
  "material-walnut": "material-walnut",
  "material-olive-wood": "material-olive-wood",
  "material-sharpening-stone": "material-sharpening-stone",
  "material-oil-on-wood": "material-olive-wood",
  "material-acacia": "material-acacia",

  // Product details
  "product-detail-blade": "product-detail-blade",
  "product-detail-handle": "product-detail-handle",
  "product-care-ritual": "product-care-ritual",

  // Articles / guides
  "article-hero": "homepage-hero-main",
  "article-inline-material": "material-damascus-steel",
  "article-inline-process": "product-care-ritual",

  // Other sections
  "cirklen-stories": "circle-community-image",
  "about-brand-portrait": "homepage-manifest-image",
};

/** Get the resolved image src for an ImageSlot name */
export function getImageForSlot(slotName: string): string | undefined {
  const libraryId = SLOT_IMAGE_MAP[slotName];
  if (!libraryId) return undefined;
  return getImageSrc(libraryId);
}

/** Get the resolved alt text for an ImageSlot name */
export function getAltForSlot(slotName: string): string | undefined {
  const libraryId = SLOT_IMAGE_MAP[slotName];
  if (!libraryId) return undefined;
  const img = imageMap.get(libraryId);
  return img?.alt;
}

// Re-export for backward compatibility
export type BrandImage = ShopifyImage;
export const IMAGES = langsomtNokImageLibrary;
export function getImage(id: string) { return getImageById(id); }
