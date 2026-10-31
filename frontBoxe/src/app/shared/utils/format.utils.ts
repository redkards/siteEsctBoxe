import { OpeningHours } from '../../core/api/models';

/** Montant en centimes → « 150 € » / « 12,50 € » */
export function formatEuros(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return '';
  const euros = cents / 100;
  return `${euros.toLocaleString('fr-FR', { minimumFractionDigits: Number.isInteger(euros) ? 0 : 2, maximumFractionDigits: 2 })} €`;
}

/** Libellé d'une valeur d'énumération à partir d'une liste { value, label } */
export function labelOf<T extends string>(list: readonly { value: T; label: string }[], value: T | null | undefined): string {
  return list.find((item) => item.value === value)?.label ?? value ?? '';
}

export function fullName(person: { firstName: string; lastName: string } | null | undefined): string {
  return person ? `${person.firstName} ${person.lastName}`.trim() : '';
}

/** Lien OpenStreetMap centré sur des coordonnées (ou recherche par adresse) */
export function osmLink(lat: number | null | undefined, lon: number | null | undefined, address?: string): string {
  if (lat !== null && lat !== undefined && lon !== null && lon !== undefined) {
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=17/${lat}/${lon}`;
  }
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(address ?? '')}`;
}

/** URL d'intégration (iframe) OpenStreetMap avec marqueur */
export function osmEmbed(lat: number, lon: number, delta = 0.006): string {
  const bbox = [lon - delta, lat - delta / 2, lon + delta, lat + delta / 2].join(',');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
}

/** Horaires d'ouverture normalisés en lignes { label, hours } (accepte texte, liste de textes ou d'objets) */
export function openingLines(value: OpeningHours | null | undefined): { label: string; hours: string }[] {
  if (!value) return [];
  const items = typeof value === 'string' ? value.split(/\n|;/) : value;
  return items
    .map((item) => {
      if (typeof item !== 'string') return { label: item.day ?? item.label ?? '', hours: item.hours };
      const [label, ...rest] = item.split(/\s*:\s*/);
      return rest.length ? { label: label.trim(), hours: rest.join(' : ').trim() } : { label: '', hours: item.trim() };
    })
    .filter((line) => line.hours || line.label);
}
