
# CRO-opstramning af Langsomt Nok

Målet er at gøre det eksisterende site skarpere og mere konverteringsvenligt — ikke et redesign. Vi bevarer billeder, produkter, brand-DNA og slow living-tonen, men strammer hierarki, kontrast, CTA'er og mikrotekster.

## 1. Designtokens (src/styles.css)

Justér eksisterende tokens for stærkere kontrast, uden at bryde paletten:

- `--background` → #F8F6F3
- `--foreground` → #2D2D2D
- `--soft` (varm baggrund) → #E6E0D7
- `--cta` → #4C574A (mosgrøn, mere mættet)
- `--cta-hover` → #3D463B (ny token til hover)
- `--copper`/sekundær accent → #B7A68B
- `--border` → #D8D1C7
- `--card` → #FAF8F4

Tilføj utility-klasser: `.shadow-card-hover`, `.lift-on-hover` (rolig 4px translate + skygge).

Typografi: skærp H1/H2 vægt og letter-spacing en smule. Sikr brødtekst på min. 16px og line-height 1.7.

## 2. Hero (src/routes/index.tsx)

Ny tekst:
- H1: "Et roligere køkken starter med de ting, du bruger hver dag."
- Underrubrik: "Udvalgte produkter i træ, stål og keramik – skabt til mere orden, bedre hverdagsritualer og et hjem, der føles rart at være i."
- Primær CTA: "Se køkkenfavoritter" → /shop (mosgrøn, fuld styrke)
- Sekundær CTA: "Udforsk keramik" → /keramik (outline)
- Mobil: CTA'er stables, min højde 48px, fuld bredde, tydelig kontrast mod hero-overlay.

## 3. Trustbar (src/components/landing/TrustBar.tsx)

Opdater til:
✓ Dansk webshop · ✓ Hurtig levering · ✓ Sikker betaling · ✓ Nem retur · ✓ hej@langsomtnok.dk

Placér umiddelbart under hero på forsiden og øverst på collection-/produktsider. Kompakt på mobil (2 kolonner grid, ikoner mindre).

## 4. Kategoriindgange på forsiden

Tre kort (Køkkenfavoritter, Keramik, Gaver) med:
- Kort konkret tekst (som specificeret)
- Tydelig CTA ("Se køkkenprodukter" / "Se keramik" / "Find en gave")
- Hover: subtil løft + dybere skygge + CTA bliver mosgrøn
- Hele kortet klikbart, men med visuel "→" CTA

Bygges/justeres i `CollectionCard` + ny sektion på forsiden.

## 5. Produktsektioner (forsiden)

Omdøb evt. "Bestseller" → "Udvalgt lige nu" / "Et godt sted at starte".
Strukturer forsiden så rækkefølgen er: Hero → Trustbar → Kategorier → Udvalgt lige nu → Keramik-sektion → Gaver med ro i → Brand/intro → Cirklen-signup → Footer.

## 6. Produktkort (src/components/ProductCard.tsx)

Tilføj:
- Tydeligere border (`--border`) + hvid kortbaggrund
- Pris i fed, mosgrøn farve
- Kort benefit-linje (1 linje, valgfri prop)
- "Se produkt"-CTA der vises tydeligere på hover (desktop) og altid på mobil
- "På lager" / "Sendes fra Danmark" mikrotekst hvis data findes
- Rolig hover: lift 4px + skygge + CTA mætter farve

Benefit-tekster mappes via produkt-handle (knivholder, slibesten, keramik osv.) — fallback til ingen tekst.

## 7. Produktsider (src/routes/product.$handle.tsx)

Tæt på pris/købsknap:
- "Levering 1–3 hverdage" · "Sikker betaling" · "Nem retur" · "Spørgsmål? hej@langsomtnok.dk"
- Fordelspunkter (4 ✓) — for magnetisk knivholder de specificerede

Sticky mobil-CTA (`StickyMobileCTA`): allerede findes — strammes visuelt (tydeligere baggrund, bedre skygge, sikr at den ikke dækker chat).

## 8. Collection-sider (src/routes/collections.$handle.tsx + keramik-template)

Hver collection-header får:
- H1 med konkret værdi-tekst
- Kort intro (2–3 linjer)
- Trust-/leveringslinje under intro
- Bedre produktgrid spacing
- Internt link-blok i bunden ("Du kan også kigge på …")

## 9. Navigation & Footer

Header: tydeliggør Køkken / Keramik / Gaver / Om / Kontakt.
Footer: tilføj mail, levering, retur, handelsbetingelser, privatliv, om, CVR (hvis tilgængelig). Varm tone bevares.

## 10. Tracking

Tilføj `data-event` / `data-section` / `data-target` attributter på:
- Hero CTA'er
- Kategori-kort
- Produktkort
- Collection-CTA'er
- Sticky mobil-CTA

Eksisterende `trackEvent`-kald bevares.

## 11. Mikrotekster

Drys ind hvor relevant: "Pakket med omtanke", "Sendes fra Danmark", "Små partier", "Udvalgt til hverdagen". Kun hvor det giver mening — ikke spam.

## 12. Mobil & kontrast-pas

- CTA min-højde 48px på mobil
- Sikr ingen beige-på-beige tekst (linjer på links og priser tjekkes)
- Sticky CTA bottom: 0 på mobil; chat-bubble løftes 88px (allerede gjort)
- Lazy-loading på alle billeder uden for viewport

## Tekniske noter

- Ingen nye store libraries
- Ingen ændring af Shopify-integration eller cart-logic
- Ingen migrations nødvendige
- Bevarer alt eksisterende tracking
- Image slots og produktbilleder forbliver uændrede

## Filer der ændres

- `src/styles.css` (tokens, hover-utilities)
- `src/routes/index.tsx` (hero-tekst, sektionsrækkefølge)
- `src/components/landing/LandingPageHero.tsx` (CTA-kontrast på mobil)
- `src/components/landing/TrustBar.tsx` (nye items + placering)
- `src/components/landing/CollectionCard.tsx` (hover, CTA)
- `src/components/ProductCard.tsx` (benefit-linje, hover, tracking)
- `src/components/StickyMobileCTA.tsx` (visuel polish)
- `src/components/Header.tsx` + `src/components/Footer.tsx` (nav + trust)
- `src/routes/product.$handle.tsx` (trust-linje + fordelspunkter)
- `src/routes/collections.$handle.tsx` (header + intro)
- `src/routes/shop.tsx` (header tekst)

## Ude af scope

- Nye produktbilleder eller AI-billeder
- Ændringer i Shopify-data eller cart-store
- Database/auth/edge functions
- Komplet nye sider eller routes
