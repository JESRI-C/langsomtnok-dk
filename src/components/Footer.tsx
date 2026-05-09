import { Link } from "@tanstack/react-router";
import { trackEvent } from "@/lib/analytics";

const footerLinks = {
  shop: [
    { label: "Knive", to: "/collections/knive" },
    { label: "Slibesten", to: "/collections/slibesten" },
    { label: "Magnetiske holdere", to: "/collections/magnetiske-holdere" },
    { label: "Pleje & ritualer", to: "/collections/pleje-ritualer" },
  ],
  guides: [
    { label: "Knivvalg", to: "/guides" },
    { label: "Slibning", to: "/guides" },
    { label: "Pleje", to: "/guides" },
    { label: "Materialer", to: "/guides" },
  ],
  brand: [
    { label: "Om Langsomt Nok", to: "/om" },
    { label: "Langsomt Cirklen", to: "/cirklen" },
    { label: "Kontakt", to: "/kontakt" },
  ],
  legal: [
    { label: "Handelsbetingelser", to: "/handelsbetingelser" },
    { label: "Privatlivspolitik", to: "/privatlivspolitik" },
    { label: "Returpolitik", to: "/returpolitik" },
    { label: "Fragt", to: "/fragt" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-deep text-deep-foreground">
      <div className="container-calm section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl mb-4">Langsomt Nok</h2>
            <p className="text-deep-foreground/60 text-sm leading-relaxed max-w-sm mb-3">
              Køkkenredskaber skabt til dem, der ikke skynder sig gennem det vigtige. Træ, stål, olie, tid.
            </p>
            <p className="text-deep-foreground/40 text-xs italic tracking-wide">
              Langsomt Nok — Nordic calm meets crafted sharpness.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-deep-foreground/50 hover:text-deep-foreground transition-colors text-sm"
              >
                Instagram
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-deep-foreground/50 hover:text-deep-foreground transition-colors text-sm"
              >
                Pinterest
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium tracking-wider uppercase mb-4 text-deep-foreground/40">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-deep-foreground/60 hover:text-deep-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium tracking-wider uppercase mb-4 text-deep-foreground/40">Guides</h3>
            <ul className="space-y-3">
              {footerLinks.guides.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-deep-foreground/60 hover:text-deep-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium tracking-wider uppercase mb-4 text-deep-foreground/40">Brand</h3>
            <ul className="space-y-3">
              {footerLinks.brand.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-deep-foreground/60 hover:text-deep-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-3 mt-6">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-deep-foreground/40 hover:text-deep-foreground/60 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter in footer */}
        <div className="border-t border-deep-foreground/10 mt-16 pt-10">
          <div className="max-w-md mx-auto text-center mb-10">
            <h3 className="font-serif text-lg mb-3">Langsomt Brev</h3>
            <p className="text-sm text-deep-foreground/50 mb-4">
              Rolige breve om køkkenritualer, pleje og nye produkter.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                trackEvent('newsletter_signup_footer');
              }}
              className="flex gap-2"
            >
              <input
                type="email"
                placeholder="Din e-mail"
                required
                className="flex-1 h-10 px-3 rounded-md border bg-deep-foreground/5 border-deep-foreground/10 text-deep-foreground placeholder:text-deep-foreground/30 text-sm focus:outline-none focus:ring-2 focus:ring-cta/30"
              />
              <button
                type="submit"
                className="h-10 px-5 rounded-md bg-cta text-cta-foreground text-sm font-medium hover:bg-cta/90 transition-colors"
              >
                Tilmeld
              </button>
            </form>
            <p className="text-xs text-deep-foreground/25 mt-2">Ingen støj. Kun ro.</p>
          </div>
        </div>

        <div className="border-t border-deep-foreground/10 pt-8">
          <p className="text-sm text-deep-foreground/30 text-center">
            © {new Date().getFullYear()} Langsomt Nok. Tid. Håndværk. Ro.
          </p>
        </div>
      </div>
    </footer>
  );
}
