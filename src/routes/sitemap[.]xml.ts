import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { ARTICLES } from "@/lib/articles";

const BASE_URL = "https://langsomtnok.dk";
const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN ?? "";
const SHOPIFY_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "";

interface Entry {
  path: string;
  priority?: string;
}

const STATIC_ENTRIES: Entry[] = [
  { path: "/", priority: "1.0" },
  { path: "/shop", priority: "0.9" },

  { path: "/collections/knive", priority: "0.8" },
  { path: "/collections/slibesten", priority: "0.8" },
  { path: "/collections/slibning-pleje", priority: "0.8" },
  { path: "/collections/pleje-ritualer", priority: "0.7" },
  { path: "/collections/magnetiske-holdere", priority: "0.8" },
  { path: "/collections/gaver", priority: "0.8" },
  { path: "/collections/handlavet-keramik", priority: "0.9" },
  { path: "/collections/susan-riel", priority: "0.8" },
  { path: "/collections/keramikkopper", priority: "0.8" },
  { path: "/collections/keramikskale", priority: "0.8" },
  { path: "/collections/keramikvaser", priority: "0.8" },
  { path: "/collections/keramikunika", priority: "0.8" },

  { path: "/keramik", priority: "0.8" },
  { path: "/keramik/susan-riel", priority: "0.7" },
  { path: "/guides", priority: "0.7" },
  { path: "/cirklen", priority: "0.7" },
  { path: "/om", priority: "0.6" },
  { path: "/kontakt", priority: "0.6" },

  { path: "/pages/damaskus-kniv", priority: "0.7" },
  { path: "/pages/den-forste-rigtige-kokkekniv", priority: "0.7" },
  { path: "/pages/gave-til-madelskeren", priority: "0.7" },
  { path: "/pages/gaver-med-ro", priority: "0.7" },
  { path: "/pages/haandlavet-keramik", priority: "0.8" },
  { path: "/pages/hvilken-knivholder-skal-jeg-vaelge", priority: "0.7" },
  { path: "/pages/knivholder-i-trae", priority: "0.7" },
  { path: "/pages/knivholder-til-koekkenet", priority: "0.7" },
  { path: "/pages/koekkenet-som-fristed", priority: "0.7" },
  { path: "/pages/saadan-sliber-du-din-kniv", priority: "0.7" },
  { path: "/pages/sadan-holder-du-din-kniv-skarp", priority: "0.7" },
  { path: "/pages/slibesten-guide", priority: "0.7" },
  { path: "/pages/sommerbord-med-keramik", priority: "0.7" },

  { path: "/find-dit-ritual", priority: "0.8" },
  { path: "/ritualer/hold-kniven-skarp", priority: "0.8" },
  { path: "/ritualer/rolig-opbevaring", priority: "0.8" },
  { path: "/gaver/fars-dag", priority: "0.8" },
  { path: "/universet", priority: "0.9" },

  { path: "/handelsbetingelser", priority: "0.4" },
  { path: "/privatlivspolitik", priority: "0.4" },
  { path: "/cookiepolitik", priority: "0.4" },
  { path: "/returpolitik", priority: "0.4" },
  { path: "/fragt", priority: "0.4" },
  { path: "/reklamation", priority: "0.4" },
];

async function fetchProductHandles(): Promise<string[]> {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) return [];
  try {
    const url = `https://${SHOPIFY_DOMAIN}/api/2025-07/graphql.json`;
    const handles: string[] = [];
    let cursor: string | null = null;
    for (let i = 0; i < 10; i++) {
      const query = `query Handles($cursor: String) {
        products(first: 250, after: $cursor) {
          edges { cursor node { handle } }
          pageInfo { hasNextPage }
        }
      }`;
      const res: Response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
        },
        body: JSON.stringify({ query, variables: { cursor } }),
      });
      if (!res.ok) break;
      const json: any = await res.json();
      const edges = json?.data?.products?.edges ?? [];
      for (const e of edges) handles.push(e.node.handle);
      if (!json?.data?.products?.pageInfo?.hasNextPage) break;
      cursor = edges[edges.length - 1]?.cursor ?? null;
      if (!cursor) break;
    }
    return handles;
  } catch {
    return [];
  }
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const productHandles = await fetchProductHandles();

        const entries: Entry[] = [
          ...STATIC_ENTRIES,
          ...ARTICLES.map((a) => ({ path: `/universet/${a.slug}`, priority: "0.7" })),
          ...ARTICLES.map((a) => ({ path: `/guides/${a.slug}`, priority: "0.6" })),
          ...productHandles.map((h) => ({ path: `/product/${h}`, priority: "0.7" })),
        ];

        const seen = new Set<string>();
        const urls = entries
          .filter((e) => {
            if (seen.has(e.path)) return false;
            seen.add(e.path);
            return true;
          })
          .map((e) =>
            [
              `  <url>`,
              `    <loc>${BASE_URL}${e.path}</loc>`,
              e.priority ? `    <priority>${e.priority}</priority>` : null,
              `  </url>`,
            ]
              .filter(Boolean)
              .join("\n"),
          );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
