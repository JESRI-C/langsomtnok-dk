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
  // Tilføj mapping her når kanoniske valg er truffet.
};

export function canonicalCollectionHandle(handle: string): string {
  return COLLECTION_CANONICALS[handle] ?? handle;
}

export function canonicalCollectionUrl(handle: string): string {
  return `https://langsomtnok.dk/collections/${canonicalCollectionHandle(handle)}`;
}
