## Fase 1 — Konverteringskritisk (punkt 9, 2, 10, 3)

Efter denne fase reviewer vi, og jeg fortsætter med resten (1, 4, 5, 6, 7, 8, 11).

---

### Punkt 9 — Meta Pixel events på hele frontend

Pixel base-scriptet er allerede installeret (`src/lib/metaPixel.ts`, default pixel `1088389321706481`, env-override via `VITE_META_PIXEL_ID`). PageView fires på route-skift. Det der mangler er standard-events med korrekt Shopify content_id-format.

- Tilføj hjælpere i `src/lib/metaPixel.ts`: `trackViewContent`, `trackAddToCart`, `trackInitiateCheckout` — alle med `content_type: "product"`, `content_ids`, `value`, `currency: "DKK"`.
- `content_ids` matcher Shopify-katalogformatet: numerisk variant-ID udtrukket fra Storefront GID (`gid://shopify/ProductVariant/12345` → `"12345"` + evt. `"shopify_DK_<product>_<variant>"` fallback dokumenteret i kode).
- Fyr `ViewContent` fra `src/routes/product.$handle.tsx` og `src/routes/products.$handle.tsx` når produkt er hentet.
- Fyr `AddToCart` fra `src/stores/cartStore.ts` (i `addItem`).
- Fyr `InitiateCheckout` fra `src/components/CartDrawer.tsx` når "Til checkout"-knap åbner Shopify.
- Cookie-samtykke: der findes ingen consent-løsning i projektet. Jeg tilføjer en `hasMarketingConsent()`-guard som defaulter til `true` med tydelig TODO-kommentar, så det er ét sted at koble på når CMP kommer.
- Env-variabel `VITE_META_PIXEL_ID` er allerede i `.env.example` — jeg tilføjer kommentar-blok i `metaPixel.ts` med "// TODO: overskriv `DEFAULT_PIXEL_ID` eller sæt `VITE_META_PIXEL_ID`".

### Punkt 2 — SSR af produkter + SEO metadata + JSON-LD

Problemet: `src/routes/collections.$handle.tsx` og produktsider henter data i `useEffect`, så første HTML har "0 produkter".

- Flyt Shopify-fetches til route `loader` via TanStack Query (`ensureQueryData` + `useSuspenseQuery`) på:
  - `src/routes/collections.$handle.tsx`
  - `src/routes/product.$handle.tsx` og `src/routes/products.$handle.tsx`
  - `src/routes/shop.tsx` (default "Alle"-forespørgsel)
  - `src/routes/index.tsx` (for punkt 3)
- Rendering under load: skeletons der bevarer plads (undgår layout-shift + viser aldrig "0 produkter").
- Per-route `head()`:
  - Collections: `title`, `description`, `og:title`, `og:description` afledt fra kollektionens navn.
  - Product: samme + `og:image` = produktets første Shopify-billede, `og:type: "product"`.
  - Canonical + `og:url` self-reference.
- JSON-LD `Product` schema på produktsider via `scripts` i `head()`: `name`, `image`, `description`, `sku`/`mpn`, `offers` med `priceCurrency: "DKK"`, `price`, `availability` (InStock/OutOfStock afledt af `availableForSale`), `url`.
- `og:image` bruger produktets rigtige Shopify-billede (ikke placeholder).

### Punkt 10 — Kampagne-skabelon `/kampagne/[slug]`

Nuværende `/kampagne/magnetisk-knivstander` er hardcoded. Jeg refaktorerer til en genbrugelig skabelon:

- Ny fil `src/lib/campaigns.ts` med `CAMPAIGNS` map: slug → `{ productHandle, hook, headline, priceNow, priceBefore, bundleHandle?, faq[], heroImageSlot }`.
- Ny route `src/routes/kampagne.$slug.tsx` som:
  - Loader: slår slug op i `CAMPAIGNS`, henter produkt fra Shopify via loader (SSR).
  - Above the fold på mobil: produktbillede, hook-overskrift, pris (399 kr / 699 kr), trust-bar, én primær CTA "Læg i kurv" (åbner cart drawer + fyrer `AddToCart`).
  - Derefter: 3 fordele, bundle-sektion hvis `bundleHandle` findes, social proof placeholder (fra punkt 5-forberedelse), FAQ accordion, CTA igen.
  - Distraktionsfri header: minimal variant med kun logo + kurv (via prop på header eller `<MinimalHeader />` i denne route).
- Migrér eksisterende `/kampagne/magnetisk-knivstander` til at bruge skabelonen (behold URL'en via redirect eller behold som separat entry i `CAMPAIGNS`).
- Ingen navigation i sidefod på kampagnesider ud over det juridisk nødvendige.

### Punkt 3 — "Mest elskede" på forsiden

- Ny sektion umiddelbart efter hero i `src/routes/index.tsx`.
- Loader-integration: henter 4 produkter fra Shopify (kurateret via `query: "tag:mest-elsket"` — fallback: første 4 aktive). Marker med TODO hvor kunden kan skifte kriteriet.
- Genbruger eksisterende `ProductCard` (billede, navn, pris DKK, Ritual Score hvis feltet findes, rolig CTA "Se produktet").
- Kort intro-tekst i brandtone; ingen badges/skrigende farver.

---

### Tekniske detaljer

- `MinimalHeader` for kampagnesider: enten prop på eksisterende `<Header>` (`variant="minimal"`) eller ny komponent — jeg vælger prop for at undgå dobbelt-kode.
- Alle nye loaders bruger `context.queryClient.ensureQueryData` (queryClient er allerede i router context ifølge `src/router.tsx`).
- Kanoniske kollektions-URL'er (punkt 7) er ikke besvaret — jeg rører ikke ved kollektions-navigation i denne fase. Det tages i fase 2.
- Fortryd-aftale (punkt 1) og Lovable Emails setup er fase 2 — kræver at email-domænet er verificeret, som jeg tjekker inden.

### Ikke rørt i denne fase

Punkt 1, 4, 5 (kun UI-forberedelse), 6, 7, 8, 11 — alle taget i fase 2 efter din review.
