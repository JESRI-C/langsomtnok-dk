/**
 * RitualTrustModule — dynamisk, kurateret trust-modul pr. produkttype.
 *
 * Indhold vælges via produkt-tags:
 *   trust_knife | trust_care | trust_display | trust_bundle | trust_ceramic
 *
 * Dette er IKKE kunde-reviews. Det er Langsomt Noks egen redaktionelle
 * vurdering (Ritual Score / Care Score / Display Score / Start Score / Circle Score).
 *
 * Overrides via Shopify metafields (valgfrit):
 *   namespace: "ritual"
 *     - title, subtitle, explanation, jesper_title
 *     - score_json      (JSON: [{label, stars}])
 *     - jesper_bullets_json (JSON: string[])
 */

import { Truck, RotateCcw, MapPin } from "lucide-react";
import type { ShopifyMetafield } from "@/lib/shopify";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


type TrustKey = "knife" | "care" | "display" | "bundle" | "ceramic" | "default";

interface ScoreRow {
  label: string;
  stars: number; // 0-5
}

interface TrustConfig {
  scoreNumber: string; // "4.8" eller "" (fallback)
  scoreName: string; // "Ritual Score"
  badgeSubtitle: string; // én linje under badge
  subtitle: string; // i fuldt modul
  rows: ScoreRow[];
  explanation: string;
  trustPoints: string[];
  jesperTitle: string;
  jesperBullets: string[];
  useGuide?: {
    title: string;
    body: string;
    link?: { label: string; href: string };
  };
}


