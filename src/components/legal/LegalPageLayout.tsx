import type { ReactNode } from "react";

export const COMPANY = {
  legalName: "JBR Freelance",
  brandName: "Langsomt Nok",
  cvr: "30782240",
  owner: "Jesper Brøchner Riel",
  addressLine: "Bøgevej 4",
  postalCity: "7160 Tørring",
  country: "Danmark",
  email: "hej@langsomtnok.dk",
  phone: "27 12 84 97",
  phoneInternational: "+45 27 12 84 97",
  website: "https://langsomtnok.dk",
};

export const UPDATED_AT = "11. maj 2026";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: COMPANY.legalName,
  alternateName: COMPANY.brandName,
  url: COMPANY.website,
  email: COMPANY.email,
  telephone: COMPANY.phoneInternational,
  taxID: `DK${COMPANY.cvr}`,
  vatID: `DK${COMPANY.cvr}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY.addressLine,
    postalCode: "7160",
    addressLocality: "Tørring",
    addressCountry: "DK",
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: COMPANY.brandName,
  url: COMPANY.website,
  publisher: {
    "@type": "Organization",
    name: COMPANY.legalName,
  },
};

export function LegalPageLayout({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-background pt-24 pb-20">
      <section className="section-padding">
        <article className="container-calm mx-auto max-w-[900px]">
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-muted-foreground/60">
            Sidst opdateret: {UPDATED_AT}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6">{title}</h1>
          {intro ? (
            <p className="text-editorial text-muted-foreground mb-10 max-w-2xl">
              {intro}
            </p>
          ) : null}
          <div className="space-y-9 text-muted-foreground text-editorial leading-relaxed">
            {children}
          </div>
          <ContactBlock />
        </article>
      </section>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3 border-t border-border/60 pt-7 first:border-t-0 first:pt-0">
      <h2 className="font-serif text-2xl text-foreground">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function CompanyDetails() {
  return (
    <address className="not-italic rounded-lg border border-border/60 bg-card/60 p-5 text-sm leading-7 text-muted-foreground">
      <strong className="block text-foreground">{COMPANY.brandName} drives af {COMPANY.legalName}</strong>
      CVR-nr.: {COMPANY.cvr}<br />
      Adresse: {COMPANY.addressLine}, {COMPANY.postalCity}, {COMPANY.country}<br />
      E-mail: <a className="text-cta hover:underline" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a><br />
      Telefon: <a className="text-cta hover:underline" href="tel:+4527128497">{COMPANY.phone}</a>
    </address>
  );
}

export function ContactBlock() {
  return (
    <div className="mt-12 rounded-xl border border-border/70 bg-card/70 p-6">
      <h2 className="font-serif text-2xl text-foreground mb-3">Kontakt</h2>
      <p className="text-sm text-muted-foreground leading-7">
        Har du spørgsmål til køb, levering, returnering eller reklamation, kan du altid skrive til
        {" "}
        <a className="text-cta hover:underline" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
        Vi svarer normalt inden for 1-2 hverdage.
      </p>
      <p className="mt-4 text-sm text-muted-foreground leading-7">
        {COMPANY.legalName}, CVR-nr. {COMPANY.cvr}<br />
        {COMPANY.addressLine}, {COMPANY.postalCity}, {COMPANY.country}<br />
        Telefon: <a className="text-cta hover:underline" href="tel:+4527128497">{COMPANY.phone}</a>
      </p>
    </div>
  );
}
