import { Component, computed, effect, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClubService } from '../../core/api/club.service';
import { AUDIENCES, DisciplineDetail } from '../../core/api/models';
import { SeoService } from '../../core/seo/seo.service';
import { LoadErrorComponent } from '../../shared/components/state/state.component';
import { HourPipe } from '../../shared/pipes/time.pipe';
import { MediaPipe } from '../../shared/pipes/media.pipe';
import { labelOf } from '../../shared/utils/format.utils';
import { createLoader } from '../../shared/utils/loader';
import { DAYS, compareSlots } from '../../shared/utils/planning.utils';

@Component({
  selector: 'app-discipline-detail',
  imports: [RouterLink, MediaPipe, HourPipe, LoadErrorComponent],
  template: `
    @if (item.loading() && !item.data()) {
      <section class="bx-page-head" aria-busy="true">
        <div class="bx-container"><span class="bx-skeleton sk-title"></span><span class="bx-skeleton sk-line"></span></div>
      </section>
    } @else if (item.notFound()) {
      <section class="bx-section">
        <div class="bx-container bx-empty">
          <strong>Discipline introuvable</strong>
          <p>Cette discipline n'existe pas ou n'est plus proposée.</p>
          <a routerLink="/disciplines" class="bx-btn bx-btn--primary">Toutes les disciplines</a>
        </div>
      </section>
    } @else if (item.error()) {
      <section class="bx-section"><div class="bx-container"><app-load-error [message]="item.error()!" (retry)="item.retry()" /></div></section>
    } @else if (item.data(); as d) {
      <section class="hero">
        <img class="hero__img" [src]="d.image | media: 'img/training2.jpg'" alt="" />
        <div class="hero__shade" aria-hidden="true"></div>
        <div class="bx-container hero__inner">
          <nav class="bx-breadcrumb" aria-label="Fil d'Ariane">
            <a routerLink="/">Accueil</a><span aria-hidden="true">/</span><a routerLink="/disciplines">Disciplines</a><span aria-hidden="true">/</span><span>{{ d.name }}</span>
          </nav>
          <h1>{{ d.name }}</h1>
          @if (d.shortDescription) {
            <p>{{ d.shortDescription }}</p>
          }
          <div class="hero__tags">
            @if (d.minAge) {
              <span class="bx-badge bx-badge--primary">Dès {{ d.minAge }} ans</span>
            }
            <span class="bx-badge bx-badge--outline">{{ d.slots.length }} créneau{{ d.slots.length > 1 ? 'x' : '' }} / semaine</span>
          </div>
        </div>
      </section>

      <section class="bx-section">
        <div class="bx-container layout">
          <div>
            @if (d.description) {
              <div class="bx-prose" [innerHTML]="d.description"></div>
            }

            <h2 class="sub">Les créneaux</h2>
            @if (slots().length) {
              <div class="bx-table-wrap">
                <table class="bx-table">
                  <caption class="bx-sr-only">Créneaux d'entraînement de la discipline {{ d.name }}</caption>
                  <thead><tr><th scope="col">Jour</th><th scope="col">Horaire</th><th scope="col">Public</th><th scope="col">Salle</th></tr></thead>
                  <tbody>
                    @for (s of slots(); track s.id) {
                      <tr>
                        <td><strong>{{ dayLabel(s.dayOfWeek) }}</strong></td>
                        <td>{{ s.startTime | hour }} – {{ s.endTime | hour }}</td>
                        <td>{{ audience(s.audience) }}</td>
                        <td>{{ s.venue.name }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            } @else {
              <p class="bx-muted">Créneaux à venir : contactez le club pour en savoir plus.</p>
            }
          </div>

          <aside class="side">
            <div class="bx-panel cta">
              <h2>Envie d'essayer ?</h2>
              <p class="bx-muted">La première séance est offerte. Inscrivez-vous en ligne, le club vous recontacte.</p>
              <a routerLink="/inscription" [queryParams]="{ discipline: d.slug }" class="bx-btn bx-btn--primary bx-btn--block">S'inscrire <span class="bx-arrow" aria-hidden="true">→</span></a>
              <a routerLink="/tarifs" class="bx-btn bx-btn--ghost bx-btn--block">Voir les tarifs</a>
            </div>
            @if (d.coaches.length) {
              <div class="bx-panel">
                <h2 class="side__title">Les coachs</h2>
                <ul class="coaches">
                  @for (c of d.coaches; track c.id) {
                    <li>
                      @if (c.photo | media; as src) {
                        <img [src]="src" alt="" loading="lazy" />
                      } @else {
                        <span class="coaches__init" aria-hidden="true">{{ c.firstName.charAt(0) }}{{ c.lastName.charAt(0) }}</span>
                      }
                      <span><strong>{{ c.firstName }} {{ c.lastName }}</strong><br /><small>{{ c.role }}</small></span>
                    </li>
                  }
                </ul>
              </div>
            }
          </aside>
        </div>
      </section>
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    .sk-title { height: 3.5rem; width: 50%; opacity: 0.25; }
    .sk-line { height: 1.2rem; width: 70%; opacity: 0.2; }
    .hero { position: relative; overflow: hidden; background: var(--bx-dark); color: var(--bx-hero-ink); }
    .hero__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .hero__shade { position: absolute; inset: 0; background: var(--bx-hero-overlay); }
    .hero__inner { position: relative; display: grid; justify-items: start; gap: 1rem; padding-block: clamp(4rem, 10vw, 7rem) 3rem; }
    .hero h1 { font-size: clamp(2.6rem, 7vw, 5rem); }
    .hero p { max-width: 60ch; margin: 0; font-size: 1.1rem; opacity: 0.92; }
    .hero .bx-breadcrumb { color: var(--bx-hero-ink); opacity: 0.85; }
    .hero__tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .layout { display: grid; grid-template-columns: 1fr 340px; gap: clamp(1.5rem, 4vw, 3rem); align-items: start; }
    .sub { margin: 2rem 0 1rem; font-size: 1.8rem; }
    .side { display: grid; gap: 1rem; position: sticky; top: calc(var(--bx-header-h) + 1rem); }
    .cta { display: grid; gap: 0.8rem; }
    .cta h2, .side__title { font-size: 1.5rem; }
    .cta p { margin: 0; }
    .coaches { display: grid; gap: 0.8rem; margin: 1rem 0 0; padding: 0; list-style: none; }
    .coaches li { display: flex; align-items: center; gap: 0.8rem; }
    .coaches img, .coaches__init { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; flex: none; }
    .coaches__init { display: grid; place-items: center; background: var(--bx-dark); color: var(--bx-dark-ink); font-weight: 700; }
    .coaches small { color: var(--bx-muted); }
    @media (max-width: 900px) {
      .layout { grid-template-columns: 1fr; }
      .side { position: static; }
    }
  `,
})
export class DisciplineDetailComponent {
  private readonly api = inject(ClubService);
  private readonly seo = inject(SeoService);

  readonly slug = input.required<string>();
  protected readonly item = createLoader<DisciplineDetail>();
  protected readonly slots = computed(() => [...(this.item.data()?.slots ?? [])].sort(compareSlots));

  constructor() {
    effect(() => {
      const slug = this.slug();
      this.item.run(() => this.api.getDiscipline(slug));
    });
    effect(() => {
      const d = this.item.data();
      if (d) {
        this.seo.update({
          title: `${d.name} — ESC Boxe Tergnier`,
          description: d.shortDescription ?? d.description,
          image: d.image,
        });
      }
    });
  }

  protected dayLabel(day: number): string {
    return DAYS[day - 1]?.label ?? '';
  }

  protected audience(value: string): string {
    return labelOf(AUDIENCES, value as never);
  }
}
