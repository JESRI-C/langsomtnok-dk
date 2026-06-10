/**
 * ============================================================================
 * ANALYTICS — Langsomt Nok
 * ============================================================================
 *
 * Central tracking utility. All events flow through here.
 *
 * Architecture:
 *   1. Pushes to window.dataLayer → picked up by GTM (GTM-5JGH9QMN)
 *   2. Direct window.gtag() call as fallback if GA4 tag fires outside GTM
 *   3. Direct window.fbq() call for Meta Pixel standard events
 *
 * GTM setup required (one-time, manual):
 *   - GA4 Configuration tag with Measurement ID
 *   - GA4 Event tag listening to custom event "ga4_event"
 *   - Meta Pixel Base Code tag
 *   - Meta Pixel Event tag listening to custom event "meta_pixel_event"
 *
 * Dev mode: logs all events to console — no real data sent.
 * Deduplication: events with identical signature within 300ms are dropped.
 * Silent failures: never throws — analytics must not break the shopping flow.
 * ============================================================================
 */

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

// ── Dev helpers ──────────────────────────────────────────────────────────────

const IS_DEV = typeof import.meta !== 'undefined' && import.meta.env?.DEV === true;

function log(event: string, payload: Record<string, unknown>) {
  if (IS_DEV) {
    console.log(`[Analytics] %c${event}`, 'color:#A67C52;font-weight:bold', payload);
  }
}

// ── Deduplication ────────────────────────────────────────────────────────────

const recentEvents = new Map<string, number>();
const DEDUP_MS = 300;

function isDuplicate(key: string): boolean {
  const now = Date.now();
  const last = recentEvents.get(key);
  if (last && now - last < DEDUP_MS) return true;
  recentEvents.set(key, now);
  if (recentEvents.size > 50) {
    const oldest = [...recentEvents.entries()].sort((a, b) => a[1] - b[1])[0][0];
    recentEvents.delete(oldest);
  }
  return false;
}

// ── dataLayer push ────────────────────────────────────────────────────────────

function pushDataLayer(payload: Record<string, unknown>) {
  try {
    if (typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  } catch {}
}

// ── GA4 event ────────────────────────────────────────────────────────────────

function pushGA4(eventName: string, params: Record<string, unknown>) {
  try {
    // Via GTM dataLayer (preferred — GTM-5JGH9QMN is already loaded)
    pushDataLayer({ event: 'ga4_event', ga4_event_name: eventName, ...params });

    // Direct gtag fallback
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  } catch {}
}

// ── Meta Pixel event ─────────────────────────────────────────────────────────

function pushMeta(
  eventType: 'track' | 'trackCustom',
  eventName: string,
  params?: Record<string, unknown>,
) {
  try {
    // Via GTM dataLayer
    pushDataLayer({ event: 'meta_pixel_event', meta_event_type: eventType, meta_event_name: eventName, meta_params: params });

    // Direct fbq fallback
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq(eventType, eventName, params);
    }
  } catch {}
}

// ── Product item helper (GA4 ecommerce schema) ────────────────────────────────

export interface TrackItem {
  item_id: string;       // product_id (raw GID or numeric part)
  item_name: string;
  item_variant?: string;
  item_category?: string;
  price: number;
  currency: string;
  quantity?: number;
  index?: number;
  item_list_name?: string;
}

function numericId(gid: string): string {
  return gid.split('/').pop() ?? gid;
}

// ── Public tracking functions ─────────────────────────────────────────────────

/**
 * Page view — call on every route change.
 * GTM fires this automatically via GA4 config tag. Explicit call ensures
 * Meta Pixel PageView also fires on SPA navigation.
 */
export function trackPageView(path?: string) {
  const url = path || (typeof window !== 'undefined' ? window.location.pathname : '');
  const key = `page_view:${url}`;
  if (isDuplicate(key)) return;

  log('page_view', { url });
  pushDataLayer({ event: 'page_view', page_path: url });
  pushMeta('track', 'PageView');
}

/**
 * Collection / category page viewed.
 * GA4: view_item_list
 * Meta: ViewContent (category)
 */
