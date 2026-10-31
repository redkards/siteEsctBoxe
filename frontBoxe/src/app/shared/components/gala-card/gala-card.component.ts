import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GALA_TYPES, Gala } from '../../../core/api/models';
import { labelOf } from '../../utils/format.utils';

/** Carte d'événement « billet » : date en gros, titre, lieu */
@Component({
  selector: 'app-gala-card',
  imports: [RouterLink, DatePipe],
  template: `
    @let g = gala();
    <article class="card" [class.card--past]="past()">
      <div class="card__date" aria-hidden="true">
        <span class="card__day">{{ g.startsAt | date: 'd' }}</span>
        <span class="card__month">{{ g.startsAt | date: 'MMM' }}</span>
        <span class="card__year">{{ g.startsAt | date: 'y' }}</span>
      </div>
      <div class="card__body">
        <span class="bx-badge bx-badge--soft">{{ type() }}</span>
        <h3><a [routerLink]="['/evenements', g.slug]" class="card__link">{{ g.title }}</a></h3>
        <p class="card__meta">
          <time [attr.datetime]="g.startsAt">{{ g.startsAt | date: "EEEE d MMMM y 'à' HH'h'mm" }}</time>
          @if (g.venue || g.city) {
            <br />{{ g.venue }}@if (g.venue && g.city) {, }{{ g.city }}
          }
        </p>
      </div>
      <span class="card__go bx-arrow" aria-hidden="true">→</span>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    :host { display: block; }
    .card {
      position: relative;
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 1.1rem;
      height: 100%;
      padding: 1rem 1.2rem 1rem 1rem;
      border: 1px solid var(--bx-card-border);
      border-radius: var(--bx-radius);
      background: var(--bx-card);
      transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    }
    .card:hover { transform: translateY(-3px); box-shadow: var(--bx-shadow-sm); border-color: var(--bx-primary); }
    .card:focus-within { box-shadow: var(--bx-focus); }
    .card__date {
      display: grid;
      justify-items: center;
      min-width: 76px;
      padding: 0.7rem 0.4rem;
      border-radius: var(--bx-radius-sm);
      background: var(--bx-primary);
      color: var(--bx-primary-ink);
      font-family: var(--bx-font-display);
      line-height: 1;
      text-transform: uppercase;
    }
    .card--past .card__date { background: var(--bx-ink-soft); color: var(--bx-bg); }
    .card__day { font-size: 2rem; font-weight: 700; }
    .card__month { font-size: 0.95rem; font-weight: 600; margin-top: 0.2rem; }
    .card__year { font-size: 0.72rem; opacity: 0.85; margin-top: 0.2rem; }
    .card__body { display: grid; justify-items: start; gap: 0.35rem; }
    h3 { font-size: 1.25rem; }
    .card__link { color: var(--bx-ink); text-decoration: none; }
    .card__link::after { content: ''; position: absolute; inset: 0; }
    .card__link:focus-visible { box-shadow: none; }
    .card__meta { margin: 0; color: var(--bx-muted); font-size: 0.88rem; }
    .card__go { color: var(--bx-primary); font-size: 1.3rem; font-weight: 700; }
    .card:hover .card__go { transform: translateX(3px); }
  `,
})
export class GalaCardComponent {
  readonly gala = input.required<Gala>();
  protected readonly type = computed(() => labelOf(GALA_TYPES, this.gala().type));
  protected readonly past = computed(() => new Date(this.gala().startsAt).getTime() < Date.now());
}
