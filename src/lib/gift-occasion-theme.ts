/**
 * ============================================================================
 * GAVE-ANLEDNING — /gaver/anledning tema
 * ============================================================================
 * Skift `ACTIVE_THEME` for at rotere sæson-siden (sommer, jul, farsdag, …).
 * Alle temaer defineres nedenfor; ét sted opdaterer hele sidens indhold,
 * SEO-tags og produktudvalg.
 *
 * Sæt `productHandles` til de Shopify-handles, du vil fremhæve (i rækkefølge).
 * ============================================================================
 */

export interface GiftOccasionTheme {
  /** Kort id, bruges internt */
  id: string;
  /** SEO */
  seoTitle: string;
  seoDescription: string;
  /** Above the fold */
  eyebrow: string;
  headline: string;
  subheadline: string;
  /** Kort intro-tekst under hero */
  intro: string;
  /** Handles fra Shopify — vises i grid, i rækkefølge */
  productHandles: string[];
  /** Rolig afslutnings-linje */
  outro: string;
}

const summer2026: GiftOccasionTheme = {
  id: "sommer-2026",
  seoTitle: "Sommerens gaver — bryllup, værtinde og grill | Langsomt Nok",
  seoDescription:
    "Rolige, brugbare gaver til sommeren: bryllupsgave, værtindegave og til dem, der elsker at grille. Håndværk fra Langsomt Nok.",
  eyebrow: "Sommer 2026",
  headline: "Sommerens gaver",
  subheadline: "Bryllup. Værtinde. Grill. Rolige gaver, der bliver brugt.",
  intro:
    "Vi har samlet et lille udvalg af det, vi selv ville give væk i sommer — redskaber, der ligger godt i hånden og bliver kærere med årene.",
  productHandles: [
    "walnut-sharpener-xz-mdq01-htm",
    "magnetic-knife-display-stand-walnut",
    "chef-knife-damascus",
  ],
  outro: "Ingen støj. Ingen pynt. Bare noget, der bliver brugt.",
};

/** Skift denne til at rotere temaet på /gaver/anledning */
export const ACTIVE_THEME: GiftOccasionTheme = summer2026;
