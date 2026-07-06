/**
 * ============================================================================
 * SHOPIFY STOREFRONT API — Langsomt Nok
 * ============================================================================
 *
 * This module connects the storefront to the Shopify Storefront API.
 * All product, collection, cart and checkout data flows through here.
 *
 * SHOPIFY CONNECTION POINTS:
 * - Products: fetched via PRODUCTS_QUERY / PRODUCT_BY_HANDLE_QUERY
 * - Collections: fetched via COLLECTIONS_QUERY / COLLECTION_BY_HANDLE_QUERY
 * - Related products: fetched via PRODUCT_RECOMMENDATIONS_QUERY
 * - Cart: managed in cartStore.ts via Storefront Cart API mutations
 * - Checkout: redirect URL from cartCreate mutation (see cartStore.ts)
 * - Newsletter: connect to Shopify/Klaviyo via customer create or Klaviyo API
 *
 * EXTENDING:
 * - Add Shopify metafields to any query for custom data (care instructions, specs, etc.)
 * - Use product tags/types for filtering and categorization
 * - Use collection handles for navigation routing
 * ============================================================================
 */

import { toast } from "sonner";

// ── Shopify API Configuration ────────────────────────────────────────────────
// These values connect directly to the Shopify store's Storefront API.
// The storefront token is a public (read-only) token safe for client-side use.
const SHOPIFY_API_VERSION = '2025-07';
export const SHOPIFY_STORE_PERMANENT_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN ?? '';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? '';

// ── TypeScript Interfaces ────────────────────────────────────────────────────
// These mirror the Shopify Storefront API GraphQL schema.
// Extend with metafields, SEO fields, or custom data as needed.

/** Represents a single product image from Shopify CDN */
export interface ShopifyImage {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
}

/** Shopify Media item — covers MediaImage, Video, ExternalVideo, Model3d */
export interface ShopifyMediaItem {
  mediaContentType: "IMAGE" | "VIDEO" | "EXTERNAL_VIDEO" | "MODEL_3D";
  alt?: string | null;
  previewImage?: ShopifyImage | null;
  /** For VIDEO: list of source files (mp4/webm) with url + mimeType */
  sources?: Array<{ url: string; mimeType: string; format?: string }>;
  /** For EXTERNAL_VIDEO (YouTube/Vimeo) */
  embedUrl?: string | null;
  host?: "YOUTUBE" | "VIMEO" | null;
}

/** Represents a product variant (size, color, material, etc.) */
export interface ShopifyVariant {
  id: string;               // Full GraphQL ID: gid://shopify/ProductVariant/xxxxx
  title: string;             // e.g. "Large / Damascus Steel"
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice?: {
    amount: string;
    currencyCode: string;
  } | null;
  availableForSale: boolean;
  quantityAvailable?: number;
  selectedOptions: Array<{
    name: string;            // e.g. "Size", "Material"
    value: string;           // e.g. "Large", "Damascus Steel"
  }>;
  sku?: string;
}

/** Represents a product option group (e.g. Size has values S, M, L) */
export interface ShopifyProductOption {
  id?: string;
  name: string;              // e.g. "Size", "Material", "Finish"
  values: string[];          // e.g. ["Small", "Medium", "Large"]
}

/**
 * Shopify metafield — custom data attached to products.
 * Use for: care instructions, technical specs, sensory descriptions,
 * materials list, ritual guides, etc.
 *
 * SHOPIFY CONNECTION: Add metafield queries to product fragments.
 * Example metafield namespaces for Langsomt Nok:
 *   - custom.care_instructions (rich text)
 *   - custom.technical_specs (JSON)
 *   - custom.sensory_intro (single line text)
 *   - custom.materials (list of text)
 */
export interface ShopifyMetafield {
  namespace: string;
  key: string;
  value: string;
  type: string;
}