export function trackCollectionView(params: {
  collection_id: string;
  collection_title: string;
  handle: string;
  items: TrackItem[];
}) {
  const key = `view_item_list:${params.handle}`;
  if (isDuplicate(key)) return;

  log('view_item_list', params);

  pushGA4('view_item_list', {
    item_list_id: params.collection_id,
    item_list_name: params.collection_title,
    items: params.items.map((it, i) => ({ ...it, index: it.index ?? i })),
  });

  pushMeta('track', 'ViewContent', {
    content_type: 'product_group',
    content_category: params.collection_title,
    content_ids: params.items.map((it) => numericId(it.item_id)),
  });
}

/**
 * Product detail page viewed.
 * GA4: view_item
 * Meta: ViewContent
 */
export function trackProductView(params: {
  product_id: string;
  product_title: string;
  variant_id?: string;
  variant_title?: string;
  price: number;
  currency: string;
  product_type?: string;
}) {
  const key = `view_item:${params.product_id}:${params.variant_id ?? ''}`;
  if (isDuplicate(key)) return;

  log('view_item', params);

  const item: TrackItem = {
    item_id: numericId(params.product_id),
    item_name: params.product_title,
    item_variant: params.variant_title,
    item_category: params.product_type,
    price: params.price,
    currency: params.currency,
    quantity: 1,
  };

  pushGA4('view_item', {
    currency: params.currency,
    value: params.price,
    items: [item],
  });

  pushMeta('track', 'ViewContent', {
    content_type: 'product',
    content_ids: [numericId(params.product_id)],
    content_name: params.product_title,
    currency: params.currency,
    value: params.price,
  });
}

/**
 * Product card clicked from a list.
 * GA4: select_item
 */
export function trackProductClick(params: {
  product_id: string;
  product_title: string;
  price: number;
  currency: string;
  product_type?: string;
  list_name?: string;
  index?: number;
}) {
  log('select_item', params);

  pushGA4('select_item', {
    item_list_name: params.list_name ?? 'product_grid',
    items: [{
      item_id: numericId(params.product_id),
      item_name: params.product_title,
      item_category: params.product_type,
      price: params.price,
      currency: params.currency,
      index: params.index ?? 0,
    }],
  });
}

/**
 * Product added to cart — call ONLY after confirmed Shopify cart success.
 * GA4: add_to_cart
 * Meta: AddToCart
 */
export function trackAddToCart(params: {
  product_id: string;
  product_title: string;
  variant_id: string;
  variant_title?: string;
  price: number;
  currency: string;
  quantity: number;
  product_type?: string;
}) {
  const key = `add_to_cart:${params.variant_id}:${params.quantity}`;
  if (isDuplicate(key)) return;

  log('add_to_cart', params);

  const item: TrackItem = {
    item_id: numericId(params.product_id),
    item_name: params.product_title,
    item_variant: params.variant_title,
    item_category: params.product_type,
    price: params.price,
    currency: params.currency,
    quantity: params.quantity,
  };

  pushGA4('add_to_cart', {
    currency: params.currency,
    value: params.price * params.quantity,
    items: [item],
  });

  pushMeta('track', 'AddToCart', {
    content_ids: [numericId(params.variant_id)],
    content_name: params.product_title,
    content_type: 'product',
    contents: [{ id: numericId(params.variant_id), quantity: params.quantity, item_price: params.price }],
    value: params.price * params.quantity,
    currency: params.currency,
  });
}

/**
 * Cart drawer opened.
 * GA4: view_cart
 */
export function trackCartOpen(params: {
  items: Array<{ product_id: string; product_title: string; variant_id: string; price: number; currency: string; quantity: number }>;
  total: number;
  currency: string;
}) {
  const key = `view_cart:${params.total}`;
  if (isDuplicate(key)) return;

  log('view_cart', params);

  pushGA4('view_cart', {
    currency: params.currency,
    value: params.total,
    items: params.items.map((it) => ({
      item_id: numericId(it.product_id),
      item_name: it.product_title,
      price: it.price,
      currency: it.currency,
      quantity: it.quantity,
    })),
  });
}

/**
 * Checkout initiated — user clicked "Gå til betaling".
 * GA4: begin_checkout
 * Meta: InitiateCheckout
 */
