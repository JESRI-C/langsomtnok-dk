import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Check, Truck, ShieldCheck, Headphones, RotateCcw } from "lucide-react";
import heroImg from "@/assets/knivstander/IMG_1308.jpg.asset.json";
import angleImg from "@/assets/knivstander/IMG_1309.jpg.asset.json";
import fullImg from "@/assets/knivstander/IMG_1310.jpg.asset.json";
import closeImg from "@/assets/knivstander/IMG_1311.jpg.asset.json";
import singleImg from "@/assets/knivstander/IMG_1312.jpg.asset.json";
import terraceImg from "@/assets/knivstander/IMG_1313.jpg.asset.json";
import walnutImg from "@/assets/knivstander/IMG_1314.jpg.asset.json";
import { FAQAccordion } from "@/components/landing/FAQAccordion";
import { buildFaqSchemaScript } from "@/lib/faq-schema";

/* ─────────────────────────────────────────────────────────────
   SHOPIFY LINKS — paste your real cart permalinks here.
   Format: https://[dinbutik].myshopify.com/cart/[VARIANT_ID]:1
   Or use a plain product URL. One per variant.
   ───────────────────────────────────────────────────────────── */
const SHOPIFY_LINKS = {
  walnut:
    "https://aqwut5-0n.myshopify.com/products/magnetic-knife-display-stand-walnut",
  acacia:
    "https://aqwut5-0n.myshopify.com/products/magnetic-knife-display-stand-acacia",
} as const;

const PRICE_NOW = 399;
const PRICE_BEFORE = 699;
const DISCOUNT_PCT = 43;

const FAQ_ITEMS = [
  {
    question: "Holder magneten knivene sikkert fast?",
    answer:
      "Ja. Neodym-magneterne er stærke nok til at bære en tung kokkekniv uden at den glider. Løft kniven af — lad den ikke skrabe hen over træet.",
  },
  {
    question: "Passer den til alle mine knive?",
    answer:
      "Næsten alle køkkenknive indeholder nok jern til at hænge magnetisk — også de fleste rustfri. Standeren holder 4–6 knive alt efter størrelse.",
  },
  {
    question: "Kan den stå ude på terrassen eller i sommerhuset?",
    answer:
      "Ja, i tørvejr. Træet er olieret og tåler at være ude, mens du laver mad. Tag den ind om natten og i regn, så holder den i mange år.",
  },
  {
    question: "Hvilket træ er det?",
    answer:
      "Nattely er massiv valnød med dyb, rolig farve. Stille Stand er massiv akacie med lysere, varmere åretegning. Begge er håndolierede.",
  },
  {
    question: "Skal jeg bore eller montere noget?",
    answer:
      "Nej. Standeren står frit på bordpladen på sin rustfri stålfod. Ingen skruer, ingen huller, ingen montering.",
  },
];

export const Route = createFileRoute("/kampagne/magnetisk-knivstander")({
  head: () => ({
    meta: [
      { title: "Magnetisk knivstander — 399 kr (før 699) · Langsomt Nok" },
      {
        name: "description",
        content:
          "Massiv valnød eller akacie. Fri stander — ingen montering. Tag den skarpe kniv med i sommerhuset. Sommerferie-pris 399 kr.",
      },
      { property: "og:title", content: "Magnetisk knivstander — sommerferie-pris 399 kr" },
      {
        property: "og:description",
        content: "Fri stander i massivt træ. Tag den skarpe kniv med derud, hvor du laver mad.",
      },
      { property: "og:image", content: heroImg.url },
    ],
    scripts: [buildFaqSchemaScript(FAQ_ITEMS)],
  }),
  component: Page,
});

type Variant = "walnut" | "acacia";

const VARIANTS: Record<Variant, { name: string; wood: string; image: string; alt: string }> = {
  walnut: {
    name: "Nattely",
    wood: "Massiv valnød",
    image: walnutImg.url,
    alt: "Magnetisk knivstander i massiv valnød med damaskus-kniv, urter i baggrunden",
  },
  acacia: {
    name: "Stille Stand",
    wood: "Massiv akacie",
    image: singleImg.url,
    alt: "Magnetisk knivstander i akacie med olietræs-håndteret kniv på terrasse",
  },
};