const CONFIGS: Record<TrustKey, TrustConfig> = {
  knife: {
    scoreNumber: "4.8",
    scoreName: "Ritual Score",
    badgeSubtitle:
      "Udvalgt af Langsomt Nok — vurderet på funktion, materialer, ro og brugsværdi.",
    subtitle:
      "Et stærkt valg til skarphed, balance og hverdagsbrug.",
    rows: [
      { label: "Skarphed", stars: 5 },
      { label: "Balance", stars: 5 },
      { label: "Materialefølelse", stars: 5 },
      { label: "Hverdagsbrug", stars: 4 },
    ],
    explanation:
      "Score er Langsomt Noks egen kuraterede produktvurdering. Det er ikke en ekstern kundeanmeldelse.",
    trustPoints: [
      "Fri fragt over 599 kr",
      "30 dages rolig returret",
      "Dansk webshop",
      "Udvalgt med fokus på kvalitet og funktion",
    ],
    jesperTitle: "Jesper anbefaler denne, hvis du vil have:",
    jesperBullets: [
      "En kniv der føles bedre end standardudstyr",
      "Et redskab der gerne må stå fremme",
      "Mere ro og præcision i madlavningen",
    ],
    useGuide: {
      title: "Sådan bruges den",
      body: "Brug kniven til daglige snit — fra grøntsager til urter og kød. Tør den af i hånden efter brug, og hold den skarp med en stryger mellem slibninger.",
      link: { label: "Læs guiden til at holde din kniv skarp", href: "/ritualer/hold-kniven-skarp" },
    },
  },
  care: {
    scoreNumber: "4.7",
    scoreName: "Care Score",
    badgeSubtitle:
      "Udvalgt af Langsomt Nok — vurderet på plejeeffekt, kontrol og langtidsholdbarhed.",
    subtitle:
      "Udvalgt til dig, der vil passe bedre på dine redskaber og forlænge deres levetid.",
    rows: [
      { label: "Brugervenlighed", stars: 5 },
      { label: "Plejeeffekt", stars: 5 },
      { label: "Kontrol", stars: 4 },
      { label: "Lang levetid", stars: 5 },
    ],
    explanation:
      "Score er Langsomt Noks egen kuraterede produktvurdering. Det er ikke en ekstern kundeanmeldelse.",
    trustPoints: [
      "Gør dine redskaber bedre over tid",
      "Let at bruge i hverdagen",
      "Udvalgt til pleje og vedligehold",
      "Sendes fra dansk webshop",
    ],
    jesperTitle: "Jesper anbefaler den, hvis du vil:",
    jesperBullets: [
      "Tage næste skridt efter grundslibning",
      "Give æggen en finere afslutning",
      "Bygge et mere præcist sliberitual",
    ],
    useGuide: {
      title: "Sådan bruges den",
      body: "Brug stenen efter en grovere eller mellemfin slibning, når æggen allerede er etableret. Arbejd roligt og jævnt — vand og tid gør resten.",
      link: { label: "Læs guiden til at holde din kniv skarp", href: "/ritualer/hold-kniven-skarp" },
    },
  },
  display: {
    scoreNumber: "4.8",
    scoreName: "Display Score",
    badgeSubtitle:
      "Udvalgt af Langsomt Nok — vurderet på design, materialer og ro i køkkenet.",
    subtitle:
      "Udvalgt til dig, der vil have ro, orden og smuk opbevaring i køkkenet.",
    rows: [
      { label: "Designværdi", stars: 5 },
      { label: "Materialefølelse", stars: 5 },
      { label: "Stabilitet", stars: 4 },
      { label: "Gaveværdi", stars: 5 },
    ],
    explanation:
      "Score er Langsomt Noks egen kuraterede produktvurdering. Det er ikke en ekstern kundeanmeldelse.",
    trustPoints: [
      "Gør køkkenet mere samlet",
      "Fremhæver dine redskaber smukt",
      "Udvalgt for materiale og funktion",
      "30 dages rolig returret",
    ],
    jesperTitle: "Jesper anbefaler denne, hvis du vil:",
    jesperBullets: [
      "Have mere ro på køkkenbordet",
      "Vise dine redskaber frem på en smuk måde",
      "Kombinere funktion og æstetik",
    ],
  },
  bundle: {
    scoreNumber: "4.9",
    scoreName: "Start Score",
    badgeSubtitle:
      "Udvalgt af Langsomt Nok — vurderet på samlet værdi, funktion og ritualfølelse.",
    subtitle:
      "Det mest komplette sted at begynde, hvis du vil samle dit køkkenritual rigtigt.",
    rows: [
      { label: "Samlet værdi", stars: 5 },
      { label: "Gaveværdi", stars: 5 },
      { label: "Funktion", stars: 5 },
      { label: "Ritualfølelse", stars: 5 },
    ],
    explanation:
      "Score er Langsomt Noks egen kuraterede produktvurdering. Det er ikke en ekstern kundeanmeldelse.",
    trustPoints: [
      "Mere værdi samlet",
      "Nemt valg som gave",
      "Produkter der giver mening sammen",
      "Et stærkt sted at begynde",
    ],
    jesperTitle: "Jesper anbefaler dette sæt, hvis du vil:",
    jesperBullets: [
      "Starte rigtigt fra begyndelsen",
      "Give en gave med både funktion og følelse",
      "Samle produkter der giver mening sammen",
    ],
  },
  ceramic: {
    scoreNumber: "4.8",
    scoreName: "Circle Score",
    badgeSubtitle:
      "Udvalgt til Cirklen — vurderet på form, stoflighed og ro omkring bordet.",
    subtitle:
      "Udvalgt for form, stoflighed og den ro, det skaber omkring bordet.",
    rows: [
      { label: "Form", stars: 5 },
      { label: "Stoflighed", stars: 5 },
      { label: "Bordets udtryk", stars: 5 },
      { label: "Gaveværdi", stars: 4 },
    ],
    explanation:
      "Score er Langsomt Noks egen kuraterede produktvurdering. Det er ikke en ekstern kundeanmeldelse.",
    trustPoints: [
      "Udvalgt for form og stemning",
      "Skabt til langsomme øjeblikke",
      "God som gave",
      "Sendes fra dansk webshop",
    ],
    jesperTitle: "Jesper anbefaler denne, hvis du vil:",
    jesperBullets: [
      "Give bordet mere varme",
      "Vælge noget med stoflighed og ro",
      "Have en gave der føles personlig",
    ],
  },
  default: {
    scoreNumber: "",
    scoreName: "Udvalgt af Langsomt Nok",
    badgeSubtitle:
      "Valgt fordi det passer ind i et køkken, hvor funktion, ro og materialer betyder noget.",
    subtitle:
      "Valgt fordi det passer ind i et køkken, hvor funktion, ro og materialer betyder noget.",
    rows: [
      { label: "Materialefølelse", stars: 5 },
      { label: "Funktion", stars: 5 },
      { label: "Ro i køkkenet", stars: 5 },
      { label: "Hverdagsværdi", stars: 4 },
    ],
    explanation:
      "Score er Langsomt Noks egen kuraterede produktvurdering. Det er ikke en ekstern kundeanmeldelse.",
    trustPoints: [
      "Fri fragt over 599 kr",
      "30 dages rolig returret",
      "Dansk webshop",
      "Udvalgt med fokus på kvalitet og funktion",
    ],
    jesperTitle: "",
    jesperBullets: [],
  },
};

