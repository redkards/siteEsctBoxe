import { REGIONAL_GALAS } from './agenda.data';
import { buildIcs, filterGalas, icsEscape, icsFileName, upcomingGalas } from './agenda.utils';

describe('agenda.utils', () => {
  const rochexpo = REGIONAL_GALAS.find((g) => g.id === 'rochexpo-2026-11-28')!;

  it('contient les 5 galas relevés', () => {
    expect(REGIONAL_GALAS.length).toBe(5);
  });

  it('masque les dates passées et trie chronologiquement', () => {
    const list = upcomingGalas(REGIONAL_GALAS, new Date(2026, 10, 22));
    expect(list.map((g) => g.id)).toEqual(['abbeville-2026-11-28', 'rochexpo-2026-11-28', 'paris-wcc-2026-12-10']);
    expect(upcomingGalas(REGIONAL_GALAS, new Date(2026, 10, 14)).length).toBe(5); // jour même inclus
    expect(upcomingGalas(REGIONAL_GALAS, new Date(2027, 0, 1))).toEqual([]);
  });

  it('filtre par région et par mois', () => {
    expect(filterGalas(REGIONAL_GALAS, 'Hauts-de-France', null).length).toBe(2);
    expect(filterGalas(REGIONAL_GALAS, null, '2026-12').map((g) => g.city)).toEqual(['Paris']);
    expect(filterGalas(REGIONAL_GALAS, 'Grand Est', '2026-12')).toEqual([]);
  });

  it('échappe les caractères spéciaux iCalendar', () => {
    expect(icsEscape('a,b;c\\d\ne')).toBe('a\\,b\\;c\\\\d\\ne');
  });

  it('génère un fichier .ics valide', () => {
    const ics = buildIcs(rochexpo, new Date(Date.UTC(2026, 9, 31, 12, 0, 0)));
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBeTrue();
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBeTrue();
    expect(ics).toContain('UID:rochexpo-2026-11-28@esctboxe');
    expect(ics).toContain('DTSTAMP:20261031T120000Z');
    expect(ics).toContain('DTSTART;TZID=Europe/Paris:20261128T194500');
    expect(ics).toContain('DTEND;TZID=Europe/Paris:20261128T224500');
    expect(ics).toContain('LOCATION:La Roche-sur-Foron\\, Auvergne-Rhône-Alpes');
    expect(ics.split('\r\n').every((line) => line.length <= 75)).toBeTrue();
    expect(icsFileName(rochexpo)).toBe('gala-rochexpo-2026-11-28.ics');
  });

  it('gère un gala tardif dont la fin passe minuit', () => {
    const ics = buildIcs({ ...rochexpo, time: '22:30' });
    expect(ics).toContain('DTEND;TZID=Europe/Paris:20261129T013000');
  });
});
