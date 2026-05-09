/**
 * Analytics event tracking utility.
 * Structured for future connection to GA4, Meta Pixel, Pinterest Tag, etc.
 * 
 * INTEGRATION POINTS:
 * - Google Analytics 4: window.gtag('event', eventName, params)
 * - Meta Pixel: window.fbq('track', eventName, params)
 * - Pinterest: window.pintrk('track', eventName, params)
 */

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
  | 'scroll_depth_75';

interface AnalyticsParams {
  label?: string;
  page?: string;
  product_id?: string;
  product_title?: string;
  value?: number;
  currency?: string;
  [key: string]: string | number | boolean | undefined;
}

export function trackEvent(event: AnalyticsEvent, params?: AnalyticsParams) {
  // Log in development for debugging
  if (import.meta.env.DEV) {
    console.log(`[Analytics] ${event}`, params);
  }

  // GA4
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', event, params);
  }

  // Meta Pixel
  if (typeof window !== 'undefined' && 'fbq' in window) {
    (window as any).fbq('trackCustom', event, params);
  }
}
