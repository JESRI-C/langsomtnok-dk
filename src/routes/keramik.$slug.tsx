import { createFileRoute, notFound } from "@tanstack/react-router";
import { KeramikCategoryTemplate } from "@/components/keramik/KeramikCategoryTemplate";
import { buildCampaignHead, SITE_ORIGIN } from "@/lib/campaign-seo";

interface CategoryConfig {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  introTitle: string;
  introBody: string;
  productQuery: string;
  emptyText: string;
  ritualTitle: string;
  ritualBody: string;
  finalHeadline: string;
  finalBody: string;
  imageMotif: string;
}

const CATEGORIES: Record<string, CategoryConfig> = {
  kopper: {
    slug: "kopper",
    title: "Kopper",
    seoTitle: "Håndlavede keramikkopper | Langsomt Nok",
    seoDescription:
      "Håndlavede keramikkopper drejet i atelieret. Til kaffen, teen og de stille morgener.",
    eyebrow: "Morgenens ritual",
    headline: "Den langsomme morgenkop",
    subheadline: "Håndlavede kopper, der gør den første tår om morgenen til et lille ritual.",
    introTitle: "En kop er sjældent bare en kop",
    introBody:
      "Det er den, du tager ned hver morgen.\nDen, der bærer dampen, varmen og den første pause på dagen.\n\nNår den er drejet i hånden, mærker du det.",
    productQuery: "product_type:Keramik AND tag:kop",
    emptyText: "De første kopper er på vej fra atelieret. Tilmeld dig, og få besked, når de er klar.",
    ritualTitle: "Find din morgenkop",
    ritualBody: "Hver kop er drejet for sig. Vælg den, der passer hånden.",
    finalHeadline: "Hør hænderne bag",
    finalBody: "Kopperne bliver til i Susan Riels atelier — én ad gangen.",
    imageMotif: "Håndlavet keramikkop med dampende kaffe på linned i morgenlys",
  },
  skaale: {
    slug: "skaale",
    title: "Skåle",
    seoTitle: "Håndlavede keramikskåle | Langsomt Nok",
    seoDescription:
      "Håndlavede keramikskåle til servering, samling og bordets ro. Drejet i atelieret af Susan Riel.",
    eyebrow: "Bordets ro",
    headline: "Skåle, der samler bordet",
    subheadline: "Til olien, til frugten, til den langsomme middag.",
    introTitle: "Det, der står midt på bordet",
    introBody:
      "En skål er ikke pynt.\nDen er der, hvor maden samles, og hænderne mødes.\n\nDen får lov at være tung, jordnær og levende.",
    productQuery: "product_type:Keramik AND (tag:skål OR tag:skaal)",
    emptyText: "De første skåle er på vej. Tilmeld dig, og få besked, når atelieret åbner igen.",
    ritualTitle: "Find skålen til dit bord",
    ritualBody: "Forskellige størrelser. Forskellige glasurer. Hver med sin egen tone.",
    finalHeadline: "Mød keramikeren",
    finalBody: "Susan Riel drejer hver skål alene i sit atelier.",
    imageMotif: "Håndlavet keramikskål med olivenolie og brød på lyst egetræ i sidelys",
  },
  vaser: {
    slug: "vaser",
    title: "Vaser",
    seoTitle: "Håndlavede keramikvaser | Langsomt Nok",
    seoDescription:
      "Håndlavede keramikvaser til grene, blomster og rolige rum. Hver vase drejet alene i atelieret.",
    eyebrow: "Stille rum",
    headline: "Vaser til ro og blomster",
    subheadline: "Små former, der løfter en gren eller en enkelt blomst.",
    introTitle: "Et roligt sted til det levende",
    introBody:
      "En vase behøver ikke være stor.\nEn enkelt gren kan ændre et helt rum.\n\nFormen er der bare — som en stille indramning af det, der gror.",
    productQuery: "product_type:Keramik AND tag:vase",
    emptyText: "Vaserne er på vej fra atelieret. Tilmeld dig, og få besked, når de er klar.",
    ritualTitle: "Find vasen til dit hjørne",
    ritualBody: "Smalle, brede, lave, høje. Hver med plads til lidt forskelligt.",
    finalHeadline: "Mød keramikeren",
    finalBody: "Vaserne drejes en ad gangen i Susan Riels atelier.",
    imageMotif: "Håndlavet keramikvase med en enkelt gren mod hvid kalket væg i roligt sidelys",
  },
  unika: {
    slug: "unika",
    title: "Unika",
    seoTitle: "Unika keramik | Langsomt Nok",
    seoDescription:
      "Ét værk. Ét hjem. Unika-keramik fra Susan Riels atelier — værker der findes i ét eksemplar.",
    eyebrow: "Ét eksemplar",
    headline: "Unika — et værk, ét hjem",
    subheadline: "Værker, der ikke gentages. Når de er væk, er de væk.",
    introTitle: "Det, der kun findes én gang",
    introBody:
      "Nogle værker bliver til i et øjeblik, hvor leret, hånden og dagen mødes på en bestemt måde.\n\nDe gentages aldrig. Det er det, der gør dem til unika.",
    productQuery: "product_type:Keramik AND tag:unika",
    emptyText: "Næste unika-serie kommer fra atelieret snart. Tilmeld dig for at få den først at se.",
    ritualTitle: "Aktuelle unika-værker",
    ritualBody: "Hvert værk findes i ét eksemplar. Når det er væk, er det væk.",
    finalHeadline: "Mød keramikeren",
    finalBody: "Bag hvert unika står Susan Riel — drejer, glaserer og brænder i hånden.",
    imageMotif: "Unika keramikobjekt på rå træhylde i sidelys, sanseligt og roligt",
  },
};

