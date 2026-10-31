import { Component, computed, effect, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GalaService } from '../../core/api/gala.service';
import { FIGHT_METHODS, FightResult, GALA_TYPES, GalaDetail } from '../../core/api/models';
import { SeoService } from '../../core/seo/seo.service';
import { CountdownComponent } from '../../shared/components/countdown/countdown.component';
import { LoadErrorComponent } from '../../shared/components/state/state.component';
import { EurosPipe } from '../../shared/pipes/euros.pipe';
import { MediaPipe } from '../../shared/pipes/media.pipe';
import { fullName, labelOf, osmLink } from '../../shared/utils/format.utils';
import { createLoader } from '../../shared/utils/loader';

@Component({
  selector: 'app-event-detail',
  imports: [RouterLink, DatePipe, EurosPipe, MediaPipe, CountdownComponent, LoadErrorComponent],
  template: `
    @if (gala.loading() && !gala.data()) {
      <section class="bx-page-head" aria-busy="true"><div class="bx-container"><span class="bx-skeleton sk"></span></div></section>
    } @else if (gala.notFound()) {
      <section class="bx-section">
        <div class="bx-container bx-empty">
          <strong>Événement introuvable</strong>
          <p>Cet événement n'existe pas ou n'est plus publié.</p>
          <a routerLink="/evenements" class="bx-btn bx-btn--primary">Tous les événements</a>
        </div>
      </section>
    } @else if (gala.error()) {
      <section class="bx-section"><div class="bx-container"><app-load-error [message]="gala.error()!" (retry)="gala.retry()" /></div></section>
    } @else if (gala.data(); as g) {
      <section class="head">
        <div class="bx-container head__inner">
          <div class="head__text">
            <nav class="bx-breadcrumb" aria-label="Fil d'Ariane">
              <a routerLink="/">Accueil</a><span aria-hidden="true">/</span><a routerLink="/evenements">Événements</a><span aria-hidden="true">/</span><span>{{ g.title }}</span>
            </nav>
            <span class="bx-badge bx-badge--primary">{{ type() }}</span>
            <h1>{{ g.title }}</h1>
            <dl class="infos">
              <div>
                <dt>Date</dt>
                <dd>
                  <time [attr.datetime]="g.startsAt">{{ g.startsAt | date: "EEEE d MMMM y, HH'h'mm" }}</time>
                  @if (g.endsAt) {
                    – {{ g.endsAt | date: "HH'h'mm" }}
                  }
                </dd>
              </div>
              @if (g.venue || g.city) {
                <div>
                  <dt>Lieu</dt>
                  <dd>
                    {{ g.venue }}@if (g.address) {<br />{{ g.address }}}@if (g.city) {<br />{{ g.city }}}
                    <br /><a [href]="mapLink()" target="_blank" rel="noopener">Voir sur la carte<span class="bx-sr-only"> (nouvel onglet)</span></a>
                  </dd>
                </div>
              }
              <div><dt>Entrée</dt><dd>{{ g.price ? (g.price | euros) : 'Gratuite' }}</dd></div>
            </dl>
            @if (upcoming()) {
              <app-countdown [target]="g.startsAt" />
            }
            <div class="actions">
              @if (g.ticketUrl && upcoming()) {
                <a [href]="g.ticketUrl" target="_blank" rel="noopener" class="bx-btn bx-btn--primary bx-btn--lg">Réserver<span class="bx-sr-only"> (nouvel onglet)</span></a>
              }
              <a routerLink="/evenements" class="bx-btn bx-btn--light">Tous les événements</a>
            </div>
          </div>
          @if (g.poster | media; as poster) {
            <a class="poster" [href]="poster" target="_blank" rel="noopener">
              <img [src]="poster" [alt]="'Affiche : ' + g.title" />
              <span class="bx-sr-only">Agrandir l'affiche (nouvel onglet)</span>
            </a>
          }
        </div>
      </section>

      <section class="bx-section">
        <div class="bx-container body">
          @if (g.description) {
            <div class="bx-prose" [innerHTML]="g.description"></div>
          }
          @if (g.fights.length) {
            <h2>{{ upcoming() ? 'Au programme' : 'Résultats' }}</h2>
            <ul class="card-list">
              @for (f of g.fights; track f.id) {
                <li class="fight">
                  <span class="fight__corner">
                    @if (f.boxer?.slug) {
                      <a [routerLink]="['/boxeurs', f.boxer!.slug]">{{ name(f.boxer) }}</a>
                    } @else {
                      {{ name(f.boxer) || 'Boxeur ESCT' }}
                    }
                    <small>ESC Tergnier</small>
                  </span>
                  <span class="fight__vs" aria-hidden="true">VS</span>
                  <span class="fight__corner fight__corner--right">
                    {{ f.opponent }}
                    @if (f.opponentClub) {
                      <small>{{ f.opponentClub }}</small>
                    }
                  </span>
                  @if (!upcoming()) {
                    <span class="fight__result" [attr.data-result]="f.result">
                      {{ results[f.result] }} · {{ methods[f.method] }}@if (f.rounds) { ({{ f.rounds }} rds)}
                    </span>
                  }
                </li>
              }
            </ul>
          }
        </div>
      </section>
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    .sk { height: 4rem; width: 60%; opacity: 0.2; }
    .head { background: var(--bx-dark); color: var(--bx-dark-ink); }
    .head__inner { display: grid; grid-template-columns: 1fr minmax(220px, 360px); gap: clamp(1.5rem, 5vw, 4rem); align-items: center; padding-block: clamp(2.5rem, 6vw, 4.5rem); }
    .head__text { display: grid; justify-items: start; gap: 1.1rem; }
    h1 { font-size: clamp(2.2rem, 6vw, 4.2rem); }
    .infos { display: grid; gap: 0.8rem; margin: 0; }
    .infos div { display: grid; grid-template-columns: 90px 1fr; gap: 1rem; }
    .infos dt { color: var(--bx-dark-muted); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; padding-top: 0.2rem; }
    .infos dd { margin: 0; font-weight: 600; }
    .infos a { color: var(--bx-dark-ink); }
    .actions { display: flex; flex-wrap: wrap; gap: 0.7rem; }
    .poster img { width: 100%; border-radius: var(--bx-radius); box-shadow: 0 30px 60px -20px rgb(0 0 0 / 0.7); }
    .body { display: grid; gap: 1.5rem; max-width: 900px; }
    .body h2 { font-size: 2rem; }
    .card-list { display: grid; gap: 0.6rem; margin: 0; padding: 0; list-style: none; }
    .fight {
      display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 1rem;
      padding: 1rem 1.2rem; border: 1px solid var(--bx-card-border); border-radius: var(--bx-radius); background: var(--bx-card);
    }
    .fight__corner { display: grid; font-weight: 700; font-size: 1.05rem; }
    .fight__corner a { color: var(--bx-primary); }
    .fight__corner small { color: var(--bx-muted); font-weight: 500; font-size: 0.82rem; }
    .fight__corner--right { text-align: right; }
    .fight__vs { font-family: var(--bx-font-display); font-size: 1.4rem; color: var(--bx-primary); }
    .fight__result { grid-column: 1 / -1; justify-self: center; padding: 0.2rem 0.7rem; border-radius: var(--bx-radius-sm); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; background: var(--bx-surface); }
    .fight__result[data-result='victoire'] { background: var(--bx-success-soft); color: var(--bx-success); }
    .fight__result[data-result='defaite'] { background: var(--bx-danger-soft); color: var(--bx-danger); }
    @media (max-width: 800px) {
      .head__inner { grid-template-columns: 1fr; }
      .poster { max-width: 280px; }
    }
  `,
})
export class EventDetailComponent {
  private readonly api = inject(GalaService);
  private readonly seo = inject(SeoService);

  readonly slug = input.required<string>();
  protected readonly gala = createLoader<GalaDetail>();
  protected readonly methods = FIGHT_METHODS;
  protected readonly results: Record<FightResult, string> = { victoire: 'Victoire', defaite: 'Défaite', nul: 'Nul' };
  protected readonly name = fullName;
  protected readonly type = computed(() => labelOf(GALA_TYPES, this.gala.data()?.type));
  protected readonly upcoming = computed(() => {
    const g = this.gala.data();
    return !!g && new Date(g.endsAt ?? g.startsAt).getTime() > Date.now();
  });
  protected readonly mapLink = computed(() => {
    const g = this.gala.data();
    return osmLink(null, null, [g?.venue, g?.address, g?.city].filter(Boolean).join(' '));
  });

  constructor() {
    effect(() => {
      const slug = this.slug();
      this.gala.run(() => this.api.get(slug));
    });
    effect(() => {
      const g = this.gala.data();
      if (g) {
        this.seo.update({ title: `${g.title} — ESC Boxe Tergnier`, description: g.description?.replace(/<[^>]+>/g, ' '), type: 'article', image: g.poster });
      }
    });
  }
}