function resolveKey(tags: string[]): TrustKey {
  const set = new Set(tags.map((t) => t.toLowerCase().trim()));
  if (set.has("trust_knife")) return "knife";
  if (set.has("trust_care")) return "care";
  if (set.has("trust_display")) return "display";
  if (set.has("trust_bundle")) return "bundle";
  if (set.has("trust_ceramic")) return "ceramic";
  return "default";
}

function metaValue(
  metafields: ShopifyMetafield[] | null | undefined,
  key: string,
): string | null {
  if (!metafields) return null;
  const m = metafields.find(
    (f) => f && f.namespace === "ritual" && f.key === key,
  );
  return m?.value ?? null;
}

function applyOverrides(
  base: TrustConfig,
  metafields: ShopifyMetafield[] | null | undefined,
): TrustConfig {
  if (!metafields || metafields.length === 0) return base;
  const next: TrustConfig = { ...base };
  const title = metaValue(metafields, "title");
  const subtitle = metaValue(metafields, "subtitle");
  const explanation = metaValue(metafields, "explanation");
  const jesperTitle = metaValue(metafields, "jesper_title");
  const scoreJson = metaValue(metafields, "score_json");
  const jesperJson = metaValue(metafields, "jesper_bullets_json");
  if (title) {
    // Allow override of "4.8 Ritual Score" via single string
    const m = title.match(/^([\d.,]+)\s+(.+)$/);
    if (m) {
      next.scoreNumber = m[1];
      next.scoreName = m[2];
    } else {
      next.scoreName = title;
    }
  }
  if (subtitle) {
    next.subtitle = subtitle;
    next.badgeSubtitle = subtitle;
  }
  if (explanation) next.explanation = explanation;
  if (jesperTitle) next.jesperTitle = jesperTitle;
  try {
    if (scoreJson) {
      const parsed = JSON.parse(scoreJson);
      if (Array.isArray(parsed)) next.rows = parsed;
    }
    if (jesperJson) {
      const parsed = JSON.parse(jesperJson);
      if (Array.isArray(parsed)) next.jesperBullets = parsed;
    }
  } catch {
    // ignore
  }
  return next;
}

