# Post-click landingssider — Knivsliber i valnød

Tre selvstændige landingssider bygget til at modtage betalt trafik (Meta, Reels,
Pinterest, retargeting) og lade brugeren købe direkte, uden mellemled til den
almindelige produktside.

## Oversigt

| Route | Kampagne | Creative / video (still) | Vinkel |
|---|---|---|---|
| `/pages/sommerhus-knivsliber` | **Sommerhus & feriekøkken** | `src/assets/knivsliber-landing/hero-sommerhus.png` (still fra "Første aften i sommerhuset") | Sløve knive i sommerhuset — bliv klar til aftensmaden. |
| `/pages/campingvogn-knivsliber` | **Campingvogn & ferie** | `src/assets/knivsliber-landing/hero-campingvogn.png` (still fra "Klar til campingvognen") | Lille format, nem i skuffen, pæn på bordet. |
| `/pages/saadan-virker-knivsliberen` | **Funktion & retargeting** | `src/assets/knivsliber-landing/hero-funktion.png` (still fra "Tre trin. En mærkbar forskel") | Demonstration: Grov · Fin · Polér. Rolig FAQ. |

## Konfiguration

Alt produktreference sker centralt i **`src/lib/knivsliber-config.ts`**:

```ts
export const KNIVSLIBER_CONFIG = {
  SHOP_DOMAIN: SHOPIFY_STORE_PERMANENT_DOMAIN,                        // fra .env
  PRODUCT_HANDLE: "walnut-sharpener-xz-mdq01-htm",
  DEFAULT_VARIANT_ID: "gid://shopify/ProductVariant/52348738830672",  // Valnød
  PRODUCT_TITLE: "Knivsliber – Valnød (Præcisionssliberen)",
};
```

Skift variant, produkt eller tilføj nye varianter her — alle tre landingssider
og `<DirectAddToCart />` opdateres automatisk.

## Direkte add-to-cart

`<DirectAddToCart />` (`src/components/knivsliber-landing/DirectAddToCart.tsx`)
er den eneste købsindgang på siderne. Den:

1. **Henter live** pris, varianter og lagerstatus fra Shopify Storefront API
   (`fetchProductsByHandles`).
2. Lægger direkte i den eksisterende Shopify-kurv via `cartStore.addItem()`
   (Cart API mutations: `cartCreate` / `cartLinesAdd`).
3. **Åbner cart drawer** automatisk (`cartStore` sætter `isOpen: true`) — der
   sker aldrig redirect til produktsiden.
4. **Tracker**:
   - `ViewContent` ved landing (via `trackProductView` — GA4 `view_item` +
     Meta Pixel `ViewContent`).
   - `AddToCart` efter bekræftet Shopify-succes (`trackAddToCart` — GA4
     `add_to_cart` + Meta Pixel `AddToCart`).
   - `InitiateCheckout` ved klik på "Gå til betaling" i drawer
     (`trackBeginCheckout` — GA4 `begin_checkout` + Meta Pixel
     `InitiateCheckout`).
   - Deduplikering (300 ms) forhindrer dobbelte events på tværs af GA4, Meta
     Pixel og GTM.
5. **UTM-parametre** fanges på landing (`captureAttribution` i
   `src/lib/tracking.ts`) og vedhæftes hver behavioral event. UTM'er sendes
   automatisk med i Meta Pixel og GA4 payloads. Shopify-checkoutURL'en er
   short-lived, og vi tilføjer ikke UTM'er derinde — Shopify-analytics læser
   `landing_site_ref` fra egne cookies.
6. **Sticky mobile bar** (`<StickyBuyBar />`) sikrer at "Tilføj til ritualet"
   altid er tilgængelig i bunden på mobil.
7. **Udsolgt** vises roligt: knappen låses, tekst skifter til "Udsolgt lige nu".

## Cart drawer

Genbruger den eksisterende `<CartDrawer />` (`src/components/CartDrawer.tsx`),
som allerede har:

- Produktfoto, titel, variant, pris, antal, subtotal
- Rolig sekundær tekst og trust-boks med betalingsikoner
- "Gå til betaling"-knap → åbner Shopify checkout i nyt vindue

Ingen ændringer nødvendige i drawer for at siderne fungerer.

## Tilføj eller skift creatives

Nye stills/videoer:

```bash
cd src/assets/knivsliber-landing
lovable-assets create --file /mnt/user-uploads/<fil> --filename hero-<slug>.png \
  > hero-<slug>.png.asset.json
```

Importer i route-filen: `import img from "@/assets/knivsliber-landing/hero-<slug>.png.asset.json"`.

For rigtige `<video>`-elementer (autoplay muted, poster + play-knap): udskift
`<img>` i "Video / still"-sektionerne. Ingen autoplay med lyd — jf. spec.
