import { defineMcp } from "@lovable.dev/mcp-js";
import searchProducts from "./tools/search-products";
import getProduct from "./tools/get-product";
import listArticles from "./tools/list-articles";

export default defineMcp({
  name: "langsomt-nok-mcp",
  title: "Langsomt Nok",
  version: "0.1.0",
  instructions:
    "Tools for Langsomt Nok — a Danish shop for calm, handmade kitchen tools and ceramics. Use `search_products` to find items in the Shopify catalog, `get_product` for details on a specific product handle, and `list_articles` to browse Danish guides and rituals.",
  tools: [searchProducts, getProduct, listArticles],
});
