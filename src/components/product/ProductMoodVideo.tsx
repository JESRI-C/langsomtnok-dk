/**
 * ProductMoodVideo — stor, rolig produktvideo der bærer det emotionelle salg.
 *
 * Vises kun når der findes en video for produktet — enten via Shopify
 * metafield (namespace "ritual", key "video_url") eller via en kendt fil i
 * /public/videos baseret på produktets type/tags.
 *
 * Designet er bevidst stille: ingen tunge skygger, varm baggrund, runde
 * hjørner og generøs luft. Ingen lyd, autoplay, loop, playsInline.
 */

import type { ShopifyMetafield } from "@/lib/shopify";

type MoodKey = "care" | "knife" | "storage" | "ceramic" | "bundle";

interface MoodConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Path under /public — fx /videos/slibesten-mood.mp4. */
  src: string;
  poster?: string;
  aspect: "16/9" | "4/5" | "9/16";
}

const CONFIGS: Record<MoodKey, Omit<MoodConfig, "src" | "poster">> = {
  care: {
    eyebrow: "Et roligt øjeblik",
    title: "Se hvordan skarphed bliver holdt i live",
    subtitle: "Vand på sten, en langsom bevægelse — og redskabet kommer tilbage til sig selv.",
    aspect: "16/9",
  },
  knife: {
    eyebrow: "Et roligt øjeblik",
    title: "Se snittet, grebet og balancen",
    subtitle: "Et stille kig på materialet, vægten i hånden og bevægelsen gennem råvaren.",
    aspect: "16/9",
  },
  storage: {
    eyebrow: "Et roligt øjeblik",
    title: "Se hvordan roen finder sin plads",
    subtitle: "Knivene væk fra skuffen — fremme, men stille. Som de skal være.",
    aspect: "4/5",
  },
  ceramic: {
    eyebrow: "Et roligt øjeblik",
    title: "Se glasuren, formen og hænderne bag",
    subtitle: "Drejet, brændt og holdt i hånden — keramik der bærer langsomheden videre.",
    aspect: "4/5",
  },
  bundle: {
    eyebrow: "Et roligt øjeblik",
    title: "Se hvordan ritualet begynder",
    subtitle: "Tre redskaber, samlet med omtanke — et roligt sted at starte køkkenet.",
    aspect: "16/9",
  },
};

/** Map kendte videofiler til produkttyper/tags. Tilføj her når nye videoer publiceres. */
const KNOWN_VIDEOS: Record<MoodKey, { src: string; poster?: string } | null> = {
  // Tilføj fx { src: "/videos/slibesten-mood.mp4", poster: "/videos/slibesten-mood-poster.jpg" }
  care: null,
  knife: null,
  storage: null,
  ceramic: null,
  bundle: null,
};

function resolveKey(productType: string | undefined, tags: string[]): MoodKey | null {
  const t = new Set(tags.map((x) => x.toLowerCase().trim()));
  if (t.has("trust_care") || /slibesten|whetstone|pleje/i.test(productType || "")) return "care";
  if (t.has("trust_knife") || /kniv|chef/i.test(productType || "")) return "knife";
  if (t.has("trust_display") || /knivholder|magnet|opbevaring|calm kitchen/i.test(productType || "")) return "storage";
  if (t.has("trust_ceramic") || /keramik|ceramic/i.test(productType || "")) return "ceramic";
  if (t.has("trust_bundle") || /set|ritual set|bundle/i.test(productType || "")) return "bundle";
  return null;
}

function metaValue(
  metafields: ShopifyMetafield[] | null | undefined,
  key: string,
): string | null {
  if (!metafields) return null;
  const m = metafields.find((f) => f && f.namespace === "ritual" && f.key === key);
  return m?.value ?? null;
}

interface Props {
  tags: string[];
  productType?: string;
  metafields?: ShopifyMetafield[] | null;
}

export function ProductMoodVideo({ tags, productType, metafields }: Props) {
  const key = resolveKey(productType, tags);
  if (!key) return null;

  const override = metaValue(metafields, "video_url");
  const knownVideo = KNOWN_VIDEOS[key];

  const src = override || knownVideo?.src;
  if (!src) return null;

  const poster = metaValue(metafields, "video_poster") || knownVideo?.poster;
  const cfg = CONFIGS[key];
  const aspectClass =
    cfg.aspect === "16/9"
      ? "aspect-video"
      : cfg.aspect === "9/16"
        ? "aspect-[9/16]"
        : "aspect-[4/5]";

  return (
    <section className="mt-20 md:mt-24" data-block="product-mood-video" data-mood-key={key}>
      <div className="max-w-3xl mb-6 md:mb-8">
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
          {cfg.eyebrow}
        </span>
        <h2
          className="font-serif text-3xl md:text-4xl lg:text-5xl mt-4 mb-3 leading-[1.1]"
          style={{ color: "#2D2D2D" }}
        >
          {cfg.title}
        </h2>
        <p
          className="text-base md:text-lg leading-relaxed max-w-2xl"
          style={{ color: "rgba(45,45,45,0.72)" }}
        >
          {cfg.subtitle}
        </p>
      </div>

      <div
        className="relative overflow-hidden"
        style={{
          backgroundColor: "#F8F6F3",
          border: "1px solid rgba(90,59,46,0.16)",
          borderRadius: "14px",
        }}
      >
        <video
          className={`w-full h-auto block ${aspectClass} object-cover`}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          aria-label={cfg.title}
        />
      </div>
    </section>
  );
}
