import { Injectable, computed, signal } from '@angular/core';

export const LESSONS_STORAGE_KEY = 'esct_lessons';

interface StoredProgress {
  done: number[];
  favorites: number[];
  session: number[];
}

function uniqueInts(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((v): v is number => Number.isInteger(v)))];
}

/**
 * Progression personnelle sur les leçons : faites, favoris et « Ma séance » (ordre conservé).
 * Stockage local (localStorage `esct_lessons`), toujours protégé par try/catch.
 */
@Injectable({ providedIn: 'root' })
export class LessonProgressService {
  private readonly state = signal<StoredProgress>(this.load());

  readonly done = computed(() => new Set(this.state().done));
  readonly favorites = computed(() => new Set(this.state().favorites));
  readonly session = computed(() => this.state().session);
  readonly doneCount = computed(() => this.state().done.length);

  isDone(id: number): boolean {
    return this.done().has(id);
  }

  isFavorite(id: number): boolean {
    return this.favorites().has(id);
  }

  inSession(id: number): boolean {
    return this.state().session.includes(id);
  }

  toggleDone(id: number): void {
    this.update((s) => ({ ...s, done: toggle(s.done, id) }));
  }

  toggleFavorite(id: number): void {
    this.update((s) => ({ ...s, favorites: toggle(s.favorites, id) }));
  }

  addToSession(id: number): void {
    if (!this.inSession(id)) this.update((s) => ({ ...s, session: [...s.session, id] }));
  }

  removeFromSession(id: number): void {
    this.update((s) => ({ ...s, session: s.session.filter((x) => x !== id) }));
  }

  /** Déplace une leçon de la séance (delta -1 = monter, +1 = descendre) */
  moveInSession(id: number, delta: number): void {
    const list = [...this.state().session];
    const from = list.indexOf(id);
    const to = from + delta;
    if (from < 0 || to < 0 || to >= list.length) return;
    [list[from], list[to]] = [list[to], list[from]];
    this.update((s) => ({ ...s, session: list }));
  }

  clearSession(): void {
    this.update((s) => ({ ...s, session: [] }));
  }

  /** Nombre de leçons faites parmi une liste d'identifiants (ex. un module) */
  countDone(ids: readonly number[]): number {
    const done = this.done();
    return ids.filter((id) => done.has(id)).length;
  }

  private update(fn: (s: StoredProgress) => StoredProgress): void {
    this.state.update(fn);
    try {
      localStorage.setItem(LESSONS_STORAGE_KEY, JSON.stringify(this.state()));
    } catch {
      /* stockage indisponible (navigation privée…) : progression en mémoire seulement */
    }
  }

  private load(): StoredProgress {
    try {
      const raw = localStorage.getItem(LESSONS_STORAGE_KEY);
      const data = raw ? (JSON.parse(raw) as Partial<StoredProgress>) : {};
      return { done: uniqueInts(data.done), favorites: uniqueInts(data.favorites), session: uniqueInts(data.session) };
    } catch {
      return { done: [], favorites: [], session: [] };
    }
  }
}

function toggle(list: number[], id: number): number[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}