export function trackBeginCheckout(params: {
  items: Array<{ product_id: string; product_title: string; variant_id: string; price: number; currency: string; quantity: number }>;
  total: number;
  currency: string;
}) {
  const key = `begin_checkout:${params.total}`;
  if (isDuplicate(key)) return;

  log('begin_checkout', params);

  const ga4Items = params.items.map((it) => ({
    item_id: numericId(it.product_id),
    item_name: it.product_title,
    price: it.price,
    currency: it.currency,
    quantity: it.quantity,
  }));

  pushGA4('begin_checkout', {
    currency: params.currency,
    value: params.total,
    items: ga4Items,
  });

  pushMeta('track', 'InitiateCheckout', {
    content_ids: params.items.map((it) => numericId(it.variant_id)),
    num_items: params.items.reduce((s, it) => s + it.quantity, 0),
    value: params.total,
    currency: params.currency,
  });
}

/**
 * Contact form submitted successfully.
 * GA4: generate_lead
 * Meta: Lead
 */
export function trackContactSubmit() {
  log('contact_form_submit', {});
  pushGA4('generate_lead', { event_category: 'contact' });
  pushMeta('track', 'Lead');
}

/**
 * Newsletter signup submitted successfully.
 * GA4: sign_up
 * Meta: Lead (newsletter)
 */
export function trackNewsletterSignup(source: string) {
  log('newsletter_signup', { source });
  pushGA4('sign_up', { method: 'newsletter', source });
  pushMeta('track', 'Lead', { content_name: 'newsletter', source });
}

/**
 * Scroll depth milestone reached.
 * GA4: scroll (custom)
 */
export function trackScrollDepth(depth: 25 | 50 | 75 | 90) {
  log('scroll_depth', { depth });
  pushGA4('scroll', { percent_scrolled: depth });
}

// ── Legacy AnalyticsEvent type (backwards compat with existing trackEvent calls) ──

export type AnalyticsEvent =
  | 'cta_click_homepage_hero'
  | 'cta_click_landing_primary'
  | 'cta_click_landing_secondary'
  | 'add_to_cart_product_page'
  | 'add_to_cart_product_card'
  | 'add_to_cart_sticky_mobile'
  | 'view_product'
  | 'view_collection'
  | 'newsletter_signup_footer'
  | 'newsletter_signup_inline'
  | 'cart_checkout_click'
  | 'cart_upsell_click'
  | 'landing_page_primary_cta_click'
  | 'bundle_cta_click'
  | 'faq_open'
  | 'guide_internal_link_click'
  | 'product_fit_section_view'
  | 'free_shipping_progress_view'
  | 'landing_page_view'
  | 'hero_cta_click'
  | 'secondary_cta_click'
  | 'gift_card_click'
  | 'ritual_card_click'
  | 'product_card_click'
  | 'add_to_cart'
  | 'initiate_checkout'
  | 'purchase'
  | 'scroll_depth_50'
  | 'scroll_depth_75'
  | 'universet_view'
  | 'universet_story_click'
  | 'universet_category_filter'
  | 'related_products_click'
  | 'cirklen_signup_click'
  | 'keramik_artist_click'
  | 'keramik_category_click'
  | 'hero_offer_view'
  | 'hero_offer_cta_click'
  | 'bundle_view'
  | 'bundle_add_to_cart'
  | 'cart_upsell_view'
  | 'cart_upsell_add';

interface AnalyticsParams {
  label?: string;
  page?: string;
  product_id?: string;
  product_title?: string;
  value?: number;
  currency?: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Generic custom event — for CTA clicks, UI interactions, etc.
 * These go as GA4 custom events and custom Meta Pixel events.
 */
export function trackEvent(event: AnalyticsEvent, params?: AnalyticsParams) {
  log(event, params ?? {});

  const cleanParams: Record<string, unknown> = {};
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) cleanParams[k] = v;
    }
  }

  pushGA4(event, cleanParams);
  pushMeta('trackCustom', event, cleanParams);
}

// ── Scroll depth auto-tracker ─────────────────────────────────────────────────

export function attachScrollDepthTracker(): () => void {
  if (typeof window === 'undefined') return () => {};

  const milestones = new Set<number>();

  const onScroll = () => {
    const el = document.documentElement;
    const scrollable = el.scrollHeight - el.clientHeight;
    if (scrollable <= 0) return;
    const pct = Math.round((window.scrollY / scrollable) * 100);
    for (const milestone of [25, 50, 75, 90] as const) {
      if (pct >= milestone && !milestones.has(milestone)) {
        milestones.add(milestone);
        trackScrollDepth(milestone);
      }
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}
