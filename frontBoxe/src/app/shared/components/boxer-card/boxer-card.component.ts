import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BOXER_LEVELS, BoxerSummary } from '../../../core/api/models';
import { MediaPipe } from '../../pipes/media.pipe';
import { labelOf } from '../../utils/format.utils';

/** Carte « affiche » d'un boxeur : photo, nom, catégorie, record V-D-N */
@Component({
  selector: 'app-boxer-card',
  imports: [RouterLink, MediaPipe],
  template: `
    @let b = boxer();
    <a class="card" [routerLink]="['/boxeurs', b.slug]">
      <div class="card__media">
        @if (b.photo | media; as src) {
          <img [src]="src" [alt]="'Photo de ' + b.firstName + ' ' + b.lastName" loading="lazy" />
        } @else {
          <span class="card__initials" aria-hidden="true">{{ b.firstName.charAt(0) }}{{ b.lastName.charAt(0) }}</span>
        }
        <span class="bx-badge bx-badge--primary card__level">{{ level() }}</span>
      </div>
      <div class="card__body">
        @if (b.nickname) {
          <span class="card__nick">« {{ b.nickname }} »</span>
        }
        <h3 class="card__name">{{ b.firstName }} <span>{{ b.lastName }}</span></h3>
        <p class="card__meta">
          {{ b.discipline?.name ?? 'Boxe anglaise' }}
          @if (b.weightClass) {
            · {{ b.weightClass }}
          }
        </p>
        <dl class="card__record" [attr.aria-label]="recordLabel()">
          <div><dt>V</dt><dd>{{ b.wins }}</dd></div>
          <div><dt>D</dt><dd>{{ b.losses }}</dd></div>
          <div><dt>N</dt><dd>{{ b.draws }}</dd></div>
          <div class="ko"><dt>KO</dt><dd>{{ b.kos }}</dd></div>
        </dl>
      </div>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    :host { display: block; }
    .card {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      border: 1px solid var(--bx-card-border);
      border-radius: var(--bx-radius);
      background: var(--bx-card);
      color: var(--bx-ink);
      text-decoration: none;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .card:hover { transform: translateY(-4px); box-shadow: var(--bx-shadow); }
    .card__media {
      position: relative;
      aspect-ratio: 4 / 5;
      overflow: hidden;
      background: var(--bx-dark);
    }
    .card__media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s;
    }
    .card:hover .card__media img { transform: scale(1.04); }
    .card__initials {
      display: grid;
      place-items: center;
      height: 100%;
      color: var(--bx-dark-muted);
      font-family: var(--bx-font-display);
      font-size: 4rem;
      font-weight: 700;
    }
    .card__level { position: absolute; top: 0.8rem; left: 0.8rem; }
    .card__body { display: grid; gap: 0.3rem; padding: 1rem 1.1rem 1.1rem; }
    .card__nick { color: var(--bx-primary); font-size: 0.85rem; font-weight: 600; font-style: italic; }
    .card__name { font-size: 1.45rem; }
    .card__name span { color: var(--bx-primary); }
    .card__meta { margin: 0; color: var(--bx-muted); font-size: 0.88rem; }
    .card__record {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      margin: 0.6rem 0 0;
      border-top: 1px solid var(--bx-line);
      padding-top: 0.7rem;
      text-align: center;
    }
    .card__record dt { color: var(--bx-muted); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; }
    .card__record dd { margin: 0; font-family: var(--bx-font-display); font-size: 1.35rem; font-weight: 700; }
    .card__record .ko dd { color: var(--bx-primary); }
  `,
})
export class BoxerCardComponent {
  readonly boxer = input.required<BoxerSummary>();
  protected readonly level = computed(() => labelOf(BOXER_LEVELS, this.boxer().level));
  protected readonly recordLabel = computed(() => {
    const b = this.boxer();
    return `Palmarès : ${b.wins} victoires, ${b.losses} défaites, ${b.draws} nuls, dont ${b.kos} par KO`;
  });
}
