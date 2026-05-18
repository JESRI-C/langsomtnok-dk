# Langsomt Nok — SEO & Struktur Audit (Fase 0)

Dato: 2026-05-18
Status: kun analyse — ingen kodeændringer.

---

## 1. Route-inventar (40 routes)

Alle routes har allerede unikt `head()`. Det er en stor styrke — vi skal ikke bygge metadata fra nul, men forfine.

### Indekserbare hoved-routes (live)
- `/` (index)
- `/shop`, `/find-dit-ritual`, `/universet`, `/universet/$slug`
- `/guides`, `/guides/$slug`
- `/collections/$handle` (dynamisk), `/collections/handlavet-keramik`
- `/keramik`, `/keramik/$slug`, `/keramik/susan-riel`
- `/ritualer/hold-kniven-skarp`, `/ritualer/rolig-opbevaring`
- `/gaver/fars-dag`, `/cirklen`, `/om`, `/kontakt`
- `/product/$handle`
- 13 × `/pages/*` (artikler/guides i pages-namespace)
- Legal: handelsbetingelser, privatlivspolitik, cookiepolitik, returpolitik, fragt, reklamation

### Korrekt blokeret
- `/audit` — disallow i `robots.txt` ✓

---

## 2. Ritualsider — status

| Ritual | URL i dag | Status |
|---|---|---|
| Sliberitualet | `/ritualer/hold-kniven-skarp` | ✅ Findes — fuld 10-trins layout |
| Opbevaringsritualet | `/ritualer/rolig-opbevaring` | ✅ Findes — fuld 10-trins layout |
| Knivritualet | — | ❌ Mangler |
| Gaveritualet | (`/gaver/fars-dag` findes som kampagne) | ❌ Mangler som permanent ritual |
| Keramikritualet | (`/keramik` findes som hub) | ❌ Mangler som ritual-format |

**Anbefaling:** Behold `/ritualer/$slug` URL-struktur (allerede crawlet). Opret:
- `/ritualer/knivritualet`
- `/ritualer/gaveritualet`
- `/ritualer/keramikritualet`

Opdater `Header.tsx` nav til at pege på `/ritualer/...` i stedet for collections, og opret `/ritualer` index-side (hub med 5 kort).

---

## 3. Collection-sider

`/collections/$handle` har generisk dynamisk template med fuld SEO (`canonical`, `CollectionPage` + `BreadcrumbList` + `FAQPage` JSON-LD ✓). Men det er én skabelon for alle handles — der mangler **unikt indhold pr. collection** (intro, buying guide, FAQ-tekst pr. handle).

Slug-status (fra sitemap):
- `/collections/knive`, `/slibesten`, `/slibning-pleje`, `/pleje-ritualer`, `/magnetiske-holdere`, `/gaver`, `/handlavet-keramik`, `/susan-riel`, `/keramikkopper`, `/keramikskale`, `/keramikvaser`, `/keramikunika`

**Mangler i forhold til ønske:** `/collections/slibning`, `/collections/opbevaring`, `/collections/keramik`, `/collections/bundles`. Beslut: opret som aliaser/redirects til eksisterende handles, eller tilføj som nye Shopify-collections.

---

## 4. Guides / artikler

`src/lib/articles.ts` har 10 artikler. Mapping mod dine 8 ønskede slugs:

| Ønsket slug | Findes i dag som | Handling |
|---|---|---|
| saadan-holder-du-dine-koekkenknive-skarpe | `hvordan-sliber-man-en-kniv` + `hvor-ofte-skal-man-slibe-sin-kniv` | Skriv ny eller alias |
| hvilken-slibesten-skal-jeg-vaelge | `slibesten-1000-5000-hvad-betyder-det` | Omdøb / udvid |
| knivlist-eller-knivstander | — | ❌ Skriv ny |
| saadan-passer-du-paa-en-kniv-med-traeskaft | — | ❌ Skriv ny |
| gave-til-madelskeren | `gave-til-den-der-elsker-mad` | Omdøb / alias |
| haandlavet-keramik-og-smaa-variationer | — | ❌ Skriv ny |
| saadan-skaber-du-mere-ro-i-koekkenet | `kokkenet-som-fristed` (delvist) | Skriv ny vinkel |
| de-bedste-redskaber-til-et-langsommere-koekkenritual | `gode-koekkenredskaber-der-holder` | Omdøb / udvid |

**Bemærk dobbelt-univers:** Artikler eksponeres både via `/universet/$slug`, `/guides/$slug` og `/pages/...` routes. Det giver risiko for duplikat-indhold på tværs af 3 URL-mønstre — kandidat til konsolidering med canonical pegende mod én primær (forslag: `/guides/$slug`).

