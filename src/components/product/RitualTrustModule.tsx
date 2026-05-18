/**
 * RitualTrustModule — dynamisk, kurateret trust-modul pr. produkttype.
 *
 * Indhold vælges via produkt-tags:
 *   trust_knife | trust_care | trust_display | trust_bundle | trust_ceramic
 *
 * Dette er IKKE kunde-reviews. Det er Langsomt Noks egen redaktionelle
 * vurdering (Ritual Score / Care Score / Display Score / Start Score) +
 * en blødere kurateret variant for keramik.
 *
 * Overrides via Shopify metafields (valgfrit — kan tilføjes senere):
 *   namespace: "ritual"
 *     - title           (fx "★★★★★ 4.8 Ritual Score")
 *     - subtitle
 *     - explanation
 *     - score_json      (JSON: [{label, stars}])
 *     - jesper_title
 *     - jesper_bullets_json (JSON: string[])
 */

import { Truck, RotateCcw, MapPin, Sparkles } from "lucide-react";
import type { ShopifyMetafield } from "@/lib/shopify";

type TrustKey = "knife" | "care" | "display" | "bundle" | "ceramic" | "default";

interface ScoreRow {
  label: string;
  stars: number; // 0-5, halve trin via 0.5
}

interface TrustConfig {
  variant: "score" | "soft"; // score = stjerner, soft = keramik uden stjerner
  title: string;
  subtitle: string;
  rows: ScoreRow[];
  rowsLabel?: string; // for soft-variant
  explanation: string;
  trustPoints: string[];
  jesperTitle: string;
  jesperBullets: string[];
}

