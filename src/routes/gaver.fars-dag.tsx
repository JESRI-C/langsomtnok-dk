import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Sæsonen er slut — /gaver/fars-dag 301'er til den generiske gave-side.
 * Skift tema i src/lib/gift-occasion-theme.ts.
 */
export const Route = createFileRoute("/gaver/fars-dag")({
  beforeLoad: () => {
    throw redirect({ to: "/gaver/anledning", replace: true });
  },
});
