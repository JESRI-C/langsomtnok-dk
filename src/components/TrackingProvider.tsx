import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { captureAttribution, trackPageViewBehavior } from "@/lib/tracking";
import { initMetaPixel, trackMetaPageView } from "@/lib/metaPixel";

/**
 * Mounts client-side tracking:
 *   • Captures UTM parameters and fbclid on first landing (first-touch).
 *   • Loads Meta Pixel base code (when VITE_META_PIXEL_ID is set).
 *   • Fires PageView + behavioral page_view on every SPA route change.
 */
export function TrackingProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    captureAttribution();
    initMetaPixel();
    // Initial page view (Meta base script already fires once; behavior layer too)
    trackPageViewBehavior(window.location.pathname);
  }, []);

  useEffect(() => {
    return router.subscribe("onResolved", () => {
      trackPageViewBehavior(window.location.pathname);
      trackMetaPageView();
    });
  }, [router]);

  return <>{children}</>;
}