const CONFIGS: Record<TrustKey, TrustConfig> = {
  knife: {
    variant: "score",
    title: "4.8 Ritual Score",
    subtitle:
      "Et stærkt valg til dig, der vil have skarphed, balance og et køkkenredskab, der gerne må stå fremme.",
    rows: [
      { label: "Skarphed", stars: 5 },
      { label: "Balance", stars: 5 },
      { label: "Materialefølelse", stars: 5 },
      { label: "Hverdagsbrug", stars: 4 },
    ],
    explanation:
      "Ritual Score er Langsomt Noks egen produktvurdering baseret på funktion, materialer, æstetik og brugsværdi.",
    trustPoints: [
      "Fri fragt i Danmark",
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
  },
  care: {
    variant: "score",
    title: "4.7 Care Score",
    subtitle:
      "Til dig, der vil holde dit køkkenritual skarpt, smukt og brugbart længere.",
    rows: [
      { label: "Brugervenlighed", stars: 5 },
      { label: "Plejeeffekt", stars: 5 },
      { label: "Kontrol", stars: 4 },
      { label: "Langtidsholdbarhed", stars: 5 },
    ],
    explanation:
      "Care Score er Langsomt Noks egen vurdering af, hvor godt produktet understøtter pleje, vedligehold og lang levetid.",
    trustPoints: [
      "Gør dine redskaber bedre over tid",
      "Let at bruge i hverdagen",
      "Udvalgt til pleje og vedligehold",
      "Sendes fra dansk webshop",
    ],
    jesperTitle: "Jesper anbefaler denne, hvis du vil:",
    jesperBullets: [
      "Passe bedre på dine redskaber",
      "Forlænge levetiden på dine knive",
      "Gøre vedligeholdelse til en enkel vane",
    ],
  },
  display: {
    variant: "score",
    title: "4.8 Display Score",
    subtitle:
      "Skabt til at lade dine redskaber hvile synligt, sikkert og smukt.",
    rows: [
      { label: "Designværdi", stars: 5 },
      { label: "Materialefølelse", stars: 5 },
      { label: "Stabilitet", stars: 4 },
      { label: "Gaveværdi", stars: 5 },
    ],
    explanation:
      "Display Score er Langsomt Noks egen vurdering af æstetik, funktion og hvordan produktet bidrager til et roligere køkken.",
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
    variant: "score",
    title: "4.9 Start Score",
    subtitle:
      "Det mest komplette sted at begynde, hvis du vil samle dit køkkenritual rigtigt fra starten.",
    rows: [
      { label: "Samlet værdi", stars: 5 },
      { label: "Gaveværdi", stars: 5 },
      { label: "Funktion", stars: 5 },
      { label: "Ritualfølelse", stars: 5 },
    ],
    explanation:
      "Start Score er Langsomt Noks egen vurdering af samlet værdi, funktion og hvor godt sættet fungerer som en helhed.",
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
    variant: "soft",
    title: "Udvalgt til Cirklen",
    subtitle: "Et stykke keramik med ro, stoflighed og hverdagsværdi.",
    rows: [
      { label: "Håndværksfølelse", stars: 0 },
      { label: "Bordets udtryk", stars: 0 },
      { label: "Gaveværdi", stars: 0 },
      { label: "Hverdagsbrug", stars: 0 },
    ],
    explanation:
      "Keramik vurderes ikke kun på funktion, men på nærvær, form og følelsen det skaber omkring bordet.",
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
    variant: "soft",
    title: "Udvalgt af Langsomt Nok",
    subtitle:
      "Valgt fordi det passer ind i et køkken, hvor funktion, ro og materialer betyder noget.",
    rows: [],
    explanation: "",
    trustPoints: [
      "Fri fragt i Danmark",
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
  if (title) next.title = title;
  if (subtitle) next.subtitle = subtitle;
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
    // Ignorer ugyldig JSON, brug fallback
  }
  return next;
}

function StarRow({ value }: { value: number }) {
  const full = Math.floor(value);
  const empty = 5 - full;
  return (
    <span
      className="inline-flex tracking-tight"
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
 * Kompakt badge — vises højt på produktsiden (under titel, over pris).
 * Giver øjeblikkelig trust uden at fylde for meget.
 */
export function RitualScoreBadge({ tags, metafields }: Props) {
  const key = resolveKey(tags);
  const config = applyOverrides(CONFIGS[key], metafields);
  const isScore = config.variant === "score";

  return (
    <div
      className="mt-3 inline-flex items-center gap-2.5 rounded-full border border-copper/25 bg-[#F8F6F3] px-3.5 py-1.5"
      data-block="ritual-score-badge"
      data-trust-key={key}
    >
      {isScore ? (
        <StarRow value={5} />
      ) : (
        <Sparkles className="w-3.5 h-3.5 text-copper" strokeWidth={1.5} />
      )}
      <span className="text-[13px] font-medium text-[#2D2D2D] tracking-tight">
        {config.title}
      </span>
      <span className="hidden sm:inline text-[11px] text-[#2D2D2D]/55">
        · Udvalgt af Langsomt Nok
      </span>
    </div>
  );
}

export function RitualTrustModule({ tags, metafields }: Props) {
  const key = resolveKey(tags);
  const config = applyOverrides(CONFIGS[key], metafields);
  const isScore = config.variant === "score";

  return (
    <div className="mt-6 space-y-4">
      <section
        className="rounded-[10px] border border-border/60 bg-[#F8F6F3] p-5 md:p-6"
        data-block="ritual-trust"
        data-trust-key={key}
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          {isScore ? (
            <div className="flex items-baseline gap-2 flex-wrap">
              <StarRow value={5} />
              <span className="font-serif text-lg text-[#2D2D2D]">
                {config.title}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-copper" strokeWidth={1.5} />
              <span className="font-serif text-lg text-[#2D2D2D]">
                {config.title}
              </span>
            </div>
          )}
        </div>

        <p className="mt-2 text-sm leading-relaxed text-[#2D2D2D]/75">
          {config.subtitle}
        </p>

        {/* Score / quality rows */}
        {config.rows.length > 0 && (
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {config.rows.map((row) => (
              <li
                key={row.label}
                className="flex items-center justify-between gap-3 py-1 border-b border-border/40 last:border-b-0 sm:border-b-0"
              >
                <span className="text-sm text-[#2D2D2D]">{row.label}</span>
                {isScore ? (
                  <StarRow value={row.stars} />
                ) : (
                  <span
                    className="text-[11px] font-medium uppercase tracking-wider"
                    style={{ color: "#4C574A" }}
                  >
                    Udvalgt
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Explanation */}
        {config.explanation && (
          <p className="mt-4 text-xs leading-relaxed text-[#2D2D2D]/60 italic">
            {config.explanation}
          </p>
        )}

        {/* Trust points */}
        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
          {config.trustPoints.map((point) => (
            <li
              key={point}
              className="flex items-start gap-2 text-sm text-[#2D2D2D]"
            >
              <span className="mt-0.5 font-semibold" style={{ color: "#4C574A" }}>
                ✓
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>

        {/* Microbar: shipping/returns/origin */}
        <div className="mt-4 pt-3 border-t border-border/40 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-[#2D2D2D]/60">
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
          className="rounded-[10px] border border-border/50 bg-soft/40 p-5 md:p-6"
          data-block="jesper-recommends"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-copper mb-2">
            Jesper anbefaler
          </p>
          <p className="font-serif text-base text-[#2D2D2D] mb-3">
            {config.jesperTitle}
          </p>
          <ul className="space-y-1.5">
            {config.jesperBullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2 text-sm text-[#2D2D2D]"
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
