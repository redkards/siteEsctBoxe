import { Component, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AGENDA_CHECKED_AT, REGIONAL_GALAS, RegionalGala } from './agenda.data';
import { buildIcs, filterGalas, icsFileName, upcomingGalas } from './agenda.utils';

/** /agenda — Agenda régional des galas (données statiques, export .ics) */
@Component({
  selector: 'app-agenda',
  imports: [RouterLink, DatePipe],
  template: `
    <section class="bx-page-head">
      <div class="bx-container">
        <nav class="bx-breadcrumb" aria-label="Fil d'Ariane"><a routerLink="/">Accueil</a><span aria-hidden="true">/</span><span>Agenda des galas</span></nav>
        <h1>Agenda des galas</h1>
        <p>Les galas de boxe à venir en France, relevés le {{ checkedAt | date: 'd MMMM y' }}. Ajoutez-les à votre calendrier en un clic.</p>
      </div>
    </section>

    <section class="bx-section bx-section--tight">
      <div class="bx-container ag">
        <p class="ag__warning" role="note">Liste non exhaustive, à vérifier avant déplacement (dates, horaires et billetterie auprès de l'organisateur).</p>

        <div class="ag__filters" role="group" aria-label="Filtres de l'agenda">
          <label>
            <span>Région</span>
            <select class="bx-input" (change)="region.set(value($event))">
              <option value="">Toutes les régions</option>
              @for (r of regions(); track r) {
                <option [value]="r">{{ r }}</option>
              }
            </select>
          </label>
          <label>
            <span>Mois</span>
            <select class="bx-input" (change)="month.set(value($event))">
              <option value="">Tous les mois</option>
              @for (m of months(); track m) {
                <option [value]="m">{{ m + '-01' | date: 'MMMM y' }}</option>
              }
            </select>
          </label>
        </div>

        <p class="ag__count" role="status" aria-live="polite">{{ galas().length }} gala{{ galas().length > 1 ? 's' : '' }} à venir</p>

        @if (galas().length) {
          <ul class="ag__list">
            @for (g of galas(); track g.id) {
              <li class="ag__item bx-card">
                <div class="ag__date" aria-hidden="true">
                  <span class="ag__day">{{ g.date | date: 'd' }}</span>
                  <span class="ag__month">{{ g.date | date: 'MMM' }}</span>
                </div>
                <div class="ag__body">
                  <h2>{{ g.title }}</h2>
                  <p class="ag__meta">
                    <time [attr.datetime]="g.date + 'T' + g.time">{{ g.date | date: 'EEEE d MMMM y' }} à {{ g.time.replace(':', 'h') }}</time>
                    · {{ g.city }} · <span class="ag__region">{{ g.region }}</span>
                  </p>
                  @if (g.note) {
                    <p class="ag__note">{{ g.note }}</p>
                  }
                  <div class="ag__actions">
                    <a class="bx-link" [href]="g.source" target="_blank" rel="noopener noreferrer">Source officielle<span class="bx-sr-only"> (nouvel onglet)</span> ↗</a>
                    <button type="button" class="bx-btn bx-btn--outline bx-btn--sm" (click)="download(g)">
                      Ajouter au calendrier (.ics)<span class="bx-sr-only"> : {{ g.title }}, {{ g.city }}</span>
                    </button>
                  </div>
                </div>
              </li>
            }
          </ul>
        } @else {
          <div class="bx-empty"><strong>Aucun gala à venir pour ces filtres</strong><p>Changez de région ou de mois.</p></div>
        }
      </div>
    </section>
  `,
  styles: `
    :host { display: block; }
    .ag { display: grid; gap: 1.25rem; }
    .ag__warning { margin: 0; padding: 0.75rem 1rem; border: 1.5px dashed var(--bx-warning); border-radius: var(--bx-radius-sm); background: var(--bx-warning-soft); color: var(--bx-warning); font-weight: 600; }
    .ag__filters { display: flex; flex-wrap: wrap; gap: 1rem; }
    .ag__filters label { display: grid; gap: 0.3rem; min-width: min(240px, 100%); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--bx-muted); }
    .ag__count { margin: 0; color: var(--bx-muted); }
    .ag__list { display: grid; gap: 1rem; margin: 0; padding: 0; list-style: none; }
    .ag__item { display: grid; grid-template-columns: 5rem 1fr; gap: 1.25rem; align-items: start; padding: 1.25rem; }
    .ag__date { display: grid; justify-items: center; padding: 0.6rem 0; border-radius: var(--bx-radius); background: var(--bx-fill, var(--bx-primary)); color: var(--bx-primary-ink); }
    .ag__day { font: 700 2rem/1 var(--bx-font-display); }
    .ag__month { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; }
    .ag__body h2 { margin: 0 0 0.3rem; font-size: 1.3rem; }
    .ag__meta, .ag__note { margin: 0 0 0.4rem; color: var(--bx-ink-soft); }
    .ag__meta time::first-letter { text-transform: uppercase; }
    .ag__region { font-weight: 700; }
    .ag__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; margin-top: 0.6rem; }
    @media (max-width: 520px) { .ag__item { grid-template-columns: 1fr; } .ag__date { justify-self: start; padding: 0.4rem 1rem; } }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AgendaComponent {
  protected readonly checkedAt = AGENDA_CHECKED_AT;
  private readonly upcoming = upcomingGalas(REGIONAL_GALAS);

  protected readonly region = signal<string | null>(null);
  protected readonly month = signal<string | null>(null);
  protected readonly regions = computed(() => [...new Set(this.upcoming.map((g) => g.region))].sort());
  protected readonly months = computed(() => [...new Set(this.upcoming.map((g) => g.date.slice(0, 7)))]);
  protected readonly galas = computed(() => filterGalas(this.upcoming, this.region(), this.month()));

  protected value(event: Event): string | null {
    return (event.target as HTMLSelectElement).value || null;
  }

  protected download(g: RegionalGala): void {
    const blob = new Blob([buildIcs(g)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = icsFileName(g);
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
