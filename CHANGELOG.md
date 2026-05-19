# Changelog — tracking-and-integration-fixes

Branch: `tracking-and-integration-fixes`
Dato: 2026-05-19
Udarbejdet af: Claude (senior backend/integration engineer)

---

## 1. Arkitekturdiagnose

### Hvad er stacken?
| Lag | Teknologi |
|-----|-----------|
| Frontend | TanStack Start + React 19, Lovable-generated |
| Hosting | Cloudflare Workers (wrangler) |
| Commerce | Shopify Storefront API v2025-07 (`aqwut5-0n.myshopify.com`) |
| Kurv | Shopify Cart API mutations via Zustand store (localStorage-persisted) |
| Email / Backend | Supabase (email queue), Cloudflare Worker server routes |
| Analytics | GTM (GTM-5JGH9QMN) allerede indlæst i `__root.tsx` |

### Hvad fungerede allerede?
- ✅ Shopify Storefront API-forbindelse med korrekt token og domain
- ✅ Cart API: create, linesAdd, linesUpdate, linesRemove — alle implementeret korrekt
- ✅ Checkout redirect via `cartCreate` → `checkoutUrl` + `?channel=online_store`
- ✅ Cart sync ved tab-skift (useCartSync hook)
- ✅ Cart persistens i localStorage med cart ID
- ✅ Error handling ved "cart not found" (expired cart ryddes korrekt)
- ✅ Kontaktformular backend: Supabase email queue med honeypot + timing-check
- ✅ GTM script indlæst i `<head>` via `__root.tsx`
- ✅ Schema.org markup (Organization, Website, Product, CollectionPage, FAQ)
- ✅ Collection fallback: hvis Shopify collection handle mangler, bruges product_type query

---

## 2. Kritiske fejl der er rettet

### [KRITISK] Tracking sendte ingen data
**Problem:** `analytics.ts` kaldte `window.gtag()` og `window.fbq()` direkte, men hverken GA4 eller Meta Pixel script var indlæst. GTM var indlæst, men ingen GTM tags var konfigureret. Alle trackingkald gik i tomrum.

