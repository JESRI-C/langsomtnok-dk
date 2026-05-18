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
  founderSubtitle?: string;
  founderBullets?: string[];
  founderLink?: { label: string; href: string };
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
    founderSubtitle:
      "Jeg ville vælge denne, hvis du vil have et redskab, der føles rigtigt i hånden og løfter de daglige snit.",
    founderBullets: [
      "God som daglig hovedkniv eller præcisionsredskab",
      "Føles rolig i hånden",
      "Skabt til både funktion og æstetik",
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
    founderSubtitle:
      "Jeg ville vælge denne, hvis du vil passe bedre på dine knive uden at gøre det besværligt.",
    founderBullets: [
      "God til enkel hverdagspleje",
      "Gør vedligeholdelse mere overskuelig",
      "Et stærkt valg før kniven bliver helt sløv",
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
    jesperTitle: "Jesper anbefaler den, hvis du vil:",
    jesperBullets: [
      "Have mere ro på køkkenbordet",
      "Vise dine redskaber frem på en smuk måde",
      "Kombinere funktion og æstetik",
    ],
    founderSubtitle:
      "Jeg ville vælge denne, hvis du vil give dine redskaber en fast plads og skabe mere ro i køkkenet.",
    founderBullets: [
      "Giver knivene en synlig og sikker plads",
      "Skaber mere ro på køkkenbordet",
      "Løfter køkkenets samlede udtryk",
    ],
    useGuide: {
      title: "Sådan bruges den",
      body: "Placér den synligt i køkkenet. Tør af med en blød klud og hold den fri for fugt — så patinerer træet roligt over tid.",
      link: { label: "Se guiden til rolig knivopbevaring", href: "/ritualer/rolig-opbevaring" },
    },
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
    jesperTitle: "Jesper anbefaler sættet, hvis du vil:",
    jesperBullets: [
      "Starte rigtigt fra begyndelsen",
      "Give en gave med både funktion og følelse",
      "Samle produkter der giver mening sammen",
    ],
    founderSubtitle:
      "Jeg ville vælge dette sæt, hvis du vil begynde rigtigt uden at skulle vælge alt enkeltvis.",
    founderBullets: [
      "Lettere at vælge rigtigt fra start",
      "Produkterne giver mening sammen",
      "God som gave eller første køkkenritual",
    ],
    useGuide: {
      title: "Sådan bruges det",
      body: "Sættet er tænkt som en samlet begyndelse. Brug delene sammen i hverdagen, og lad dem patinere roligt over tid.",
    },
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
    jesperTitle: "Jesper anbefaler den, hvis du vil:",
    jesperBullets: [
      "Give bordet mere varme",
      "Vælge noget med stoflighed og ro",
      "Have en gave der føles personlig",
    ],
    useGuide: {
      title: "Sådan bruges den",
      body: "Brug den hver dag — keramik bliver smukkere af at være i hånden. Skyl i hånden, undgå pludselige temperaturskift.",
    },
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
      className="rounded-[10px] border bg-white px-4 py-3.5 md:px-5 md:py-4"
      style={{
        borderColor: "rgba(90,59,46,0.16)",
        borderLeftWidth: "4px",
        borderLeftColor: "#5A3B2E",
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
 * RitualScoreAccordion — én samlet, åben premium-sektion lavere på siden.
 * (Navnet bibeholdt af bagudkompatibilitet — det er ikke længere en accordion.)
 *
 * Layout:
 *   1. Heading + subtitle
 *   2. Stort score-header (store stjerner + tal + scorenavn + kort forklaring)
 *   3. Score-grid (label venstre, stjerner højre — hver i sit hvide kort)
 *   4. Jesper anbefaler — 3 benefit-kort
 *   5. Kompakt trust-strip
 *   6. "Sådan bruges den" kort
 *   7. Lille disclaimer
 */
export function RitualScoreAccordion({ tags, metafields }: Props) {
  const key = resolveKey(tags);
  const config = applyOverrides(CONFIGS[key], metafields);
  if (!config.rows.length) return null;

  const trustStrip = [
    "Fri fragt over 599 kr",
    "30 dages retur",
    "Dansk webshop",
    "Sikker betaling",
  ];

  return (
    <section
      className="mt-16 md:mt-20"
      data-block="ritual-score-panel"
      data-trust-key={key}
    >
      <div
        className="relative max-w-4xl rounded-[18px] p-6 md:p-12"
        style={{
          backgroundColor: "#F3EEE7",
          border: "1px solid rgba(90,59,46,0.16)",
          borderLeftWidth: "4px",
          borderLeftColor: "#A67C52",
        }}
      >
        {/* 1. Heading + subtitle */}
        <header className="mb-7 md:mb-9">
          <span
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase font-medium px-2.5 py-1 rounded-full"
            style={{
              color: "#A67C52",
              backgroundColor: "rgba(166,124,82,0.10)",
              border: "1px solid rgba(166,124,82,0.25)",
            }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "#A67C52" }}
            />
            Kurateret af Langsomt Nok
          </span>
          <h2
            className="font-serif text-3xl md:text-4xl mt-4 mb-3 leading-[1.1]"
            style={{ color: "#2D2D2D" }}
          >
            Hvorfor vi har valgt den
          </h2>
          <p
            className="text-base md:text-lg leading-relaxed max-w-2xl"
            style={{ color: "rgba(45,45,45,0.72)" }}
          >
            Udvalgt for funktion, materialer og den ro, produktet skaber i hverdagen.
          </p>
        </header>

        {/* 2. Stort score header */}
        <div
          className="rounded-[12px] p-5 md:p-6 mb-6"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid rgba(90,59,46,0.12)",
          }}
        >
          <div className="flex items-center gap-3 flex-wrap">
            <StarRow value={5} size="lg" />
            {config.scoreNumber && (
              <span
                className="font-serif leading-none"
                style={{ color: "#2D2D2D", fontSize: "28px" }}
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
            className="mt-3 text-sm md:text-base leading-relaxed"
            style={{ color: "rgba(45,45,45,0.78)" }}
          >
            {config.subtitle}
          </p>
        </div>

        {/* 3. Score grid */}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-7 md:mb-9">
          {config.rows.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between gap-3 rounded-[10px] px-4 py-3"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid rgba(90,59,46,0.12)",
              }}
            >
              <span className="text-sm md:text-[15px]" style={{ color: "#2D2D2D" }}>
                {row.label}
              </span>
              <StarRow value={row.stars || 5} size="sm" />
            </li>
          ))}
        </ul>

        {/* 4. Jesper anbefaler — 3 benefit cards */}
        {config.jesperTitle && config.jesperBullets.length > 0 && (
          <div className="mb-7 md:mb-9">
            <p
              className="text-[11px] font-medium uppercase tracking-[0.18em] mb-2"
              style={{ color: "#A67C52" }}
            >
              Jesper anbefaler
            </p>
            <p
              className="font-serif text-lg md:text-xl mb-4"
              style={{ color: "#2D2D2D" }}
            >
              {config.jesperTitle}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {config.jesperBullets.slice(0, 3).map((bullet) => (
                <div
                  key={bullet}
                  className="rounded-[10px] p-4 flex items-start gap-3"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid rgba(90,59,46,0.12)",
                  }}
                >
                  <span
                    className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold leading-none"
                    style={{
                      backgroundColor: "rgba(76,87,74,0.12)",
                      color: "#4C574A",
                    }}
                  >
                    ✓
                  </span>
                  <span
                    className="text-sm leading-snug"
                    style={{ color: "#2D2D2D" }}
                  >
                    {bullet}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Kompakt trust strip */}
        <div
          className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs md:text-[13px] py-4 px-4 md:px-5 rounded-[10px] mb-6"
          style={{
            backgroundColor: "rgba(255,255,255,0.55)",
            border: "1px solid rgba(90,59,46,0.10)",
            color: "rgba(45,45,45,0.85)",
          }}
        >
          {trustStrip.map((item) => (
            <span key={item} className="inline-flex items-center gap-1.5">
              <span style={{ color: "#4C574A" }} className="font-semibold">
                ✓
              </span>
              <span>{item}</span>
            </span>
          ))}
        </div>

        {/* 6. Sådan bruges den */}
        {config.useGuide && (
          <div
            className="rounded-[10px] p-5 md:p-6 mb-5"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid rgba(90,59,46,0.12)",
            }}
          >
            <p
              className="text-[11px] font-medium uppercase tracking-[0.18em] mb-1.5"
              style={{ color: "#A67C52" }}
            >
              Sådan bruges den
            </p>
            <p
              className="font-serif text-lg mb-2"
              style={{ color: "#2D2D2D" }}
            >
              {config.useGuide.title}
            </p>
            <p
              className="text-sm leading-relaxed mb-3"
              style={{ color: "rgba(45,45,45,0.78)" }}
            >
              {config.useGuide.body}
            </p>
            {config.useGuide.link && (
              <a
                href={config.useGuide.link.href}
                className="inline-flex items-center gap-1.5 text-sm font-medium border-b pb-0.5 transition-all hover:gap-2.5"
                style={{
                  color: "#4C574A",
                  borderColor: "rgba(76,87,74,0.35)",
                }}
              >
                {config.useGuide.link.label} →
              </a>
            )}
          </div>
        )}

        {/* 7. Disclaimer */}
        {config.explanation && (
          <p
            className="italic text-center md:text-left"
            style={{ color: "rgba(45,45,45,0.55)", fontSize: "12px" }}
          >
            {config.explanation}
          </p>
        )}
      </div>
    </section>
  );
}


