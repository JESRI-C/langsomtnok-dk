/**
 * COLLECTION_CANONICALS — hvor to kollektioner overlapper indholdsmæssigt
 * peger vi begge på den samme kanoniske URL, så Google ikke splitter
 * autoritet mellem duplikater.
 *
 * Key = collection handle (fra Shopify), value = canonical handle (target).
 * Hvis mappingen mangler for et handle, bruger vi handle'et selv.
 *
 * Fyld ind når overlappende kollektioner identificeres. Eksempler:
 *   "slibesten": "slibning-pleje",
 *   "opbevaring": "magnetiske-holdere",
 */
export const COLLECTION_CANONICALS: Record<string, string> = {
  // Slibesten og slibning-pleje dækker samme intention (slibning + pleje).
  // Vi peger begge på "slibning-pleje" som den kanoniske URL.
  slibesten: "slibning-pleje",
};

export function canonicalCollectionHandle(handle: string): string {
  return COLLECTION_CANONICALS[handle] ?? handle;
}

export function canonicalCollectionUrl(handle: string): string {
  return `https://langsomtnok.dk/collections/${canonicalCollectionHandle(handle)}`;
}
