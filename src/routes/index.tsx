import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-kitchen.jpg";
import materialSteel from "@/assets/material-steel.jpg";
import materialWalnut from "@/assets/material-walnut.jpg";
import materialOlive from "@/assets/material-olive.jpg";
import materialStone from "@/assets/material-stone.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Langsomt Nok — Tid. Håndværk. Ro." },
      { name: "description", content: "Køkkenredskaber skabt til dem, der ikke skynder sig gennem det vigtige. Knive, slibesten, holdere og plejeritualer." },
      { property: "og:title", content: "Langsomt Nok — Tid. Håndværk. Ro." },
      { property: "og:description", content: "Køkkenredskaber skabt til dem, der ikke skynder sig gennem det vigtige." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    storefrontApiRequest(PRODUCTS_QUERY, { first: 6 })
      .then((data) => {
        if (data?.data?.products?.edges) {
          setProducts(data.data.products.edges);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Nordisk køkken med kniv på valnødskærebræt" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-r from-deep/70 via-deep/40 to-transparent" />
        </div>
        <div className="container-calm relative z-10 pt-20">
          <div className="max-w-xl">
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-deep-foreground leading-[0.95] mb-6">
              Tid.<br />Håndværk.<br />Ro.
            </h1>
            <p className="text-lg md:text-xl text-deep-foreground/70 leading-relaxed mb-10 max-w-md">
              Køkkenredskaber skabt til dem, der ikke skynder sig gennem det vigtige.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" asChild>
                <Link to="/shop">Udforsk ritualerne</Link>
              </Button>
              <Button variant="hero-outline" className="border-deep-foreground/30 text-deep-foreground hover:bg-deep-foreground/10" asChild>
                <Link to="/shop">Find dit første værktøj</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Manifest */}
      <section className="section-padding bg-soft">
        <div className="container-calm text-center max-w-3xl mx-auto">
          <p className="font-serif text-2xl md:text-4xl leading-relaxed mb-6 text-walnut">
            Træ, stål, olie, tid.
          </p>
          <p className="font-serif text-xl md:text-2xl text-copper mb-8">
            Fire elementer. Ét formål.
          </p>
          <p className="text-editorial mx-auto text-muted-foreground">
            Langsomt Nok er skabt til køkkenet som fristed. Til hænder, der mærker forskellen. Til måltider, der gerne må tage lidt længere tid.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding">
        <div className="container-calm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Knive", desc: "Hvert snit fortæller en historie om stål og tålmodighed.", to: "/collections/knive", img: materialSteel },
              { title: "Slibesten", desc: "Giv bladet nyt liv. Langsomt og med omtanke.", to: "/collections/slibesten", img: materialStone },
              { title: "Magnetiske holdere", desc: "Træ møder stål. Ophæng med sjæl.", to: "/collections/magnetiske-holdere", img: materialWalnut },
              { title: "Pleje & ritualer", desc: "Forlæng glæden. Olie, voks og nærvær.", to: "/collections/pleje-ritualer", img: materialOlive },
            ].map((cat) => (
              <Link key={cat.title} to={cat.to} className="group block">
                <div className="aspect-[3/4] rounded-lg overflow-hidden mb-4 bg-linen">
                  <img src={cat.img} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                </div>
                <h3 className="font-serif text-xl mb-1 group-hover:text-walnut transition-colors">{cat.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{cat.desc}</p>
                <span className="text-sm font-medium text-cta">Udforsk →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Find dit køkkenritual */}
      <section className="section-padding bg-linen">
        <div className="container-calm">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">Find dit køkkenritual</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Jeg vil starte rigtigt", desc: "De vigtigste redskaber til et godt fundament.", icon: "🔪" },
              { title: "Jeg vil pleje det, jeg har", desc: "Olie, sten og teknikker til vedligehold.", icon: "🫧" },
              { title: "Jeg leder efter en gave", desc: "Gaver der varer længere end én aften.", icon: "🎁" },
              { title: "Jeg vil samle et helt ritual", desc: "Det komplette sæt for den dedikerede.", icon: "✨" },
            ].map((choice) => (
              <Link
                key={choice.title}
                to="/shop"
                className="group p-6 rounded-lg bg-background hover:shadow-md transition-all duration-300 border border-border/50"
              >
                <span className="text-2xl mb-4 block">{choice.icon}</span>
                <h3 className="font-serif text-lg mb-2 group-hover:text-walnut transition-colors">{choice.title}</h3>
                <p className="text-sm text-muted-foreground">{choice.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding">
        <div className="container-calm">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl">Udvalgte redskaber</h2>
              <p className="text-muted-foreground mt-2">Skabt til dem, der mærker forskellen.</p>
            </div>
            <Link to="/shop" className="text-sm font-medium text-cta hover:text-cta/80 hidden md:flex items-center gap-1">
              Se alle <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.slice(0, 3).map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">Indlæser produkter...</p>
          )}
        </div>
      </section>

      {/* Materials */}
      <section className="section-padding bg-deep text-deep-foreground">
        <div className="container-calm">
          <h2 className="font-serif text-3xl md:text-4xl mb-4 text-center">Materialerne bag ritualet</h2>
          <p className="text-center text-deep-foreground/50 mb-12 max-w-lg mx-auto">Hvert materiale er valgt med omtanke. Ingen tilfældigheder.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Damascus stål", desc: "Lag på lag af stål smedet til ét formål: et snit der holder.", img: materialSteel },
              { title: "Valnøddetræ", desc: "Varme og dybde i hvert greb. Ældes smukt med tiden.", img: materialWalnut },
              { title: "Oliventræ", desc: "Blødere i hånden. Levende i sit mønster. Naturens egen kunst.", img: materialOlive },
              { title: "Slibesten", desc: "Tålmodighedens redskab. Langsomt giver den bladet nyt liv.", img: materialStone },
            ].map((mat) => (
              <div key={mat.title} className="group">
                <div className="aspect-square rounded-lg overflow-hidden mb-4">
                  <img src={mat.img} alt={mat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                </div>
                <h3 className="font-serif text-lg mb-1">{mat.title}</h3>
                <p className="text-sm text-deep-foreground/50">{mat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundles */}
      <section className="section-padding">
        <div className="container-calm">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-3">Sæt ro sammen</h2>
          <p className="text-center text-muted-foreground mb-12">Sammensatte ritualer for det komplette køkken.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Ritual Startkit", desc: "Det første skridt mod et roligere køkken. Kniv, bræt og plejeolie.", price: "Fra 1.499 kr" },
              { title: "Craft & Care", desc: "Slibesten, plejeolie og guide. Alt hvad du behøver for vedligehold.", price: "Fra 899 kr" },
              { title: "Full Focus Set", desc: "Det komplette ritual. Knive, sten, holdere og pleje samlet.", price: "Fra 3.499 kr" },
            ].map((bundle) => (
              <Link key={bundle.title} to="/shop" className="group block p-8 rounded-lg border border-border bg-soft/30 hover:shadow-md transition-all duration-300">
                <div className="aspect-video rounded-md bg-linen mb-6 flex items-center justify-center">
                  <span className="font-serif text-2xl text-muted-foreground/30">Langsomt Nok</span>
                </div>
                <h3 className="font-serif text-xl mb-2 group-hover:text-walnut transition-colors">{bundle.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{bundle.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{bundle.price}</span>
                  <span className="text-sm text-cta">Se sættet →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cirklen Teaser */}
      <section className="section-padding bg-linen">
        <div className="container-calm text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl mb-4">
            Et stille fællesskab for dem, der tror på tid.
          </h2>
          <p className="text-editorial mx-auto text-muted-foreground mb-8">
            Langsomt Cirklen er vores rum for guides, ritualer, historier og små breve fra køkkenet.
          </p>
          <Button variant="cta" size="lg" asChild>
            <Link to="/cirklen">Bliv en del af Cirklen</Link>
          </Button>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSignup />
    </div>
  );
}