/** Main product type — wraps the Shopify Storefront API product node */
export interface ShopifyProduct {
  node: {
    id: string;              // Full GraphQL ID: gid://shopify/Product/xxxxx
    title: string;
    description: string;
    descriptionHtml?: string;
    handle: string;          // URL-safe slug, used for routing: /product/{handle}
    productType: string;     // e.g. "Kniv", "Slibesten", "Holder"
    vendor?: string;
    tags: string[];          // Used for filtering, rituals, gift ideas
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
      maxVariantPrice?: {
        amount: string;
        currencyCode: string;
      };
    };
    compareAtPriceRange?: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{ node: ShopifyImage }>;
    };
    /** Shopify media — includes images AND videos uploaded to the product. */
    media?: {
      edges: Array<{ node: ShopifyMediaItem }>;
    };
    variants: {
      edges: Array<{ node: ShopifyVariant }>;
    };
    options: ShopifyProductOption[];
    /**
     * SHOPIFY CONNECTION: Metafields for custom product data.
     * Add to GraphQL queries when metafields are configured in Shopify admin.
     * Example query fragment:
     *   metafields(identifiers: [
     *     {namespace: "custom", key: "care_instructions"},
     *     {namespace: "custom", key: "technical_specs"},
     *     {namespace: "custom", key: "sensory_intro"}
     *   ]) { namespace key value type }
     */
    metafields?: ShopifyMetafield[] | null;
    seo?: {
      title: string | null;
      description: string | null;
    };
  };
}

/** Collection type for Shopify collection pages */
export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;           // URL-safe slug: /collections/{handle}
  description: string;
  descriptionHtml?: string;
  image: ShopifyImage | null;
  products?: {
    edges: ShopifyProduct[];
  };
  /**
   * SHOPIFY CONNECTION: Collection metafields for editorial content.
   * Example: collection storytelling block, editorial intro, ritual guide.
   */
  metafields?: ShopifyMetafield[] | null;
}

/**
 * Bundle/kit product structure.
 * In Shopify, bundles are typically:
 * 1. A product with multiple variants representing the bundle
 * 2. A collection grouping bundle items
 * 3. Products linked via metafields
 *
 * SHOPIFY CONNECTION: Use product tags (e.g. "bundle", "startkit")
 * or a dedicated collection handle (e.g. "startkits") to identify bundles.
 */
export interface ShopifyBundle {
  handle: string;            // Product handle or collection handle
  title: string;
  description: string;
  price: string;
  currencyCode: string;
  image?: ShopifyImage | null;
  includedProducts?: ShopifyProduct[];
}

/**
 * Newsletter signup data structure.
 * SHOPIFY CONNECTION: Submit to Shopify Customer API or Klaviyo.
 *
 * Shopify approach:
 *   mutation customerCreate($input: CustomerCreateInput!) {
 *     customerCreate(input: $input) { customer { id } userErrors { ... } }
 *   }
 *   variables: { input: { email, firstName, acceptsMarketing: true } }
 *
 * Klaviyo approach:
 *   POST https://a.klaviyo.com/api/v2/list/{LIST_ID}/subscribe
 *   body: { profiles: [{ email, first_name }] }
 */
export interface NewsletterSignupData {
  email: string;
  firstName?: string;
  source: 'footer' | 'homepage' | 'cirklen' | 'product_page' | 'checkout';
  acceptsMarketing: boolean;
}

// Bundle placeholders removed — use real Shopify products only.

// ── Placeholder Collection Handles ───────────────────────────────────────────
// Map frontend category routes to Shopify collection handles.
// Create matching collections in Shopify admin for each handle.
export const COLLECTION_HANDLES = {
  knive: 'knive',                        // SHOPIFY: collection handle
  slibesten: 'slibesten',               // SHOPIFY: collection handle
  magnetiskeHoldere: 'magnetiske-holdere', // SHOPIFY: collection handle
  plejeRitualer: 'pleje-ritualer',       // SHOPIFY: collection handle
  gaver: 'gaver',                       // SHOPIFY: collection handle
  startkits: 'startkits',               // SHOPIFY: collection handle
  bestsellers: 'bestsellers',           // SHOPIFY: collection handle
} as const;

