/**
 * SITE_CONFIG — centralt sted for eksterne URLs (sociale medier m.m.),
 * så vi ikke har generiske platform-forsider spredt i koden.
 *
 * TODO: Erstat platform-forsiderne herunder med de rigtige Langsomt Nok
 * profil-URLs så snart de er klar.
 */

export const SITE_CONFIG = {
  social: {
    // TODO: skift til https://www.instagram.com/langsomtnok/ når profilen er klar
    instagram: "https://www.instagram.com/",
    // TODO: skift til https://www.pinterest.dk/langsomtnok/ når profilen er klar
    pinterest: "https://www.pinterest.com/",
  },
} as const;
