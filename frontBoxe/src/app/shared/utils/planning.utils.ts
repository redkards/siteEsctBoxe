import { Audience, TrainingSlot } from '../../core/api/models';

export const DAYS = [
  { value: 1, label: 'Lundi', short: 'Lun' },
  { value: 2, label: 'Mardi', short: 'Mar' },
  { value: 3, label: 'Mercredi', short: 'Mer' },
  { value: 4, label: 'Jeudi', short: 'Jeu' },
  { value: 5, label: 'Vendredi', short: 'Ven' },
  { value: 6, label: 'Samedi', short: 'Sam' },
  { value: 7, label: 'Dimanche', short: 'Dim' },
] as const;

export interface PlanningFilter {
  /** slug de la discipline */
  discipline?: string | null;
  audience?: Audience | null;
}

export interface PlanningDay {
  value: number;
  label: string;
  short: string;
  slots: TrainingSlot[];
}

/** Jour ISO (1 = lundi … 7 = dimanche) d'une date */
export function isoDay(date: Date = new Date()): number {
  return ((date.getDay() + 6) % 7) + 1;
}

/** "18:30" → 1110 minutes (tri et calculs de durée) */
export function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function compareSlots(a: TrainingSlot, b: TrainingSlot): number {
  return a.dayOfWeek - b.dayOfWeek || toMinutes(a.startTime) - toMinutes(b.startTime) || toMinutes(a.endTime) - toMinutes(b.endTime);
}

/**
 * Filtre les créneaux. Un créneau « tous publics » reste visible quel que soit le public choisi.
 */
export function filterSlots(slots: TrainingSlot[], filter: PlanningFilter = {}): TrainingSlot[] {
  return slots.filter(
    (slot) =>
      (!filter.discipline || slot.discipline?.slug === filter.discipline) &&
      (!filter.audience || slot.audience === filter.audience || slot.audience === 'tous'),
  );
}

/** Grille hebdomadaire : 7 colonnes (lundi → dimanche), créneaux triés par heure de début */
export function buildWeek(slots: TrainingSlot[], filter: PlanningFilter = {}): PlanningDay[] {
  const kept = filterSlots(slots, filter).sort(compareSlots);
  return DAYS.map((day) => ({ ...day, slots: kept.filter((s) => s.dayOfWeek === day.value) }));
}

/** Créneaux d'un jour donné (par défaut aujourd'hui), triés */
export function slotsOfDay(slots: TrainingSlot[], day: number = isoDay()): TrainingSlot[] {
  return slots.filter((s) => s.dayOfWeek === day).sort(compareSlots);
}

/** "18:00" → "18h", "18:30" → "18h30" */
export function formatTime(time: string): string {
  const [h, m] = time.split(':');
  return `${Number(h)}h${m && m !== '00' ? m : ''}`;
}
