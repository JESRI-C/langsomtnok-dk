/**
 * ============================================================================
 * CAMPAIGN CONTENT — Shopify Metaobject CMS layer for landing pages
 * ============================================================================
 *
 * Page copy for the four campaign landing pages can be edited from
 * Shopify Admin via a Metaobject of type `campaign_landing_page`.
 *
 * SETUP IN SHOPIFY ADMIN
 * ----------------------
 * 1. Go to: Settings → Custom data → Metaobjects → Add definition
 * 2. Name:  Campaign Landing Page
 *    Type:  campaign_landing_page  (lowercase, this is the API identifier)
 * 3. Add the fields listed in CAMPAIGN_FIELDS below.
 *    Field type: "Single line text" or "Multi line text" for everything
 *    except `guide_cards` which is "JSON".
 * 4. Mark the metaobject as "Storefronts can access" so the
 *    Storefront API can read it.
 * 5. Create one Metaobject entry per slug:
 *      - fars-dag
 *      - hold-kniven-skarp
 *      - rolig-opbevaring
 *      - find-dit-ritual
 *    The Metaobject "handle" must equal the slug.
 *
 * FALLBACK BEHAVIOUR
 * ------------------
 * If the Metaobject does not exist, or a field is empty, the page falls
 * back to the hardcoded copy stored in `FALLBACKS` below — pages always
 * render, even before the CMS is filled in.
 *
 * GUIDE CARDS JSON SHAPE
 * ----------------------
 * Stored in the `guide_cards` field as JSON, e.g.:
 *   [
 *     { "title": "Til far der elsker mad", "text": "Slibesten...", "href": "#farsdag-produkter" },
 *     { "title": "Til far der har alt",    "text": "En knivsliber...", "href": "#farsdag-produkter" }
 *   ]
 * `href` is optional and may be an internal route or anchor.
 * ============================================================================
 */

import { storefrontApiRequest } from "@/lib/shopify";

// ── Field schema ─────────────────────────────────────────────────────────────
// All fields are optional strings. `guide_cards` is JSON-encoded.

export interface GuideCard {
  title: string;
  text: string;
  href?: string;
}

export interface CampaignContent {
  seo_title?: string;
  seo_description?: string;
  hero_eyebrow?: string;
  hero_headline?: string;
  hero_subheading?: string;
  primary_cta_text?: string;
  primary_cta_url?: string;
  secondary_cta_text?: string;
  secondary_cta_url?: string;
  intro_section_title?: string;
  intro_section_body?: string;
  story_section_body?: string;
  guide_cards?: GuideCard[];
  final_cta_headline?: string;
  final_cta_body?: string;
  final_cta_button_text?: string;
  final_cta_button_url?: string;
}

// ── Storefront API query ─────────────────────────────────────────────────────

const METAOBJECT_QUERY = `
  query CampaignContent($handle: MetaobjectHandleInput!) @inContext(language: DA) {
    metaobject(handle: $handle) {
      id
      handle
      type
      fields { key value type }
    }
  }
`;

const METAOBJECT_TYPE = "campaign_landing_page";

/**
 * Fetch a campaign landing page's editable copy from Shopify Metaobjects.
 * Returns `null` when the Metaobject does not exist (page should use fallback).
 */
export async function fetchCampaignContent(
  slug: string,
): Promise<CampaignContent | null> {
  try {
    const data = await storefrontApiRequest(METAOBJECT_QUERY, {
      handle: { type: METAOBJECT_TYPE, handle: slug },
    });
    const obj = data?.data?.metaobject;
    if (!obj) return null;

    const fields = obj.fields as Array<{ key: string; value: string | null }>;
    const out: Record<string, unknown> = {};
    for (const f of fields) {
      if (!f.value) continue;
      if (f.key === "guide_cards") {
        try {
          const parsed = JSON.parse(f.value);
          if (Array.isArray(parsed)) out.guide_cards = parsed;
        } catch {
          // Ignore malformed JSON — fallback will be used.
        }
      } else {
        out[f.key] = f.value;
      }
    }
    return out as CampaignContent;
  } catch {
    return null;
  }
}

/** Merge Shopify content over fallback copy — only non-empty values win. */
export function mergeContent(
  fallback: CampaignContent,
  remote: CampaignContent | null,
): CampaignContent {
  if (!remote) return fallback;
  const merged: CampaignContent = { ...fallback };
  for (const [k, v] of Object.entries(remote)) {
    if (v === undefined || v === null) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    (merged as Record<string, unknown>)[k] = v;
  }
  return merged;
}