// ── Storefront API Request Helper ────────────────────────────────────────────

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description: "Shopify API access requires an active billing plan.",
    });
    return;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(`Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`);
  }

  return data;
}

// ── GraphQL Queries ──────────────────────────────────────────────────────────

/**
 * Fetch multiple products with optional search query.
 * SHOPIFY CONNECTION: Products are fetched live from the Storefront API.
 * Use the `query` variable to filter by tag, type, vendor, etc.
 * Examples: query: "tag:bestseller", query: "product_type:Kniv"
 */
export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) @inContext(language: DA) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          productType
          vendor
          tags
          priceRange {
            minVariantPrice { amount currencyCode }
            maxVariantPrice { amount currencyCode }
          }
          compareAtPriceRange {
            minVariantPrice { amount currencyCode }
          }
          images(first: 5) {
            edges { node { url altText width height } }
          }
          variants(first: 10) {
            edges {
              node {
                id title
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
                availableForSale sku
                selectedOptions { name value }
              }
            }
          }
          options { id name values }
        }
      }
    }
  }
`;

/**
 * Fetch a single product by its URL handle.
 * SHOPIFY CONNECTION: The handle comes from the route parameter /product/{handle}
 * and maps directly to the Shopify product handle.
 *
 * To add metafields (care instructions, specs, etc.):
 * Add this fragment inside productByHandle:
 *   metafields(identifiers: [
 *     {namespace: "custom", key: "care_instructions"},
 *     {namespace: "custom", key: "technical_specs"},
 *     {namespace: "custom", key: "sensory_intro"},
 *     {namespace: "custom", key: "materials"}
 *   ]) { namespace key value type }
 */
export const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) @inContext(language: DA) {
    productByHandle(handle: $handle) {
      id title description descriptionHtml handle productType vendor tags
      seo { title description }
      priceRange {
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
      compareAtPriceRange {
        minVariantPrice { amount currencyCode }
      }
      images(first: 10) {
        edges { node { url altText width height } }
      }
      media(first: 20) {
        edges {
          node {
            mediaContentType
            alt
            previewImage { url altText width height }
            ... on Video {
              sources { url mimeType format width height }
            }
            ... on ExternalVideo {
              embedUrl
              host
            }
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id title
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            availableForSale sku
            selectedOptions { name value }
          }
        }
      }
      options { id name values }
    }
  }
`;

/**
 * Fetch product recommendations (related products).
 * SHOPIFY CONNECTION: Shopify's ML-powered recommendations engine.
 * Pass a product ID (gid://shopify/Product/xxxxx) to get related products.
 */
export const PRODUCT_RECOMMENDATIONS_QUERY = `
  query GetProductRecommendations($productId: ID!) @inContext(language: DA) {
    productRecommendations(productId: $productId) {
      id title description handle productType tags
      priceRange {
        minVariantPrice { amount currencyCode }
      }
      images(first: 3) {
        edges { node { url altText } }
      }
      variants(first: 5) {
        edges {
          node {
            id title
            price { amount currencyCode }
            availableForSale
            selectedOptions { name value }
          }
        }
      }
      options { name values }
    }
  }
`;

/**
 * Fetch all collections.
 * SHOPIFY CONNECTION: Collections map to category pages.
 * Each collection handle routes to /collections/{handle}.
 */
export const COLLECTIONS_QUERY = `
  query GetCollections($first: Int!) @inContext(language: DA) {
    collections(first: $first) {
      edges {
        node {
          id title handle description
          image { url altText width height }
        }
      }
    }
  }
`;

/**
 * Fetch a single collection by handle with its products.
 * SHOPIFY CONNECTION: The handle comes from the route /collections/{handle}
 * and maps directly to the Shopify collection handle.
 */
