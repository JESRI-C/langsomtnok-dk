
# Redesign Product & Collection Pages Using Shopify Descriptions

## What We Know

All 14 Shopify products now have structured HTML descriptions with consistent H3 sections:
- **Intro** (opening paragraphs before first H3)
- **Skabt til...** (story/purpose)
- **Passer til dig, hvis** (fit bullets)
- **Materialer og detaljer** (specs list)
- **Pleje er en del af ritualet** / **Sådan bruger du den** (care)
- **Det giver mening sammen med** (cross-sell)
- **FAQ** (question/answer pairs)

The current product page renders the full `descriptionHtml` as one block and uses hardcoded placeholder specs/FAQ. We need to parse and display each section in its own designed block.

---

## Plan

### 1. Create a Shopify description parser utility

New file: `src/lib/parse-product-description.ts`

- Parse `descriptionHtml` by splitting on `<h3>` tags
- Extract intro (everything before first H3)
- Extract named sections: story, fit points, materials, care, cross-sell, FAQ
- FAQ parser: extract bold questions and their answers
- Fit parser: extract `<li>` items from the fit section
- Materials parser: extract `<li>` items from materials section
- Return a typed object with all sections as strings/arrays
- Remove the hardcoded `getPlaceholderSpecs()` and `PLACEHOLDER_FAQ` from the product page

### 2. Redesign the product page (`src/routes/product.$handle.tsx`)

Replace the current single-block layout with structured sections using parsed data:

1. **Product hero** — gallery + title + parsed intro + price + variants + quantity + CTA ("Tilføj til ritualet") + trust line
2. **Trust bar** — reuse existing `TrustBar` component
3. **Product story** — parsed "Skabt til..." section in editorial layout
4. **Fit section** — parsed "Passer til dig, hvis" as styled card with checkmarks (update `ProductFitSection` to accept parsed data)
5. **Materials & details** — parsed specs as clean striped table
6. **Care section** — parsed care text in warm section with `bg-soft`
7. **Cross-sell** — parsed "Det giver mening sammen med" + related products from Shopify recommendations
8. **FAQ** — parsed FAQ in accordion (use existing `Accordion` component)
9. **Final CTA** — "Begynd med dette ritual" / "Tilføj til ritualet"
10. **Sticky mobile CTA** — already exists, keep as-is

Remove: hardcoded `getPlaceholderSpecs()`, `PLACEHOLDER_FAQ`, generic "Sådan føles den" section, placeholder reviews section.

### 3. Update `ProductFitSection` component

- Accept parsed fit points from Shopify description instead of hardcoded defaults
- Keep the "Hvis du er i tvivl" doubt-removal block

### 4. Improve collection page (`src/routes/collections.$handle.tsx`)

- Add collection intro copy based on handle (knive, slibning-pleje, magnetisk-opbevaring, gaver, start-dit-ritual)
- Add `TrustBar` at bottom
- Add editorial header with the specified intro lines
- Better SEO head tags

### 5. Update shop page categories (`src/routes/shop.tsx`)

- Fix category filter queries to match actual Shopify `product_type` values: "The Chef Line", "The Ritual Set", "The Calm Kitchen", "The Gift Chapter"
- Update category labels to Danish: "Knive", "Slibning & pleje", "Opbevaring", "Gaver"

### 6. Update 5 landing pages with real product data

Each landing page will fetch its recommended products from Shopify and pass them to `ProductRecommendationBlock`:

- **Den første rigtige kokkekniv** — fetch Damascus Chef Knife, Slibesten 1000/5000, Magnetisk Knivstander
- **Sådan holder du din kniv skarp** — fetch sharpening products
- **Knivholder i træ** — fetch magnetic storage products
- **Gave til madelskeren** — fetch Gift of Calm, Damascus Chef Knife, Knivsliber Valnød
- **Damaskus kniv** — fetch Damascus Chef Knife, Damascus Universalkniv

Update hero headlines and CTAs to match the specified copy.

### 7. Create audit page (`src/routes/audit.tsx`)

Dev-only internal page at `/audit` listing:
- All products with status (active/draft), inventory, image availability
- Missing images list
- Suggested bundles and landing page mappings

---

## Technical Details

- **Description parser**: Uses DOMParser (browser) or regex to split HTML on `<h3>` boundaries. Returns `{ intro, story, fitPoints, materials, care, crossSell, faq }`.
- **Product type routing**: The product page layout adapts section ordering/styling based on `productType` ("The Chef Line", "The Ritual Set", "The Calm Kitchen", "The Gift Chapter").
- **Landing page product fetching**: Uses `storefrontApiRequest` with handle-based queries to fetch specific products.
- **No invented facts**: All specs, materials, care instructions come from parsed Shopify HTML. No hardcoded HRC, weights, or dimensions.

### Files to create
- `src/lib/parse-product-description.ts`
- `src/routes/audit.tsx`

### Files to edit
- `src/routes/product.$handle.tsx` (major rewrite)
- `src/components/ProductFitSection.tsx`
- `src/routes/collections.$handle.tsx`
- `src/routes/shop.tsx`
- `src/routes/pages.damaskus-kniv.tsx`
- `src/routes/pages.den-forste-rigtige-kokkekniv.tsx`
- `src/routes/pages.gave-til-madelskeren.tsx`
- `src/routes/pages.knivholder-i-trae.tsx`
- `src/routes/pages.sadan-holder-du-din-kniv-skarp.tsx`
