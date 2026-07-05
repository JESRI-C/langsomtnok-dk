import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { fetchProductsByQuery, formatPrice } from "@/lib/shopify";

export default defineTool({
  name: "search_products",
  title: "Search products",
  description:
    "Search the Langsomt Nok Shopify catalog by keyword. Returns product title, handle, price, availability, and product URL.",
  inputSchema: {
    query: z.string().min(1).describe("Danish or English keyword, e.g. 'knivsliber' or 'keramik'."),
    limit: z.number().int().min(1).max(20).default(8),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ query, limit }) => {
    const products = await fetchProductsByQuery(query, limit);
    const items = products.map((p) => {
      const variant = p.node.variants.edges[0]?.node;
      return {
        title: p.node.title,
        handle: p.node.handle,
        url: `https://langsomtnok.dk/products/${p.node.handle}`,
        price: variant ? formatPrice(variant.price.amount, variant.price.currencyCode) : null,
        available: p.node.variants.edges.some((e) => e.node.availableForSale),
        productType: p.node.productType,
      };
    });
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { items },
    };
  },
});
