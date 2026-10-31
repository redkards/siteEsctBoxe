import { Lesson, LessonLevel, ModuleId } from './lessons.model';

export type LessonAudience = 'enfants' | 'ados' | 'jeunesAdultes';

export const LESSON_AUDIENCES: readonly { value: LessonAudience; label: string; ages: string }[] = [
  { value: 'enfants', label: 'Enfants', ages: '6–11 ans' },
  { value: 'ados', label: 'Ados', ages: '12–17 ans' },
  { value: 'jeunesAdultes', label: 'Jeunes adultes', ages: '18–25 ans' },
];

export const LESSON_LEVELS: readonly LessonLevel[] = ['découverte', 'intermédiaire', 'avancé'];

export interface LessonFilter {
  module?: ModuleId | null;
  level?: LessonLevel | null;
  query?: string;
  onlyFavorites?: boolean;
  favorites?: ReadonlySet<number>;
}

/** Minuscules sans accents, pour la recherche texte */
export function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

/** Filtre module / niveau / favoris / recherche (titre, objectif, adaptations, déroulé) */
export function filterLessons(lessons: readonly Lesson[], f: LessonFilter): Lesson[] {
  const terms = normalize(f.query ?? '').split(/\s+/).filter(Boolean);
  return lessons.filter((l) => {
    if (f.module && l.module !== f.module) return false;
    if (f.level && l.level !== f.level) return false;
    if (f.onlyFavorites && !f.favorites?.has(l.id)) return false;
    if (!terms.length) return true;
    const hay = normalize(
      [l.title, l.objective, l.decision, ...l.steps, ...Object.values(l.adaptations ?? {})].join(' '),
    );
    return terms.every((t) => hay.includes(t));
  });
}

/** Retrouve une leçon citée en prérequis (par slug ou par titre, sans tenir compte des accents) */
export function findLessonRef(lessons: readonly Lesson[], ref: string): Lesson | undefined {
  const n = normalize(ref);
  return lessons.find((l) => l.slug === ref.trim() || normalize(l.title) === n);
}

/** Leçons voisines dans l'ordre des identifiants */
export function neighbours(lessons: readonly Lesson[], id: number): { prev?: Lesson; next?: Lesson } {
  const sorted = [...lessons].sort((a, b) => a.id - b.id);
  const i = sorted.findIndex((l) => l.id === id);
  return i < 0 ? {} : { prev: sorted[i - 1], next: sorted[i + 1] };
}

/** Échauffement et retour au calme fixes de « Ma séance » (minutes) */
export const SESSION_WARMUP_MIN = 10;
export const SESSION_COOLDOWN_MIN = 5;

export function sessionDuration(lessons: readonly Pick<Lesson, 'durationMin'>[]): number {
  return SESSION_WARMUP_MIN + SESSION_COOLDOWN_MIN + lessons.reduce((n, l) => n + (l.durationMin || 0), 0);
}

export function formatMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return h ? `${h} h ${m.toString().padStart(2, '0')}` : `${m} min`;
}
