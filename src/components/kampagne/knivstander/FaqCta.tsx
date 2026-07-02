import { BuyButton } from "./BuyButton";
import { PriceBadge, PriceLine } from "./PriceBadge";

const faq = [
  {
    q: "Holder den knivene sikkert fast?",
    a: "Ja. Kraftige neodym-magneter holder knivene i ro — også når du bærer standeren fra køkken til terrasse.",
  },
  {
    q: "Passer den til alle knive?",
    a: "Den passer til alle almindelige køkkenknive med stålklinge. Keramiske knive er ikke magnetiske og passer ikke.",
  },
  {
    q: "Tåler den at stå ude?",
    a: "Den er lavet til at flytte med udenfor i tørt vejr. Lad den ikke stå ude i regn eller om natten — træet er behandlet med naturlig olie.",
  },
  {
    q: "Hvilket træ er den lavet af?",
    a: "Massiv valnød eller akacie. Du vælger træsort på Shopify, efter du klikker Køb nu.",
  },
];

export function FaqCta({ buyUrl }: { buyUrl: string }) {
  return (
    <section className="bg-[#F4F1EA] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-serif text-3xl md:text-4xl text-[#2D2D2D] text-center leading-tight">
          Spørgsmål
        </h2>
        <dl className="mt-12 divide-y divide-[#2D2D2D]/10 border-y border-[#2D2D2D]/10">
          {faq.map((f, i) => (
            <details key={i} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[#2D2D2D]">
                <dt className="font-serif text-lg md:text-xl leading-snug">{f.q}</dt>
                <span className="text-[#6E7B4F] text-xl transition-transform group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <dd className="mt-3 text-[#2D2D2D]/75 leading-relaxed text-base">{f.a}</dd>
            </details>
          ))}
        </dl>

        {/* Final CTA */}
        <div className="mt-20 flex flex-col items-center gap-6 text-center">
          <PriceBadge size="lg" />
          <h3 className="font-serif text-3xl md:text-4xl text-[#2D2D2D] leading-tight max-w-md">
            Tag den <em className="italic font-light text-[#6E7B4F]">med derud</em> i sommer
          </h3>
          <PriceLine className="text-[#2D2D2D]" />
          <BuyButton href={buyUrl} />
          <p className="text-xs text-[#2D2D2D]/50 max-w-xs">
            Vælg træsort (valnød eller akacie) på næste side.
          </p>
        </div>
      </div>
    </section>
  );
}
