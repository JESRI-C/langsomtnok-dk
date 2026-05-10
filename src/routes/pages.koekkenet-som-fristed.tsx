import { createFileRoute, Link } from "@tanstack/react-router";
import { LandingPageHero } from "@/components/landing/LandingPageHero";
import { TrustBar } from "@/components/landing/TrustBar";
import { CalmCTASection } from "@/components/landing/CalmCTASection";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { ImageSlot } from "@/components/ImageSlot";

export const Route = createFileRoute("/pages/koekkenet-som-fristed")({
  head: () => ({
    meta: [
      { title: "Køkkenet som fristed — Langsomt Nok" },
      { name: "description", content: "Vores manifest. Køkkenet er ikke en arbejdsstation — det er et fristed. Knive, holdere, slibesten, keramik og gaver, der gør hverdagen langsommere." },
      { property: "og:title", content: "Køkkenet som fristed" },
      { property: "og:description", content: "Vores manifest og hele universet — knive, holdere, slibesten, keramik og gaver." },
    ],
  }),
  component: Page,
});

const categories = [
  { title: "Knive", desc: "Damaskus og oliventræ. Skarphed, der varer.", to: "/shop", slot: "category-knives" },
  { title: "Knivholdere", desc: "Magnetiske holdere i træ. Et hjem til kniven.", to: "/pages/knivholder-til-koekkenet", slot: "category-magnetic-holders" },
  { title: "Slibning", desc: "Sten, slibere og strop. Pleje frem for nyt.", to: "/pages/slibesten-guide", slot: "category-sharpening-stones" },
  { title: "Keramik", desc: "Hånddrejet af Susan Riel. Spor af hænder.", to: "/pages/haandlavet-keramik", slot: "ceramic-coffee" },
  { title: "Gaver", desc: "Indpakket i naturpapir. Brugt, ikke gemt væk.", to: "/pages/gaver-med-ro", slot: "category-gift-sets" },
];

function Page() {
  return (
    <div>
      <LandingPageHero
        headline="Køkkenet som fristed."
        subheadline="Et sted, hvor hænderne kan tænke. Hvor stål, træ og ler stadig betyder noget."
        primaryCta={{ label: "Begynd her", to: "/find-dit-ritual" }}
        secondaryCta={{ label: "Se udvalget", to: "/shop" }}
        imageSlot={{ name: "video_koekkenet_som_fristed", motif: "Hænder i et roligt køkken med kniv, brød og keramik", src: "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/IMG_6159.jpg?v=1773564091" }}
        variant="overlay"
      />

      <TrustBar />

      <section className="section-padding">
        <div className="container-calm max-w-3xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Manifest</h2>
          <div className="space-y-5 text-muted-foreground text-editorial">
            <p>Vi tror på, at de bedste ting er dem, der bruges hver dag. En kniv, der hviler i hånden. En kop, der varmer mere end kaffen. En sten, der genskaber skarpheden uden hast.</p>
            <p>Vi tror på langsomt håndværk frem for hurtigt forbrug. På materialer, der ældes — frem for slides. På et køkken, der er et fristed, ikke en arbejdsstation.</p>
            <p>Det er det, vi laver: ting til langsomme køkkener.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-soft">
        <div className="container-calm">
          <h2 className="font-serif text-2xl md:text-3xl mb-10 text-center">Universet</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((c) => (
              <Link key={c.title} to={c.to} className="cta-product-grid group block">
                <ImageSlot name={c.slot} ratio="4/5" motif={c.desc} variant="warm" className="mb-4" />
                <h3 className="font-serif text-xl mb-1 group-hover:text-walnut transition-colors">{c.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{c.desc}</p>
                <span className="text-sm font-medium text-cta">Udforsk →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-calm max-w-2xl text-center">
          <h2 className="font-serif text-2xl md:text-3xl mb-3">Langsomt Brev</h2>
          <p className="text-muted-foreground text-editorial mb-6">Et brev hver måned. Om ritualer, materialer og små stunder i køkkenet. Aldrig støj.</p>
          <NewsletterSignup variant="default" />
        </div>
      </section>

      <CalmCTASection
        headline="Træd ind i køkkenet."
        text="Find det ritual, der hører til dit hjem."
        cta={{ label: "Begynd her", to: "/find-dit-ritual" }}
        secondaryCta={{ label: "Se udvalget", to: "/shop" }}
        variant="warm"
      />
    </div>
  );
}