export const Route = createFileRoute("/keramik/$slug")({
  head: ({ params }) => {
    const cfg = CATEGORIES[params.slug];
    if (!cfg) return { meta: [{ title: "Ikke fundet — Langsomt Nok" }] };
    return buildCampaignHead({
      pathname: `/keramik/${cfg.slug}`,
      title: cfg.seoTitle,
      description: cfg.seoDescription,
      breadcrumbs: [
        { name: "Forside", url: `${SITE_ORIGIN}/` },
        { name: "Håndlavet keramik", url: `${SITE_ORIGIN}/keramik` },
        { name: cfg.title, url: `${SITE_ORIGIN}/keramik/${cfg.slug}` },
      ],
    });
  },
  component: KeramikCategoryRoute,
  notFoundComponent: () => (
    <div className="container-calm py-24 text-center">
      <h1 className="font-serif text-3xl mb-4">Kategorien findes ikke</h1>
      <a href="/keramik" className="text-cta underline">
        Tilbage til keramik-universet
      </a>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container-calm py-24 text-center">
      <h1 className="font-serif text-3xl mb-4">Noget gik galt</h1>
      <p className="text-muted-foreground">{error.message}</p>
    </div>
  ),
});

function KeramikCategoryRoute() {
  const { slug } = Route.useParams();
  const cfg = CATEGORIES[slug];
  if (!cfg) throw notFound();

  return (
    <KeramikCategoryTemplate
      campaign={`keramik_${cfg.slug}`}
      eyebrow={cfg.eyebrow}
      headline={cfg.headline}
      subheadline={cfg.subheadline}
      introTitle={cfg.introTitle}
      introBody={cfg.introBody}
      productQuery={cfg.productQuery}
      emptyText={cfg.emptyText}
      ritualTitle={cfg.ritualTitle}
      ritualBody={cfg.ritualBody}
      finalHeadline={cfg.finalHeadline}
      finalBody={cfg.finalBody}
      imageName={`keramik-${cfg.slug}-hero`}
      imageMotif={cfg.imageMotif}
    />
  );
}
