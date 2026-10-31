/** Âge de la majorité (autorisation du responsable légal en dessous) */
export const MAJORITY_AGE = 18;

/**
 * Parse une date « AAAA-MM-JJ » (ou ISO 8601) en date locale, sans décalage de fuseau.
 * Renvoie null si la valeur est vide ou invalide.
 */
export function parseDay(value: string | null | undefined): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? '');
  if (!match) return null;
  const [, y, m, d] = match.map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d ? date : null;
}

/** Âge révolu à une date de référence (aujourd'hui par défaut) ; null si la date est invalide */
export function ageOn(birthDate: string | null | undefined, reference: Date = new Date()): number | null {
  const birth = parseDay(birthDate);
  if (!birth) return null;
  let age = reference.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    reference.getMonth() < birth.getMonth() ||
    (reference.getMonth() === birth.getMonth() && reference.getDate() < birth.getDate());
  if (beforeBirthday) age--;
  return age;
}

/** Vrai si la personne a moins de 18 ans à la date de référence */
export function isMinor(birthDate: string | null | undefined, reference: Date = new Date()): boolean {
  const age = ageOn(birthDate, reference);
  return age !== null && age < MAJORITY_AGE;
}

/** Date de naissance plausible : passée et âge entre 3 et 100 ans */
export function isPlausibleBirthDate(birthDate: string | null | undefined, reference: Date = new Date()): boolean {
  const age = ageOn(birthDate, reference);
  return age !== null && age >= 3 && age <= 100;
}

/**
 * Saison sportive en cours, de septembre à août : « 2026-2027 ».
 * À partir d'août, on s'inscrit déjà pour la saison qui commence.
 */
export function currentSeason(reference: Date = new Date()): string {
  const year = reference.getFullYear();
  const start = reference.getMonth() >= 7 ? year : year - 1;
  return `${start}-${start + 1}`;
}

/** Date locale au format AAAA-MM-JJ */
export function toIsoDay(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
