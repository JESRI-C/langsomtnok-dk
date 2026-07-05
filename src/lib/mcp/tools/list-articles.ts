import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { ARTICLES, ARTICLE_CATEGORIES } from "@/lib/articles";

export default defineTool({
  name: "list_articles",
  title: "List guides & articles",
  description:
    "List Langsomt Nok's Danish guides and articles (kniv, keramik, ritualer). Optionally filter by category or keyword.",
  inputSchema: {
    category: z
      .string()
      .optional()
      .describe(`Optional category. One of: ${ARTICLE_CATEGORIES.join(", ")}.`),
    query: z.string().optional().describe("Optional keyword filter on title/excerpt."),
    limit: z.number().int().min(1).max(50).default(20),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category, query, limit }) => {
    const q = query?.toLowerCase();
    const items = ARTICLES.filter((a) => !category || a.category === category)
      .filter(
        (a) =>
          !q ||
          a.title.toLowerCase().includes(q) ||
          a.intro.toLowerCase().includes(q),
      )
      .slice(0, limit)
      .map((a) => ({
        slug: a.slug,
        title: a.title,
        category: a.category,
        excerpt: a.intro,
        url: `https://langsomtnok.dk/guides/${a.slug}`,
      }));
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { items },
    };
  },
});
