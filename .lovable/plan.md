# Langsomt Nok — Site rebuild for SEO, struktur og konvertering

Det her er en meget stor opgave (15 dele, ~50+ sider berørt). Jeg foreslår vi deler det i 6 faser og kører én ad gangen — så du kan se og godkende undervejs. Jeg starter med en audit, så vi ved præcis hvad der allerede findes, hvad der mangler og hvad der bør ryddes op.

---

## Fase 0 — Audit (først, ingen kodeændringer)

Jeg gennemgår og leverer en kort rapport:

1. **Route-inventar** — alle routes i `src/routes/` mappet mod sitemap.xml (hvad er live, hvad er tyndt, hvad er duplikat).
2. **Ritual-sider** — status på de 5 ritualer (kun 2 findes i dag: `hold-kniven-skarp`, `rolig-opbevaring`). Mangler: knivritualet, gaveritualet, keramikritualet — og de skal flyttes til `/pages/...` slugs som du har angivet, eller jeg foreslår vi beholder eksisterende `/ritualer/...` URLs af hensyn til allerede crawlede links + tilføjer redirects.
3. **Collection-sider** — hvilke `/collections/$handle` der har unikt indhold vs. bare produktgrid.
4. **Guides** — eksisterende `ARTICLES` i `src/lib/articles.ts` mappet mod dine 8 ønskede slugs (flere findes allerede under andre slugs — vi beslutter om vi omdøber, redirecter eller skriver nye).
5. **Produktsider** — tjek af `product.$handle.tsx` for dublerede trust-blokke, schema-status.
6. **Metadata** — hvilke sider har unikt `head()` og hvilke arver root-default.
7. **Sitemap & robots** — hvad er med, hvad mangler, hvad burde noindex'es.
8. **Strukturerede data** — hvor findes JSON-LD i dag, hvor mangler det.
9. **Lavværdi-sider** — kandidater til noindex / fjernelse af interne links.

**Output:** kort rapport i chat + en `.lovable/seo-audit.md` fil. Ingen kodeændringer.

---

## Fase 1 — Tekniske fundament (SEO-kritisk, lav risiko)

- Unikke `head()` på alle vigtige routes der mangler det (collections, pages, ritualer).
- BreadcrumbList + Organization/WebSite JSON-LD på root.
- Product schema på `product.$handle.tsx` (uden fake reviews — Ritual Score forbliver visuel UI, ikke `aggregateRating`).
- FAQPage schema hvor der allerede er FAQ.
- Canonical-tjek (kun på leaf, ikke root — undgå dublet pga. TanStack link-merge).
- Sitemap-opdatering: tilføj manglende sider, fjern thin/draft.

---

## Fase 2 — Ritualsider komplet (5 ritualer)

- Færdiggør `knivritualet`, `gaveritualet`, `keramikritualet` med samme struktur som de 2 eksisterende.
- Standardisér alle 5 til 10-trins layoutet (Hero → Start her → Video → Promise → Journey → Founder → Guide → Full grid → FAQ → Final CTA).
- Beslutning: behold `/ritualer/$slug` URL-struktur (allerede i sitemap + GSC) — tilføj evt. `/pages/knivritualet` som alias-redirect hvis du foretrækker det.

---

## Fase 3 — Collection-sider opgraderes til mini-landing

- `/collections/knive`, `/slibning`, `/opbevaring`, `/keramik`, `/gaver`, `/bundles`.
- Hero + intro + featured + buying guide + grid + FAQ + SEO-tekst + interne links.
- Genbrug komponenter fra ritualsiderne (`FeaturedRitualProducts`, `FounderRitualBox`).

---

## Fase 4 — Guides-hub + 8 artikler

- `/guides` hub-side med kategorier.
- Audit eksisterende artikler — omskriv/omdøb til dine 8 målslugs hvor relevant, opret resten.
- Konsistent struktur: H1 → intro → TOC → sektioner → produktanbefalinger → FAQ → CTA.
- Article + FAQPage JSON-LD.

---

## Fase 5 — Produktside finpudsning + intern linkning + analytics

- Strømlin trust-blokke (én score nær CTA, én detaljeret nede — som allerede halvt gjort).
- "Hører til dette ritual" / "Læs guiden" / "Det giver mening sammen med" link-moduler.
- GA4 events: `ritual_cta_click`, `product_card_click`, `guide_click`, `video_play`, `faq_open`, `newsletter_signup`.

---

## Fase 6 — Homepage hub + cleanup

- Homepage refresh efter PART 3-spec (hero, 5 ritual cards, featured, founder, guides teaser, newsletter).
- Cleanup: noindex på thin pages identificeret i audit, fjern interne links til lavværdi-sider.
- Final QA-checklist kørt på tværs af site.

---

## Hvad jeg foreslår nu

Jeg starter med **Fase 0 (audit)** i næste tur — leverer rapporten og venter på din godkendelse før jeg rører kode. Det giver os et fælles overblik og sikrer at vi ikke bygger oven på antagelser (fx om `/pages/knivritualet` vs. `/ritualer/hold-kniven-skarp` URL-strukturen, eller om vi skal omdøbe eksisterende guides).

Sig til hvis du vil have jeg ændrer rækkefølgen, springer en fase over, eller bare kører Fase 0 + 1 først.