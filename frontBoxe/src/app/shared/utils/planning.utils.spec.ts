import { TrainingSlot } from '../../core/api/models';
import { buildWeek, filterSlots, formatTime, isoDay, slotsOfDay, toMinutes } from './planning.utils';

function slot(id: number, dayOfWeek: number, startTime: string, discipline: string, audience: TrainingSlot['audience']): TrainingSlot {
  return {
    id,
    dayOfWeek,
    startTime,
    endTime: '21:00',
    discipline: { name: discipline, slug: discipline },
    audience,
    coach: null,
    venue: { name: 'Salle', city: 'Tergnier' },
  };
}

describe('planning.utils — grille hebdomadaire', () => {
  const slots = [
    slot(1, 3, '18:30', 'loisir', 'adultes'),
    slot(2, 1, '18:00', 'educative', 'enfants'),
    slot(3, 1, '17:00', 'educative', 'enfants'),
    slot(4, 3, '17:00', 'amateur', 'competiteurs'),
    slot(5, 6, '10:00', 'loisir', 'tous'),
  ];

  it('construit 7 jours du lundi au dimanche, créneaux triés par heure', () => {
    const week = buildWeek(slots);
    expect(week.map((d) => d.label)).toEqual(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']);
    expect(week[0].slots.map((s) => s.id)).toEqual([3, 2]);
    expect(week[1].slots).toEqual([]);
    expect(week[2].slots.map((s) => s.id)).toEqual([4, 1]);
    expect(week[5].slots.map((s) => s.id)).toEqual([5]);
  });

  it('filtre par discipline', () => {
    expect(filterSlots(slots, { discipline: 'loisir' }).map((s) => s.id)).toEqual([1, 5]);
  });

  it('filtre par public en gardant les créneaux « tous publics »', () => {
    expect(filterSlots(slots, { audience: 'enfants' }).map((s) => s.id)).toEqual([2, 3, 5]);
    expect(filterSlots(slots, { discipline: 'educative', audience: 'adultes' })).toEqual([]);
  });

  it('ne modifie pas la liste d’origine', () => {
    const before = slots.map((s) => s.id);
    buildWeek(slots);
    expect(slots.map((s) => s.id)).toEqual(before);
  });

  it('donne les créneaux du jour et le jour ISO', () => {
    expect(isoDay(new Date(2026, 10, 2))).toBe(1); // lundi
    expect(isoDay(new Date(2026, 10, 1))).toBe(7); // dimanche
    expect(slotsOfDay(slots, 1).map((s) => s.id)).toEqual([3, 2]);
  });

  it('formate les horaires', () => {
    expect(toMinutes('18:30')).toBe(1110);
    expect(formatTime('18:00')).toBe('18h');
    expect(formatTime('09:30')).toBe('9h30');
  });
});
