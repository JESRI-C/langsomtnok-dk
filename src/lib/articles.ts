/**
 * ============================================================================
 * GUIDES / ARTICLES DATA — Langsomt Nok
 * ============================================================================
 * Central article data used by the guides hub and individual article pages.
 * Each article has SEO metadata, content structure, and related content.
 * ============================================================================
 */

export interface ArticleData {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  category: string;
  readTime: string;
  intro: string;
  tableOfContents: string[];
  sections: Array<{ heading: string; content: string }>;
  relatedSlugs: string[];
  relatedCollections: string[];
  image?: string;
}

export const ARTICLE_CATEGORIES = [
  "Knivvalg",
  "Slibning",
  "Pleje",
  "Materialer",
  "Gaver",
  "Langsom mad",
] as const;

export const ARTICLES: ArticleData[] = [
  {
    slug: "hvilken-kokkekniv-skal-jeg-vaelge",
    title: "Hvilken kokkekniv skal jeg vælge?",
    seoTitle: "Hvilken kokkekniv skal jeg vælge? — Langsomt Nok Guide",
    metaDescription: "Find den rigtige kokkekniv til dit køkken. Lær om ståltyper, skaftmaterialer, balance og hvad der gør en kniv god.",
    category: "Knivvalg",
    readTime: "7 min",
    intro: "Et godt snit begynder med det rigtige valg. Ikke den dyreste kniv — den rigtige. Her guider vi dig roligt igennem det vigtigste.",
    tableOfContents: ["Hvad gør en god kokkekniv?", "Ståltyper og hårdhed", "Skaft og greb", "Størrelse og profil", "Vores anbefaling"],
    sections: [
      { heading: "Hvad gør en god kokkekniv?", content: "En god kokkekniv handler om tre ting: skarpheden, balancen og følelsen i hånden. Skarpheden bestemmes af stålet og æggens vinkel. Balancen af vægtfordelingen mellem blad og skaft. Følelsen af skaftets materiale, form og ergonomi. Når alle tre er på plads, gør kniven arbejdet — du guider den bare." },
      { heading: "Ståltyper og hårdhed", content: "Europæisk stål (54-56 HRC) er blødere og nemmere at slibe, men mister skarpheden hurtigere. Japansk stål (60-62 HRC) holder skarphed længere, men kræver mere forsigtighed. Damascus-stål kombinerer det bedste: hård kerne omgivet af fleksible lag." },
      { heading: "Skaft og greb", content: "Plastikskafter er billige men sjælløse. Træskafter — valnød, oliven, acacia — giver varme, greb og karakter. De ældes smukt og bliver bedre med tiden. Vælg det materiale, der føles rigtigt i din hånd." },
      { heading: "Størrelse og profil", content: "De fleste starter bedst med en 20 cm kokkekniv. Den er alsidig nok til hakkning, snit og rokkekniv-teknik. Mindre hænder kan foretrække 18 cm. Større end 21 cm er for den erfarne." },
      { heading: "Vores anbefaling", content: "Start med én god kokkekniv i stedet for et sæt middelmådige. En 20 cm kokkekniv i damaskus-stål med valnødskaft er vores bedste bud på det perfekte startpunkt." },
    ],
    relatedSlugs: ["damaskus-kniv-hvad-betyder-det", "japansk-eller-europaeisk-kokkekniv", "hvad-betyder-hrc-paa-en-kniv"],
    relatedCollections: ["knive"],
    image: "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/Hvilken_kniv_skal_jeg_vaelge.png?v=1778396730",
  },
  {
    slug: "damaskus-kniv-hvad-betyder-det",
    title: "Damaskus kniv — hvad betyder det?",
    seoTitle: "Damaskus kniv — hvad betyder det? — Langsomt Nok Guide",
    metaDescription: "Lær hvad damaskus-stål virkelig er, hvorfor lagene betyder noget, og hvad du skal kigge efter i en damaskus kokkekniv.",
    category: "Materialer",
    readTime: "6 min",
    intro: "Damaskus er ikke bare mønster. Det er en teknik, en tradition og en måde at tænke stål på. Her forklarer vi hvad det betyder — roligt.",
    tableOfContents: ["Historien bag damaskus", "Hvordan det laves", "Lagenes funktion", "Ægte vs. falsk damaskus", "Pleje af damaskus"],
    sections: [
      { heading: "Historien bag damaskus", content: "Navnet stammer fra Damaskus i Syrien, hvor bølgemønstrede sværd blev handlet i middelalderen. Den originale teknik gik tabt, men moderne smedekunst har genskabt og forfinet princippet." },
      { heading: "Hvordan det laves", content: "Flere lag af forskellige ståltyper stables, opvarmes og smejes sammen. Processen gentages indtil bladet har 33, 67 eller flere lag. Kernen er typisk hårdt VG-10 stål, omgivet af blødere lag der giver fleksibilitet." },
      { heading: "Lagenes funktion", content: "Lagene er ikke kosmetiske. De skaber et blad der kombinerer hårdhed med sejhed. Kernestålet holder skarpheden, mens de ydre lag absorberer stød og forhindrer bladet i at blive sprødt." },
      { heading: "Ægte vs. falsk damaskus", content: "Ægte damaskus har lag hele vejen igennem. Mønsteret er stålets struktur. Falsk damaskus er ætset eller trykt på overfladen. Forskellen mærkes i skarpheden og holdbarheden — og i prisen." },
      { heading: "Pleje af damaskus", content: "Håndvask, tør af med det samme, opbevar tørt. Med tiden kan mønsteret blive mere udtalt — det er meningen. Din kniv fortæller sin egen historie." },
    ],
    relatedSlugs: ["hvilken-kokkekniv-skal-jeg-vaelge", "hvad-betyder-hrc-paa-en-kniv", "japansk-eller-europaeisk-kokkekniv"],
    relatedCollections: ["knive"],
    image: "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/Damascus_Steel_Close_up.png?v=1778398103",
  },
  {
    slug: "japansk-eller-europaeisk-kokkekniv",
    title: "Japansk eller europæisk kokkekniv?",
    seoTitle: "Japansk eller europæisk kokkekniv? — Langsomt Nok Guide",
    metaDescription: "Forstå forskellen mellem japanske og europæiske kokkeknive. Stålhårdhed, bladprofil, skaft og hvilken der passer dig.",
    category: "Knivvalg",
    readTime: "6 min",
    intro: "To traditioner. Samme formål. Men følelsen i hånden er helt anderledes. Her sammenligner vi de to — uden at vælge side.",
    tableOfContents: ["Stål og hårdhed", "Bladprofil og geometri", "Skafttradition", "Hvem passer hvad?", "Vores anbefaling"],
    sections: [
      { heading: "Stål og hårdhed", content: "Japanske knive bruger typisk hårdere stål (60-62 HRC) med tyndere blade. Europæiske knive er blødere (54-56 HRC) og tykkere. Japanske holder skarphed længere, europæiske tåler mere vold." },
      { heading: "Bladprofil og geometri", content: "Japanske knive har en fladere profil — ideel til præcise træk-snit. Europæiske har mere kurve — bedre til rokkekniv-teknik. Din skæreteknik bestemmer, hvilken der passer dig." },
      { heading: "Skafttradition", content: "Traditionelle japanske skafter er lette, oktagonale og af ho-træ. Vestlige japanske knive bruger ofte den samme D-form som europæiske. Begge kan have træskafter i valnød eller pakkawood." },
      { heading: "Hvem passer hvad?", content: "Hvis du elsker præcision og lette snit: japansk. Hvis du vil have robusthed og rokkekniv: europæisk. Hvis du vil have det bedste fra begge verdener: en japansk-inspireret kniv med vestligt skaft." },
      { heading: "Vores anbefaling", content: "Vores knive er inspireret af den japanske tradition — hårdt stål, tynd æg, damaskus-lag — men med vestlige skafter der føles hjemme i nordiske hænder." },
    ],
    relatedSlugs: ["hvilken-kokkekniv-skal-jeg-vaelge", "damaskus-kniv-hvad-betyder-det", "hvad-betyder-hrc-paa-en-kniv"],
    relatedCollections: ["knive"],
  },
  {
    slug: "hvad-betyder-hrc-paa-en-kniv",
    title: "Hvad betyder HRC på en kniv?",
    seoTitle: "Hvad betyder HRC på en kniv? — Langsomt Nok Guide",
    metaDescription: "HRC måler stålhårdhed. Lær hvad tallene betyder, og hvorfor de er vigtige for din kokkeknivs skarphed og levetid.",
    category: "Materialer",
    readTime: "4 min",
    intro: "HRC er et tal, du ser overalt på knive. Men hvad betyder det egentlig? Og hvorfor er det vigtigt for dig? Her er det simple svar.",
    tableOfContents: ["Hvad HRC måler", "Tallenes betydning", "Hårdhed vs. sejhed", "Det rigtige HRC for dig"],
    sections: [
      { heading: "Hvad HRC måler", content: "HRC står for Rockwell Hardness C-skala. Det måler, hvor modstandsdygtigt stålet er over for indtrykninger. Jo højere tal, jo hårdere stål, jo længere holder skarpheden." },
      { heading: "Tallenes betydning", content: "Under 54: Blødt stål, nemt at slibe men sløves hurtigt. 56-58: Godt europæisk niveau. 60-62: Japansk niveau — holder skarphed længst. Over 64: Meget hårdt, kan være skrøbeligt." },
      { heading: "Hårdhed vs. sejhed", content: "Hårdt stål holder skarphed men kan chippe. Blødt stål er sejt men sløves. Damaskus-stål løser dette: hård kerne for skarphed, bløde ydre lag for sejhed." },
      { heading: "Det rigtige HRC for dig", content: "For de fleste hjemmekokke er 60±1 HRC det ideelle kompromis. Det holder skarphed i uger og kan slibes med en standard vandsten." },
    ],
    relatedSlugs: ["damaskus-kniv-hvad-betyder-det", "hvilken-kokkekniv-skal-jeg-vaelge", "japansk-eller-europaeisk-kokkekniv"],
    relatedCollections: ["knive"],
  },
  {
    slug: "hvordan-sliber-man-en-kniv",
    title: "Hvordan sliber man en kniv?",
    seoTitle: "Hvordan sliber man en kniv? — Langsomt Nok Guide",
    metaDescription: "Lær at slibe din kniv med vandsten trin for trin. En rolig guide til skarphed uden maskiner eller gætværk.",
    category: "Slibning",
    readTime: "8 min",
    intro: "Slibning er enklere end du tror. Det kræver blot en god sten, lidt vand og tålmodighed. Her guider vi dig igennem det hele.",
    tableOfContents: ["Hvad du behøver", "Forberedelse", "Slibeteknik", "Afslutning", "Vedligeholdelse"],
    sections: [
      { heading: "Hvad du behøver", content: "En kombinationssten (1000/5000 grit), en stenholder eller fugtigt håndklæde, vand og din kniv. Det er alt. Ingen maskiner, ingen komplicerede systemer." },
      { heading: "Forberedelse", content: "Blødlæg stenen i vand i 10-15 minutter. Sæt den på en stabil overflade. Start med 1000-siden (den grove). Tør din kniv af og kig på æggen — kan du se lys reflektere fra den? Så er den sløv." },
      { heading: "Slibeteknik", content: "Hold kniven i 15-20° vinkel. Træk bladet i jævne strøg fra hæl til spids, som om du skærer en tynd skive af stenen. Brug let tryk. 5-10 strøg pr. sektion, derefter vend og gentag." },
      { heading: "Afslutning", content: "Skift til 5000-siden for at polere æggen. Lav et par strøg på en læderstrop for den ultimative finish. Skyl kniven og tør grundigt af." },
      { heading: "Vedligeholdelse", content: "Hvæs med en keramisk stål eller læderstrop mellem slibningerne. Det retter mikroskopiske buk ud i æggen. Slib igen, når kniven begynder at glide i stedet for at snitte." },
    ],
    relatedSlugs: ["slibesten-1000-5000-hvad-betyder-det", "hvor-ofte-skal-man-slibe-sin-kniv", "hvilken-kokkekniv-skal-jeg-vaelge"],
    relatedCollections: ["slibesten", "pleje-ritualer"],
  },
  {
    slug: "slibesten-1000-5000-hvad-betyder-det",
    title: "Slibesten 1000/5000 — hvad betyder det?",
    seoTitle: "Slibesten 1000/5000 — hvad betyder det? — Langsomt Nok Guide",
    metaDescription: "Forstå slibesten grit-numre. Hvad 1000 og 5000 betyder, og hvilken sten du skal starte med.",
    category: "Slibning",
    readTime: "5 min",
    intro: "Tallene på din slibesten er ikke tilfældige. De fortæller præcis, hvad stenen gør. Her er den rolige forklaring.",
    tableOfContents: ["Hvad grit betyder", "Grov vs. fin", "Kombinationsstenen", "Hvilken sten først?"],
    sections: [
      { heading: "Hvad grit betyder", content: "Grit-tallet angiver antallet af slibepartikler pr. kvadrattomme. Jo højere tal, jo finere partikler, jo glattere slibning. 1000 grit er medium — det arbejdshest-niveau, der genskaber æggen." },
      { heading: "Grov vs. fin", content: "400-600 grit: Grov. Til beskadigede knive. Fjerner mest metal. 1000 grit: Medium. Den vigtigste. Genskaber æggen. 3000-5000 grit: Fin. Polerer æggen til en silkeblød skarphed." },
      { heading: "Kombinationsstenen", content: "En 1000/5000 kombinationssten har en side af hver. Det er alt, de fleste hjemmekokke behøver. Start med 1000 for at skabe æggen, afslut med 5000 for at polere den." },
      { heading: "Hvilken sten først?", content: "Start med en 1000/5000 kombinationssten. Når du er fortrolig med den, kan du tilføje en 400 grit til reparationer. De fleste klarer sig fint med bare kombinationsstenen." },
    ],
    relatedSlugs: ["hvordan-sliber-man-en-kniv", "hvor-ofte-skal-man-slibe-sin-kniv", "hvad-betyder-hrc-paa-en-kniv"],
    relatedCollections: ["slibesten"],
    image: "https://cdn.shopify.com/s/files/1/0915/7227/3488/files/minimal_wooden_Sharpening_stone_setup.png?v=1778398237",
  },
  {
    slug: "hvor-ofte-skal-man-slibe-sin-kniv",
    title: "Hvor ofte skal man slibe sin kniv?",
    seoTitle: "Hvor ofte skal man slibe sin kniv? — Langsomt Nok Guide",
    metaDescription: "Lær hvornår din kniv behøver slibning, og hvad forskellen er på slibning og hvæsning.",
    category: "Pleje",
    readTime: "4 min",
    intro: "Det korte svar: sjældnere end du tror. Det lange svar handler om at lytte til din kniv.",
    tableOfContents: ["Tegn på en sløv kniv", "Slibning vs. hvæsning", "Den rigtige kadence", "Daglig vedligeholdelse"],
    sections: [
      { heading: "Tegn på en sløv kniv", content: "Hvis kniven glider af en tomat i stedet for at skære igennem, er den sløv. Hvis du presser hårdere end du guider, er den sløv. Hvis du kan se lys reflektere fra æggen, er den sløv." },
      { heading: "Slibning vs. hvæsning", content: "Hvæsning (strygestål, læderstrop) retter æggen op. Det fjerner ikke metal — det bøjer mikroskopiske buk tilbage. Slibning fjerner metal og skaber en ny æg. Hvæs ofte, slib sjældent." },
      { heading: "Den rigtige kadence", content: "For de fleste hjemmekokke: slib hver 2-3 måned. Hvæs før eller efter hver brug. Hvis du laver mad dagligt, slib hver 6-8 uger. Professionelle sliber ugentligt." },
      { heading: "Daglig vedligeholdelse", content: "Et par strøg på en keramisk stål eller læderstrop holder æggen i form. Håndvask, tør af med det samme, opbevar på magnetisk holder. Det tager 30 sekunder og forlænger tiden mellem slibninger markant." },
    ],
    relatedSlugs: ["hvordan-sliber-man-en-kniv", "slibesten-1000-5000-hvad-betyder-det", "hvilken-kokkekniv-skal-jeg-vaelge"],
    relatedCollections: ["slibesten", "pleje-ritualer"],
  },
  {
    slug: "gave-til-den-der-elsker-mad",
    title: "Gave til den der elsker mad",
    seoTitle: "Gave til den der elsker mad — Langsomt Nok Guide",
    metaDescription: "Find den perfekte gave til madelskeren. Køkkenredskaber med mening, varighed og historier der huskes.",
    category: "Gaver",
    readTime: "5 min",
    intro: "De bedste gaver er dem, der bliver en del af hverdagen. Her er vores bud på gaver, der huskes.",
    tableOfContents: ["Gaver med mening", "Til begynderen", "Til den erfarne", "Til den der har alt"],
    sections: [
      { heading: "Gaver med mening", content: "Et godt køkkenredskab er en gave, der bruges hver dag. Ikke én gang om året. Ikke når man husker det. Hver dag. Det er det, der gør det til en god gave." },
      { heading: "Til begynderen", content: "En god kokkekniv er det bedste sted at starte. Par den med en slibesten og plejeolie for det komplette startkit. Det er alt, man behøver for at begynde et nyt ritual." },
      { heading: "Til den erfarne", content: "En magnetisk knivholder i valnød. En japansk slibesten. En specialiseret kniv de ikke ville købe til sig selv. Noget der udvider ritualet." },
      { heading: "Til den der har alt", content: "Plejeolie og voks. En læderstrop. Ting der vedligeholder det, de allerede elsker. Omsorg for det eksisterende er den smukkeste gave." },
    ],
    relatedSlugs: ["hvilken-kokkekniv-skal-jeg-vaelge", "gode-koekkenredskaber-der-holder", "kokkenet-som-fristed"],
    relatedCollections: ["gaver", "startkits"],
  },
  {
    slug: "gode-koekkenredskaber-der-holder",
    title: "Gode køkkenredskaber der holder",
    seoTitle: "Gode køkkenredskaber der holder — Langsomt Nok Guide",
    metaDescription: "Køkkenredskaber der varer i årtier. Hvad der adskiller kvalitet fra masseproduktion, og hvorfor det er værd at investere.",
    category: "Materialer",
    readTime: "6 min",
    intro: "Kvalitet handler ikke om pris. Det handler om materialer, håndværk og respekt for det køkken, redskabet ender i.",
    tableOfContents: ["Kvalitet vs. pris", "Materialer der varer", "Pleje forlænger alt", "Investering i glæde"],
    sections: [
      { heading: "Kvalitet vs. pris", content: "En billig kniv koster 200 kr og holder et år. En god kniv koster 1.000 kr og holder et liv. Per brug er den gode kniv billigere — og giver langt mere glæde undervejs." },
      { heading: "Materialer der varer", content: "Damascus-stål holder skarphed i uger. Valnøddetræ ældes smukt over årtier. Japansk vandsten holder i tusindvis af slibninger. Kvalitetsmaterialer er ikke luksus — de er fornuft." },
      { heading: "Pleje forlænger alt", content: "Et godt redskab, der passes, varer i generationer. Olie dit træ. Slib dit stål. Opbevar korrekt. Det tager minutter og giver år." },
      { heading: "Investering i glæde", content: "At lave mad med gode redskaber er en anden oplevelse. Kniven glider. Brættet ligger stille. Holderen viser dine redskaber frem. Hvert element gør madlavning til noget, du ser frem til." },
    ],
    relatedSlugs: ["hvilken-kokkekniv-skal-jeg-vaelge", "damaskus-kniv-hvad-betyder-det", "gave-til-den-der-elsker-mad"],
    relatedCollections: ["knive", "magnetiske-holdere"],
  },
  {
    slug: "kokkenet-som-fristed",
    title: "Køkkenet som fristed",
    seoTitle: "Køkkenet som fristed — Langsomt Nok Guide",
    metaDescription: "Køkkenet er mere end et rum. Det er et fristed. Om at finde ro, ritual og nærvær i madlavning.",
    category: "Langsom mad",
    readTime: "5 min",
    intro: "Køkkenet er det eneste sted i hjemmet, hvor alle sanser er i brug. Her handler det om at give dem plads.",
    tableOfContents: ["Køkkenet som rum", "Langsomhedens værdi", "Ritualernes kraft", "At begynde i dag"],
    sections: [
      { heading: "Køkkenet som rum", content: "Køkkenet er ikke et sted, man går igennem. Det er et sted, man er i. Duften af løg der karamelliserer. Lyden af stål mod bræt. Følelsen af dejen under fingrene. Synet af damp der stiger." },
      { heading: "Langsomhedens værdi", content: "Hurtig mad er praktisk. Langsom mad er noget andet. Det er en investering i smagsoplevelsen. I nærværet. I den stille tilfredsstillelse ved at gøre noget ordentligt." },
      { heading: "Ritualernes kraft", content: "Et ritual er en vane med mening. At slibe sin kniv om søndagen. At tænde et lys, mens saucen simrer. At bruge det rigtige bræt til det rigtige formål. Små ting, der gør hele forskellen." },
      { heading: "At begynde i dag", content: "Du behøver ikke et nyt køkken. Du behøver ikke en uge fri. Du behøver bare at beslutte, at det næste måltid ikke laves i hast. Start med én god kniv, ét godt snit, og lad resten følge." },
    ],
    relatedSlugs: ["hvilken-kokkekniv-skal-jeg-vaelge", "gave-til-den-der-elsker-mad", "gode-koekkenredskaber-der-holder"],
    relatedCollections: ["knive", "pleje-ritualer"],
  },
];

export function getArticleBySlug(slug: string): ArticleData | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getRelatedArticles(slugs: string[]): ArticleData[] {
  return slugs.map((s) => ARTICLES.find((a) => a.slug === s)).filter(Boolean) as ArticleData[];
}
