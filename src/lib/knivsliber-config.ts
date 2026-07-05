/**
 * ============================================================================
 * KNIVSLIBER LANDING PAGES — Central konfiguration
 * ============================================================================
 * Konfigurer produkt-referencer ét sted. Bruges af alle tre post-click
 * landingssider (/pages/sommerhus-knivsliber, /pages/campingvogn-knivsliber,
 * /pages/saadan-virker-knivsliberen) og af <DirectAddToCart /> komponenten.
 *
 * Alle værdier hentes fra Shopify live via Storefront API (pris, lagerstatus,
 * varianter) — DEFAULT_VARIANT_ID bruges kun som fallback, hvis produktet
 * kun har én variant, eller hvis brugeren ikke aktivt vælger en anden.
 * ============================================================================
 */

import { SHOPIFY_STORE_PERMANENT_DOMAIN } from "@/lib/shopify";

export const KNIVSLIBER_CONFIG = {
  /** Shop-domænet (auto-hentet fra .env — samme kilde som Storefront API'et). */
  SHOP_DOMAIN: SHOPIFY_STORE_PERMANENT_DOMAIN,

  /** Handle i Shopify — bruges til Storefront API opslag. */
  PRODUCT_HANDLE: "walnut-sharpener-xz-mdq01-htm",

  /** Default = valnød. Fuld GraphQL-ID til Cart API (gid://shopify/ProductVariant/…). */
  DEFAULT_VARIANT_ID: "gid://shopify/ProductVariant/52348738830672",

  /** Vist titel — bruges til analytics og fallback UI. Pris hentes live. */
  PRODUCT_TITLE: "Knivsliber – Valnød (Præcisionssliberen)",
} as const;
