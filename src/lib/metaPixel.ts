/**
 * Meta Pixel — base script loader.
 * No-ops when VITE_META_PIXEL_ID is missing or still the placeholder, so the
 * site never errors when the pixel hasn't been configured yet.
 *
 * Standard events (PageView, ViewContent, AddToCart, InitiateCheckout) are
 * fired from src/lib/analytics.ts via window.fbq once this loader has run.
 */

// Public Meta Pixel ID for langsomtnok.dk — safe to ship in client bundle.
// Env override allowed for staging/testing; falls back to production pixel.
const DEFAULT_PIXEL_ID = "1008389321706401";
const ENV_PIXEL_ID =
  (typeof import.meta !== "undefined" && (import.meta.env?.VITE_META_PIXEL_ID as string | undefined)) || "";
const PIXEL_ID =
  ENV_PIXEL_ID && !/REPLACE_WITH|your[-_]?pixel/i.test(ENV_PIXEL_ID) ? ENV_PIXEL_ID : DEFAULT_PIXEL_ID;

const PLACEHOLDER = !PIXEL_ID;

let installed = false;

export function initMetaPixel(): void {
  if (installed) return;
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (PLACEHOLDER) return;
  installed = true;

  // Standard Meta Pixel bootstrap
  /* eslint-disable */
  (function (f: any, b: any, e: any, v: any) {
    if (f.fbq) return;
    const n: any = (f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = b.createElement(e);
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

  (window as any).fbq("init", PIXEL_ID);
  (window as any).fbq("track", "PageView");
  /* eslint-enable */
}

export function trackMetaPageView(): void {
  if (typeof window === "undefined") return;
  const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
  if (typeof fbq === "function") fbq("track", "PageView");
}

export const metaPixelConfigured = !PLACEHOLDER;
