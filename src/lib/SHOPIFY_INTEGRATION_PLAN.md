# Shopify Integration Plan — Langsomt Nok

> Denne fil dokumenterer hele Shopify-forbindelsen i projektet.
> Alle brugervendte tekster er på dansk. Visuelt design: nordisk, roligt, premium.

---

## 1. Produkter — Hentning & Visning

**Filer:** `src/lib/shopify.ts`, `src/routes/shop.tsx`, `src/routes/product.$handle.tsx`

| Hvad | Hvordan |
|------|---------|
| Alle produkter | `storefrontApiRequest(PRODUCTS_QUERY, { first: 50 })` |
| Enkelt produkt | `storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle })` |
| Relaterede produkter | `storefrontApiRequest(PRODUCT_RECOMMENDATIONS_QUERY, { productId })` |
| Filtrering | Tilføj `query` variabel: `"tag:bestseller"`, `"product_type:Kniv"` |

**Udvidelse med metafields:**
Tilføj til produkt-queries for plejevejledninger, tekniske specs, sensorisk intro:
```graphql
metafields(identifiers: [
  {namespace: "custom", key: "care_instructions"},
  {namespace: "custom", key: "technical_specs"},
  {namespace: "custom", key: "sensory_intro"}
]) { namespace key value type }
```

---

## 2. Kollektioner — Hentning & Routing

**Filer:** `src/lib/shopify.ts`, `src/routes/collections.$handle.tsx`

| Hvad | Hvordan |
|------|---------|
| Alle kollektioner | `storefrontApiRequest(COLLECTIONS_QUERY, { first: 20 })` |
| Enkelt kollektion | `storefrontApiRequest(COLLECTION_BY_HANDLE_QUERY, { handle, first: 50 })` |
| Sortering | `sortKey: "BEST_SELLING"`, `"PRICE"`, `"CREATED"` + `reverse: true/false` |
| Filtre | Responsens `filters` felt giver filtermuligheder fra Shopify |

**Kollektion-handles i projektet** (`COLLECTION_HANDLES` i shopify.ts):
- `knive` — Knive
- `slibesten` — Slibesten
- `magnetiske-holdere` — Magnetiske holdere
- `pleje-ritualer` — Pleje & ritualer
- `gaver` — Gaver
- `startkits` — Startkits
- `bestsellers` — Bestsellers

Navigation: `<Link to="/collections/$handle" params={{ handle: "knive" }}>`

---

## 3. Tilføj til kurv — Hvordan det virker

**Fil:** `src/stores/cartStore.ts`

### Flow:
```
Bruger klikker "Læg i kurv"
  → addItem() i Zustand-store
    → Første gang: cartCreate mutation → opretter Shopify-kurv, gemmer cartId + checkoutUrl
    → Eksisterende vare: cartLinesUpdate mutation → opdaterer antal
    → Ny vare: cartLinesAdd mutation → tilføjer linje
  → Kurv-drawer åbner automatisk (isOpen: true)
```

### Brug i komponenter:
```tsx
const addItem = useCartStore(state => state.addItem);
const variant = product.node.variants.edges[0]?.node;

await addItem({
  product,
  variantId: variant.id,        // gid://shopify/ProductVariant/xxxxx
  variantTitle: variant.title,
  price: variant.price,
  quantity: 1,
  selectedOptions: variant.selectedOptions,
});
```

---

## 4. Kurv-drawer — Opdatering

**Filer:** `src/components/CartDrawer.tsx`, `src/hooks/useCartSync.ts`

| Aktion | API-kald | Resultat |
|--------|----------|----------|
| Åbn drawer | `syncCart()` | Verificerer kurv stadig eksisterer i Shopify |
| Opdater antal | `cartLinesUpdate` | Ændrer antal på linje i Shopify |
| Fjern vare | `cartLinesRemove` | Sletter linje fra Shopify-kurv |
| Ryd kurv | `clearCart()` | Nulstiller lokal state |

**Synkronisering (`useCartSync` hook i `__root.tsx`):**
- Kører `syncCart()` ved side-load
- Kører `syncCart()` når brugeren vender tilbage til fanen (visibility change)
- Rydder kurven hvis Shopify returnerer `totalQuantity === 0` (checkout gennemført)

---

## 5. Checkout — Redirect

**Fil:** `src/stores/cartStore.ts`, `src/components/CartDrawer.tsx`

### Flow:
```
Bruger klikker "Gå til betaling"
  → getCheckoutUrl() henter URL fra cart state
  → URL har altid ?channel=online_store (påkrævet for at undgå password-gate)
  → window.open(checkoutUrl, '_blank') åbner Shopify checkout i nyt faneblad
  → Bruger gennemfører betaling på Shopify
  → Når brugeren vender tilbage: useCartSync → syncCart() → rydder kurv
```

