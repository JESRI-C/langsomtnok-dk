import { BuyButton } from "./BuyButton";
import { PriceBadge, PriceLine } from "./PriceBadge";
import heroImg from "@/assets/knivstander/IMG_1308.jpg.asset.json";

export function Hero({ buyUrl }: { buyUrl: string }) {
  return (
    <section className="relative w-full overflow-hidden bg-[#F4F1EA]">
      <div className="relative h-[92vh] min-h-[600px] w-full">
        <img
          src={heroImg.url}
          alt="Magnetisk knivstander i massivt træ på en sommerterrasse med krukker af krydderurter"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Dark gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Badge */}
        <div className="absolute right-5 top-5 md:right-10 md:top-10">
          <PriceBadge size="lg" />
        </div>

        {/* Copy */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-10 md:px-16 md:pb-16 text-[#F4F1EA]">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl leading-[1.05] md:text-6xl md:leading-[1.02]">
              Tag din <em className="italic font-light">skarpe</em> kniv med derud
            </h1>
            <p className="mt-5 max-w-md text-base md:text-lg text-[#F4F1EA]/85 leading-relaxed">
              En magnetisk knivstander i massivt træ, der flytter med — terrasse, sommerhus, grill. Ingen skruer, ingen væg.
            </p>
            <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center">
              <PriceLine className="text-[#F4F1EA]" />
              <BuyButton href={buyUrl} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
