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
  // /collections/slibesten, /collections/slibning-pleje og
  // /collections/pleje-ritualer overlappede — slået sammen til én kanonisk
  // URL. Gamle handles redirecter permanent i src/routes/collections.$handle.tsx.
  slibesten: "slibning-pleje",
  "pleje-ritualer": "slibning-pleje",
};

export function canonicalCollectionHandle(handle: string): string {
  return COLLECTION_CANONICALS[handle] ?? handle;
}

export function canonicalCollectionUrl(handle: string): string {
  return `https://langsomtnok.dk/collections/${canonicalCollectionHandle(handle)}`;
}
