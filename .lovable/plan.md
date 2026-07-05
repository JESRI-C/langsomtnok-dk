## Overblik

Prompten dækker 10 sektioner, hvoraf flere hver især er en dags arbejde (SSR-rewrite af hele produkt/kollektions-pipelinen, to-trins fortrydelse med e-mail, konsolidering af guides/kollektions-slugs med 301'ere, ny TrustBlok-standard på alle produktsider, to nye landingssider, konfigurerbar gave-side, komplet Meta Pixel-lag med CAPI-dedup). For at levere det med kvalitet — og undgå at én runde bliver så stor at intet kan verificeres — foreslår jeg at dele det op i tre runder. Sig til hvis du hellere vil have alt i én runde.

## Vigtige afklaringer først

1. **SSR af produkt/kollektions-data (sektion 1)** — Sitet henter Shopify-produkter client-side via Storefront API i dag. For at få navn/pris/knap i rå HTML skal loaders flyttes til route-loaders (SSR via TanStack Start). Det virker for prerender af eksisterende handles, men *live* pris/lager i HTML kræver at build køres ved Shopify-webhooks. Jeg foreslår: SSR via loaders + `staleTime` i cache (pris/lager opdateres reelt live når siden hydrerer). Er det ok, eller vil du have webhook-baseret revalidering nu?

2. **Kanonisk produkt-URL** — Prompten siger vælg `/products/handle`. I dag er ruten `/product/$handle`. Skal jeg lave `/products/$handle` til den nye rute og 301-redirecte `/product/$handle` → `/products/$handle`? (Alle interne links opdateres.)

3. **Bundles (sektion 5)** — "Knivholder + slibesten" og "Komplet køkkenstart" findes ikke i Shopify. Skal jeg (a) oprette rigtige bundle-produkter via Shopify-tool, eller (b) bygge frontend-bundle-sider der lægger flere varer i kurven på én gang? Frontend-varianten er hurtigere; Shopify-produkter giver rene produktsider og lagerstyring.

4. **Anmeldelser (sektion 6)** — Feature-flag: hvor vil du styre det? Jeg foreslår `src/lib/feature-flags.ts` med én konstant (`REVIEWS_ENABLED = false`).

5. **/gaver/anledning tema (sektion 8)** — Skiftes ét sted. Foreslår `src/lib/gift-occasion-theme.ts` (statisk fil) frem for Shopify Metaobject, for at holde det simpelt. Ok?

## Runde 1 — Fundament (lovkrav + SSR)

Alt i denne runde er blokerende: lovkrav og det tekniske fundament for resten.

1. **SSR af produkt- og kollektionssider** (sektion 1)
   - Konvertér `src/routes/products.$handle.tsx` og `collections.$handle.tsx` til at bruge `loader` + `ensureQueryData` med Storefront API kaldt server-side
   - `/shop` server-renderer udvalgt produkt-grid
   - JSON-LD Product / ItemList / BreadcrumbList via `head()` scripts
   - Ny kanonisk URL: `/products/$handle` + 301 fra `/product/$handle`
2. **Ét fælles Footer-komponent** (sektion 2) med "Fortryd aftale", betalingsikoner, ret retur-tekst overalt, fjern Farsdagsgaver, fjern sociale ikoner uden URL
3. **To-trins fortrydelse** (sektion 3) — stepper, "Bekræft fortrydelse", kvitteringsskærm + e-mail (bruger eksisterende app-email-infrastruktur), notifikation til butik, gem i DB med timestamp
4. **SEO-oprydning** (sektion 4) — fjern noindex på guides, /universet/* 301 → /guides/*, konsolider kollektions-slugs (vælg én pr. kategori, 301 øvrige), ret breadcrumb "The Chef Line" → "Knive", tilføj knivsliber-produktkort i "Hvordan sliber man en kniv?"

## Runde 2 — Handel & konvertering

5. **Ægte add-to-cart overalt** (sektion 5) — ritual-siden får rigtige køb-knapper med produktkort, "Se udvalget →" som sekundær stil for kollektions-links, forsidens bundle-kort peger på rigtige bundle-sider, "Se favoritter →" peger på /shop
6. **Bundles** — oprettes efter din afklaring i spørgsmål 3
7. **Produktside-standard + TrustBlok overalt** (sektion 6) — above-the-fold på 390px, pris i knap-tekst, TrustBlok under købssektionen på alle produktsider, fast aspect-ratio på billeder, video-poster-pattern på forsiden, anmeldelses-komponent bag feature-flag

## Runde 3 — Nye sider & tracking

8. **Ny retargeting-side** `/kampagne/knivsliber-grill` (sektion 7a) — jeg har allerede oprettet en variant af denne; opdaterer til at matche 5-sektions-specifikationen præcist (fjern nav, sticky mobil-CTA respekterer safe-area, statisk billede i stedet for video)
9. **Ny guide-side** `/guide/foer-du-koeber-nye-knive` (sektion 7b) — 7 sektioner, ægte add-to-cart, accordion-FAQ, regnestykket med kommentar-flag på 120 kr.
10. **/gaver/anledning** (sektion 8) — generisk template + tema-fil, sommer-tema som default, 301 fra /gaver/fars-dag
11. **Meta Pixel-lag** (sektion 9) — ViewContent / AddToCart / InitiateCheckout med `event_id`, guard mod dobbelt-fyring, console-log i dev
12. **Leverance-dokument** (sektion 10) — alle nye ruter, alle 301'ere, bekræftelse på server-HTML, pixel-event-oversigt, feature-flag-steder

## Teknisk

- **SSR-loaders**: kaldt via `serverOnly` helper eller `createServerFn` mod Storefront API med `SUPABASE_URL`-lignende server env for `SHOPIFY_STOREFRONT_TOKEN` (allerede sat)
- **301-redirects**: implementeret som server routes der returnerer `Response.redirect(..., 301)` — TanStack file-based routes under `src/routes/product.$handle.tsx` med `beforeLoad` throw redirect
- **JSON-LD**: injiceres via `head({ loaderData }).scripts` som allerede beskrevet i head-meta-guide
- **Kvitteringsmail på fortrydelse**: nyt template `fortrydelse-kvittering` i `src/lib/email-templates/`
- **Kollektions-slug-consolidation**: kræver kortlægning i Shopify — jeg lister alle nuværende handles først og foreslår den kanoniske slug pr. kategori før jeg implementerer 301'erne

## Foreslået leverance

Jeg venter på svar på de 5 afklaringer + bekræftelse på 3-runde-opdelingen, og starter så på Runde 1. Sig til hvis du hellere vil have det hele i én lang runde (så tager det bare længere før du kan verificere noget).