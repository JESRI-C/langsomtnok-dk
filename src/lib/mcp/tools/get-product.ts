import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { fetchProductsByHandles, formatPrice } from "@/lib/shopify";

export default defineTool({
  name: "get_product",
  title: "Get product by handle",
  description:
    "Fetch full details for a single Langsomt Nok product by its Shopify handle: title, description, price, variants, availability, and product URL.",
  inputSchema: {
    handle: z.string().min(1).describe("Shopify product handle, e.g. 'praecisionssliberen-valnoed'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ handle }) => {
    const [p] = await fetchProductsByHandles([handle]);
    if (!p) {
      return {
        content: [{ type: "text", text: `No product found for handle '${handle}'.` }],
        isError: true,
      };
    }
    const variants = p.node.variants.edges.map((e) => ({
      id: e.node.id,
      title: e.node.title,
      price: formatPrice(e.node.price.amount, e.node.price.currencyCode),
      available: e.node.availableForSale,
    }));
    const data = {
      title: p.node.title,
      handle: p.node.handle,
      url: `https://langsomtnok.dk/products/${p.node.handle}`,
      description: p.node.description,
      productType: p.node.productType,
      available: variants.some((v) => v.available),
      variants,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: data,
    };
  },
});
