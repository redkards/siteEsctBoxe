/**
 * Informations légales du site de l'ESC Boxe Tergnier : UNIQUE fichier à compléter par le bureau de l'association.
 *
 * Remplacez chaque valeur « [À COMPLÉTER : …] » par l'information réelle (statuts, récépissé de déclaration en
 * préfecture, avis de situation INSEE). Les pages Mentions légales, Politique de confidentialité et CGU lisent ce
 * fichier ; une valeur non remplie reste affichée surlignée sur le site.
 *
 * Modèles à faire relire (bureau de l'association, éventuellement un juriste) avant la mise en ligne.
 */
export const LEGAL = {
  association: {
    /** Dénomination exacte figurant dans les statuts */
    name: 'ESC Boxe Tergnier',
    legalForm: 'Association régie par la loi du 1er juillet 1901 et le décret du 16 août 1901',
    /** Numéro RNA (W02…) du récépissé de déclaration en préfecture de l'Aisne */
    rna: '[À COMPLÉTER : numéro RNA W02…]',
    /** Uniquement si l'association en possède un (emploi salarié, subventions…) ; sinon « Non applicable » */
    siret: '[À COMPLÉTER : numéro SIRET, ou « Non applicable »]',
    address: '[À COMPLÉTER : adresse du siège social], 02700 Tergnier',
    email: '[À COMPLÉTER : email de contact du club]',
    /** Adresse dédiée aux demandes relatives aux données personnelles (peut être la même) */
    privacyEmail: '[À COMPLÉTER : email pour les demandes RGPD]',
    phone: '[À COMPLÉTER : téléphone du club]',
    /** Affiliation fédérale */
    federation: 'Fédération Française de Boxe (FFBoxe)',
    affiliation: '[À COMPLÉTER : numéro d’affiliation FFBoxe]',
  },
  /** Le directeur de la publication d'une association est en principe son président (représentant légal) */
  publicationDirector: '[À COMPLÉTER : prénom et nom du président], président(e) de l’association',
  host: {
    name: 'o2switch',
    legalForm: 'SAS au capital de 100 000 €',
    address: 'Chemin des Pardiaux, 63000 Clermont-Ferrand, France',
    phone: '04 44 44 60 40',
    siren: '510 909 807 (RCS Clermont-Ferrand)',
    website: 'https://www.o2switch.fr',
  },
  cnil: {
    address: '3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07',
    complaintUrl: 'https://www.cnil.fr/fr/plaintes',
  },
  lastUpdate: '31 octobre 2026',
  cguVersion: '1.0',
} as const;

/** Vrai si la valeur n'a pas encore été renseignée (affichage surligné). */
export function isPending(value: string): boolean {
  return value.includes('[À COMPLÉTER');
}

/** Entrée du sommaire d'une page légale. */
export interface LegalSection {
  id: string;
  label: string;
}

/**
 * Défilement vers une section du sommaire (le routeur n'active pas l'anchorScrolling).
 */
export function scrollToSection(event: Event, id: string): void {
  const target = document.getElementById(id);
  if (!target) {
    return;
  }
  event.preventDefault();
  const smooth = !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  target.focus({ preventScroll: true });
  history.replaceState(history.state, '', `${location.pathname}#${id}`);
}
