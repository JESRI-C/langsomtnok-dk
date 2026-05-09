/**
 * useCampaignContent — load editable Shopify Metaobject copy for a landing
 * page, merged over the page's hardcoded fallback content.
 *
 * Usage:
 *   const content = useCampaignContent("fars-dag", FALLBACK_FARSDAG);
 */

import { useEffect, useState } from "react";
import {
  fetchCampaignContent,
  mergeContent,
  type CampaignContent,
} from "@/lib/campaign-content";

export function useCampaignContent(
  slug: string,
  fallback: CampaignContent,
): CampaignContent {
  const [content, setContent] = useState<CampaignContent>(fallback);

  useEffect(() => {
    let active = true;
    fetchCampaignContent(slug).then((remote) => {
      if (!active) return;
      setContent(mergeContent(fallback, remote));
    });
    return () => {
      active = false;
    };
    // fallback is treated as a constant per page; slug is the only key
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return content;
}