**VIGTIGT:**
- Checkout-URL genereres af `cartCreate` mutation — aldrig manuelt konstrueret
- Åbnes altid i nyt faneblad med `window.open(url, '_blank')`
- Aldrig brug direkte produkt-URLs eller `/cart/add?id=` permalinks

---

## 6. Nyhedsbrev — Shopify/Klaviyo forbindelse

**Fil:** `src/components/NewsletterSignup.tsx`

### Mulighed A: Shopify Customer API
```graphql
mutation customerCreate($input: CustomerCreateInput!) {
  customerCreate(input: $input) {
    customer { id email }
    customerUserErrors { field message code }
  }
}
# Variables:
{ input: { email: "...", firstName: "...", acceptsMarketing: true } }
```

### Mulighed B: Klaviyo API (anbefalet for avancerede flows)
```
POST https://a.klaviyo.com/api/v2/list/{LIST_ID}/subscribe
Headers: { "Content-Type": "application/json", "api-key": KLAVIYO_PRIVATE_KEY }
Body: { "profiles": [{ "email": "...", "first_name": "..." }] }
```

**Implementering:** Kald via server function (createServerFn) for at beskytte API-nøgler.

### Signup-kilder i projektet:
- `source: 'footer'` — Footer-signup
- `source: 'homepage'` — Forside "Langsomt Brev" sektion
- `source: 'cirklen'` — Langsomt Cirklen-side
- `source: 'product_page'` — Produktside
- `source: 'checkout'` — Post-checkout

---

## 7. Miljøvariabler

### Allerede konfigureret (offentlige, i koden):
| Variabel | Værdi | Placering |
|----------|-------|-----------|
| `SHOPIFY_STORE_PERMANENT_DOMAIN` | `aqwut5-0n.myshopify.com` | `src/lib/shopify.ts` |
| `SHOPIFY_STOREFRONT_TOKEN` | `2a0608b70646abcc4bd94abf1aa7ef09` | `src/lib/shopify.ts` |
| `SHOPIFY_API_VERSION` | `2025-07` | `src/lib/shopify.ts` |

> Storefront-token er en offentlig (read-only) nøgle — sikker at bruge client-side.

### Påkrævede for server-side funktioner (tilføj som secrets):
| Variabel | Formål | Hvornår |
|----------|--------|---------|
| `KLAVIYO_PRIVATE_KEY` | Nyhedsbrev-signups via Klaviyo | Når Klaviyo newsletter vælges |
| `KLAVIYO_LIST_ID` | Specifik Klaviyo-liste for Langsomt Brev | Når Klaviyo newsletter vælges |
| `SHOPIFY_ADMIN_TOKEN` | Admin API til ordrer, lager, metafields | Kun backend/server functions |

---

## Filstruktur — Oversigt

```
src/
├── lib/
│   └── shopify.ts              ← API-konfiguration, types, queries, hjælpefunktioner
├── stores/
│   └── cartStore.ts            ← Zustand kurv-state, Shopify Cart mutations
├── hooks/
│   └── useCartSync.ts          ← Kurv-synkronisering ved visibility change
├── components/
│   ├── CartDrawer.tsx           ← Kurv-drawer UI ("Dit ritual")
│   ├── ProductCard.tsx          ← Produktkort med "Læg i kurv"
│   ├── Header.tsx               ← Navigation med kurv-ikon
│   ├── Footer.tsx               ← Footer med kollektion-links
│   └── NewsletterSignup.tsx     ← "Langsomt Brev" signup
├── routes/
│   ├── index.tsx                ← Forside med produkter
│   ├── shop.tsx                 ← Butik med alle produkter
│   ├── product.$handle.tsx      ← Produktdetalje-side
│   ├── collections.$handle.tsx  ← Kollektion-side
│   ├── cirklen.tsx              ← Fællesskab / Langsomt Cirklen
│   ├── om.tsx                   ← Om Langsomt Nok
│   ├── kontakt.tsx              ← Kontakt
│   └── guides.*/               ← Guide-sider
```

---

## Status: ✅ Live Integration

Hele Shopify Storefront API-integrationen er implementeret og aktiv:
- [x] Produkter hentes live fra Shopify
- [x] Kurv oprettes og synkroniseres via Cart API
- [x] Checkout redirect via Storefront API
- [x] Variantvalg og lagerstatus
- [x] Kurv-persistens i localStorage
- [x] Auto-sync ved tab-skift

**Næste skridt:**
- [ ] Tilslut nyhedsbrev til Klaviyo eller Shopify Customer API
- [ ] Tilføj metafields til produkter i Shopify Admin
- [ ] Opret kollektioner med de definerede handles
- [ ] Tilføj bundleprodukter (Ritual Startkit, Craft & Care, Full Focus Set)