export const COLLECTION_BY_HANDLE_QUERY = `
  query GetCollectionByHandle($handle: String!, $first: Int!, $sortKey: ProductCollectionSortKeys, $reverse: Boolean) @inContext(language: DA) {
    collection(handle: $handle) {
      id title handle description descriptionHtml
      image { url altText width height }
      products(first: $first, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            id title description handle productType vendor tags
            priceRange {
              minVariantPrice { amount currencyCode }
            }
            compareAtPriceRange {
              minVariantPrice { amount currencyCode }
            }
            images(first: 5) {
              edges { node { url altText } }
            }
            variants(first: 10) {
              edges {
                node {
                  id title
                  price { amount currencyCode }
                  compareAtPrice { amount currencyCode }
                  availableForSale
                  selectedOptions { name value }
                }
              }
            }
            options { name values }
          }
        }
        filters {
          id label type
          values { id label count input }
        }
      }
    }
  }
`;

/**
 * Fetch multiple products by their handles.
 * Used by landing pages to show specific product recommendations.
 */
export const PRODUCTS_BY_HANDLES_QUERY = `
  query GetProductsByHandles($first: Int!, $query: String!) @inContext(language: DA) {
    products(first: $first, query: $query) {
      edges {
        node {
          id title description handle productType vendor tags
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          compareAtPriceRange {
            minVariantPrice { amount currencyCode }
          }
          images(first: 3) {
            edges { node { url altText } }
          }
          variants(first: 5) {
            edges {
              node {
                id title
                price { amount currencyCode }
                availableForSale
                selectedOptions { name value }
              }
            }
          }
          options { name values }
        }
      }
    }
  }
`;

/** Fetch products by an array of handles (uses productByHandle per handle — reliable with hyphenated handles) */
export async function fetchProductsByHandles(handles: string[]): Promise<ShopifyProduct[]> {
  if (handles.length === 0) return [];
  const results = await Promise.all(
    handles.map(async (handle) => {
      try {
        const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
        const node = data?.data?.productByHandle;
        return node ? { node } as ShopifyProduct : null;
      } catch {
        return null;
      }
    }),
  );
  return results.filter((p): p is ShopifyProduct => p !== null);
}

/** Fetch products by a Shopify search query (e.g. "product_type:'The Ritual Set'"). */
export async function fetchProductsByQuery(query: string, first = 20): Promise<ShopifyProduct[]> {
  try {
    const data = await storefrontApiRequest(PRODUCTS_QUERY, { first, query });
    return data?.data?.products?.edges || [];
  } catch {
    return [];
  }
}

// ── Utility Functions ────────────────────────────────────────────────────────

/** Format price in Danish locale (e.g. "1.499,00 kr.") */
export function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}

/** Check if a product has a compare-at (sale) price */
export function hasDiscount(product: ShopifyProduct): boolean {
  const compare = product.node.compareAtPriceRange?.minVariantPrice;
  const current = product.node.priceRange.minVariantPrice;
  if (!compare) return false;
  return parseFloat(compare.amount) > parseFloat(current.amount);
}

/** Get discount percentage between compare-at and current price */
export function getDiscountPercentage(product: ShopifyProduct): number {
  const compare = product.node.compareAtPriceRange?.minVariantPrice;
  const current = product.node.priceRange.minVariantPrice;
  if (!compare) return 0;
  const compareVal = parseFloat(compare.amount);
  const currentVal = parseFloat(current.amount);
  if (compareVal <= currentVal) return 0;
  return Math.round(((compareVal - currentVal) / compareVal) * 100);
}

/** Extract a metafield value by namespace and key */
export function getMetafieldValue(
  metafields: ShopifyMetafield[] | null | undefined,
  namespace: string,
  key: string
): string | null {
  if (!metafields) return null;
  const field = metafields.find((m) => m.namespace === namespace && m.key === key);
  return field?.value ?? null;
}

/**
 * Fetch related/recommended products for a given product ID.
 * SHOPIFY CONNECTION: Uses Shopify's built-in recommendation engine.
 */
export async function fetchProductRecommendations(productId: string): Promise<ShopifyProduct[]> {
  try {
    const data = await storefrontApiRequest(PRODUCT_RECOMMENDATIONS_QUERY, { productId });
    const recs = data?.data?.productRecommendations;
    if (!recs) return [];
    return recs.map((node: ShopifyProduct['node']) => ({ node }));
  } catch {
    return [];
  }
}
