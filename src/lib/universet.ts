/**
 * ============================================================================
 * LANGSOMT NOK UNIVERSET — Datalag
 * ============================================================================
 * Et roligt univers af fortællinger, ritualer og håndværk.
 * Bygger ovenpå eksisterende ARTICLES (src/lib/articles.ts) og kobler dem til:
 *   - rituelle kategorier (ritual_category)
 *   - relaterede Shopify-produkter (via product_type query)
 *   - FAQ-blokke pr. fortælling
 *   - billed-slot for fortællingens hero
 * ============================================================================
 */

import { ARTICLES, type ArticleData } from "./articles";

export type RitualCategory =
  | "Køkkenritualer"
  | "Espresso & morgenro"
  | "Knive & slibning"
  | "Materialer & pleje"
  | "Slow living"
  | "Gaver med mening";

export const RITUAL_CATEGORIES: RitualCategory[] = [
  "Køkkenritualer",
  "Knive & slibning",
  "Materialer & pleje",
  "Espresso & morgenro",
  "Slow living",
  "Gaver med mening",
];

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface UniversetStory {
  slug: string;
  title: string;
  excerpt: string;            // kort, poetisk
  ritualCategory: RitualCategory;
  readTime: string;
  publishedAt: string;        // ISO
  modifiedAt: string;         // ISO
  imageSlot: string;          // ImageSlot name
  imageMotif: string;
  /** Shopify product type/tag query for "Det hører til ritualet" */
  relatedProductQuery?: string;
  relatedProductBlockTitle?: string;
  faq?: FaqEntry[];
  /** Pull-quote shown as åndepause i fortællingen */
  quote?: string;
  /** Reference til artikel-data (sektioner, intro). null hvis fortællingen er kun-Universet. */
  articleSlug?: string;
}

const PUBLISHED = "2025-09-01T08:00:00.000Z";
const MODIFIED = "2026-04-15T08:00:00.000Z";

/**
 * Mapping af eksisterende artikel-kategorier → ritual_category.
 */
function ritualFromArticle(a: ArticleData): RitualCategory {
  switch (a.category) {
    case "Knivvalg":
    case "Slibning":
      return "Knive & slibning";
    case "Pleje":
    case "Materialer":
      return "Materialer & pleje";
    case "Gaver":
      return "Gaver med mening";
    case "Langsom mad":
      return "Slow living";
    default:
      return "Køkkenritualer";
  }
}

const PRODUCT_QUERY_BY_RITUAL: Record<RitualCategory, string | undefined> = {
  "Knive & slibning": 'product_type:"The Ritual Set"',
  "Materialer & pleje": 'product_type:"The Ritual Set"',
  "Køkkenritualer": 'product_type:"The Calm Kitchen"',
  "Espresso & morgenro": 'product_type:"The Calm Kitchen"',
  "Slow living": 'product_type:"The Calm Kitchen"',
  "Gaver med mening": 'product_type:"The Gift Chapter"',
};

const QUOTES: Record<string, string> = {
  "hvordan-sliber-man-en-kniv":
    "Slibning er ikke en opgave. Det er ti minutter, hvor verden bliver stille.",
  "hvilken-kokkekniv-skal-jeg-vaelge":
    "Den rigtige kniv kender du, når du holder den. Resten er detaljer.",
  "kokkenet-som-fristed":
    "Køkkenet er det eneste sted i hjemmet, hvor alle sanser er i brug.",
  "damaskus-kniv-hvad-betyder-det":
    "Lagene er ikke kosmetik. De er fortællingen om stålet.",
  "gave-til-den-der-elsker-mad":
    "De bedste gaver bliver en del af hverdagen — ikke en gemmt oplevelse.",
};

const FAQS: Record<string, FaqEntry[]> = {
  "hvordan-sliber-man-en-kniv": [
    {
      question: "Hvor ofte skal jeg slibe min kniv?",
      answer:
        "For de fleste hjemmekokke er hver 2-3 måned passende. Hvæs imellem med en læderstrop eller keramisk stål.",
    },
    {
      question: "Hvilken slibesten skal jeg starte med?",
      answer:
        "En kombinationssten i 1000/5000 grit dækker 95% af alle hjemmekøkkeners behov — grov side til at skabe æggen, fin side til at polere.",
    },
    {
      question: "Hvad er den rigtige vinkel?",
      answer: "15-20° for de fleste kokkeknive. Hold den konstant og lad stenen gøre arbejdet.",
    },
  ],
  "hvilken-kokkekniv-skal-jeg-vaelge": [
    {
      question: "Hvilken størrelse kokkekniv passer mig?",
      answer: "20 cm er det alsidige standardvalg. Mindre hænder kan foretrække 18 cm.",
    },
    {
      question: "Hvad er forskellen på japansk og europæisk stål?",
      answer:
        "Japansk stål (60-62 HRC) er hårdere og holder skarpheden længere. Europæisk (54-56 HRC) er sejere og nemmere at vedligeholde.",
    },
  ],
  "gave-til-den-der-elsker-mad": [
    {
      question: "Hvilken gave passer til en madelsker?",
      answer: "En god kniv, en slibesten eller en magnetisk knivholder i træ — ting der bliver brugt dagligt.",
    },
    {
      question: "Hvad koster en god køkkengave?",
      answer:
        "En meningsfuld køkkengave koster typisk 400-1.200 kr. Det handler ikke om prisen — det handler om hvor ofte gaven bliver brugt.",
    },
  ],
  "kokkenet-som-fristed": [
    {
      question: "Hvordan gør jeg madlavning mere roligt?",
      answer:
        "Begynd med ét måltid om ugen, hvor du ikke skynder dig. Skær langsomt. Smag undervejs. Lad det tage tid.",
    },
  ],
};

/**
 * Bygger et Universet-fortælling fra en eksisterende artikel.
 */
function storyFromArticle(a: ArticleData): UniversetStory {
  const ritual = ritualFromArticle(a);
  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.intro,
    ritualCategory: ritual,
    readTime: a.readTime,
    publishedAt: PUBLISHED,
    modifiedAt: MODIFIED,
    imageSlot: `universet-story-${a.slug}`,
    imageMotif: a.title,
    relatedProductQuery: PRODUCT_QUERY_BY_RITUAL[ritual],
    relatedProductBlockTitle: "Det hører til ritualet",
    faq: FAQS[a.slug],
    quote: QUOTES[a.slug],
    articleSlug: a.slug,
  };
}

export const STORIES: UniversetStory[] = ARTICLES.map(storyFromArticle);

export function getStoryBySlug(slug: string): UniversetStory | undefined {
  return STORIES.find((s) => s.slug === slug);
}

export function getRelatedStories(slug: string, max = 3): UniversetStory[] {
  const current = getStoryBySlug(slug);
  if (!current) return STORIES.slice(0, max);
  // Samme ritualkategori først, derefter resten
  const sameCat = STORIES.filter((s) => s.slug !== slug && s.ritualCategory === current.ritualCategory);
  const others = STORIES.filter((s) => s.slug !== slug && s.ritualCategory !== current.ritualCategory);
  return [...sameCat, ...others].slice(0, max);
}

export function getStoriesByCategory(cat: RitualCategory | "Alle"): UniversetStory[] {
  if (cat === "Alle") return STORIES;
  return STORIES.filter((s) => s.ritualCategory === cat);
}

/** Den fremhævede fortælling (manuelt valgt). */
export const FEATURED_STORY_SLUG = "kokkenet-som-fristed";

export function getFeaturedStory(): UniversetStory {
  return getStoryBySlug(FEATURED_STORY_SLUG) ?? STORIES[0];
}