**Fix:** `src/lib/analytics.ts` er fuldt ombygget med:
- `window.dataLayer` push (standard GTM-protokol) som primær kanal
- Direct `gtag()` og `fbq()` som fallback
- Korrekte GA4 ecommerce-event-payloads (`view_item_list`, `select_item`, `view_item`, `add_to_cart`, `view_cart`, `begin_checkout`)
- Korrekte Meta Pixel standard events (`PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `Lead`)
- Deduplication (events inden for 300ms ignoreres)
- Silent failures (ingen uncaught errors der bryder UX)
- Dev-mode logging med farvet console output

### [KRITISK] Newsletter-formular sendte ingen data
**Problem:** `NewsletterSignup.tsx` kaldte `handleSubmit` → `trackEvent()` → returnerede straks. Ingen API-kald. Ingen e-mail-signup. Formularen var non-funktionel.

**Fix:**
- Oprettet `src/routes/api/public/newsletter.ts`: Cloudflare Worker server route der kalder Shopify Storefront `customerCreate` mutation med `acceptsMarketing: true`
- Håndterer `CUSTOMER_DISABLED` (eksisterende kunde) og `TAKEN` (allerede tilmeldt) som success
- Honeypot-felt + Zod-validering
- `NewsletterSignup.tsx` opdateret: loading state, success state, error feedback, `trackNewsletterSignup()` fires kun ved bekræftet success

### [KRITISK] add_to_cart tracking fyrede uden at vide om Shopify-kaldet lykkedes
**Problem:** `trackEvent('add_to_cart...')` blev kaldt umiddelbart efter `await addItem()` uanset om Shopify-mutationen fejlede eller returnerede userErrors.

**Fix:** Tracking fires nu kun hvis cart state faktisk ændrede sig (item count op eller kvantitet øget). Gælder både `ProductCard.tsx` og `product.$handle.tsx`.

### [KRITISK] Cart upsell brugte hardcodede placeholder-navne
**Problem:** CartDrawer viste `['Plejeolie', 'Slibesten #1000', 'Magnetisk holder']` som statiske strings — ingen forbindelse til Shopify.

**Fix:** CartDrawer henter nu live product recommendations via `fetchProductRecommendations()` når drawer åbnes. Filtrerer produkter der allerede er i kurven og produkter der ikke er på lager. Viser max 3 anbefalinger som klikbare links til produktsiderne.

### [MANGLENDE] view_item tracking
**Problem:** Produktsiden sendte ingen `view_item` event til GA4/Meta ved sidebesøg.

**Fix:** `trackProductView()` kaldes i `product.$handle.tsx` useEffect efter succesfuld produkthentning fra Shopify. Indeholder product_id, variant_id, pris, valuta og product_type.

### [MANGLENDE] view_item_list tracking
**Problem:** Collectionsider sendte ingen `view_item_list` event.

**Fix:** `trackCollectionView()` kaldes i `collections.$handle.tsx` useEffect efter produkter er resolved (inkl. fallback-query). Sender de første 20 produkter som items-array.

### [MANGLENDE] begin_checkout tracking
**Problem:** "Gå til betaling"-knappen i CartDrawer sendte ingen event.

**Fix:** `trackBeginCheckout()` kaldes i `handleCheckout()` med alle cart items, total og valuta — før `window.open()`.

### [MANGLENDE] view_cart tracking
**Problem:** Ingen tracking når kurv-drawer åbnes.

**Fix:** `trackCartOpen()` kaldes når drawer åbnes og kurven ikke er tom.

### [MANGLENDE] SPA page_view tracking
**Problem:** Meta Pixel PageView fandt kun sted ved hard reload — ikke ved SPA-navigation.

**Fix:** `AppShell` i `__root.tsx` abonnerer på `router.subscribe('onResolved')` og kalder `trackPageView()` ved hver ruteændring.

### [MANGLENDE] Scroll depth tracking
**Problem:** Ingen scroll depth måling.

**Fix:** `attachScrollDepthTracker()` kaldes på produktsiden efter produkthentning. Tracker 25%, 50%, 75%, 90% milestones som GA4 custom scroll events. Dedupliceret pr. session.

### [MANGLENDE] select_item tracking
**Problem:** Ingen tracking ved klik på produktkort.

**Fix:** `ProductCard.tsx` kalder `trackProductClick()` og `trackEvent('product_card_click')` ved klik på Link.

---

## 3. Hvad er IKKE rørt (frontend i Lovable)

Ingen ændringer til:
- Visuelt design, layout, farver, typografi
- CSS/Tailwind klasser
- CTA-tekster og produktbeskrivelser
- Sidernes strukturelle opbygning
- Hero-sektioner, trust bars, FAQ, SEO-tekster
- Alle `/pages/*`, `/ritualer/*`, `/guides/*`, `/keramik/*` routes
- `Header.tsx`, `Footer.tsx`, `AnnouncementBar.tsx`

---

## 4. Shopify data-status — kræver manuel handling

### Collection handles — MISMATCH

Frontend forventer disse handles, men de eksisterer IKKE i Shopify:

| Frontend handle | Status | Handling |
|----------------|--------|---------|
| `knive` | ❌ Mangler | Opret collection med handle `knive` i Shopify Admin |
| `slibesten` | ❌ Mangler | Opret collection med handle `slibesten` |
| `magnetiske-holdere` | ❌ Mangler | Opret collection med handle `magnetiske-holdere` |
| `gaver` | ❌ Mangler | Opret collection med handle `gaver` |
| `pleje-ritualer` | ❌ Mangler | Opret collection med handle `pleje-ritualer` |

**Virker det alligevel?** Delvist — koden har en fallback der bruger `product_type` queries. Men `gaver` virker IKKE i praksis fordi ingen produkter har `productType = "The Gift Chapter"`. Produkterne er i `the-gift-chapter` collectionen men tilgås ikke via fallback.

### Aktuelle Shopify collections (eksisterer):
| Handle | Titel | Produkter |
|--------|-------|-----------|
| `the-chef-line` | The Chef Line | **0** (tom!) |
| `the-ritual-set` | The Ritual Set | 1 |
| `the-calm-kitchen` | The Calm Kitchen | 4 |
| `the-gift-chapter` | The Gift Chapter | 10 |
| `frontpage` | Startside | 1 |
| `home-page` | Home Page | 4 |

### Produkter i Shopify:
| Produkt | Type | Pris | Status |
|---------|------|------|--------|
| Damascus Chef Knife 21,5 cm – Olive Wood | The Chef Line | 999 DKK | ✅ Aktiv |
| Slibesten 1000/5000 – Grundstenen | The Ritual Set | 549 DKK | ✅ Aktiv |
| Slibesten 3000/8000 – Polérstenen | The Ritual Set | 499 DKK | ✅ Aktiv |
| Slibestensholder – Akacie | The Ritual Set | 299 DKK | ✅ Aktiv |
| Knivsliber – Valnød | The Ritual Set | 379 DKK | ✅ Aktiv |
| Knivsliber – Ask | The Ritual Set | 379 DKK | ✅ Aktiv |
| Magnetisk Knivlist – Valnød 50cm | The Calm Kitchen | 450 DKK | ✅ Aktiv |
| Magnetisk Knivlist – Akacie 15.7" | The Calm Kitchen | 395 DKK | ✅ Aktiv |
| Magnetisk Knivlist – Akacie 50cm | The Calm Kitchen | 395 DKK | ✅ Aktiv |
| Magnetisk Knivstander – Valnød | The Calm Kitchen | 495 DKK | ✅ Aktiv |
| Magnetisk Knivstander – Akacie | The Calm Kitchen | 495 DKK | ✅ Aktiv |
| 7x Susan Riel keramik | Keramik | 125-655 DKK | ✅ Aktive |

**Kritisk:** Damascus-kniven er IKKE tilknyttet `the-chef-line` collection — collections er tom. Kniven nås kun via product_type fallback.

### Manuel handling krævet i Shopify Admin:

1. **Tilføj Damascus knife til the-chef-line collection**
2. **Opret collection `knive`** (eller omdøb `the-chef-line` til `knive`)
3. **Opret collection `magnetiske-holdere`** (eller omdøb `the-calm-kitchen`)
4. **Opret collection `gaver`** og tilføj relevante produkter
5. **Opret collection `slibesten`** (eller omdøb `the-ritual-set`)
6. **Opret collection `pleje-ritualer`** med slibesten + plejeprodukter

---

## 5. Tracking-events — verificeret implementeret

| Event | GA4 | Meta | Trigger |
|-------|-----|------|---------|
| page_view | ✅ | ✅ PageView | Hver SPA-navigation |
| view_item_list | ✅ | ✅ ViewContent (group) | Collection-side loaded |
| select_item | ✅ | — | Klik på ProductCard |
| view_item | ✅ | ✅ ViewContent | Produktside loaded |
| add_to_cart | ✅ | ✅ AddToCart | Efter bekræftet Shopify cart update |
| view_cart | ✅ | — | Cart drawer åbnet (med items) |
| begin_checkout | ✅ | ✅ InitiateCheckout | "Gå til betaling" klikket |
| purchase | ⚠️ | ⚠️ | Kræver Shopify Customer Events (se nedenfor) |
| generate_lead | ✅ | ✅ Lead | Kontaktformular success |
| sign_up | ✅ | ✅ Lead | Newsletter signup success |
| scroll_depth (25/50/75/90%) | ✅ | — | Automatisk på produktsider |
| product_card_click | ✅ custom | ✅ custom | Klik på produktkort |

### purchase-event — kræver manuel opsætning
Purchase kan IKKE fakes i frontend. Det korrekte setup:
1. **Shopify Customer Events**: Gå til Shopify Admin → Settings → Customer events → tilføj Google Analytics 4 pixel og Meta pixel her. Shopify injicerer purchase event på order confirmation-siden.
2. **Alternativt**: GTM trigger på thank-you page URL (`/checkout/thank_you` eller `orders/`)

---

## 6. Events der kræver manuel opsætning i GTM/GA4/Meta

### GTM (Google Tag Manager — ID: GTM-5JGH9QMN):
GTM er indlæst men har ingen tags konfigureret. Påkrævet:

1. **GA4 Configuration tag**
   - Tag type: Google Analytics GA4 Configuration
   - Measurement ID: `G-XXXXXXXXXX` (hent fra GA4 Admin)
   - Trigger: All Pages

2. **GA4 Event tag**
   - Tag type: Google Analytics GA4 Event
   - Event Name: `{{DLV - ga4_event_name}}` (DataLayer variabel)
   - Alle parametre: send fra dataLayer
   - Trigger: Custom Event `ga4_event`

3. **Meta Pixel Base Code tag**
   - Tag type: Custom HTML
   - Indhold: Meta Pixel base code med dit Pixel ID
   - Trigger: All Pages

4. **Meta Pixel Event tag**
   - Tag type: Custom HTML  
   - Indhold: `fbq('{{DLV - meta_event_type}}', '{{DLV - meta_event_name}}', {{DLV - meta_params}})`
   - Trigger: Custom Event `meta_pixel_event`

### Microsoft Clarity / Hotjar:
Ikke implementeret. Anbefaling: Tilføj via GTM tag (Custom HTML):
- Microsoft Clarity: Gratis, god session recording
- Hotjar: Heatmaps + recordings (betalt over gratis tier)

---

## 7. Testplan — konkret funnel-test

### Forberedelse:
- Åbn GA4 DebugView (Realtime → DebugView)
- Installer Meta Pixel Helper browser extension
- Åbn browserens DevTools → Console
- Åbn `https://langsomtnok.dk` (eller localhost)

### Test 1 — Besøg og page_view
1. Gå til forsiden
2. **Forventet i Console:** `[Analytics] page_view { url: '/' }`
3. **Forventet i dataLayer:** `{ event: 'ga4_event', ga4_event_name: 'page_view', ... }`

### Test 2 — Collection view
1. Gå til `/collections/the-calm-kitchen` (eller `/collections/magnetiske-holdere`)
2. **Forventet:** `[Analytics] view_item_list` med produkter i console
3. GA4 DebugView: `view_item_list` event med `item_list_name`
4. Meta Pixel Helper: `ViewContent` (content_type: product_group)

### Test 3 — Produktklik (select_item)
1. Klik på et produktkort
2. **Forventet:** `[Analytics] select_item` + `product_card_click`

### Test 4 — Produktside (view_item)
1. Besøg en produktside (fx `/product/magnetic-knife-holder-walnut-19-6`)
2. **Forventet:** `[Analytics] view_item` med pris og currency
3. GA4 DebugView: `view_item` event
4. Meta Pixel Helper: `ViewContent` (content_type: product)
5. Scroll ned til 50% → `[Analytics] scroll_depth { depth: 50 }`

### Test 5 — Add to cart
1. Klik "Tilføj til ritualet"
2. **Forventet:** Cart drawer åbner
3. **Forventet:** `[Analytics] add_to_cart` med korrekte produktdata
4. GA4 DebugView: `add_to_cart` event
5. Meta Pixel Helper: `AddToCart` event

### Test 6 — Cart drawer (view_cart)
1. Åbn cart drawer via kurv-ikon i header
2. **Forventet:** `[Analytics] view_cart` med items og total
3. Kontrollér upsell-produkter er rigtige Shopify-produkter (ikke placeholders)

### Test 7 — Begin checkout
1. Klik "Gå til betaling" i cart drawer
2. **Forventet:** `[Analytics] begin_checkout` før redirect
3. GA4 DebugView: `begin_checkout` event
4. Meta Pixel Helper: `InitiateCheckout` event
5. Shopify checkout åbner i nyt faneblad

### Test 8 — Kontaktformular
1. Gå til `/kontakt`
2. Udfyld formular og send
3. **Forventet:** `[Analytics] contact_form_submit`
4. GA4 DebugView: `generate_lead` event
5. Jesper modtager email via Supabase email queue

### Test 9 — Newsletter
1. Rul til newsletter-signup (fx på en collection-side)
2. Indtast e-mail og klik "Modtag Langsomt Brev"
3. **Forventet:** Loading → Success state ("Tak — du er tilmeldt Langsomt Brev.")
4. **Forventet:** `[Analytics] newsletter_signup`
5. Kontrollér i Shopify Admin → Customers: ny kunde med `acceptsMarketing: true`
6. GA4 DebugView: `sign_up` event

### Test 10 — Shopify Analytics
1. Gå til Shopify Admin → Analytics
2. Kontrollér at sessioner registreres
3. Settings → Customer Events: verificér at native Shopify events (purchase) er konfigureret

---

## 8. Risiko-vurdering

| Risiko | Sandsynlighed | Konsekvens | Mitigering |
|--------|--------------|------------|------------|
| GTM har ingen tags → ingen GA4/Meta data | **HØJ** — ingen tags er opsat | Ingen analytics på trods af implementering | Opsæt GA4 + Meta tags i GTM ASAP |
| newsletter endpoint fejler i Cloudflare | Lav | Brugere kan ikke tilmelde sig | Supabase fallback eller Klaviyo |
| purchase tracking mangler | Høj | Ingen ROAS-data til Meta/GA4 | Shopify Customer Events opsætning |
| Collection handles mismatch | **HØJ** | Gaver-kollektion viser ingen produkter | Manuel handling i Shopify Admin |
| Cart upsell: ingen recommendations → tom | Lav | Upsell vises simpelthen ikke | Silence er OK — ingen placeholder spam |
| duplicate events GA4+Shopify | Medium | Inflated data i GA4 | Shopify Customer Events kun for purchase |