function Page() {
  const [variant, setVariant] = useState<Variant>("acacia");
  const buyUrl = SHOPIFY_LINKS[variant];

  return (
    <div className="bg-[#F4F1EA] text-foreground">
      {/* ── HERO ────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="container-calm max-w-6xl px-5 pt-10 pb-14 md:pt-20 md:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="order-2 md:order-1">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#6E7B4F] mb-5">
                Sommerferie hos Langsomt Nok
              </p>
              <h1 className="font-serif text-[2.1rem] leading-[1.08] md:text-[3.4rem] md:leading-[1.05] text-[#2D2D2D]">
                Sommerhusets knive
                <br />
                <em className="italic text-[#5A3B2E]">er altid de sløveste.</em>
              </h1>
              <p className="mt-5 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
                Tag den skarpe kniv med derud. En fri stander i massivt træ — flytter fra
                køkkenbordet til terrassen, til grillen, til sommerhuset.
              </p>

              <div className="mt-8 flex items-baseline gap-4">
                <span className="font-serif text-4xl md:text-5xl text-[#2D2D2D]">
                  {PRICE_NOW} kr
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  {PRICE_BEFORE} kr
                </span>
              </div>

              <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:items-center">
                <a
                  href={buyUrl}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#6E7B4F] px-8 py-4 text-base font-medium text-white shadow-md transition hover:bg-[#5c6842] hover:shadow-lg"
                >
                  Køb nu — {PRICE_NOW} kr
                </a>
                <a
                  href="#varianter"
                  className="text-sm font-medium text-[#5A3B2E] underline underline-offset-4 hover:no-underline text-center sm:text-left"
                >
                  Vælg valnød eller akacie ↓
                </a>
              </div>

              <ul className="mt-8 grid grid-cols-2 gap-y-2 gap-x-6 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#6E7B4F]" strokeWidth={2} /> Fri levering i DK</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#6E7B4F]" strokeWidth={2} /> Ingen montering</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#6E7B4F]" strokeWidth={2} /> Massivt træ</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#6E7B4F]" strokeWidth={2} /> 1–3 hverdage</li>
              </ul>
            </div>

            <div className="order-1 md:order-2 relative">
              <div className="absolute -top-3 -right-3 md:-top-5 md:-right-5 z-10 w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#6E7B4F] text-white flex flex-col items-center justify-center shadow-lg">
                <span className="font-serif text-2xl md:text-3xl leading-none">−{DISCOUNT_PCT}%</span>
                <span className="text-[10px] uppercase tracking-[0.2em] mt-1">Sommer</span>
              </div>
              <div className="aspect-[4/5] overflow-hidden rounded-[20px] bg-[#E6E0D7]">
                <img
                  src={heroImg.url}
                  alt="Magnetisk knivstander i træ på sommerterrasse med mynte og citronmelisse"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST ROW ────────────────────────────────────── */}
      <section className="border-y border-[#E6E0D7] bg-[#EFEAE0]">
        <div className="container-calm max-w-6xl px-5 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <TrustItem icon={Truck} label="Fri fragt i DK" />
            <TrustItem icon={ShieldCheck} label="Tilfredshedsgaranti" />
            <TrustItem icon={Headphones} label="Dansk kundeservice" />
            <TrustItem icon={RotateCcw} label="30 dages retur" />
          </div>
        </div>
      </section>

      {/* ── 5 ANGLES: PROBLEM → SOLUTION ─────────────────── */}
      <section className="section-padding">
        <div className="container-calm max-w-5xl px-5">
          <div className="max-w-2xl mb-14">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#6E7B4F] mb-3">
              Hvorfor en fri stander
            </p>
            <h2 className="font-serif text-3xl md:text-4xl leading-[1.15] text-[#2D2D2D]">
              En vægliste bliver hjemme. <em className="italic text-[#5A3B2E]">Den her flytter med.</em>
            </h2>
          </div>

          <div className="space-y-16 md:space-y-20">
            <Angle
              n="01"
              title="Sommerhusets knive er altid de sløveste"
              body="Skuffeknive, feriegryder, en gammel brødkniv. Tag din egen skarpe kniv med — og giv den et sted at høre til, mens du er der."
              image={terraceImg.url}
              alt="Knivstander med enkelt kniv på sommerterrasse, urtekrukker i baggrunden"
              reverse={false}
            />
            <Angle
              n="02"
              title="En vægliste bliver hængende hjemme"
              body="Standeren står frit på bordpladen. Den følger med i bilen, ud på terrassen, hen til grillen — og hjem igen."
              image={fullImg.url}
              alt="Fritstående magnetisk knivstander med fire knive på bordplade udendørs"
              reverse
            />
            <Angle
              n="03"
              title="Sløve knive glider — og bliver farlige ved grillen"
              body="En skarp kniv er en sikker kniv. Når bladet bider, behøver du ikke presse. Færre uheld, roligere hænder."
              image={closeImg.url}
              alt="Nærbillede af skarpe knive fastholdt magnetisk på træstander"
              reverse={false}
            />
            <Angle
              n="04"
              title="Fra urtekrukke til skærebræt på ét skridt"
              body="Kniven står, hvor du laver mad. Grib, snit, læg tilbage. Ingen skuffer, ingen leden, ingen afbrydelser."
              image={singleImg.url}
              alt="Enkelt kniv med olietræshåndtag i akaciestander ved urtekrukker"
              reverse
            />
            <Angle
              n="05"
              title="Ingen skruer. Ingen montering. Ingen huller."
              body="Sæt den på bordpladen. Færdig. Ingen boremaskine, ingen dybler — og ingen aftryk, når du tager den med et andet sted hen."
              image={angleImg.url}
              alt="Magnetisk knivstander set fra siden med rustfri stålfod"
              reverse={false}
            />
          </div>
        </div>
      </section>

      {/* ── VARIANT SELECTOR ─────────────────────────────── */}
      <section id="varianter" className="section-padding bg-[#EFEAE0]">
        <div className="container-calm max-w-5xl px-5">
          <div className="text-center max-w-xl mx-auto mb-10">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#6E7B4F] mb-3">
              Vælg dit træ
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#2D2D2D]">
              To standere. <em className="italic text-[#5A3B2E]">Samme ro.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {(Object.keys(VARIANTS) as Variant[]).map((key) => {
              const v = VARIANTS[key];
              const active = variant === key;
              return (
                <button
                  key={key}
                  onClick={() => setVariant(key)}
                  className={`text-left rounded-[18px] overflow-hidden border-2 transition-all bg-[#F4F1EA] ${
                    active
                      ? "border-[#6E7B4F] shadow-lg"
                      : "border-transparent hover:border-[#D7CDBA]"
                  }`}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[#E6E0D7]">
                    <img src={v.image} alt={v.alt} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="font-serif text-2xl text-[#2D2D2D]">{v.name}</h3>
                      {active && (
                        <span className="text-xs uppercase tracking-[0.2em] text-[#6E7B4F]">Valgt</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{v.wood}</p>
                    <div className="flex items-baseline gap-3">
                      <span className="font-serif text-2xl text-[#2D2D2D]">{PRICE_NOW} kr</span>
                      <span className="text-sm text-muted-foreground line-through">{PRICE_BEFORE} kr</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <a
              href={buyUrl}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#6E7B4F] px-10 py-4 text-base font-medium text-white shadow-md transition hover:bg-[#5c6842] hover:shadow-lg"
            >
              Køb {VARIANTS[variant].name} — {PRICE_NOW} kr
            </a>
            <p className="mt-3 text-xs text-muted-foreground">Du sendes direkte til vores sikre Shopify-butik</p>
          </div>
        </div>
      </section>

      {/* ── HONEST NOTE ──────────────────────────────────── */}
      <section className="py-14">
        <div className="container-calm max-w-2xl px-5 text-center">
          <p className="font-serif text-lg md:text-xl italic text-[#5A3B2E] leading-relaxed">
            «En ærlig ting: Det er en bordstander — ikke en vægliste. Det er hele pointen. Den flytter
            med dig derhen, hvor du laver mad.»
          </p>
        </div>
      </section>

      {/* ── SOCIAL PROOF (placeholders) ──────────────────── */}
      <section className="section-padding bg-[#EFEAE0]">
        <div className="container-calm max-w-5xl px-5">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#A67C52] text-[#A67C52]" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              [Placeholder: gennemsnitlig rating og antal reviews sættes ind, når rigtige anmeldelser er på plads]
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-7 rounded-[14px] bg-[#F4F1EA] border border-[#E6E0D7]">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#A67C52] text-[#A67C52]" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic leading-relaxed mb-4">
                  [Placeholder — indsæt ægte kundecitat her. Vi opdigter ikke anmeldelser.]
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-[#6E7B4F]">— Kundenavn</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <FAQAccordion items={FAQ_ITEMS} />

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-calm max-w-3xl px-5 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#6E7B4F]/10 px-4 py-1.5 mb-6">
            <span className="text-xs uppercase tracking-[0.2em] text-[#6E7B4F]">−{DISCOUNT_PCT}% Sommerferie</span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl leading-[1.1] text-[#2D2D2D] mb-6">
            Skarpe knive, <em className="italic text-[#5A3B2E]">hvor end du laver mad.</em>
          </h2>
          <div className="flex items-baseline justify-center gap-4 mb-8">
            <span className="font-serif text-4xl text-[#2D2D2D]">{PRICE_NOW} kr</span>
            <span className="text-lg text-muted-foreground line-through">{PRICE_BEFORE} kr</span>
          </div>
          <a
            href={buyUrl}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#6E7B4F] px-10 py-4 text-base font-medium text-white shadow-md transition hover:bg-[#5c6842] hover:shadow-lg"
          >
            Køb {VARIANTS[variant].name} nu
          </a>
          <p className="mt-4 text-xs text-muted-foreground">
            Fri fragt · 1–3 hverdage · 30 dages retur
          </p>
        </div>
      </section>
    </div>
  );
}

function TrustItem({ icon: Icon, label }: { icon: typeof Truck; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-[#6E7B4F]" strokeWidth={1.5} />
      <span className="text-foreground/80">{label}</span>
    </div>
  );
}

function Angle({
  n,
  title,
  body,
  image,
  alt,
  reverse,
}: {
  n: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  reverse: boolean;
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
      <div className="aspect-[4/5] md:aspect-[4/5] overflow-hidden rounded-[16px] bg-[#E6E0D7]">
        <img src={image} alt={alt} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div>
        <p className="font-serif text-sm text-[#6E7B4F] mb-3">{n}</p>
        <h3 className="font-serif text-2xl md:text-3xl leading-[1.15] text-[#2D2D2D] mb-4">{title}</h3>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{body}</p>
      </div>
    </div>
  );
}
