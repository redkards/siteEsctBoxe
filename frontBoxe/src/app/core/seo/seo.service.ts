import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export type OgType = 'website' | 'article' | 'profile';

export interface SeoData {
  /** Titre complet de la page (balise <title> et og:title) */
  title?: string;
  description?: string | null;
  type?: OgType;
  /** Image Open Graph (URL absolue ou chemin) */
  image?: string | null;
}

export const DEFAULT_IMAGE = 'img/training2.jpg';

export const SITE_NAME = 'ESC Boxe Tergnier';
export const DEFAULT_TITLE = 'ESC Boxe Tergnier — Club de boxe anglaise à Tergnier (Aisne)';
export const DEFAULT_DESCRIPTION =
  'ESC Boxe Tergnier, club de boxe anglaise à Tergnier (02700) : boxe éducative, loisir, amateur et pro, planning des cours, tarifs, boxeurs, galas et inscriptions en ligne.';

/** Longueur conseillée d'une meta description */
const DESCRIPTION_MAX = 160;

/**
 * SEO — meta description et balises Open Graph de la page courante.
 * Appelé par SeoTitleStrategy à chaque navigation (données de route),
 * puis par les pages dynamiques (actualité, boxeur, événement, discipline) une fois le contenu chargé.
 * Le noindex de la bêta reste porté par index.html (meta robots) et robots.txt.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  update({ title, description, type = 'website', image }: SeoData): void {
    const pageTitle = title?.trim() || DEFAULT_TITLE;
    const pageDescription = summarize(description) || DEFAULT_DESCRIPTION;

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: pageDescription });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: pageDescription });
    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:locale', content: 'fr_FR' });
    this.meta.updateTag({ property: 'og:image', content: image || DEFAULT_IMAGE });
  }
}

/** Texte sur une ligne, tronqué proprement à ~160 caractères */
export function summarize(text: string | null | undefined, max = DESCRIPTION_MAX): string {
  const clean = (text ?? '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) {
    return clean;
  }
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.–—-]+$/, '')}…`;
}
