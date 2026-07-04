import { Link } from "@tanstack/react-router";
import { CreditCard, ShieldCheck, Package, RotateCcw } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { COMPANY } from "@/components/legal/LegalPageLayout";

const footerLinks = {
  shop: [
    { label: "Knive", to: "/collections/knive" },
    { label: "Slibesten", to: "/collections/slibesten" },
    { label: "Magnetiske holdere", to: "/collections/magnetiske-holdere" },
    { label: "Håndlavet keramik", to: "/keramik" },
    { label: "Pleje & ritualer", to: "/collections/pleje-ritualer" },
  ],
  guides: [
    { label: "Knivvalg", to: "/guides" },
    { label: "Slibning", to: "/guides" },
    { label: "Pleje", to: "/guides" },
    { label: "Materialer", to: "/guides" },
  ],
  rituals: [
    { label: "Universet", href: "/universet" },
    { label: "Farsdagsgaver", href: "/gaver/fars-dag" },
    { label: "Hold din kniv skarp", href: "/ritualer/hold-kniven-skarp" },
    { label: "Rolig opbevaring", href: "/ritualer/rolig-opbevaring" },
    { label: "Find dit køkkenritual", href: "/find-dit-ritual" },
  ],
  brand: [
    { label: "Om Langsomt Nok", to: "/om" },
    { label: "Langsomt Cirklen", to: "/cirklen" },
    { label: "Kontakt", to: "/kontakt" },
  ],
  legal: [
    { label: "Kontakt", href: "/kontakt" },
    { label: "Handelsbetingelser", href: "/handelsbetingelser" },
    { label: "Privatlivspolitik", href: "/privatlivspolitik" },
    { label: "Cookiepolitik", href: "/cookiepolitik" },
    { label: "Returnering og fortrydelse", href: "/returpolitik" },
    { label: "Fortryd aftale", href: "/fortryd-aftale" },
    { label: "Levering", href: "/fragt" },
    { label: "Reklamation", href: "/reklamation" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-deep text-deep-foreground">
      <div className="container-calm section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl mb-4">Langsomt Nok</h2>
            <p className="text-deep-foreground/65 text-sm leading-relaxed max-w-sm mb-4">
              Køkkenredskaber og keramik skabt til dem, der ikke skynder sig gennem det vigtige. Træ, stål, olie, tid.
            </p>
            <p className="text-deep-foreground/55 text-sm mb-3">
              Spørgsmål til et produkt? Skriv til{" "}
              <a href={`mailto:${COMPANY.email}`} className="text-deep-foreground underline-offset-4 hover:underline">
                {COMPANY.email}
              </a>
              {" "}— vi svarer roligt og hurtigt.
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

            <div className="mt-8 pt-6 border-t border-deep-foreground/10 max-w-sm">
              <h3 className="text-sm font-medium tracking-wider uppercase mb-3 text-deep-foreground/40">
                Juridisk information
              </h3>
              <p className="text-sm text-deep-foreground/60 leading-relaxed mb-4">
                Langsomt Nok drives af {COMPANY.legalName} - en dansk virksomhed med fokus på ro, håndværk og brugbare produkter til hjemmet.
              </p>
              <address className="not-italic text-xs text-deep-foreground/45 leading-6">
                {COMPANY.legalName}<br />
                CVR-nr.: {COMPANY.cvr}<br />
                {COMPANY.addressLine}, {COMPANY.postalCity}, {COMPANY.country}<br />
                E-mail: <a href={`mailto:${COMPANY.email}`} className="hover:text-deep-foreground transition-colors">{COMPANY.email}</a><br />
                Telefon: <a href="tel:+4527128497" className="hover:text-deep-foreground transition-colors">{COMPANY.phone}</a>
              </address>
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
            <h3 className="text-sm font-medium tracking-wider uppercase mb-4 text-deep-foreground/40">Ritualer og gaver</h3>
            <ul className="space-y-3">
              {footerLinks.rituals.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-deep-foreground/60 hover:text-deep-foreground transition-colors"
                  >
                    {link.label}
                  </a>
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
            <h3 className="text-sm font-medium tracking-wider uppercase mt-8 mb-4 text-deep-foreground/40">Vilkår</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-deep-foreground/40 hover:text-deep-foreground/60 transition-colors">
                    {link.label}
                  </a>
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

        {/* Tryg betaling */}
        <div className="border-t border-deep-foreground/10 pt-8 pb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-sm font-medium tracking-wider uppercase mb-3 text-deep-foreground/40">Tryg betaling</h3>
            <p className="text-sm text-deep-foreground/60 leading-relaxed mb-5 max-w-md mx-auto">
              Betal sikkert med kort og de betalingsmuligheder, der vises i checkout.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-deep-foreground/50">
              <span className="inline-flex items-center gap-2 text-xs">
                <CreditCard className="w-4 h-4 text-cta" strokeWidth={1.5} />
                Kort
              </span>
              <span className="inline-flex items-center gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-cta" strokeWidth={1.5} />
                Sikker betaling
              </span>
              <span className="inline-flex items-center gap-2 text-xs">
                <Package className="w-4 h-4 text-cta" strokeWidth={1.5} />
                Pakket med omhu
              </span>
              <span className="inline-flex items-center gap-2 text-xs">
                <RotateCcw className="w-4 h-4 text-cta" strokeWidth={1.5} />
                30 dages returret
              </span>
            </div>
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
