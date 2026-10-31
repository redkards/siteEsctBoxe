/** Logique pure du chronomètre de rounds (aucun timer : on fait avancer l'état seconde par seconde). */

export type ChronoPhase = 'idle' | 'prep' | 'round' | 'rest' | 'done';

export interface ChronoSettings {
  rounds: number;
  roundSec: number;
  restSec: number;
  prepSec: number;
}

export interface ChronoState {
  phase: ChronoPhase;
  round: number; // 1-based, 0 avant le départ
  remaining: number; // secondes restantes dans la phase
}

export interface ChronoPreset {
  id: string;
  label: string;
  rounds: number;
  roundSec: number;
  restSec: number;
}

export const CHRONO_PRESETS: readonly ChronoPreset[] = [
  { id: 'educative', label: 'Boxe éducative enfants', rounds: 3, roundSec: 60, restSec: 60 },
  { id: 'loisir', label: 'Loisir', rounds: 4, roundSec: 120, restSec: 60 },
  { id: 'amateur', label: 'Amateur', rounds: 3, roundSec: 180, restSec: 60 },
];

export const PREP_SEC = 10;

/** Événement sonore à jouer lors d'une transition */
export type ChronoCue = 'start' | 'rest' | 'end' | 'warn' | null;

export function initialState(): ChronoState {
  return { phase: 'idle', round: 0, remaining: 0 };
}

export function start(s: ChronoSettings): ChronoState {
  return s.prepSec > 0 ? { phase: 'prep', round: 1, remaining: s.prepSec } : { phase: 'round', round: 1, remaining: s.roundSec };
}

/** Avance d'une seconde ; retourne le nouvel état et le signal sonore éventuel */
export function tick(state: ChronoState, s: ChronoSettings): { state: ChronoState; cue: ChronoCue } {
  if (state.phase === 'idle' || state.phase === 'done') return { state, cue: null };
  const remaining = state.remaining - 1;
  if (remaining > 0) {
    // Alerte 10 s avant la fin d'un round (si le round dure plus de 20 s)
    const cue: ChronoCue = state.phase === 'round' && remaining === 10 && s.roundSec > 20 ? 'warn' : null;
    return { state: { ...state, remaining }, cue };
  }
  switch (state.phase) {
    case 'prep':
      return { state: { phase: 'round', round: state.round, remaining: s.roundSec }, cue: 'start' };
    case 'round':
      if (state.round >= s.rounds) return { state: { phase: 'done', round: state.round, remaining: 0 }, cue: 'end' };
      if (s.restSec <= 0) return { state: { phase: 'round', round: state.round + 1, remaining: s.roundSec }, cue: 'start' };
      return { state: { phase: 'rest', round: state.round, remaining: s.restSec }, cue: 'rest' };
    case 'rest':
      return { state: { phase: 'round', round: state.round + 1, remaining: s.roundSec }, cue: 'start' };
  }
}

/** Durée totale d'une session (préparation + rounds + repos entre rounds), en secondes */
export function totalDuration(s: ChronoSettings): number {
  return s.prepSec + s.rounds * s.roundSec + Math.max(0, s.rounds - 1) * s.restSec;
}

export function formatClock(sec: number): string {
  const v = Math.max(0, Math.floor(sec));
  return `${Math.floor(v / 60)}:${(v % 60).toString().padStart(2, '0')}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : min;
}
