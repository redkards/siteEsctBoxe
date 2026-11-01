import { Component, DestroyRef, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  CHRONO_PRESETS,
  ChronoCue,
  ChronoPreset,
  ChronoSettings,
  ChronoState,
  PREP_SEC,
  clamp,
  formatClock,
  initialState,
  start,
  tick,
  totalDuration,
} from './chrono.logic';

interface WakeLockLike {
  release(): Promise<void>;
}

const PHASE_LABELS = { idle: 'Prêt', prep: 'Préparation', round: 'Round', rest: 'Repos', done: 'Terminé' } as const;

/** /chrono — Chronomètre de rounds (préréglages, bip Web Audio, Wake Lock) */
@Component({
  selector: 'app-chrono',
  imports: [RouterLink],
  templateUrl: './chrono.component.html',
  styleUrl: './chrono.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { '(document:keydown)': 'onKey($event)' },
})
export class ChronoComponent {
  protected readonly presets = CHRONO_PRESETS;
  protected readonly rounds = signal(3);
  protected readonly roundSec = signal(60);
  protected readonly restSec = signal(60);
  protected readonly preset = signal<string | null>('educative');
  protected readonly state = signal<ChronoState>(initialState());
  protected readonly running = signal(false);

  protected readonly settings = computed<ChronoSettings>(() => ({
    rounds: this.rounds(),
    roundSec: this.roundSec(),
    restSec: this.restSec(),
    prepSec: PREP_SEC,
  }));
  protected readonly clock = computed(() => {
    const s = this.state();
    return formatClock(s.phase === 'idle' ? this.roundSec() : s.remaining);
  });
  protected readonly phaseLabel = computed(() => PHASE_LABELS[this.state().phase]);
  protected readonly total = computed(() => formatClock(totalDuration(this.settings())));
  protected readonly started = computed(() => this.state().phase !== 'idle');

  private timer: ReturnType<typeof setInterval> | null = null;
  private lastTick = 0;
  private audio: AudioContext | null = null;
  private wakeLock: WakeLockLike | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.running.set(false);
      this.stopTimer();
      void this.releaseWakeLock();
      void this.audio?.close().catch(() => undefined);
    });
  }

  protected applyPreset(p: ChronoPreset): void {
    if (this.started()) return;
    this.preset.set(p.id);
    this.rounds.set(p.rounds);
    this.roundSec.set(p.roundSec);
    this.restSec.set(p.restSec);
  }

  protected setNumber(target: 'rounds' | 'roundMin' | 'roundS' | 'rest', event: Event): void {
    const v = Number((event.target as HTMLInputElement).value);
    this.preset.set(null);
    if (target === 'rounds') this.rounds.set(clamp(v, 1, 15));
    if (target === 'roundMin') this.roundSec.set(clamp(v * 60 + (this.roundSec() % 60), 10, 600));
    if (target === 'roundS') this.roundSec.set(clamp(Math.floor(this.roundSec() / 60) * 60 + v, 10, 600));
    if (target === 'rest') this.restSec.set(clamp(v, 0, 300));
  }

  protected toggle(): void {
    if (this.running()) {
      this.pause();
      return;
    }
    this.unlockAudio();
    if (!this.started() || this.state().phase === 'done') {
      this.state.set(start(this.settings()));
      this.beep('warn');
    }
    this.running.set(true);
    void this.requestWakeLock();
    this.stopTimer();
    this.lastTick = Date.now();
    // Cadence fine + rattrapage sur l'horloge réelle : les navigateurs ralentissent setInterval
    // en arrière-plan (écran verrouillé, autre onglet), le décompte ne doit pas dériver.
    this.timer = setInterval(() => this.catchUp(), 250);
  }

  protected pause(): void {
    this.running.set(false);
    this.stopTimer();
    void this.releaseWakeLock();
  }

  protected reset(): void {
    this.pause();
    this.state.set(initialState());
  }

  protected onKey(event: KeyboardEvent): void {
    const tag = (event.target as HTMLElement | null)?.tagName;
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' || tag === 'BUTTON' || tag === 'A') return;
    if (event.code === 'Space') {
      event.preventDefault();
      this.toggle();
    } else if (event.key === 'r' || event.key === 'R') {
      this.reset();
    }
  }

  protected minutes(sec: number): number {
    return Math.floor(sec / 60);
  }

  protected seconds(sec: number): number {
    return sec % 60;
  }

  /** Applique autant de secondes que réellement écoulées depuis le dernier passage */
  private catchUp(): void {
    const elapsed = Math.floor((Date.now() - this.lastTick) / 1000);
    if (elapsed <= 0) return;
    this.lastTick += elapsed * 1000;
    let current = this.state();
    let lastCue: ChronoCue = null;
    for (let i = 0; i < elapsed && current.phase !== 'done'; i++) {
      const { state, cue } = tick(current, this.settings());
      current = state;
      if (cue) lastCue = cue;
    }
    this.state.set(current);
    if (lastCue) this.beep(lastCue);
    if (current.phase === 'done') this.pause();
  }

  private stopTimer(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  /** Le contexte audio n'est créé qu'au clic (politique d'autoplay des navigateurs) */
  private unlockAudio(): void {
    try {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!this.audio && Ctx) this.audio = new Ctx();
      void this.audio?.resume();
    } catch {
      this.audio = null;
    }
  }

  private beep(cue: Exclude<ChronoCue, null>): void {
    const ctx = this.audio;
    if (!ctx) return;
    try {
      const pattern: Record<typeof cue, { freq: number; count: number; dur: number }> = {
        start: { freq: 880, count: 1, dur: 0.6 },
        rest: { freq: 520, count: 2, dur: 0.3 },
        end: { freq: 660, count: 3, dur: 0.4 },
        warn: { freq: 1200, count: 1, dur: 0.15 },
      };
      const p = pattern[cue];
      for (let i = 0; i < p.count; i++) {
        const t = ctx.currentTime + i * (p.dur + 0.12);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = p.freq;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + p.dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + p.dur + 0.02);
      }
    } catch {
      /* audio indisponible */
    }
  }

  private async requestWakeLock(): Promise<void> {
    try {
      const nav = navigator as Navigator & { wakeLock?: { request(type: 'screen'): Promise<WakeLockLike> } };
      if (nav.wakeLock && !this.wakeLock) {
        const lock = await nav.wakeLock.request('screen');
        // Pause ou sortie de page pendant la demande : on relâche aussitôt (sinon l'écran resterait allumé)
        if (this.running()) this.wakeLock = lock;
        else void lock.release().catch(() => undefined);
      }
    } catch {
      this.wakeLock = null;
    }
  }

  private async releaseWakeLock(): Promise<void> {
    try {
      await this.wakeLock?.release();
    } catch {
      /* déjà relâché */
    }
    this.wakeLock = null;
  }
}
