/**
 * Campaign SEO helper — builds head() meta + canonical link + JSON-LD scripts
 * for the four campaign landing pages.
 *
 * Used by:
 *   /gaver/fars-dag
 *   /ritualer/hold-kniven-skarp
 *   /ritualer/rolig-opbevaring
 *   /find-dit-ritual
 */

export const SITE_ORIGIN = "https://langsomtnok.dk";
export const SITE_NAME = "Langsomt Nok";

// Global fallback share image (Shopify CDN — absolute URL).
export const DEFAULT_OG_IMAGE =
  "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/ln-material-damascus-01.png?v=1778143706";

export interface BreadcrumbStep {
  name: string;
  url: string; // absolute
}

export interface ItemListEntry {
  name: string;
  url: string; // absolute or relative-resolved by caller
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface CampaignSeoArgs {
  pathname: string; // e.g. "/gaver/fars-dag"
  title: string;
  description: string;
  ogImage?: string; // absolute URL
  breadcrumbs: BreadcrumbStep[];
  itemList?: ItemListEntry[];
  itemListName?: string;
  faq?: FaqEntry[];
}

export function buildCampaignHead(args: CampaignSeoArgs) {
  const url = `${SITE_ORIGIN}${args.pathname}`;
  const ogImage = args.ogImage ?? DEFAULT_OG_IMAGE;

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: args.title,
    description: args.description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_ORIGIN,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: args.breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: b.url,
    })),
  };

  const scripts: Array<{ type: string; children: string }> = [
    { type: "application/ld+json", children: JSON.stringify(webPageLd) },
    { type: "application/ld+json", children: JSON.stringify(breadcrumbLd) },
  ];

  if (args.itemList && args.itemList.length > 0) {
    const itemListLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: args.itemListName ?? args.title,
      itemListElement: args.itemList.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        url: it.url,
      })),
    };
    scripts.push({ type: "application/ld+json", children: JSON.stringify(itemListLd) });
  }

  if (args.faq && args.faq.length > 0) {
    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: args.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    };
    scripts.push({ type: "application/ld+json", children: JSON.stringify(faqLd) });
  }

  return {
    meta: [
      { title: args.title },
      { name: "description", content: args.description },
      { property: "og:title", content: args.title },
      { property: "og:description", content: args.description },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: ogImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: args.title },
      { name: "twitter:description", content: args.description },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts,
  };
}