---

## 5. Produktside (`product.$handle.tsx`)

- ✅ Canonical sat på leaf
- ✅ JSON-LD `Product` schema (linje 343)
- ✅ Ingen fake review schema bekræftet
- ⚠️ Tjek for dublerede trust-blokke ifht. seneste iteration af `RitualTrustModule` + `ProductMoodVideo` (kræver browser-tjek i Fase 5)

---

## 6. Metadata-dækning

**100% af routes har `head()`.** Stikprøvetjek nødvendigt for:
- Unikke meta descriptions (ikke kopier af title)
- `og:image` på sider med relevant visuelt indhold
- `og:url` konsistens

---

## 7. Sitemap & robots

- ✅ `sitemap.xml` er server-rendered (`src/routes/sitemap[.]xml.ts`)
- ✅ Inkluderer dynamiske produkter via Shopify Storefront API
- ✅ Inkluderer alle artikler både som `/universet/$slug` OG `/guides/$slug` — bekræfter duplikat-issue ovenfor
- ✅ `robots.txt` korrekt sat op med Sitemap-direktiv
- ⚠️ Sitemap pegerer mod URLs der måske ikke findes (`/collections/slibesten`, `/collections/slibning-pleje`, `/collections/pleje-ritualer`) — bekræft Shopify-handles
- ⚠️ `/pages/...` URLs er statiske routes der duplikerer guide-indhold

---

## 8. Strukturerede data — status

- ✅ Root: Organization + WebSite JSON-LD
- ✅ Product: Product schema
- ✅ Collection: CollectionPage + BreadcrumbList + FAQPage
- ✅ Universet artikler: BlogPosting + FAQ
- ⚠️ `/guides/$slug` — verificér Article schema
- ⚠️ Mangler BreadcrumbList på ritual-sider og pages-routes

---

## 9. Lavværdi-kandidater (potentielle årsager til "discovered, not indexed")

1. **Dobbelt-eksponering af artikler** (`/universet/$slug` + `/guides/$slug` + `/pages/*`) — Google ser 3× samme indhold. **Højeste prioritet at fikse.**
2. **`/collections/$handle` med kun grid** — for sider hvor Shopify-collection findes men ingen unik landing-tekst er tilføjet.
3. **`/pages/*` routes** — flere overlapper med universet-artikler.
4. **Tomme/draft produkter** — bør tjekkes mod Shopify-feed og noindex'es hvis pris=0 eller status=draft.

---

## Hovedkonklusioner

**Den gode nyhed:** Det tekniske SEO-fundament er i god stand. Alle routes har head(), canonical og JSON-LD-mønstre er på plads, sitemap er dynamisk.

**Det reelle problem bag "discovered, not indexed":**
1. Duplikat-indhold på tværs af `/universet/`, `/guides/`, `/pages/` — Google vælger ikke at indeksere når den ikke ved hvilken er kanonisk.
2. Tynde collection-sider uden unikt indhold.
3. Manglende ritualsider (3 ud af 5) der ellers ville være naturlige hub-sider.
4. Inkonsistent intern linkning mellem rituals → collections → produkter → guides.

---

## Anbefalet rækkefølge (justeret efter audit)

**Fase 1 først — konsolidering (størst SEO-impact, lavest risiko):**
- Beslut kanonisk URL-mønster for artikler (forslag: `/guides/$slug` som primær, `/universet/` og `/pages/` som canonical-pegende aliaser eller redirects).
- Tilføj BreadcrumbList JSON-LD på ritualsider + pages-routes.
- Audit Shopify-collections, fjern sitemap-entries til ikke-eksisterende handles.

**Fase 2 — manglende ritualsider:** opret de 3 manglende.

**Fase 3 — collection unikke landings.**

Resten af planen følger som beskrevet.

---

## Beslutninger jeg har brug for fra dig før Fase 1

1. **Artikel-URL-konsolidering:** OK at gøre `/guides/$slug` til primær, og lade `/universet/$slug` + `/pages/...` pege canonical mod den? (Eller foretrækker du modsat: `/universet/` som primær fordi indholdet er fortællende?)
2. **Ritualer URL:** Behold `/ritualer/$slug` (allerede crawlet), eller flyt til `/pages/...` som din spec foreslår? Anbefaling: behold + tilføj redirect fra `/pages/knivritualet` → `/ritualer/knivritualet`.
3. **Collections:** Skal jeg oprette nye Shopify-collections (`opbevaring`, `slibning`, `bundles`), eller alias-route'r der peger på eksisterende handles?

Svar på de 3, så starter jeg Fase 1.