/** Stjerner — altid synlige, copper farve, halve trin understøttet */
function StarRow({
  value,
  size = "sm",
}: {
  value: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "lg" ? "text-2xl" : size === "md" ? "text-lg" : "text-sm";
  const full = Math.floor(value);
  const empty = 5 - full;
  return (
    <span
      className={`inline-flex tracking-tight leading-none ${sizeClass}`}
      style={{ color: "#A67C52" }}
      aria-label={`${value} ud af 5 stjerner`}
    >
      {"★".repeat(full)}
      <span className="opacity-25">{"★".repeat(empty)}</span>
    </span>
  );
}

interface Props {
  tags: string[];
  metafields?: ShopifyMetafield[] | null;
}

/**
 * Premium score-kort placeret højt på siden (mellem pris og Add to cart).
 * Stort, synligt, copper venstrekant. Mobile-friendly.
 */
export function RitualScoreBadge({ tags, metafields }: Props) {
  const key = resolveKey(tags);
  const config = applyOverrides(CONFIGS[key], metafields);

  return (
    <div
      className="rounded-[10px] border bg-[#F8F6F3] px-4 py-3.5 md:px-5 md:py-4"
      style={{
        borderColor: "rgba(90,59,46,0.18)",
        borderLeftWidth: "4px",
        borderLeftColor: "#A67C52",
      }}
      data-block="ritual-score-badge"
      data-trust-key={key}
    >
      <div className="flex items-center gap-2.5 flex-wrap">
        <StarRow value={5} size="md" />
        {config.scoreNumber && (
          <span
            className="font-serif text-xl md:text-2xl leading-none"
            style={{ color: "#2D2D2D" }}
          >
            {config.scoreNumber}
          </span>
        )}
        <span
          className="font-serif text-lg md:text-xl leading-none"
          style={{ color: "#2D2D2D" }}
        >
          {config.scoreName}
        </span>
      </div>
      <p
        className="mt-1.5 text-[13px] leading-relaxed"
        style={{ color: "rgba(45,45,45,0.72)" }}
      >
        {config.badgeSubtitle}
      </p>
    </div>
  );
}

export function RitualTrustModule({ tags, metafields }: Props) {
  const key = resolveKey(tags);
  const config = applyOverrides(CONFIGS[key], metafields);

  return (
    <div className="mt-6 space-y-4">
      <section
        className="rounded-[10px] p-5 md:p-7"
        style={{
          backgroundColor: "#F8F6F3",
          border: "1px solid rgba(90,59,46,0.18)",
          borderLeftWidth: "4px",
          borderLeftColor: "#A67C52",
        }}
        data-block="ritual-trust"
        data-trust-key={key}
      >
        {/* Header — store stjerner + score */}
        <div className="flex items-center gap-3 flex-wrap">
          <StarRow value={5} size="lg" />
          {config.scoreNumber && (
            <span
              className="font-serif leading-none"
              style={{ color: "#2D2D2D", fontSize: "26px" }}
            >
              {config.scoreNumber}
            </span>
          )}
          <span
            className="font-serif leading-none"
            style={{ color: "#2D2D2D", fontSize: "22px" }}
          >
            {config.scoreName}
          </span>
        </div>

        <p
          className="mt-3 text-sm leading-relaxed"
          style={{ color: "rgba(45,45,45,0.78)" }}
        >
          {config.subtitle}
        </p>

        {/* Score rows — altid stjerner */}
        {config.rows.length > 0 && (
          <ul className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5">
            {config.rows.map((row) => (
              <li
                key={row.label}
                className="flex items-center justify-between gap-3 py-1"
                style={{ borderBottom: "1px dashed rgba(90,59,46,0.10)" }}
              >
                <span className="text-sm" style={{ color: "#2D2D2D" }}>
                  {row.label}
                </span>
                <StarRow value={row.stars || 5} size="sm" />
              </li>
            ))}
          </ul>
        )}

        {/* Lille disclaimer */}
        {config.explanation && (
          <p
            className="mt-4 italic"
            style={{ color: "rgba(45,45,45,0.65)", fontSize: "12px" }}
          >
            {config.explanation}
          </p>
        )}

        {/* Trust points */}
        <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
          {config.trustPoints.map((point) => (
            <li
              key={point}
              className="flex items-start gap-2 text-sm"
              style={{ color: "#2D2D2D" }}
            >
              <span className="mt-0.5 font-semibold" style={{ color: "#4C574A" }}>
                ✓
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>

        {/* Micro-bar: shipping / returns / origin */}
        <div
          className="mt-5 pt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px]"
          style={{
            borderTop: "1px solid rgba(90,59,46,0.12)",
            color: "rgba(45,45,45,0.65)",
          }}
        >
          <span className="inline-flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" style={{ color: "#4C574A" }} strokeWidth={1.5} />
            Fri fragt over 599 kr
          </span>
          <span className="inline-flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" style={{ color: "#4C574A" }} strokeWidth={1.5} />
            30 dages retur
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" style={{ color: "#4C574A" }} strokeWidth={1.5} />
            Sendt fra Danmark
          </span>
        </div>
      </section>

      {/* Jesper anbefaler */}
      {config.jesperTitle && config.jesperBullets.length > 0 && (
        <section
          className="rounded-[10px] p-5 md:p-6"
          style={{
            backgroundColor: "#E6E0D7",
            border: "1px solid rgba(90,59,46,0.14)",
          }}
          data-block="jesper-recommends"
        >
          <p
            className="text-[11px] font-medium uppercase tracking-[0.12em] mb-2"
            style={{ color: "#A67C52" }}
          >
            Jesper anbefaler
          </p>
          <p
            className="font-serif text-base md:text-lg mb-3"
            style={{ color: "#2D2D2D" }}
          >
            {config.jesperTitle}
          </p>
          <ul className="space-y-1.5">
            {config.jesperBullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2 text-sm"
                style={{ color: "#2D2D2D" }}
              >
                <span className="mt-0.5 font-semibold" style={{ color: "#4C574A" }}>
                  ✓
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/**
 * RitualScoreAccordion — lavere på siden, lukket som default.
 * Indeholder score-rækker + disclaimer, så den ikke konkurrerer med
 * score-badget tæt på Add to Cart.
 */
export function RitualScoreAccordion({ tags, metafields }: Props) {
  const key = resolveKey(tags);
  const config = applyOverrides(CONFIGS[key], metafields);
  if (!config.rows.length) return null;

  return (
    <section className="mt-16 max-w-3xl" data-block="ritual-score-accordion" data-trust-key={key}>
      <Accordion
        type="single"
        collapsible
        className="rounded-[10px] overflow-hidden"
        style={{
          backgroundColor: "#F8F6F3",
          border: "1px solid rgba(90,59,46,0.16)",
        }}
      >
        <AccordionItem value="why" className="border-b-0">
          <AccordionTrigger className="px-5 md:px-6 py-4 hover:no-underline">
            <span className="flex items-center gap-3">
              <StarRow value={5} size="sm" />
              <span className="font-serif text-lg md:text-xl" style={{ color: "#2D2D2D" }}>
                Hvorfor vi har valgt den
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-5 md:px-6 pb-5">
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: "rgba(45,45,45,0.78)" }}
            >
              {config.subtitle}
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5">
              {config.rows.map((row) => (
                <li
                  key={row.label}
                  className="flex items-center justify-between gap-3 py-1"
                  style={{ borderBottom: "1px dashed rgba(90,59,46,0.10)" }}
                >
                  <span className="text-sm" style={{ color: "#2D2D2D" }}>
                    {row.label}
                  </span>
                  <StarRow value={row.stars || 5} size="sm" />
                </li>
              ))}
            </ul>
            {config.explanation && (
              <p
                className="mt-4 italic"
                style={{ color: "rgba(45,45,45,0.65)", fontSize: "12px" }}
              >
                {config.explanation}
              </p>
            )}
            {config.jesperTitle && config.jesperBullets.length > 0 && (
              <div
                className="mt-5 pt-5"
                style={{ borderTop: "1px solid rgba(90,59,46,0.12)" }}
              >
                <p
                  className="text-[11px] font-medium uppercase tracking-[0.12em] mb-2"
                  style={{ color: "#A67C52" }}
                >
                  Jesper anbefaler
                </p>
                <p
                  className="font-serif text-base md:text-lg mb-3"
                  style={{ color: "#2D2D2D" }}
                >
                  {config.jesperTitle}
                </p>
                <ul className="space-y-1.5">
                  {config.jesperBullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: "#2D2D2D" }}
                    >
                      <span className="mt-0.5 font-semibold" style={{ color: "#4C574A" }}>
                        ✓
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}

