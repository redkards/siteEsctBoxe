import { Component, DestroyRef, computed, inject, input, signal, ChangeDetectionStrategy } from '@angular/core';

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

/** Temps restant jusqu'à une date cible (parties entières, jamais négatives) */
export function countdownParts(target: string | Date, now: Date = new Date()): CountdownParts {
  const diff = Math.max(0, new Date(target).getTime() - now.getTime());
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: diff === 0,
  };
}

/** Compte à rebours (jours / heures / minutes / secondes) jusqu'au prochain gala */
@Component({
  selector: 'app-countdown',
  template: `
    @if (parts(); as p) {
      @if (p.done) {
        <p class="cd__done">C'est parti !</p>
      } @else {
        <div class="cd" role="timer" [attr.aria-label]="label()">
          @for (unit of units(); track unit.label) {
            <div class="cd__unit" aria-hidden="true">
              <span class="cd__value">{{ unit.value }}</span>
              <span class="cd__label">{{ unit.label }}</span>
            </div>
          }
        </div>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    .cd {
      display: flex;
      gap: 0.6rem;
    }
    .cd__unit {
      display: grid;
      justify-items: center;
      min-width: 70px;
      padding: 0.7rem 0.5rem;
      border: 1px solid var(--bx-dark-line);
      border-radius: var(--bx-radius);
      background: var(--bx-glass);
      color: var(--bx-ink);
    }
    .cd__value {
      font-family: var(--bx-font-display);
      font-size: clamp(1.6rem, 4vw, 2.3rem);
      font-weight: 700;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    .cd__label {
      margin-top: 0.3rem;
      color: var(--bx-muted);
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .cd__done {
      margin: 0;
      font-family: var(--bx-font-display);
      font-size: 1.6rem;
      text-transform: uppercase;
    }
    @media (max-width: 420px) {
      .cd__unit { min-width: 0; flex: 1; }
    }
  `,
})
export class CountdownComponent {
  readonly target = input.required<string>();

  private readonly now = signal(new Date());
  protected readonly parts = computed(() => countdownParts(this.target(), this.now()));
  protected readonly units = computed(() => {
    const p = this.parts();
    const pad = (n: number) => String(n).padStart(2, '0');
    return [
      { value: String(p.days), label: p.days > 1 ? 'jours' : 'jour' },
      { value: pad(p.hours), label: 'heures' },
      { value: pad(p.minutes), label: 'min' },
      { value: pad(p.seconds), label: 'sec' },
    ];
  });
  protected readonly label = computed(() => {
    const p = this.parts();
    return `Encore ${p.days} jours, ${p.hours} heures et ${p.minutes} minutes`;
  });

  constructor() {
    const timer = setInterval(() => this.now.set(new Date()), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }
}
