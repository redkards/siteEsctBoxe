import { variantForUrl } from './page-variant';

describe('variantForUrl', () => {
  it('met les pages parents en variante claire', () => {
    for (const url of ['/inscription', '/tarifs', '/disciplines/loisir', '/planning', '/contact', '/lecons/seance', '/chrono', '/cgu', '/mon-espace?tab=messages']) {
      expect(variantForUrl(url)).toBe('light');
    }
  });

  it('met les pages vitrine en mode gala', () => {
    for (const url of ['/', '/boxeurs/x', '/evenements', '/actualites/y', '/agenda', '/club', '/inconnue']) {
      expect(variantForUrl(url)).toBe('gala');
    }
  });
});
