/**
 * ============================================================================
 * COLLECTION PAGE - /collections/{handle}
 * ============================================================================
 * Fetches collection from Shopify with editorial intro copy per collection.
 * Also supports older/internal alias handles so existing links do not lead to
 * empty collection experiences.
 * ============================================================================
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, HelpCircle, Package, ShieldCheck, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { TrustBar } from "@/components/landing/TrustBar";
import { storefrontApiRequest, COLLECTION_BY_HANDLE_QUERY, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import kniveHero from "@/assets/knive-hero.png";

const HERO_BACKGROUNDS: Record<string, string> = {
  knive: kniveHero,
  "the-chef-line": kniveHero,
};

const SORT_OPTIONS = [
  { label: "Anbefalet", key: "COLLECTION_DEFAULT", reverse: false },
  { label: "Pris: Lav til høj", key: "PRICE", reverse: false },
  { label: "Pris: Høj til lav", key: "PRICE", reverse: true },
  { label: "Nyeste", key: "CREATED", reverse: true },
  { label: "Titel: A-Å", key: "TITLE", reverse: false },
];

type CollectionContent = {
  tagline: string;
  intro: string;
  promise: string;
  body: string;
  highlights: string[];
  bestFor: string[];
  guideTitle: string;
  guideText: string;
  links?: Array<{ label: string; href: string; text: string }>;
  faq: Array<{ question: string; answer: string }>;
};

const DEFAULT_CONTENT: CollectionContent = {
  tagline: "Udvalgt af Langsomt Nok",
  intro: "Produkter valgt for funktion, materialer og ro i hverdagen.",
  promise: "Et roligere valg til hjemmet.",
  body: "Her finder du produkter, der er udvalgt til at blive brugt. Ikke kun kigget på. Vores fokus er enkle materialer, tydelig funktion og en oplevelse, der passer ind i et hjem med lidt mere nærvær.",
  highlights: ["Udvalgt med fokus på kvalitet", "Pakket med omhu", "Sendes fra Danmark"],
  bestFor: ["Dig, der vil købe færre, men bedre ting", "Dig, der ønsker produkter med roligt udtryk", "Dig, der gerne vil give en brugbar gave"],
  guideTitle: "Sådan vælger du roligt",
  guideText: "Start med det, du faktisk mangler i hverdagen. Vælg derefter materiale, størrelse og udtryk. Det bedste køb er ofte det, du får lyst til at bruge igen og igen.",
  faq: [
    { question: "Hvordan vælger jeg det rigtige produkt?", answer: "Start med din hverdag. Skal det bruges dagligt, gives som gave eller skabe mere ro i køkkenet? Vælg derefter efter størrelse, materiale og funktion." },
    { question: "Sendes produkterne fra Danmark?", answer: "Ja, ordrer pakkes med omhu og sendes fra Danmark." },
  ],
};

const COLLECTION_CONTENT: Record<string, CollectionContent> = {
  knive: {
    tagline: "The Chef Line",
    intro: "Knive til hænder, der gerne vil mærke forskellen.",
    promise: "Skarphed, balance og tyngde i hånden.",
    body: "En god kniv gør madlavning mere rolig. Ikke fordi den larmer med teknik, men fordi den bare føles rigtig. Her finder du knive valgt for greb, balance, stål og den daglige glæde ved et redskab, der arbejder med dig.",
    highlights: ["Til daglig madlavning", "Fokus på greb og balance", "Udvalgt til lang levetid"],
    bestFor: ["Din første rigtige kokkekniv", "Gaven til madelskeren", "Dig, der vil opgradere køkkenets vigtigste redskab"],
    guideTitle: "Hvilken kniv skal jeg begynde med?",
    guideText: "Start med én god kokkekniv. Den skal ligge naturligt i hånden og passe til den mad, du faktisk laver. Derefter kan du bygge stille videre med specialknive og pleje.",
    links: [
      { label: "Læs guide til første kokkekniv", href: "/pages/den-forste-rigtige-kokkekniv", text: "Få hjælp til greb, størrelse og valg." },
      { label: "Læs om damaskusknive", href: "/pages/damaskus-kniv", text: "Forstå stålet, lagene og udtrykket." },
    ],
    faq: [
      { question: "Hvilken kniv skal jeg vælge først?", answer: "For de fleste er en alsidig kokkekniv det bedste første valg. Den kan bruges til grønt, kød, urter og de fleste opgaver i hverdagen." },
      { question: "Hvordan holder jeg kniven skarp?", answer: "Brug et godt skærebræt, vask i hånden og vedligehold eggen med slibesten eller passende sliberedskab. Opvaskemaskine er no-go, hvis kniven skal leve længe." },
      { question: "Er knivene gode som gave?", answer: "Ja, især til mennesker der elsker madlavning. Vælg en kniv, der føles som et løft i hverdagen, ikke som pynt til en skuffe." },
    ],
  },
  "the-chef-line": undefined as unknown as CollectionContent,
  slibesten: {
    tagline: "The Ritual Set",
    intro: "Skarphed er ikke tilfældig. Den er plejet.",
    promise: "Små plejeritualer til redskaber, der gerne må holde længe.",
    body: "Slibning og pleje handler ikke kun om vedligehold. Det er et stille ritual, hvor du giver dine redskaber mere levetid. Her finder du produkter til skarphed, træ, olie og den slags ro, der begynder før madlavningen.",
    highlights: ["Til knivpleje og skarphed", "Forlænger levetiden", "Gør vedligehold enkelt"],
    bestFor: ["Dig med en god kniv", "Dig, der vil lære at slibe", "Gaven til den praktiske madelsker"],
    guideTitle: "Slibning skal ikke være svært",
    guideText: "Det vigtigste er at begynde roligt. Brug lidt tid, lidt vand og et fast greb. En skarp kniv er både mere præcis, mere behagelig og mere sikker at arbejde med.",
    links: [
      { label: "Sådan sliber du din kniv", href: "/pages/saadan-sliber-du-din-kniv", text: "En enkel guide til slibesten og rytme." },
      { label: "Hold din kniv skarp", href: "/ritualer/hold-kniven-skarp", text: "Små vaner, der gør en stor forskel." },
    ],
    faq: [
      { question: "Hvilken slibesten skal jeg vælge?", answer: "En kombinationssten er ofte et godt sted at starte. Den giver både mulighed for at genopbygge skarphed og afslutte med en finere æg." },
      { question: "Hvor ofte skal jeg slibe?", answer: "Det afhænger af brug. En kniv, der bruges ofte, har godt af løbende vedligehold. Vent ikke til den er helt sløv." },
      { question: "Er slibning svært?", answer: "Det kræver lidt tålmodighed, men ikke drama. Start langsomt, hold vinklen stabil og lad stenen gøre arbejdet." },
    ],
  },
  "slibning-pleje": undefined as unknown as CollectionContent,
  "pleje-ritualer": undefined as unknown as CollectionContent,
  "the-ritual-set": undefined as unknown as CollectionContent,
  "magnetiske-holdere": {
    tagline: "The Calm Kitchen",
    intro: "Når værktøjet er smukt, skal det ikke gemmes væk.",
    promise: "Rolig opbevaring til knive, der gerne må være synlige.",
    body: "En magnetisk knivholder giver knivene en fast plads og køkkenet et roligere udtryk. Det handler om overblik, sikkerhed og følelsen af, at de ting du bruger mest, er lige ved hånden.",
    highlights: ["Frigør plads på bordet", "Gør knivene nemme at nå", "Skaber et roligt visuelt udtryk"],
    bestFor: ["Små køkkener", "Knive du bruger ofte", "Dig, der vil have orden uden at gemme alt væk"],
    guideTitle: "Væg, bord eller display?",
    guideText: "Vælg vægholder, hvis du vil frigøre bordplads. Vælg display eller blok, hvis du vil kunne flytte opbevaringen rundt. Det rigtige valg er det, der giver ro i dit køkken.",
    links: [
      { label: "Hvilken knivholder skal jeg vælge?", href: "/pages/hvilken-knivholder-skal-jeg-vaelge", text: "Få hjælp til væg, bord og materialer." },
      { label: "Knivholder i træ", href: "/pages/knivholder-i-trae", text: "Læs om træ, udtryk og opbevaring." },
    ],
    faq: [
      { question: "Hvorfor vælge magnetisk knivholder?", answer: "Den giver overblik, frigør plads og gør knivene lette at tage frem. Samtidig kan en smuk kniv få lov at være en del af køkkenets udtryk." },
      { question: "Er magnetisk opbevaring sikker?", answer: "Ja, når holderen bruges korrekt, og knivene placeres stabilt. Sørg altid for, at holderen monteres eller placeres forsvarligt." },
      { question: "Passer den til alle knive?", answer: "De fleste knive med magnetisk stål kan bruges. Meget små eller meget tunge knive bør altid testes roligt på holderen." },
    ],
  },
  "magnetisk-opbevaring": undefined as unknown as CollectionContent,
  "the-calm-kitchen": undefined as unknown as CollectionContent,
  gaver: {
    tagline: "The Gift Chapter",
    intro: "Gaver, der bliver brugt. Ikke bare pakket ud.",
    promise: "Gaver med funktion, ro og lidt mere eftertanke.",
    body: "En god gave skal ikke larme. Den skal ramme noget i hverdagen. Her finder du gaver til mennesker, der holder af mad, materialer, små ritualer og ting, der bliver brugt længe efter gavepapiret er væk.",
    highlights: ["Til madelskere", "Brugbare gaver", "Pakket med omhu"],
    bestFor: ["Fødselsdag", "Værtindegave", "Fars dag", "Indflyttergave"],
    guideTitle: "Vælg gave efter hverdagen",
    guideText: "Tænk mindre på om gaven imponerer i fem sekunder, og mere på om den bliver brugt i fem år. En kniv, en skål eller et plejesæt kan blive en del af modtagerens rytme.",
    links: [
      { label: "Gave til madelskeren", href: "/pages/gave-til-madelskeren", text: "Find en gave til den, der elsker køkkenet." },
      { label: "Gaver med ro", href: "/pages/gaver-med-ro", text: "Gaver der føles rolige og gennemtænkte." },
    ],
    faq: [
      { question: "Hvad er en god gave fra Langsomt Nok?", answer: "En god gave er noget, der passer ind i modtagerens hverdag. Knive, keramik og plejeprodukter er gode valg, fordi de kan bruges igen og igen." },
      { question: "Kan produkterne gives som værtindegave?", answer: "Ja. Særligt keramik, små skåle og brugbare køkkenprodukter passer godt som rolige værtindegaver." },
      { question: "Hvad hvis jeg er i tvivl?", answer: "Vælg det mest enkle. Gaver med tydelig funktion og rolige materialer rammer ofte bedre end noget meget specifikt." },
    ],
  },
  "the-gift-chapter": undefined as unknown as CollectionContent,
  "handlavet-keramik": {
    tagline: "Håndlavet keramik",
    intro: "Keramik skabt i hænder. Til rolige morgener, små serveringer og hverdage, der gerne må gå lidt langsommere.",
    promise: "Hver form bærer spor af hænder, ler og tid.",
    body: "Håndlavet keramik er aldrig helt ens. Det er netop pointen. Små variationer i glasur, kant og form giver hvert stykke sit eget liv. Her finder du kopper, skåle, vaser og unika til hverdage med lidt mere stoflighed.",
    highlights: ["Håndlavet i små serier", "Unikke glasurer", "Til brug, ikke kun pynt"],
    bestFor: ["Morgenkaffe", "Små serveringer", "Gaver med personlighed", "Rolige hylder og borde"],
    guideTitle: "Keramik må gerne mærkes",
    guideText: "Vælg efter den situation, du vil bruge det i. En kop til morgenens første pause. En skål til frugt, salt eller små serveringer. En vase til grene, der må stå længe.",
    links: [
      { label: "Mød Susan Riel", href: "/keramik/susan-riel", text: "Læs om kunstneren bag keramikken." },
      { label: "Læs om håndlavet keramik", href: "/pages/haandlavet-keramik", text: "Forstå glasur, variationer og udtryk." },
    ],
    faq: [
      { question: "Er hvert stykke keramik unikt?", answer: "Ja. Små forskelle i glasur, form og overflade er en del af udtrykket. Det er ikke fejl, men spor af hænder og proces." },
      { question: "Kan keramikken bruges i hverdagen?", answer: "Ja, keramikken er valgt til at blive brugt. Læs altid produktsiden for konkrete anbefalinger om opvask, varme og pleje." },
      { question: "Kommer der flere af samme produkt?", answer: "Nogle produkter findes i små serier. Andre er unika. Når et unika er solgt, kommer præcis det samme ikke igen." },
    ],
  },
  "susan-riel": {
    tagline: "Atelier Susan Riel",
    intro: "Keramik fra Susan Riel - levende glasurer, rolige former og tydelige spor af hænder.",
    promise: "Små værker til hjem, hvor materialer gerne må have personlighed.",
    body: "Susan Riels keramik har et levende udtryk, hvor glasur og form arbejder sammen. Det er keramik, der gerne må stå fremme, men som også er skabt til at blive brugt i hverdagen.",
    highlights: ["Keramik fra Susan Riel", "Levende glasurer", "Små serier og unika"],
    bestFor: ["Samleren", "Den rolige gave", "Dig, der ønsker keramik med tydelige hænder"],
    guideTitle: "Keramik med menneskelige spor",
    guideText: "Vælg det stykke, der fanger øjet først. Håndlavet keramik er ikke en perfekt gentagelse. Det er en lille beslutning om stemning, farve og form.",
    links: [
      { label: "Se al håndlavet keramik", href: "/collections/handlavet-keramik", text: "Gå tilbage til hele keramikuniverset." },
      { label: "Læs om håndlavet keramik", href: "/pages/haandlavet-keramik", text: "Få rolig forklaring på materialer og variationer." },
    ],
    faq: [
      { question: "Hvem laver keramikken?", answer: "Denne kollektion samler keramik fra Susan Riel. Udtrykket er præget af håndens arbejde, glasurens bevægelse og små forskelle fra stykke til stykke." },
      { question: "Er det unika?", answer: "Noget er unika, andet findes i små serier. Det fremgår af produktet, hvis et stykke kun findes i ét eksemplar." },
    ],
  },
  keramikkopper: {
    tagline: "Keramikkopper",
    intro: "Kopper til kaffe, te og små pauser i dagen.",
    promise: "Til den første varme kop og det lille ophold midt i dagen.",
    body: "En kop er et af de mest brugte objekter i hjemmet. Derfor må den gerne føles rigtig. Her finder du håndlavede kopper med vægt, glasur og variationer, der gør pausen lidt mere nærværende.",
    highlights: ["Til kaffe og te", "Håndlavet udtryk", "Gode som gave"],
    bestFor: ["Morgenkaffe", "Te om aftenen", "En lille personlig gave"],
    guideTitle: "Vælg kop efter rytme",
    guideText: "En lille kop gør kaffen mere koncentreret. En større kop giver mere tid. Vælg den form, du får lyst til at holde om.",
    faq: [
      { question: "Er kopperne ens?", answer: "Nej, små forskelle er naturlige i håndlavet keramik. Hver kop har sit eget udtryk." },
      { question: "Kan de bruges hver dag?", answer: "Ja, de er tænkt til hverdagsbrug. Se altid produktets konkrete plejeanbefalinger." },
    ],
  },
  keramikskale: {
    tagline: "Keramikskåle",
    intro: "Skåle til servering, samling og stille hverdagsritualer.",
    promise: "Til frugt, salt, snacks, servering og de små ting, der samler bordet.",
    body: "En skål kan være praktisk og smuk på samme tid. Her finder du håndlavede skåle til små serveringer, rolige borde og hverdage, hvor materialet gerne må have en synlig plads.",
    highlights: ["Til servering", "Til små hverdagsritualer", "Håndlavede variationer"],
    bestFor: ["Morgenbord", "Tapas og små serveringer", "Gave til hjemmet"],
    guideTitle: "Vælg skål efter brug",
    guideText: "Små skåle er gode til salt, nødder og snacks. Større skåle samler frugt, salat eller brød. Vælg efter den plads, den skal have i hverdagen.",
    faq: [
      { question: "Hvad kan skålene bruges til?", answer: "De kan bruges til servering, små retter, frugt, snacks eller som roligt objekt på bord og hylde." },
      { question: "Er glasuren ens på alle skåle?", answer: "Nej. Glasuren kan variere fra stykke til stykke, og det er en del af keramikken." },
    ],
  },
  keramikvaser: {
    tagline: "Keramikvaser",
    intro: "Små former til grene, blomster og rolige rum.",
    promise: "Til en enkelt gren, en stille buket eller et roligt punkt i rummet.",
    body: "En vase behøver ikke fylde meget for at ændre et rum. Her finder du håndlavede vaser med stoflighed, glasur og form, der giver plads til det enkle.",
    highlights: ["Til blomster og grene", "Dekorativ uden støj", "Håndlavet form"],
    bestFor: ["Vindueskarmen", "Spisebordet", "En rolig gave"],
    guideTitle: "Vælg vase efter det, du samler ind",
    guideText: "En lille vase kan bære én gren. En større vase kan samle en buket. Tænk på rummet, lyset og den plads, vasen skal have.",
    faq: [
      { question: "Kan vaserne holde vand?", answer: "Se altid den enkelte produktside for information. Håndlavet keramik kan variere i glasur og anvendelse." },
      { question: "Er vaserne unika?", answer: "Nogle vaser findes kun i ét eksemplar, andre i små serier. Det fremgår på produktet." },
    ],
  },
  keramikunika: {
    tagline: "Keramikunika",
    intro: "Ét værk. Ét hjem. Én stille videre rejse.",
    promise: "Til dig, der vil have noget, der ikke gentager sig selv.",
    body: "Unika er keramik med sin egen rytme. Formen, glasuren og overfladen findes kun sådan én gang. Når et stykke er solgt, går det videre til et nyt hjem og kommer ikke tilbage som kopi.",
    highlights: ["Ét eksemplar", "Personligt udtryk", "Særligt velegnet som gave"],
    bestFor: ["Samleren", "Den særlige gave", "Hylder, borde og stille steder"],
    guideTitle: "Når noget kun findes én gang",
    guideText: "Vælg med øjet først. Unika handler om mødet mellem form og fornemmelse. Det skal ikke passe til alt. Det skal passe til et sted.",
    faq: [
      { question: "Kommer et solgt unika igen?", answer: "Nej, ikke som præcis samme stykke. Der kan komme beslægtede former og glasurer, men hvert unika er sit eget." },
      { question: "Hvordan vælger jeg unika?", answer: "Vælg det, der bliver ved med at trække blikket tilbage. Det er ofte det rigtige stykke." },
    ],
  },
};

COLLECTION_CONTENT["the-chef-line"] = COLLECTION_CONTENT.knive;
COLLECTION_CONTENT["slibning-pleje"] = COLLECTION_CONTENT.slibesten;
COLLECTION_CONTENT["pleje-ritualer"] = COLLECTION_CONTENT.slibesten;
COLLECTION_CONTENT["the-ritual-set"] = COLLECTION_CONTENT.slibesten;
COLLECTION_CONTENT["magnetisk-opbevaring"] = COLLECTION_CONTENT["magnetiske-holdere"];
COLLECTION_CONTENT["the-calm-kitchen"] = COLLECTION_CONTENT["magnetiske-holdere"];
COLLECTION_CONTENT["the-gift-chapter"] = COLLECTION_CONTENT.gaver;

const COLLECTION_PRODUCT_TYPE_FALLBACK: Record<string, string> = {
  knive: 'product_type:"The Chef Line"',
  "the-chef-line": 'product_type:"The Chef Line"',
  "damascus-kollektionen-stal-tid-og-handvaerk": "damascus OR damaskus",
  slibesten: 'product_type:"The Ritual Set"',
  "slibning-pleje": 'product_type:"The Ritual Set"',
  "pleje-ritualer": 'product_type:"The Ritual Set"',
  "the-ritual-set": 'product_type:"The Ritual Set"',
  "magnetiske-holdere": 'product_type:"The Calm Kitchen"',
  "magnetisk-opbevaring": 'product_type:"The Calm Kitchen"',
  "the-calm-kitchen": 'product_type:"The Calm Kitchen"',
  gaver: 'product_type:"The Gift Chapter"',
  "the-gift-chapter": 'product_type:"The Gift Chapter"',
  "start-dit-ritual": "",
  "handlavet-keramik": "product_type:Keramik",
  "susan-riel": 'vendor:"Susan Riel"',
  keramikkopper: "product_type:Keramik AND tag:kop",
  keramikskale: "product_type:Keramik AND (tag:skål OR tag:skaal)",
  keramikvaser: "product_type:Keramik AND tag:vase",
  keramikunika: "product_type:Keramik AND tag:unika",
};

const CATEGORY_NAV = [
  { label: "Knive", href: "/collections/knive" },
  { label: "Slibning & pleje", href: "/collections/slibning-pleje" },
  { label: "Magnetisk opbevaring", href: "/collections/magnetiske-holdere" },
  { label: "Gaver", href: "/collections/gaver" },
  { label: "Keramik", href: "/collections/handlavet-keramik" },
];

export const Route = createFileRoute("/collections/$handle")({
  head: ({ params }) => {
    const info = COLLECTION_CONTENT[params.handle] || DEFAULT_CONTENT;
    const title = `${info.tagline} | Langsomt Nok`;
    const desc = info.intro;
    const url = `https://langsomtnok.dk/collections/${params.handle}`;
    const collectionLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: title,
      description: desc,
      url,
      isPartOf: { "@type": "WebSite", name: "Langsomt Nok", url: "https://langsomtnok.dk" },
    };
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Forside", item: "https://langsomtnok.dk/" },
        { "@type": "ListItem", position: 2, name: "Shop", item: "https://langsomtnok.dk/shop" },
        { "@type": "ListItem", position: 3, name: info.tagline, item: url },
      ],
    };
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(collectionLd) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbLd) },
      ],
    };
  },
  component: CollectionPage,
});

function CollectionPage() {
  const { handle } = Route.useParams();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [collection, setCollection] = useState<{ title: string; description: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortIdx, setSortIdx] = useState(0);

  const content = COLLECTION_CONTENT[handle] || DEFAULT_CONTENT;

  useEffect(() => {
    setLoading(true);
    const sort = SORT_OPTIONS[sortIdx];

    storefrontApiRequest(COLLECTION_BY_HANDLE_QUERY, {
      handle,
      first: 50,
      sortKey: sort.key,
      reverse: sort.reverse,
    })
      .then(async (data) => {
        const col = data?.data?.collection;
        if (col && col.products?.edges?.length > 0) {
          setCollection({ title: col.title, description: col.description });
          setProducts(col.products.edges);
        } else {
          const fallbackQuery = COLLECTION_PRODUCT_TYPE_FALLBACK[handle];
          if (fallbackQuery !== undefined) {
            setCollection({ title: content.tagline || col?.title || handle, description: content.intro || col?.description || "" });
            const fbData = await storefrontApiRequest(PRODUCTS_QUERY, { first: 50, ...(fallbackQuery ? { query: fallbackQuery } : {}) });
            setProducts(fbData?.data?.products?.edges || []);
          } else {
            setCollection(col ? { title: col.title, description: col.description } : null);
            setProducts([]);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [handle, sortIdx]);

  const heroBg = HERO_BACKGROUNDS[handle];

  return (
    <div className="pt-24 bg-background">
      <section className={`section-padding pb-10 relative overflow-hidden ${heroBg ? "isolate" : ""}`}>
        {heroBg && (
          <>
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <img
                src={heroBg}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover ken-burns"
              />
            </div>
            <div
              className="absolute inset-0 -z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(100deg, hsl(var(--background)) 0%, hsl(var(--background)/0.92) 38%, hsl(var(--background)/0.55) 65%, hsl(var(--background)/0.2) 100%)",
              }}
            />
          </>
        )}
        <div className="container-calm relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2 mb-6 text-xs text-muted-foreground">
                <Link to="/" className="hover:text-cta transition-colors">Forside</Link>
                <span>/</span>
                <Link to="/shop" className="hover:text-cta transition-colors">Shop</Link>
                <span>/</span>
                <span className="text-foreground/70">{content.tagline}</span>
              </div>
              <span className="text-xs font-medium text-copper uppercase tracking-widest mb-4 block">
                {content.tagline}
              </span>
              <h1 className="font-serif text-4xl md:text-6xl leading-tight mb-6">
                {collection?.title || content.tagline}
              </h1>
              <p className="text-editorial text-muted-foreground max-w-2xl mb-6">
                {content.intro}
              </p>
              <p className="text-base md:text-lg text-foreground/70 leading-relaxed max-w-2xl">
                {content.body}
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-border/60 bg-soft/60 p-6 md:p-8 shadow-sm">
                <div className="flex items-start gap-3 mb-5">
                  <Sparkles className="w-5 h-5 text-copper mt-1" strokeWidth={1.5} />
                  <div>
                    <h2 className="font-serif text-2xl text-foreground mb-2">{content.promise}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Vælg langsomt. Brug længe. Lad materialerne få plads i hverdagen.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {content.highlights.map((highlight) => (
                    <div key={highlight} className="flex items-center gap-2 text-sm text-foreground/70">
                      <CheckCircle2 className="w-4 h-4 text-cta" strokeWidth={1.5} />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {CATEGORY_NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  item.href.endsWith(handle)
                    ? "border-cta bg-cta text-cta-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-cta/40 hover:text-foreground"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding py-10 bg-soft/40">
        <div className="container-calm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <article className="rounded-xl bg-background/80 border border-border/60 p-6">
              <Package className="w-5 h-5 text-copper mb-4" strokeWidth={1.5} />
              <h2 className="font-serif text-2xl mb-3">Hvad finder du her?</h2>
              <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                {content.bestFor.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-copper">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-xl bg-background/80 border border-border/60 p-6 lg:col-span-2">
              <HelpCircle className="w-5 h-5 text-copper mb-4" strokeWidth={1.5} />
              <h2 className="font-serif text-2xl mb-3">{content.guideTitle}</h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl mb-6">
                {content.guideText}
              </p>
              {content.links && content.links.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {content.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="group rounded-lg border border-border/60 bg-soft/50 p-4 transition-colors hover:border-cta/40"
                    >
                      <span className="flex items-center justify-between gap-3 font-medium text-foreground">
                        {link.label}
                        <ArrowRight className="w-4 h-4 text-cta transition-transform group-hover:translate-x-1" />
                      </span>
                      <span className="mt-2 block text-sm text-muted-foreground leading-relaxed">{link.text}</span>
                    </a>
                  ))}
                </div>
              ) : null}
            </article>
          </div>
        </div>
      </section>

      <section className="section-padding pt-12">
        <div className="container-calm">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 border-b border-border pb-5">
            <div>
              <span className="text-xs font-medium text-copper uppercase tracking-widest mb-2 block">Udvalg</span>
              <h2 className="font-serif text-3xl md:text-4xl">Se produkterne</h2>
            </div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground whitespace-nowrap">{products.length} produkter</p>
              <select
                value={sortIdx}
                onChange={(e) => setSortIdx(Number(e.target.value))}
                className="text-sm bg-transparent border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-cta/30"
              >
                {SORT_OPTIONS.map((opt, i) => (
                  <option key={`${opt.key}-${opt.reverse}`} value={i}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-linen rounded-lg mb-4" />
                  <div className="h-4 bg-linen rounded w-2/3 mb-2" />
                  <div className="h-3 bg-linen rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 mb-16 rounded-xl border border-border/60 bg-soft/40">
              <p className="font-serif text-xl text-muted-foreground mb-2">Ingen produkter i denne kollektion endnu</p>
              <p className="text-sm text-muted-foreground/60">Produkter tilføjes snart.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {products.map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-padding py-12 bg-linen/40">
        <div className="container-calm max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {[
              { icon: ShieldCheck, title: "Tryg betaling", text: "Betaling foregår sikkert via webshoppen." },
              { icon: Package, title: "Pakket med omhu", text: "Vi pakker din ordre roligt og forsvarligt." },
              { icon: CheckCircle2, title: "Tydelige vilkår", text: "14 dages fortrydelsesret og direkte kontakt." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl bg-background/70 border border-border/60 p-5">
                <item.icon className="w-5 h-5 text-cta mb-4" strokeWidth={1.5} />
                <h3 className="font-serif text-xl mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-background/80 border border-border/60 p-6 md:p-8">
            <h2 className="font-serif text-3xl mb-6">Spørgsmål før du vælger</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.faq.map((item) => (
                <div key={item.question} className="border-t border-border/60 pt-5">
                  <h3 className="font-medium text-foreground mb-2">{item.question}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TrustBar />
      <NewsletterSignup />
    </div>
  );
}
