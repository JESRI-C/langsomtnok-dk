/**
 * ============================================================================
 * SHOPIFY DESCRIPTION PARSER — Langsomt Nok
 * ============================================================================
 *
 * Parses structured Shopify descriptionHtml into typed sections.
 * Works with ANY H3-based structure — detects known section types by keywords
 * and collects remaining sections as generic editorial blocks.
 * ============================================================================
 */

export interface ParsedFAQItem {
  question: string;
  answer: string;
}

export interface ParsedSection {
  heading: string;
  content: string;
  /** Detected type for special rendering */
  type: "story" | "fit" | "materials" | "care" | "crossSell" | "faq" | "generic";
  /** Extracted list items (for fit, materials, or any section with <li>) */
  listItems: string[];
}

export interface ParsedProductDescription {
  /** Opening paragraphs before first H3 */
  intro: string;
  /** All H3 sections in order, typed for rendering */
  sections: ParsedSection[];
  // Legacy accessors for backward compat
  story: string;
  fitPoints: string[];
  materials: string[];
  care: string;
  crossSell: string;
  faq: ParsedFAQItem[];
  storyHeading: string;
  careHeading: string;
}

/**
 * Split HTML string on heading tags (h1, h2, h3), returning an array of
 * { heading: string, content: string } pairs.
 */
function splitOnHeadings(html: string): Array<{ heading: string; content: string }> {
  // Split on any h1/h2/h3 opening tag
  const parts = html.split(/<h[123][^>]*>/i);
  const sections: Array<{ heading: string; content: string }> = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (i === 0) {
      sections.push({ heading: "", content: part.trim() });
    } else {
      // Find closing tag (h1, h2, or h3)
      const closeMatch = part.match(/<\/h[123]>/i);
      if (!closeMatch) {
        sections.push({ heading: stripTags(part).trim(), content: "" });
      } else {
        const closeIdx = part.indexOf(closeMatch[0]);
        const heading = part.substring(0, closeIdx).trim();
        const content = part.substring(closeIdx + closeMatch[0].length).trim();
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
    const text = match[1].replace(/<[^>]*>/g, "").trim();
    if (text) items.push(text);
  }
  return items;
}

/** Extract FAQ pairs from HTML with <strong>Question</strong> pattern */
function extractFAQ(html: string): ParsedFAQItem[] {
  const faqs: ParsedFAQItem[] = [];
  const pBlocks = html.split(/<p[^>]*>/i).filter(Boolean);

  for (const block of pBlocks) {
    const strongMatch = block.match(/<(?:strong|b)>([\s\S]*?)<\/(?:strong|b)>/i);
    if (strongMatch) {
      const question = strongMatch[1].replace(/<[^>]*>/g, "").trim();
      let answer = block
        .substring((block.indexOf("</strong>") !== -1 ? block.indexOf("</strong>") + 9 : block.indexOf("</b>") + 4))
        .replace(/<br\s*\/?>/gi, " ")
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

/** Detect section type from heading text (supports Danish and English) */
function detectSectionType(heading: string): ParsedSection["type"] {
  const h = heading.toLowerCase();

  // Story / purpose
  if (h.startsWith("skabt til") || h.includes("design") || h.includes("expression") || h.includes("udtryk")) return "story";

  // Fit / who it's for
  if (h.startsWith("passer til") || h.includes("for those") || h.includes("for dem")) return "fit";

  // Materials / specs / dimensions
  if (h.startsWith("materialer") || h.includes("dimensions") || h.includes("specifications") || h.includes("specifikation") || h.includes("material")) return "materials";

  // Care / maintenance
  if (h.startsWith("pleje") || h.startsWith("sådan bruger") || h.includes("maintenance") || h.includes("vedligehold")) return "care";

  // Cross-sell
  if (h.startsWith("det giver mening") || h.includes("goes well") || h.includes("sammen med")) return "crossSell";

  // FAQ
  if (h === "faq" || h === "ofte stillede spørgsmål" || h.includes("frequently asked")) return "faq";

  return "generic";
}

/**
 * Parse a Shopify product's descriptionHtml into structured sections.
 * Returns all sections typed for rendering, plus legacy accessors.
 */
export function parseProductDescription(descriptionHtml: string): ParsedProductDescription {
  const result: ParsedProductDescription = {
    intro: "",
    sections: [],
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

  const rawSections = splitOnHeadings(descriptionHtml);

  for (const section of rawSections) {
    if (!section.heading) {
      // Intro — content before first H3
      result.intro = section.content;
      continue;
    }

    const headingText = stripTags(section.heading);
    const type = detectSectionType(headingText);
    const listItems = extractListItems(section.content);

    const parsed: ParsedSection = {
      heading: headingText,
      content: section.content,
      type,
      listItems,
    };

    result.sections.push(parsed);

    // Populate legacy accessors
    switch (type) {
      case "story":
        if (!result.story) {
          result.storyHeading = headingText;
          result.story = section.content;
        }
        break;
      case "fit":
        if (result.fitPoints.length === 0) {
          result.fitPoints = listItems.length > 0 ? listItems : [stripTags(section.content)];
        }
        break;
      case "materials":
        if (result.materials.length === 0) {
          result.materials = listItems.length > 0 ? listItems : [stripTags(section.content)];
        }
        break;
      case "care":
        if (!result.care) {
          result.careHeading = headingText;
          result.care = section.content;
        }
        break;
      case "crossSell":
        if (!result.crossSell) {
          result.crossSell = section.content;
        }
        break;
      case "faq":
        if (result.faq.length === 0) {
          result.faq = extractFAQ(section.content);
        }
        break;
    }
  }

  return result;
}
