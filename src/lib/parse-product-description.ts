/**
 * ============================================================================
 * SHOPIFY DESCRIPTION PARSER — Langsomt Nok
 * ============================================================================
 *
 * Parses structured Shopify descriptionHtml into typed sections.
 * All Langsomt Nok products follow a consistent H3-based structure:
 *   - Intro (before first H3)
 *   - Skabt til... (story/purpose)
 *   - Passer til dig, hvis (fit bullets)
 *   - Materialer og detaljer (specs)
 *   - Pleje / Sådan bruger du den (care)
 *   - Det giver mening sammen med (cross-sell)
 *   - FAQ (question/answer pairs)
 * ============================================================================
 */

export interface ParsedFAQItem {
  question: string;
  answer: string;
}

export interface ParsedProductDescription {
  /** Opening paragraphs before first H3 */
  intro: string;
  /** "Skabt til..." section HTML */
  story: string;
  /** "Passer til dig, hvis" bullet points */
  fitPoints: string[];
  /** "Materialer og detaljer" list items */
  materials: string[];
  /** "Pleje" or "Sådan bruger du den" section HTML */
  care: string;
  /** "Det giver mening sammen med" section HTML */
  crossSell: string;
  /** FAQ question/answer pairs */
  faq: ParsedFAQItem[];
  /** The story section heading (varies: "Skabt til rolig præcision", etc.) */
  storyHeading: string;
  /** The care section heading (varies: "Pleje er en del af ritualet", "Sådan bruger du den") */
  careHeading: string;
}

/**
 * Split HTML string on <h3> tags, returning an array of
 * { heading: string, content: string } pairs.
 * The first entry has heading="" (intro content before first H3).
 */
function splitOnH3(html: string): Array<{ heading: string; content: string }> {
  // Split on <h3> or <h3 ...> tags
  const parts = html.split(/<h3[^>]*>/i);
  const sections: Array<{ heading: string; content: string }> = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (i === 0) {
      // Intro — no heading
      sections.push({ heading: "", content: part.trim() });
    } else {
      // Split heading from content at </h3>
      const closeIdx = part.indexOf("</h3>");
      if (closeIdx === -1) {
        sections.push({ heading: part.trim(), content: "" });
      } else {
        const heading = part.substring(0, closeIdx).trim();
        const content = part.substring(closeIdx + 5).trim();
        sections.push({ heading, content });
      }
    }
  }

  return sections;
}

/** Extract text content from <li> elements in HTML */
function extractListItems(html: string): string[] {
  const items: string[] = [];
  const regex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    // Strip inner HTML tags to get plain text
    const text = match[1].replace(/<[^>]*>/g, "").trim();
    if (text) items.push(text);
  }
  return items;
}

/** Extract FAQ pairs from HTML with <strong>Question</strong><br>Answer pattern */
function extractFAQ(html: string): ParsedFAQItem[] {
  const faqs: ParsedFAQItem[] = [];
  // Match <strong>question</strong> followed by <br> or <br/> then answer text
  const regex = /<(?:strong|b)>([\s\S]*?)<\/(?:strong|b)>\s*(?:<br\s*\/?>)?\s*([\s\S]*?)(?=<(?:strong|b|p)>|$)/gi;
  
  // Alternative: parse <p> blocks containing <strong>
  const pBlocks = html.split(/<p[^>]*>/i).filter(Boolean);
  
  for (const block of pBlocks) {
    const strongMatch = block.match(/<(?:strong|b)>([\s\S]*?)<\/(?:strong|b)>/i);
    if (strongMatch) {
      const question = strongMatch[1].replace(/<[^>]*>/g, "").trim();
      // Get answer: everything after the </strong> and optional <br>
      let answer = block
        .substring(block.indexOf("</strong>") + 9 || block.indexOf("</b>") + 4)
        .replace(/<br\s*\/?>/gi, "")
        .replace(/<\/p>/gi, "")
        .replace(/<[^>]*>/g, "")
        .trim();
      if (question && answer) {
        faqs.push({ question, answer });
      }
    }
  }
  
  return faqs;
}

/** Strip HTML tags, returning plain text */
function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * Parse a Shopify product's descriptionHtml into structured sections.
 * Returns an object with all recognized sections extracted.
 */
export function parseProductDescription(descriptionHtml: string): ParsedProductDescription {
  const result: ParsedProductDescription = {
    intro: "",
    story: "",
    fitPoints: [],
    materials: [],
    care: "",
    crossSell: "",
    faq: [],
    storyHeading: "",
    careHeading: "",
  };

  if (!descriptionHtml) return result;

  const sections = splitOnH3(descriptionHtml);

  for (const section of sections) {
    const headingLower = stripTags(section.heading).toLowerCase();

    if (!section.heading) {
      // Intro
      result.intro = section.content;
    } else if (headingLower.startsWith("skabt til")) {
      result.storyHeading = stripTags(section.heading);
      result.story = section.content;
    } else if (headingLower.startsWith("passer til")) {
      result.fitPoints = extractListItems(section.content);
    } else if (headingLower.startsWith("materialer")) {
      result.materials = extractListItems(section.content);
    } else if (headingLower.startsWith("pleje") || headingLower.startsWith("sådan bruger")) {
      result.careHeading = stripTags(section.heading);
      result.care = section.content;
    } else if (headingLower.startsWith("det giver mening")) {
      result.crossSell = section.content;
    } else if (headingLower === "faq") {
      result.faq = extractFAQ(section.content);
    }
  }

  return result;
}
