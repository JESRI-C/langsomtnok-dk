import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * /universet/$slug er 301'et til den kanoniske /guides/$slug (SEO-cleanup).
 * /universet forbliver som ren oversigtsside der linker til guides.
 */
export const Route = createFileRoute("/universet_/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/guides/$slug",
      params: { slug: params.slug },
      replace: true,
    });
  },
});
