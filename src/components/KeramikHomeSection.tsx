import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ImageSlot } from "@/components/ImageSlot";

/**
 * Forside-sektion for "Håndlavet keramik".
 * Rolig, lys, taktil — 2-kolonne på desktop, stack på mobil.
 */
export function KeramikHomeSection() {
  return (
    <section className="section-padding bg-soft/60">
      <div className="container-calm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Tekst */}
          <div className="max-w-lg">
            <span className="text-[11px] tracking-[0.25em] uppercase text-copper">
              Ny kategori
            </span>
            <h2 className="font-serif text-3xl md:text-5xl mt-3 mb-5 leading-tight">
              Håndlavet keramik
            </h2>
            <p className="text-editorial text-foreground/70 mb-4 leading-relaxed">
              Keramik skabt i hænder. Til rolige morgener, små serveringer og
              hverdage, der gerne må gå lidt langsommere.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              Hver kop, skål og vase bærer spor af ler, glasur og tid. Nogle
              værker findes kun i ét eksemplar. Når de er solgt, forsvinder de
              stille videre til et nyt hjem.
            </p>
            <Link
              to="/collections/$handle"
              params={{ handle: "handlavet-keramik" }}
              className="inline-flex items-center gap-2 rounded-md bg-cta text-cta-foreground px-7 py-3.5 text-sm font-medium tracking-wide hover:bg-[#3F4B3D] transition-colors duration-500"
              data-track="keramik_home_cta"
            >
              Udforsk keramikken
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Billede */}
          <div className="order-first md:order-last">
            <div className="rounded-lg overflow-hidden bg-linen">
              <ImageSlot
                name="keramik-hero-home"
                ratio="4/5"
                src="https://cdn.shopify.com/s/files/1/0915/7227/3488/files/Keramik_paa_hylde.png?v=1778397388"
                motif="Stilleben af håndlavet stentøjsskål og kop på linned i blødt morgenlys, rolige nordiske toner"
                alt="Håndlavet keramik fra Langsomt Nok"
                variant="warm"
                className="rounded-none"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
