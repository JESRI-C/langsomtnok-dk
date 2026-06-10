import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Legacy product URL. Canonical is /products/$handle.
 * Permanent client-side redirect preserves SEO link equity from old paths.
 */
export const Route = createFileRoute("/product/$handle")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/products/$handle",
      params: { handle: params.handle },
      replace: true,
    });
  },
});
