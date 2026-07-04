/**
 * ============================================================================
 * KAMPAGNE-INDHOLD — genbrugelig data-model til /kampagne/[slug]
 * ============================================================================
 *
 * Hver kampagne binder én Shopify-produkt-handle sammen med et hook,
 * en pris-frame, bullets, valgfri bundle og en kort FAQ. Produktdata
 * hentes live fra Shopify i loader'en — teksten her styrer message match
 * mellem annoncen og landingssiden.
 *
 * Tilføj en ny kampagne ved at tilføje en ny entry i `CAMPAIGNS`.
 * ============================================================================
 */

export interface CampaignFaq {
  q: string;
  a: string;
}

export interface CampaignContent {
  /** URL-slug: /kampagne/{slug} */
  slug: string;
  /** Shopify-produkt-handle der hentes til hero og "læg i kurv" */
  productHandle: string;
  /** Kort eyebrow der spejler annoncens tema */
  eyebrow: string;
  /** Hero-overskrift der spejler annoncens hook */
  headline: string;
  /** Underrubrik under overskriften */
  subline: string;
  /** Kampagnepris i kr. — ELLER null hvis Shopify-prisen skal bruges direkte */
  priceNow: number | null;
  /** Genuin før-pris i kr. (dansk markedsføringslov) */
  priceBefore: number | null;
  /** Tre korte fordele: (funktion, følelse, historie) */
  benefits: [string, string, string];
  /** Valgfri bundle-handle på Shopify */
  bundleHandle?: string;
  bundleLabel?: string;
  faq: CampaignFaq[];
  /** Hero-billede-alt for tilgængelighed */
  heroAlt: string;
}

export const CAMPAIGNS: Record<string, CampaignContent> = {
  "knivstander": {
    slug: "knivstander",
    productHandle: "magnetic-knife-display-stand-walnut",
    eyebrow: "Sommertilbud",
    headline: "En magnetisk knivstander, der flytter med derud, hvor sommeren er.",
    subline:
      "Terrasse, sommerhus, grill. Ingen skruer, ingen væg — bare stil den på bordet.",
    priceNow: 399,
    priceBefore: 699,
    benefits: [
      "Knivene væk fra skuffen — mere ro på bordet.",
      "Massivt træ, der bliver smukkere med årene.",
      "Skabt i et lille dansk værksted — ikke i en fabrik.",
    ],
    // TODO: opret bundle-produkt i Shopify med handle 'knivstander-slibesten-bundle'
    // og opdater denne handle. Indtil da linker vi til slibesten alene.
    bundleHandle: "double-sided-whetstone-1000-5000",
    bundleLabel: "Læg slibesten til — hold kniven skarp",
    faq: [
      {
        q: "Hvordan sender I?",
        a: "Vi pakker og sender fra Danmark. Bestiller du før kl. 14 på en hverdag, er den typisk fremme 1-2 dage efter.",
      },
      {
        q: "Kan jeg fortryde mit køb?",
        a: "Ja, du har 30 dages returret. Skriv til hej@langsomtnok.dk, så vejleder vi dig roligt.",
      },
      {
        q: "Hvilket træ er den lavet af?",
        a: "Massivt træ — enten valnød (mørkt, varmt) eller akacie (lyst, nordisk). Overfladen er behandlet med naturlig olie.",
      },
      {
        q: "Passer den til alle knive?",
        a: "Den holder alle almindelige køkkenknive med stålklinge. Meget tunge slagteknive kan glide.",
      },
    ],
    heroAlt: "Magnetisk knivstander i massivt træ på sommerterrasse med krydderurter",
  },
};

export function getCampaign(slug: string): CampaignContent | null {
  return CAMPAIGNS[slug] ?? null;
}
