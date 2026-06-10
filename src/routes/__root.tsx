import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { Header } from "@/components/Header";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { TrackingProvider } from "@/components/TrackingProvider";
import { useCartSync } from "@/hooks/useCartSync";
import { organizationSchema, websiteSchema } from "@/components/legal/LegalPageLayout";
import { trackPageView } from "@/lib/analytics";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-serif text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-serif text-foreground">Siden blev ikke fundet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Den side, du leder efter, findes ikke eller er blevet flyttet.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-cta px-5 py-2.5 text-sm font-medium text-cta-foreground transition-colors hover:bg-cta/90"
          >
            Gå til forsiden
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-serif text-foreground">Noget gik galt</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Prøv at genindlæse siden eller gå tilbage til forsiden.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-lg bg-cta px-5 py-2.5 text-sm font-medium text-cta-foreground transition-colors hover:bg-cta/90"
          >
            Prøv igen
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Gå til forsiden
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Langsomt Nok — Tid. Håndværk. Ro." },
      { name: "description", content: "Køkkenredskaber skabt til dem, der ikke skynder sig gennem det vigtige." },
      { name: "author", content: "Langsomt Nok" },
      { property: "og:title", content: "Langsomt Nok — Tid. Håndværk. Ro." },
      { property: "og:description", content: "Køkkenredskaber skabt til dem, der ikke skynder sig gennem det vigtige." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Langsomt Nok" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@langsomtnok" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300..700&display=swap" },
    ],
    scripts: [
      {
        children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5JGH9QMN');`,
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(organizationSchema),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(websiteSchema),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <head>
        <HeadContent />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5JGH9QMN"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
    </QueryClientProvider>
  );
}

function AppShell() {
  useCartSync();
  const router = useRouter();

  // Track SPA page views on every route change
  useEffect(() => {
    return router.subscribe('onResolved', () => {
      trackPageView(window.location.pathname);
    });
  }, [router]);

  useEffect(() => {
    const SRC = "https://cdn.shopify.com/shopifycloud/shopify_chat/storefront/shopify_chat.js";
    if (document.querySelector(`script[src="${SRC}"]`)) {
      console.log("Shopify Inbox script already loaded");
      return;
    }
    const s = document.createElement("script");
    s.async = true;
    s.src = SRC;
    s.setAttribute("data-shop-id", "91572273488");
    s.onload = () => console.log("Shopify Inbox script loaded");
    s.onerror = () => console.error("Shopify Inbox script failed to load");
    document.body.appendChild(s);
  }, []);

  return (
    <TrackingProvider>
      <AnnouncementBar />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Toaster position="top-center" toastOptions={{ className: "font-sans" }} />
    </TrackingProvider>
  );
}
