/**
 * Variante d'habillage « Mix 1 · 7 · 12 » par route (cf. docs/design/README.md, section Mix).
 *  - `gala`  : mode sombre noir / rouge (accueil, club, boxeurs, évènements, actualités, agenda) ;
 *  - `light` : variante claire crème, rassurante pour les parents (inscription, tarifs, disciplines,
 *              planning, contact, leçons, chrono, compte, connexion, pages légales).
 * Toute route non listée prend `gala`. Appliquée sur `<body data-variant>` par AppComponent.
 */
export type PageVariant = 'gala' | 'light';

/** Premier segment d'URL → variante claire. */
export const LIGHT_SECTIONS: readonly string[] = [
  'inscription',
  'tarifs',
  'disciplines',
  'planning',
  'contact',
  'lecons',
  'chrono',
  'mentions-legales',
  'confidentialite',
  'cgu',
  'mon-espace',
  'connexion',
  'inscription-compte',
  'verifier-email',
  'suppression-compte',
];

/** Premier segment d'URL → mode gala (explicite ; c'est aussi la valeur par défaut). */
export const GALA_SECTIONS: readonly string[] = ['', 'club', 'boxeurs', 'evenements', 'actualites', 'agenda'];

export function variantForUrl(url: string): PageVariant {
  const first = (url.split(/[?#]/)[0] ?? '').replace(/^\/+/, '').split('/')[0] ?? '';
  return LIGHT_SECTIONS.includes(first) ? 'light' : 'gala';
}
