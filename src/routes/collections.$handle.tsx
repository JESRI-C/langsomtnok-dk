/**
 * ============================================================================
 * COLLECTION PAGE - /collections/{handle}
 * ============================================================================
 * Each collection is rendered as a calm landing page:
 *   Hero (with visible copper star/trust line)
 *   Compact service bar
 *   Three benefit cards
 *   Product grid with sort
 *   Buying guide (warm beige) + "Et godt sted at begynde"
 *   Other rituals (internal navigation)
 *   FAQ + SEO text
 * ============================================================================
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  HelpCircle,
  MapPin,
  Package,
  RotateCcw,
  Shield,
  Star,
  Truck,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { VideoShowcase } from "@/components/VideoShowcase";
import {
  storefrontApiRequest,
  COLLECTION_BY_HANDLE_QUERY,
  PRODUCTS_QUERY,
  type ShopifyProduct,
} from "@/lib/shopify";
import { trackCollectionView } from "@/lib/analytics";
import kniveHero from "@/assets/knive-hero.png";
import slibningHero from "@/assets/slibning-hero.png";
import holdereHero from "@/assets/holdere-hero.png";
import gaverHero from "@/assets/gaver-hero.png";

const HERO_BACKGROUNDS: Record<string, string> = {
  knive: kniveHero,
  "the-chef-line": kniveHero,
  slibesten: slibningHero,
  "slibning-pleje": slibningHero,
  "pleje-ritualer": slibningHero,
  "the-ritual-set": slibningHero,
  "magnetiske-holdere": holdereHero,
  "magnetisk-opbevaring": holdereHero,
  "the-calm-kitchen": holdereHero,
  gaver: gaverHero,
  "the-gift-chapter": gaverHero,
};

const SORT_OPTIONS = [
  { label: "Anbefalet", key: "COLLECTION_DEFAULT", reverse: false },
  { label: "Pris: Lav til høj", key: "PRICE", reverse: false },
  { label: "Pris: Høj til lav", key: "PRICE", reverse: true },
  { label: "Nyeste", key: "CREATED", reverse: true },
  { label: "Titel: A-Å", key: "TITLE", reverse: false },
];

// ---------- Category meta (the "why buy from this collection?" layer) ----------

type CategoryKey = "knives" | "care" | "display" | "bundle" | "gift" | "ceramic" | "default";

type CategoryMeta = {
  h1: string;
  intro: string;
  scoreLabel: string;
  scoreTrustLine: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  benefitCards: Array<{ title: string; text: string }>;
  guideTitle: string;
  guideItems: string[];
  startTitle: string;
  startText: string;
  startCta: { label: string; href: string };
  productBenefit: string;
  seoHeading: string;
  seoBody: string;
};

const CATEGORY_META: Record<CategoryKey, CategoryMeta> = {
  knives: {
    h1: "Knive til rolige hænder og præcise snit",
    intro:
      "En god kniv skal ikke bare være skarp. Den skal føles rigtig i hånden, ligge roligt ved skærebrættet og gøre madlavningen mere nærværende.",
    scoreLabel: "Ritual Score",
    scoreTrustLine: "Ritual Score · Udvalgt for skarphed, balance og materialefølelse",
    primaryCta: { label: "Se knivene", href: "#produkter" },
    secondaryCta: { label: "Find dit køkkenritual", href: "/find-dit-ritual" },
    benefitCards: [
      { title: "Skarphed med ro", text: "Knive valgt for præcise snit og en stabil æg." },
      { title: "Materialer der må stå fremme", text: "Stål og træ med stoflighed og varme." },
      { title: "Til både hverdag og langsomme måltider", text: "Daglig brug uden at miste karakter." },
    ],
    guideTitle: "Sådan vælger du rigtigt",
    guideItems: [
      "Vælg kokkekniven, hvis du vil have én stærk hovedkniv.",
      "Vælg universalkniven, hvis du vil have kontrol til mindre snit.",
      "Tilføj slibning, hvis kniven skal holde sig levende.",
    ],
    startTitle: "Et godt sted at begynde",
    startText:
      "Start med kokkekniven, hvis du vil have én stærk hovedkniv til hverdagen.",
    startCta: { label: "Se anbefalingen", href: "/pages/den-forste-rigtige-kokkekniv" },
    productBenefit: "Til præcision, balance og hverdagsro.",
    seoHeading: "Køkkenknive til hverdagen og det langsomme måltid",
    seoBody:
      "Hos Langsomt Nok finder du køkkenknive valgt for greb, balance og materialefølelse. Hver kniv er udvalgt til at blive brugt - ikke gemt væk. Find kokkeknive, universalknive og specialknive til både den daglige rytme og de stille måltider, hvor redskabet må mærkes.",
  },
  care: {
    h1: "Slibesten & pleje",
    intro:
      "Når kniven maser tomaten, er det tid til rolig skarphed. Slibesten, stropper og redskaber der holder æggen levende i hverdagen.",
    scoreLabel: "Care Score",
    scoreTrustLine: "Sendes fra Danmark · Levering 1-2 dage · 30 dages returret",
    primaryCta: { label: "Find din slibesten", href: "#produkter" },
    secondaryCta: { label: "Læs slibeguiden", href: "/pages/saadan-sliber-du-din-kniv" },
    benefitCards: [
      { title: "Almindelig vedligeholdelse", text: "#1000/#5000 – det bedste sted at begynde." },
      { title: "Fin polering", text: "#3000/#8000 til den sidste, glatte afslutning." },
      { title: "Komplet pleje", text: "Kombiner med en læderstrop og en stabil holder." },
    ],
    guideTitle: "Sådan vælger du rigtigt",
    guideItems: [
      "Til almindelig vedligeholdelse: #1000/#5000.",
      "Til fin polering: #3000/#8000.",
      "Til komplet pleje: kombiner med læderstrop.",
      "Holderen giver stabilitet og kontrol.",
    ],
    startTitle: "Et godt sted at begynde",
    startText:
      "Start med Grundstenen 1000/5000, hvis du vil lære at holde dine knive skarpe.",
    startCta: { label: "Se anbefalingen", href: "/pages/slibesten-guide" },
    productBenefit: "Til pleje, skarphed og længere levetid.",
    seoHeading: "Knivslibning som en del af hverdagen",
    seoBody:
      "Hos Langsomt Nok finder du slibesten, læderstropper og knivslibere til dig, der vil passe bedre på dine køkkenknive. Produkterne er udvalgt til rolig vedligeholdelse, så skarphed bliver noget, du kan vende tilbage til - ikke noget, der forsvinder.",
  },
  display: {
    h1: "Magnetiske knivholdere",
    intro:
      "Få knivene ud af skuffen. Beskyt æggen, frigør plads og skab ro på køkkenbordet.",
    scoreLabel: "Display Score",
    scoreTrustLine: "Sendes fra Danmark · Levering 1-2 dage · 30 dages returret",
    primaryCta: { label: "Se knivholderne", href: "#produkter" },
    secondaryCta: { label: "Hvilken knivholder skal jeg vælge?", href: "/pages/hvilken-knivholder-skal-jeg-vaelge" },
    benefitCards: [
      { title: "Beskytter knivens æg", text: "Knivene rører ikke hinanden eller bestik." },
      { title: "Frigør plads i skuffen", text: "Mere overskud på køkkenbordet." },
      { title: "Giver roligt overblik", text: "Du ser dine redskaber – og griber det rigtige." },
      { title: "Gør dine bedste redskaber synlige", text: "Smukke materialer må gerne stå fremme." },
    ],
    guideTitle: "Hvorfor vælge en magnetisk knivholder?",
    guideItems: [
      "Beskytter knivens æg mod slag og slid i skuffen.",
      "Frigør plads og giver mere bordplads.",
      "Giver roligt overblik over dine vigtigste knive.",
      "Gør dine bedste redskaber synlige og smukke.",
    ],
    startTitle: "Et godt sted at begynde",
    startText:
      "Start med en magnetisk knivlist, hvis du vil skabe mere ro og overblik på køkkenvæggen.",
    startCta: { label: "Se anbefalingen", href: "/pages/knivholder-til-koekkenet" },
    productBenefit: "Til dig der vil have knivene synligt og sikkert frem.",
    seoHeading: "Magnetiske knivholdere i træ til det rolige køkken",
    seoBody:
      "Magnetiske knivlister og knivstandere i valnød og akacie giver dine knive en fast, synlig plads. Produkterne er valgt for stoflighed og funktion - så dine vigtigste redskaber kan stå fremme og bidrage til et roligere køkken.",
  },
  bundle: {
    h1: "Start dit køkkenritual rigtigt",
    intro:
      "De bedste produkter virker endnu bedre sammen. Her finder du sammensatte sæt, der gør det nemt at begynde med både skarphed, orden og ro.",
    scoreLabel: "Start Score",
    scoreTrustLine: "Start Score · Mere værdi samlet",
    primaryCta: { label: "Se sættene", href: "#produkter" },
    benefitCards: [
      { title: "Nemt at vælge", text: "Sammensat så du ikke skal regne den ud." },
      { title: "Bedre samlet pris", text: "Mere værdi end at samle stykvis." },
      { title: "Gaveklar funktion og følelse", text: "Sæt der opleves som ét, ikke flere ting." },
    ],
    guideTitle: "Sådan vælger du rigtigt",
    guideItems: [
      "Vælg startsættet, hvis det er din første rigtige kokkekniv.",
      "Vælg pleje-sættet, hvis du har kniven og mangler skarphed.",
      "Vælg gavesættet, hvis det skal pakkes med omhu og gives videre.",
    ],
    startTitle: "Et godt sted at begynde",
    startText:
      "Start med et sæt der dækker både kniv og opbevaring – så er køkkenet på plads fra dag ét.",
    startCta: { label: "Se anbefalingen", href: "/gaver/fars-dag" },
    productBenefit: "Et samlet valg med mere værdi.",
    seoHeading: "Gavesæt og startpakker fra Langsomt Nok",
    seoBody:
      "Vores sammensatte sæt gør det nemt at komme i gang med skarphed, orden og ro i køkkenet. Hvert sæt er udvalgt med omhu - til dig selv eller som en rolig, gennemtænkt gave.",
  },
  gift: {
    h1: "Gaver der bliver brugt – ikke bare pakket ud",
    intro:
      "En god gave skal ramme noget i hverdagen. Her finder du gaver til mennesker, der holder af mad, materialer og små ritualer.",
    scoreLabel: "Gift Score",
    scoreTrustLine: "Gift Score · Udvalgt for funktion, ro og personligt udtryk",
    primaryCta: { label: "Se gaverne", href: "#produkter" },
    secondaryCta: { label: "Gave til madelskeren", href: "/pages/gave-til-madelskeren" },
    benefitCards: [
      { title: "Brugbare gaver", text: "Ting der bliver en del af hverdagen." },
      { title: "Roligt udtryk", text: "Materialer og form med karakter." },
      { title: "Pakket med omhu", text: "Sendt fra Danmark, klar til at gives." },
    ],
    guideTitle: "Sådan vælger du rigtigt",
    guideItems: [
      "Vælg kniven, hvis modtageren elsker at lave mad.",
      "Vælg keramik, hvis det skal være personligt og taktilt.",
      "Vælg et sæt, hvis du vil give noget komplet.",
    ],
    startTitle: "Et godt sted at begynde",
    startText:
      "Start med det, der passer ind i modtagerens hverdag - ikke det, der imponerer i fem sekunder.",
    startCta: { label: "Se gaveguiden", href: "/pages/gaver-med-ro" },
    productBenefit: "En rolig gave med funktion og følelse.",
    seoHeading: "Rolige gaver fra Langsomt Nok",
    seoBody:
      "Find gaver til madelskere, hjemmenørder og mennesker der holder af materialer og små ritualer. Knive, keramik og plejeprodukter pakket med omhu og sendt fra Danmark.",
  },
  ceramic: {
    h1: "Keramik med hænder, ro og stoflighed",
    intro:
      "Håndlavet keramik til bordet, hylden og de små pauser i dagen. Hvert stykke bærer små variationer i form, glasur og overflade – og netop derfor føles det levende.",
    scoreLabel: "Circle Score",
    scoreTrustLine: "Circle Score · Udvalgt for form, stoflighed og bordets udtryk",
    primaryCta: { label: "Se keramikken", href: "#produkter" },
    secondaryCta: { label: "Mød Susan Riel", href: "/keramik/susan-riel" },
    benefitCards: [
      { title: "Håndlavet i små serier", text: "Drejet, glaseret og brændt med ro." },
      { title: "Hvert værk har sit eget udtryk", text: "Små variationer er en del af formen." },
      { title: "Til bord, gave og langsomme øjeblikke", text: "Smukt – og lavet til at blive brugt." },
    ],
    guideTitle: "Sådan vælger du rigtigt",
    guideItems: [
      "Vælg kopper til små daglige ritualer.",
      "Vælg skåle til servering og bordets udtryk.",
      "Vælg vaser som stille objekter i rummet.",
      "Husk at unika kun findes i ét eksemplar.",
    ],
    startTitle: "Et godt sted at begynde",
    startText:
      "Start med det stykke, du bliver ved med at kigge på. Keramik skal kunne mærkes, før det forklares.",
    startCta: { label: "Se anbefalingen", href: "/keramik" },
    productBenefit: "Håndlavet form til bordets små øjeblikke.",
    seoHeading: "Håndlavet keramik fra danske atelierer",
    seoBody:
      "Kopper, skåle, vaser og unika fra Susan Riel og andre danske keramikere. Håndlavede stykker med levende glasurer og rolige former - skabt til daglig brug og stille øjeblikke.",
  },
  default: {
    h1: "Udvalgt af Langsomt Nok",
    intro: "Produkter valgt for funktion, materialer og ro i hverdagen.",
    scoreLabel: "Ritual Score",
    scoreTrustLine: "Kurateret af Langsomt Nok",
    primaryCta: { label: "Se produkterne", href: "#produkter" },
    benefitCards: [
      { title: "Udvalgt med omhu", text: "Funktion, materialer og rolige detaljer." },
      { title: "Pakket fra Danmark", text: "Sendt med 1-2 dages levering." },
      { title: "30 dages retur", text: "Tryg handel og tydelige vilkår." },
    ],
    guideTitle: "Sådan vælger du roligt",
    guideItems: [
      "Start med det, du faktisk mangler i hverdagen.",
      "Vælg derefter efter materiale og udtryk.",
      "Det bedste køb er det, du får lyst til at bruge igen.",
    ],
    startTitle: "Et godt sted at begynde",
    startText: "Start med det, du allerede har brugt for længe - bare i en bedre udgave.",
    startCta: { label: "Find dit ritual", href: "/find-dit-ritual" },
    productBenefit: "Udvalgt for funktion og rolig form.",
    seoHeading: "Roligt udvalgte produkter til hjemmet",
    seoBody:
      "Langsomt Nok samler produkter til dig, der vil købe færre - men bedre - ting. Funktion, materialer og rolig form i centrum.",
  },
};

function getCategoryKey(handle: string): CategoryKey {
  if (/(^knive|chef-line|damascus)/.test(handle)) return "knives";
  if (/(slib|pleje|ritual-set)/.test(handle)) return "care";
  if (/(holder|opbevar|calm-kitchen)/.test(handle)) return "display";
  if (/(bundle|sæt|saet|start-dit-ritual|pakke)/.test(handle)) return "bundle";
  if (/(gave|gift-chapter|gaver)/.test(handle)) return "gift";
  if (/(keramik|susan-riel|kopper|skale|skaale|vase|unika)/.test(handle)) return "ceramic";
  return "default";
}

// ---------- Existing collection content (kept for SEO + fallback titles) ----------

type CollectionContent = {
  tagline: string;
  intro: string;
  body: string;
  faq: Array<{ question: string; answer: string }>;
};

const DEFAULT_CONTENT: CollectionContent = {
  tagline: "Udvalgt af Langsomt Nok",
  intro: "Produkter valgt for funktion, materialer og ro i hverdagen.",
  body: "Her finder du produkter, der er udvalgt til at blive brugt. Vores fokus er enkle materialer, tydelig funktion og en oplevelse, der passer ind i et hjem med lidt mere nærvær.",
  faq: [
    { question: "Hvordan vælger jeg det rigtige produkt?", answer: "Start med din hverdag. Skal det bruges dagligt, gives som gave eller skabe mere ro i køkkenet? Vælg derefter efter størrelse, materiale og funktion." },
    { question: "Sendes produkterne fra Danmark?", answer: "Ja, ordrer pakkes med omhu og sendes fra Danmark." },
  ],
};

const COLLECTION_CONTENT: Record<string, CollectionContent> = {
  knive: {
    tagline: "The Chef Line",
    intro: "Knive til hænder, der gerne vil mærke forskellen.",
    body: "En god kniv gør madlavning mere rolig. Her finder du knive valgt for greb, balance, stål og den daglige glæde ved et redskab, der arbejder med dig.",
    faq: [
      { question: "Hvilken kniv skal jeg starte med?", answer: "Start med kokkekniven, hvis du vil have én alsidig hovedkniv. Vælg universalkniven som supplement til mindre opgaver." },
      { question: "Må knivene komme i opvaskemaskine?", answer: "Nej. Håndvask og grundig aftørring bevarer både træ og stål bedst." },
      { question: "Hvad skal jeg købe sammen med en kniv?", answer: "En slibesten og en god opbevaringsløsning er det naturlige næste skridt." },
    ],
  },
  slibesten: {
    tagline: "The Ritual Set",
    intro: "Skarphed er ikke tilfældig. Den er plejet.",
    body: "Slibning og pleje handler ikke kun om vedligehold. Det er et stille ritual, hvor du giver dine redskaber mere levetid.",
    faq: [
      { question: "Hvilken slibesten skal jeg vælge først?", answer: "Grundstenen 1000/5000 er det bedste sted at begynde." },
      { question: "Skal jeg bruge læderstrop?", answer: "Den er god til den sidste polering og til at holde æggen levende mellem slibninger." },
      { question: "Er en 3-trins sliber nok?", answer: "Den er god til enkel hverdagspleje. En slibesten giver mere kontrol." },
    ],
  },
  "magnetiske-holdere": {
    tagline: "The Calm Kitchen",
    intro: "Når værktøjet er smukt, skal det ikke gemmes væk.",
    body: "En magnetisk knivholder giver knivene en fast plads og køkkenet et roligere udtryk.",
    faq: [
      { question: "Skal jeg vælge knivlist eller knivstander?", answer: "Vælg knivlist for vægmontering og mere bordplads. Vælg stander hvis du vil have en fritstående løsning." },
      { question: "Hvad er forskellen på valnød og akacie?", answer: "Valnød har et mørkere og varmere udtryk. Akacie er lysere og mere nordisk." },
      { question: "Er magnetisk opbevaring sikker?", answer: "Ja, når holderen bruges korrekt, og knivene placeres stabilt." },
    ],
  },
  gaver: {
    tagline: "The Gift Chapter",
    intro: "Gaver, der bliver brugt. Ikke bare pakket ud.",
    body: "Gaver til mennesker, der holder af mad, materialer, små ritualer og ting, der bliver brugt længe efter gavepapiret er væk.",
    faq: [
      { question: "Hvad er en god gave fra Langsomt Nok?", answer: "Knive, keramik og plejeprodukter er gode valg, fordi de kan bruges igen og igen." },
      { question: "Kan produkterne gives som værtindegave?", answer: "Ja. Særligt keramik og små brugbare køkkenprodukter passer godt." },
      { question: "Hvad hvis jeg er i tvivl?", answer: "Vælg det mest enkle. Gaver med tydelig funktion rammer ofte bedre." },
    ],
  },
  "handlavet-keramik": {
    tagline: "Håndlavet keramik",
    intro: "Keramik skabt i hænder. Til rolige morgener og hverdage med stoflighed.",
    body: "Håndlavet keramik er aldrig helt ens. Små variationer i glasur og form giver hvert stykke sit eget liv.",
    faq: [
      { question: "Er keramikken håndlavet?", answer: "Ja. Små variationer i form, glasur og overflade er en naturlig del af udtrykket." },
      { question: "Er hvert produkt unikt?", answer: "Mange af produkterne er unika eller små serier. Når et værk er solgt, kommer det som udgangspunkt ikke igen." },
      { question: "Kan keramikken bruges som gave?", answer: "Ja. Det er særligt oplagt som en personlig gave med ro og hverdagsværdi." },
    ],
  },
};

// Aliases
COLLECTION_CONTENT["the-chef-line"] = COLLECTION_CONTENT.knive;
COLLECTION_CONTENT["slibning-pleje"] = COLLECTION_CONTENT.slibesten;
COLLECTION_CONTENT["pleje-ritualer"] = COLLECTION_CONTENT.slibesten;
COLLECTION_CONTENT["the-ritual-set"] = COLLECTION_CONTENT.slibesten;
COLLECTION_CONTENT["magnetisk-opbevaring"] = COLLECTION_CONTENT["magnetiske-holdere"];
COLLECTION_CONTENT["the-calm-kitchen"] = COLLECTION_CONTENT["magnetiske-holdere"];
COLLECTION_CONTENT["the-gift-chapter"] = COLLECTION_CONTENT.gaver;
COLLECTION_CONTENT["susan-riel"] = COLLECTION_CONTENT["handlavet-keramik"];
COLLECTION_CONTENT["keramikkopper"] = COLLECTION_CONTENT["handlavet-keramik"];
COLLECTION_CONTENT["keramikskale"] = COLLECTION_CONTENT["handlavet-keramik"];
COLLECTION_CONTENT["keramikvaser"] = COLLECTION_CONTENT["handlavet-keramik"];
COLLECTION_CONTENT["keramikunika"] = COLLECTION_CONTENT["handlavet-keramik"];

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

// ---------- Other-rituals navigation ----------

const OTHER_RITUALS: Array<{
  category: CategoryKey;
  label: string;
  href: string;
  text: string;
  image: string;
}> = [
  { category: "knives", label: "Knive", href: "/collections/knive", text: "Til de snit, der gerne må føles lidt bedre.", image: kniveHero },
  { category: "care", label: "Slibning", href: "/collections/slibning-pleje", text: "Til dig, der vil passe på det, du bruger.", image: slibningHero },
  { category: "display", label: "Opbevaring", href: "/collections/magnetiske-holdere", text: "Til ro, orden og redskaber der må stå fremme.", image: holdereHero },
  { category: "ceramic", label: "Keramik", href: "/collections/handlavet-keramik", text: "Til bordet, pausen og de små langsomme øjeblikke.", image: "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/Keramik_header.png?v=1778396909" },
  { category: "gift", label: "Gaver / Bundles", href: "/collections/gaver", text: "Til den særlige gave, pakket med omhu.", image: gaverHero },
];

// ---------- Small UI atoms ----------

function StarRow({ size = 14 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 align-middle" aria-label="5 ud af 5 stjerner">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className="text-copper fill-copper" style={{ width: size, height: size }} strokeWidth={1.25} />
      ))}
    </span>
  );
}

function ServiceBar() {
  const items = [
    { icon: Star, text: "Kurateret af Langsomt Nok", isStar: true },
    { icon: Truck, text: "Fri fragt over 599 kr" },
    { icon: RotateCcw, text: "30 dages retur" },
    { icon: MapPin, text: "Dansk webshop" },
    { icon: Shield, text: "Sikker betaling" },
  ];
  return (
    <section className="py-4 border-y border-walnut/15" style={{ backgroundColor: "#E6E0D7" }}>
      <div className="container-calm">
        <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
          {items.map((item) => (
            <div key={item.text} className="flex items-center gap-2">
              {item.isStar ? (
                <StarRow size={12} />
              ) : (
                <item.icon className="w-4 h-4 text-cta" strokeWidth={1.5} />
              )}
              <span className="text-xs font-medium text-foreground/75">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Route ----------

export const Route = createFileRoute("/collections/$handle")({
  head: ({ params }) => {
    const info = COLLECTION_CONTENT[params.handle] || DEFAULT_CONTENT;
    const meta = CATEGORY_META[getCategoryKey(params.handle)];
    const title = `${meta.h1} | Langsomt Nok`;
    const desc = meta.intro;
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
    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: info.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
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
        { type: "application/ld+json", children: JSON.stringify(faqLd) },
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
  const categoryKey = getCategoryKey(handle);
  const meta = CATEGORY_META[categoryKey];

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
        let resolvedProducts: ShopifyProduct[] = [];
        let resolvedTitle = handle;

        if (col && col.products?.edges?.length > 0) {
          resolvedTitle = col.title;
          setCollection({ title: col.title, description: col.description });
          resolvedProducts = col.products.edges;
          setProducts(resolvedProducts);
        } else {
          const fallbackQuery = COLLECTION_PRODUCT_TYPE_FALLBACK[handle];
          if (fallbackQuery !== undefined) {
            resolvedTitle = content.tagline || col?.title || handle;
            setCollection({ title: resolvedTitle, description: content.intro || col?.description || "" });
            const fbData = await storefrontApiRequest(PRODUCTS_QUERY, { first: 50, ...(fallbackQuery ? { query: fallbackQuery } : {}) });
            resolvedProducts = fbData?.data?.products?.edges || [];
            setProducts(resolvedProducts);
          } else {
            setCollection(col ? { title: col.title, description: col.description } : null);
            setProducts([]);
          }
        }

        // Track collection view after products are resolved
        if (resolvedProducts.length > 0) {
          trackCollectionView({
            collection_id: col?.id ?? handle,
            collection_title: resolvedTitle,
            handle,
            items: resolvedProducts.slice(0, 20).map((p, i) => ({
              item_id: p.node.id,
              item_name: p.node.title,
              item_category: p.node.productType,
              price: parseFloat(p.node.priceRange.minVariantPrice.amount),
              currency: p.node.priceRange.minVariantPrice.currencyCode,
              quantity: 1,
              index: i,
              item_list_name: resolvedTitle,
            })),
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [handle, sortIdx]);

  const heroBg = HERO_BACKGROUNDS[handle];
  const otherRituals = OTHER_RITUALS.filter((r) => r.category !== categoryKey).slice(0, 4);
  const firstHalf = products.slice(0, 4);
  const secondHalf = products.slice(4);

  return (
    <div className="pt-24" style={{ backgroundColor: "#F8F6F3" }}>
      {/* ============ 1. HERO ============ */}
      <section className={`section-padding pb-12 relative overflow-hidden ${heroBg ? "isolate" : ""}`}>
        {heroBg && (
          <>
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <img src={heroBg} alt="" aria-hidden="true" className="w-full h-full object-cover ken-burns" />
            </div>
            <div
              className="absolute inset-0 -z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(100deg, rgba(248,246,243,1) 0%, rgba(248,246,243,0.92) 45%, rgba(248,246,243,0.55) 75%, rgba(248,246,243,0.15) 100%)",
              }}
            />
          </>
        )}
        <div className="container-calm relative">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-cta transition-colors">Forside</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-cta transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-foreground/70">{content.tagline}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <span className="text-[10px] font-medium uppercase tracking-[0.22em] mb-4 block" style={{ color: "#A67C52" }}>
                Langsomt Nok kollektion
              </span>
              <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] mb-6" style={{ color: "#1E1E1E" }}>
                {meta.h1}
              </h1>
              <p className="text-lg md:text-xl leading-relaxed mb-8 max-w-2xl" style={{ color: "#2D2D2D" }}>
                {meta.intro}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <a
                  href={meta.primaryCta.href}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-md text-sm font-semibold tracking-wide uppercase text-cta-foreground transition-colors"
                  style={{ backgroundColor: "#4C574A" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3E4A3D")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4C574A")}
                >
                  {meta.primaryCta.label}
                </a>
                {meta.secondaryCta && (
                  <a
                    href={meta.secondaryCta.href}
                    className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-foreground/80 border rounded-md transition-colors hover:text-foreground"
                    style={{ borderColor: "rgba(90,59,46,0.18)" }}
                  >
                    {meta.secondaryCta.label}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Visible star + trust line */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm" style={{ color: "#A67C52" }}>
                <StarRow size={16} />
                <span className="font-medium">{meta.scoreTrustLine}</span>
                <span className="text-foreground/40">·</span>
                <span className="text-foreground/65">Fri fragt over 599 kr · 30 dages retur</span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl p-6 md:p-8" style={{ backgroundColor: "rgba(230,224,215,0.7)", border: "1px solid rgba(90,59,46,0.16)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <StarRow size={14} />
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#A67C52" }}>
                    {meta.scoreLabel}
                  </span>
                </div>
                <p className="font-serif text-xl md:text-2xl leading-snug mb-5" style={{ color: "#1E1E1E" }}>
                  Hvert produkt i kollektionen er udvalgt og scoret af Langsomt Nok.
                </p>
                <ul className="space-y-2.5">
                  {meta.benefitCards.map((b) => (
                    <li key={b.title} className="flex items-start gap-2.5 text-sm">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#4C574A" }} strokeWidth={2.25} />
                      <span style={{ color: "#2D2D2D" }}>
                        <strong className="font-semibold">{b.title}.</strong>{" "}
                        <span className="text-foreground/70">{b.text}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 2. SERVICE BAR (top) ============ */}
      <ServiceBar />

      {/* ============ 3. PRODUCT GRID ============ */}
      <section id="produkter" className="section-padding pt-14">
        <div className="container-calm">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 border-b pb-5" style={{ borderColor: "rgba(90,59,46,0.16)" }}>
            <div>
              <span className="text-[10px] font-medium uppercase tracking-[0.22em] mb-2 block" style={{ color: "#A67C52" }}>Udvalg</span>
              <h2 className="font-serif text-3xl md:text-4xl" style={{ color: "#1E1E1E" }}>Se produkterne</h2>
              <p className="text-sm text-muted-foreground mt-1">
                <StarRow size={12} /> <span className="ml-1 align-middle">Hvert produkt har en {meta.scoreLabel}</span>
              </p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground whitespace-nowrap">{products.length} produkter</p>
              <select
                value={sortIdx}
                onChange={(e) => setSortIdx(Number(e.target.value))}
                className="text-sm bg-transparent border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-cta/30"
                style={{ borderColor: "rgba(90,59,46,0.18)" }}
              >
                {SORT_OPTIONS.map((opt, i) => (
                  <option key={`${opt.key}-${opt.reverse}`} value={i}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-linen rounded-lg mb-4" />
                  <div className="h-4 bg-linen rounded w-2/3 mb-2" />
                  <div className="h-3 bg-linen rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 rounded-xl border" style={{ borderColor: "rgba(90,59,46,0.16)", backgroundColor: "rgba(230,224,215,0.4)" }}>
              <p className="font-serif text-xl text-muted-foreground mb-2">Ingen produkter i denne kollektion endnu</p>
              <p className="text-sm text-muted-foreground/60">Produkter tilføjes snart.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {firstHalf.map((product) => (
                  <ProductCard key={product.node.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ============ 4. BUYING GUIDE + START HERE ============ */}
      {products.length > 0 && (
        <section className="section-padding py-14 mt-14" style={{ backgroundColor: "#E6E0D7" }}>
          <div className="container-calm">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Buying guide */}
              <article className="lg:col-span-3 rounded-2xl p-7 md:p-9" style={{ backgroundColor: "#F8F6F3", border: "1px solid rgba(90,59,46,0.16)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <HelpCircle className="w-5 h-5" style={{ color: "#A67C52" }} strokeWidth={1.5} />
                  <span className="text-[10px] font-medium uppercase tracking-[0.22em]" style={{ color: "#A67C52" }}>Guide</span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl mb-5" style={{ color: "#1E1E1E" }}>
                  {meta.guideTitle}
                </h2>
                <ul className="space-y-3">
                  {meta.guideItems.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-base" style={{ color: "#2D2D2D" }}>
                      <Check className="w-4 h-4 mt-1.5 flex-shrink-0" style={{ color: "#4C574A" }} strokeWidth={2.25} />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </article>

              {/* Best place to start */}
              <aside className="lg:col-span-2 rounded-2xl p-7 md:p-9 flex flex-col" style={{ backgroundColor: "#F8F6F3", border: "1px solid rgba(90,59,46,0.16)", borderLeft: "3px solid #A67C52" }}>
                <div className="flex items-center gap-2 mb-3">
                  <StarRow size={14} />
                  <span className="text-[10px] font-medium uppercase tracking-[0.22em]" style={{ color: "#A67C52" }}>Start her</span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl mb-4" style={{ color: "#1E1E1E" }}>
                  {meta.startTitle}
                </h2>
                <p className="text-base leading-relaxed mb-6 flex-1" style={{ color: "#2D2D2D" }}>
                  {meta.startText}
                </p>
                <a
                  href={meta.startCta.href}
                  className="inline-flex items-center justify-center self-start px-5 py-2.5 rounded-md text-sm font-semibold tracking-wide uppercase text-cta-foreground transition-colors"
                  style={{ backgroundColor: "#4C574A" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3E4A3D")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4C574A")}
                >
                  {meta.startCta.label}
                </a>
              </aside>
            </div>
          </div>
        </section>
      )}

      {/* ============ 5. REST OF PRODUCT GRID ============ */}
      {secondHalf.length > 0 && (
        <section className="section-padding pt-14">
          <div className="container-calm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {secondHalf.map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ 6. VIDEO (display category only) ============ */}
      {categoryKey === "display" && (
        <VideoShowcase
          eyebrow="Så nemt sættes den op"
          title="Monteret på få minutter — uden boremaskine."
          body="Holderen monteres med dobbeltklæbende tape, som følger med. Brug en laser eller et vaterpas, ret den ind og tryk den fast. Så er køkkenet et roligere sted."
          background="linen"
          videoSide="left"
          compact
        />
      )}

      {/* ============ 7. OTHER RITUALS ============ */}
      <section className="section-padding py-16">
        <div className="container-calm">
          <div className="text-center mb-10">
            <span className="text-[10px] font-medium uppercase tracking-[0.22em] mb-3 block" style={{ color: "#A67C52" }}>Mere fra Langsomt Nok</span>
            <h2 className="font-serif text-3xl md:text-4xl" style={{ color: "#1E1E1E" }}>Udforsk flere ritualer</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {otherRituals.map((r) => (
              <a
                key={r.href}
                href={r.href}
                className="group block rounded-xl overflow-hidden transition-transform duration-500 hover:-translate-y-1"
                style={{ backgroundColor: "#F8F6F3", border: "1px solid rgba(90,59,46,0.16)" }}
              >
                <div className="aspect-[4/3] overflow-hidden" style={{ backgroundColor: "#E6E0D7" }}>
                  <img src={r.image} alt={r.label} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-lg mb-1.5 group-hover:text-walnut transition-colors" style={{ color: "#1E1E1E" }}>{r.label}</h3>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: "#2D2D2D" }}>{r.text}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider" style={{ color: "#4C574A" }}>
                    Se {r.label.toLowerCase()} <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 8. FAQ ============ */}
      <section className="section-padding py-14" style={{ backgroundColor: "#E6E0D7" }}>
        <div className="container-calm max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-[10px] font-medium uppercase tracking-[0.22em] mb-3 block" style={{ color: "#A67C52" }}>Spørgsmål før du vælger</span>
            <h2 className="font-serif text-3xl md:text-4xl" style={{ color: "#1E1E1E" }}>Det vi oftest får spurgt om</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {content.faq.map((item) => (
              <div key={item.question} className="rounded-xl p-6" style={{ backgroundColor: "#F8F6F3", border: "1px solid rgba(90,59,46,0.16)" }}>
                <h3 className="font-serif text-lg mb-2.5" style={{ color: "#1E1E1E" }}>{item.question}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#2D2D2D" }}>{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 9. SERVICE BAR (bottom) ============ */}
      <ServiceBar />

      {/* ============ 10. SEO TEXT ============ */}
      <section className="section-padding py-14">
        <div className="container-calm max-w-3xl text-center">
          <h2 className="font-serif text-2xl md:text-3xl mb-4" style={{ color: "#1E1E1E" }}>
            {meta.seoHeading}
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "#2D2D2D" }}>
            {meta.seoBody}
          </p>
        </div>
      </section>

      <NewsletterSignup />
    </div>
  );
}
