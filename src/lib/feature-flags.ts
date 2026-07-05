/**
 * ============================================================================
 * FEATURE FLAGS — Langsomt Nok
 * ============================================================================
 * Ét sted at slå features til/fra. Skift værdien og genindlæs.
 *
 * REVIEWS_ENABLED
 *   false: anmeldelses-sektioner er skjult overalt (kun stjerne-strukturen
 *   findes i koden — der vises INGEN opdigtede citater).
 *   true: viser rigtige anmeldelser fra `src/lib/reviews.ts` når de findes.
 *   Skift KUN til true, når der ligger verificerede kundeanmeldelser.
 * ============================================================================
 */
export const FEATURE_FLAGS = {
  REVIEWS_ENABLED: false,
} as const;
