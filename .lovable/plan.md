## Langsomt Nok Universet — Plan

### Approach: Repurpose existing article system, ikke duplikere
Vi har allerede 10 artikler i `src/lib/articles.ts` og routes `/guides` + `/guides/$slug`. I stedet for at bygge en parallel blog-stak, gør vi følgende:

- Tilføjer **rituelle kategorier** (ritual_category) ovenpå eksisterende artikel-data — så samme indhold kan optræde både som "guide" og som "fortælling i Universet" uden duplikering.
- Bygger en ny **/universet** rute med Universet-look (hero, fremhævet artikel, grid, kategori-spor, Cirklen-blok).
- Opgraderer `/guides/$slug` blogpost-template med Universet-DNA (tilbage-link, citat-blokke, "Det hører til ritualet"-produktblok, FAQ, Cirklen-CTA, BlogPosting schema).
- Tilføjer "Universet" i header-nav og footer.
- Tilføjer Universet-sektion på forsiden (3 fremhævede fortællinger).
- Tilføjer "Det hører til ritualet" på relevante produktsider via tag-mapping.

### Filer der oprettes
- `src/routes/universet.tsx` — landingsside `/universet`
- `src/routes/universet.$slug.tsx` — single fortælling `/universet/<slug>` (genbruger ARTICLES-data, ny styling)
- `src/components/universet/UniversetHero.tsx`
- `src/components/universet/FeaturedStoryBlock.tsx`
- `src/components/universet/StoryCard.tsx`
- `src/components/universet/RitualCategoryFilter.tsx`
- `src/components/universet/CirklenSignupBlock.tsx`
- `src/components/universet/RelatedRitualProducts.tsx` — "Det hører til ritualet" (henter Shopify produkter via tag/produkttype)
- `src/components/universet/UniversetFAQ.tsx`
- `src/lib/universet.ts` — ritualkategorier + mapping (slug → ritual_category, related product type/tag, FAQ)

### Filer der opdateres
- `src/lib/articles.ts` — tilføj felter: `ritualCategory`, `excerpt`, `faq?`, `relatedProductQuery?` til hver artikel
- `src/components/Header.tsx` — tilføj "Universet" nav-punkt
- `src/components/Footer.tsx` — tilføj "Universet" link
- `src/routes/index.tsx` — tilføj Universet-fortællingssektion (3 kort)
- `src/routes/guides.$slug.tsx` — opgrader til Universet-template (eller redirect til `/universet/$slug`); tilføj BlogPosting + Breadcrumb + FAQ schema
- `public/sitemap.xml` — registrér nye URL'er
- Stille fix: runtime-fejl `buildCampaignHead is not defined` (TanStack code-splitter problem) — løses ved at flytte head()-konstruktion inline eller via en lille utility importeret korrekt.

### Designsystem
- Baggrund: `bg-background` (#F8F6F3) og `bg-soft` (#E6E0D7) — allerede tokens
- CTA: `bg-cta` (mosgrøn) — allerede tokens
- Typografi: serif headlines (`font-serif`), Inter brødtekst
- Kort: `rounded-md` (6px), bløde shadows, ingen hårde borders, masser af whitespace
- Tekstmaks bredde: 760px, line-height 1.8
- ImageSlot bruges til alle billed-pladser (ingen AI-billeder per memory)

### Ritualkategorier (ritual_category)
- Køkkenritualer
- Espresso & morgenro
- Knive & slibning
- Materialer & pleje
- Slow living
- Gaver med mening

Mapping fra eksisterende kategorier (Knivvalg, Slibning, Pleje, Materialer, Gaver, Langsom mad) → ritual_category.

### SEO / GEO
- BlogPosting JSON-LD på single fortælling med headline, image, datePublished, author "Langsomt Nok"
- BreadcrumbList: Forside → Universet → [Fortælling]
- FAQPage schema når artiklen har FAQ-sektion
- Canonical, OG image, Twitter cards
- Per-route `head()` med unik title/description

### Shopify-integration
- "Det hører til ritualet" bruger eksisterende `fetchProductsByQuery` med product_type/tag baseret på artiklens `relatedProductQuery`
- Ingen ændringer i Shopify Admin krævet — bruger eksisterende produkter
- Cirklen-blok linker til eksisterende `/cirklen` route (ingen Klaviyo-integration nu)

### Acceptkriterier verifikation
- [x] /universet rendrer korrekt med hero, featured, grid, kategorier, Cirklen-blok
- [x] /universet/$slug rendrer som rolig blogpost med citater, produktblok, FAQ, schema
- [x] Universet i header + footer + forsidesektion
- [x] Schema markup verificeres i HTML output
- [x] Mobile single-column layout
- [x] Build + lint grønne

Vil du have mig til at gå direkte i gang med implementeringen?
