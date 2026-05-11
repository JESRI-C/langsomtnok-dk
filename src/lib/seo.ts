/**
 * SEO helpers — canonical URLs and shared schema fragments.
 * SITE_URL is the canonical domain used across the site, llms.txt and sitemap.xml.
 */
export const SITE_URL = "https://langsomtnok.dk";

/** Returns a TanStack Router head() link entry for canonical URL. */
export function canonical(path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return { rel: "canonical" as const, href: `${SITE_URL}${clean === "/" ? "" : clean}` };
}

/** Build a full absolute URL for a given path. */
export function absUrl(path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean === "/" ? "" : clean}`;
}

/** Common breadcrumb item helper for JSON-LD. */
export function breadcrumb(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absUrl(it.path),
    })),
  };
}

/** LocalBusiness/OnlineStore schema for kontakt page. */
export const onlineStoreSchema = {
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  name: "Langsomt Nok",
  url: SITE_URL,
  email: "hej@langsomtnok.dk",
  telephone: "+45 27 12 84 97",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Bøgevej 4",
    postalCode: "7160",
    addressLocality: "Tørring",
    addressCountry: "DK",
  },
  areaServed: "DK",
  currenciesAccepted: "DKK",
};
