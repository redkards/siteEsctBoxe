import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

/** Citations originales du club (une par jour, en rotation) */
export const DAILY_QUOTES: readonly string[] = [
  'Chaque progrès commence par un geste appris avec respect.',
  'Ton rythme mérite autant de respect que ton objectif.',
  'Une équipe grandit quand chacun y trouve sa place.',
  'Le courage, c’est aussi apprendre sans se comparer.',
  'La maîtrise se construit avec patience et attention.',
  'Ton énergie devient une force quand elle encourage les autres.',
  'Ce que tu apprends aujourd’hui peut aider quelqu’un demain.',
  'Un petit progrès partagé peut donner un grand élan.',
  'On avance plus sereinement quand on s’encourage ensemble.',
  'Chaque premier round peut ouvrir une nouvelle confiance.',
  'Chaque chute t’apprend où poser ton prochain appui.',
  'Ta place sur le ring se gagne d’abord à l’entraînement.',
  'Écris tes progrès : demain, ils te rappelleront d’où tu viens.',
  'Sous les projecteurs, c’est ta préparation qui parle.',
  'Le calme dans la garde prépare la clarté dans l’action.',
];

/** Citation du jour : même citation toute la journée (date locale), change chaque jour */
export function quoteOfDay(date: Date = new Date(), quotes: readonly string[] = DAILY_QUOTES): string {
  const dayIndex = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return quotes[((dayIndex % quotes.length) + quotes.length) % quotes.length];
}

@Component({
  selector: 'app-quote-of-day',
  template: `
    <section class="qd" aria-label="Citation du jour">
      <div class="bx-container">
        <figure class="qd__fig">
          <blockquote class="qd__quote"><p>« {{ quote() }} »</p></blockquote>
          <figcaption class="qd__cap">Citation du jour · ESC Boxe Tergnier</figcaption>
        </figure>
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .qd { padding-block: clamp(1.5rem, 4vw, 2.5rem); background: var(--bx-surface); }
    .qd__fig { margin: 0; text-align: center; }
    .qd__quote { margin: 0; }
    .qd__quote p { margin: 0 auto; max-width: 40ch; color: var(--bx-ink); font: var(--bx-display-weight) clamp(1.3rem, 3.2vw, 2rem) / 1.3 var(--bx-font-display); letter-spacing: var(--bx-display-tracking); }
    .qd__cap { margin-top: 0.6rem; color: var(--bx-muted); font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class QuoteOfDayComponent {
  /** Date de référence (tests / aperçu) ; par défaut aujourd'hui */
  readonly date = input<Date | null>(null);
  protected readonly quote = computed(() => quoteOfDay(this.date() ?? new Date()));
}
