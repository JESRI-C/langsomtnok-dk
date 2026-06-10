/**
 * ============================================================================
 * TRACKING LAYER — generic behavioral events
 * ============================================================================
 * Persists a stable anonymous_id (lifetime) + rolling session_id (30 min idle).
 * Captures UTM parameters and fbclid on first landing and keeps them attached
 * to every event for the session.
 *
 * Outputs:
 *   • window.dataLayer.push(...)   ← consumed by GTM / GA4 / pixels
 *   • localStorage ring buffer     ← last 50 events for inspection
 *   • console.log in DEV           ← visible during development
 *
 * Designed to be extended later with GA4 / PostHog / custom backend without
 * touching call sites. Safe to call from SSR (no-ops on the server).
 * ============================================================================
 */

const ANON_KEY = "ln_anonymous_id";
const SESSION_KEY = "ln_session";
const ATTRIB_KEY = "ln_attribution";
const EVENTS_KEY = "ln_events";
const SESSION_TTL_MS = 30 * 60 * 1000;

const IS_BROWSER = typeof window !== "undefined";
const IS_DEV = typeof import.meta !== "undefined" && import.meta.env?.DEV === true;

type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  fbclid?: string;
  gclid?: string;
  referrer?: string;
  landing_path?: string;
  captured_at?: number;
};

function uuid(): string {
  try {
    if (IS_BROWSER && "crypto" in window && "randomUUID" in window.crypto) {
      return window.crypto.randomUUID();
    }
  } catch {}
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function safeGet<T>(key: string): T | null {
  if (!IS_BROWSER) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: unknown): void {
  if (!IS_BROWSER) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function getAnonymousId(): string {
  if (!IS_BROWSER) return "ssr";
  const existing = safeGet<string>(ANON_KEY);
  if (existing) return existing;
  const id = uuid();
  safeSet(ANON_KEY, id);
  return id;
}

export function getSessionId(): string {
  if (!IS_BROWSER) return "ssr";
  const now = Date.now();
  const session = safeGet<{ id: string; last: number }>(SESSION_KEY);
  if (session && now - session.last < SESSION_TTL_MS) {
    safeSet(SESSION_KEY, { id: session.id, last: now });
    return session.id;
  }
  const id = uuid();
  safeSet(SESSION_KEY, { id, last: now });
  return id;
}

const ATTRIB_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
] as const;

export function captureAttribution(): Attribution | null {
  if (!IS_BROWSER) return null;
  try {
    const url = new URL(window.location.href);
    const found: Attribution = {};
    let hasAny = false;
    for (const key of ATTRIB_PARAMS) {
      const v = url.searchParams.get(key);
      if (v) {
        (found as Record<string, string>)[key] = v;
        hasAny = true;
      }
    }
    if (!hasAny) {
      // Keep existing attribution; nothing new to capture
      return safeGet<Attribution>(ATTRIB_KEY);
    }
    const existing = safeGet<Attribution>(ATTRIB_KEY);
    // First-touch wins: only persist if nothing recorded yet
    if (existing && existing.captured_at) return existing;
    const attribution: Attribution = {
      ...found,
      referrer: document.referrer || undefined,
      landing_path: url.pathname,
      captured_at: Date.now(),
    };
    safeSet(ATTRIB_KEY, attribution);
    return attribution;
  } catch {
    return null;
  }
}

export function getAttribution(): Attribution {
  return safeGet<Attribution>(ATTRIB_KEY) ?? {};
}

type EventPayload = Record<string, unknown>;

function pushDataLayer(payload: EventPayload) {
  if (!IS_BROWSER) return;
  try {
    (window as unknown as { dataLayer: EventPayload[] }).dataLayer =
      (window as unknown as { dataLayer?: EventPayload[] }).dataLayer || [];
    (window as unknown as { dataLayer: EventPayload[] }).dataLayer.push(payload);
  } catch {}
}

function appendRing(payload: EventPayload) {
  if (!IS_BROWSER) return;
  try {
    const list = safeGet<EventPayload[]>(EVENTS_KEY) ?? [];
    list.push(payload);
    if (list.length > 50) list.splice(0, list.length - 50);
    safeSet(EVENTS_KEY, list);
  } catch {}
}

export function trackBehavior(eventName: string, data: EventPayload = {}): void {
  if (!IS_BROWSER) return;
  const payload: EventPayload = {
    event: eventName,
    event_name: eventName,
    anonymous_id: getAnonymousId(),
    session_id: getSessionId(),
    path: window.location.pathname,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    ...getAttribution(),
    ...data,
  };
  pushDataLayer(payload);
  appendRing(payload);
  if (IS_DEV) {
    // eslint-disable-next-line no-console
    console.log(`[Track] %c${eventName}`, "color:#4C574A;font-weight:bold", payload);
  }
}

export function trackPageViewBehavior(path?: string): void {
  trackBehavior("page_view", { page_path: path ?? (IS_BROWSER ? window.location.pathname : "/") });
}
