/** Agenda régional des galas — relevé manuel du 31/10/2026, liste non exhaustive. Heures locales (Europe/Paris). */
export interface RegionalGala {
  id: string;
  title: string;
  city: string;
  region: string;
  date: string; // AAAA-MM-JJ
  time: string; // HH:MM (début principal)
  note?: string;
  source: string;
}

export const AGENDA_CHECKED_AT = '2026-10-31';

export const REGIONAL_GALAS: readonly RegionalGala[] = [
  {
    id: 'bruay-2026-11-14',
    title: 'Grand gala de boxe',
    city: 'Bruay-la-Buissière',
    region: 'Hauts-de-France',
    date: '2026-11-14',
    time: '19:30',
    source: 'https://bruaylabuissiere.fr/event/grand-gala-de-boxe/',
  },
  {
    id: 'epernay-2026-11-21',
    title: 'Gala de boxe',
    city: 'Épernay',
    region: 'Grand Est',
    date: '2026-11-21',
    time: '19:00',
    source: 'https://epernay.fr/agenda/gala-de-boxe',
  },
  {
    id: 'abbeville-2026-11-28',
    title: 'Gala de boxe',
    city: 'Abbeville',
    region: 'Hauts-de-France',
    date: '2026-11-28',
    time: '18:00',
    source: 'https://www.abbeville.fr/agenda/gala-de-boxe-2/',
  },
  {
    id: 'rochexpo-2026-11-28',
    title: 'Gala de boxe — Rochexpo',
    city: 'La Roche-sur-Foron',
    region: 'Auvergne-Rhône-Alpes',
    date: '2026-11-28',
    time: '19:45',
    note: 'Ouverture des portes 18:00, combats 19:45',
    source: 'https://www.rochexpo.com/gala-de-boxe/',
  },
  {
    id: 'paris-wcc-2026-12-10',
    title: 'White Collar Challenge',
    city: 'Paris',
    region: 'Île-de-France',
    date: '2026-12-10',
    time: '19:00',
    note: 'Ouverture 19:00',
    source: 'https://whitecollarchallenge.com/',
  },
];
