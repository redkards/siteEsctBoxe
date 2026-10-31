import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClubService } from '../../core/api/club.service';
import { Discipline } from '../../core/api/models';
import { EmptyStateComponent, LoadErrorComponent, SkeletonGridComponent } from '../../shared/components/state/state.component';
import { MediaPipe } from '../../shared/pipes/media.pipe';
import { createLoader } from '../../shared/utils/loader';

export const DISCIPLINE_PHOTOS = ['img/eduTergnier2.jpg', 'img/training1.jpg', 'img/champtergnier2.jpg', 'img/galaAmaPro3.jpg', 'img/festi2.jpeg'];

@Component({
  selector: 'app-discipline-list',
  imports: [RouterLink, MediaPipe, SkeletonGridComponent, LoadErrorComponent, EmptyStateComponent],
  template: `
    <section class="bx-page-head">
      <div class="bx-container">
        <nav class="bx-breadcrumb" aria-label="Fil d'Ariane"><a routerLink="/">Accueil</a><span aria-hidden="true">/</span><span>Disciplines</span></nav>
        <h1>Nos disciplines</h1>
        <p>Boxe éducative pour les plus jeunes, boxe loisir pour se dépenser, boxe amateur et pro pour la compétition.</p>
      </div>
    </section>

    <section class="bx-section">
      <div class="bx-container">
        @if (list.loading() && !list.data()) {
          <app-skeleton-grid [count]="4" ratio="16 / 9" min="420px" />
        } @else if (list.error()) {
          <app-load-error [message]="list.error()!" (retry)="list.retry()" />
        } @else {
          <div class="list">
            @for (d of list.data(); track d.id; let i = $index) {
              <article class="item" [class.item--rev]="i % 2 === 1">
                <img class="item__img" [src]="d.image | media: photos[i % photos.length]" alt="" loading="lazy" />
                <div class="item__body">
                  <span class="item__num" aria-hidden="true">{{ (i + 1).toString().padStart(2, '0') }}</span>
                  <h2>{{ d.name }}</h2>
                  @if (d.minAge) {
                    <span class="bx-badge bx-badge--primary">Dès {{ d.minAge }} ans</span>
                  }
                  <p>{{ d.shortDescription }}</p>
                  <div class="item__actions">
                    <a [routerLink]="['/disciplines', d.slug]" class="bx-btn bx-btn--dark">Découvrir <span class="bx-arrow" aria-hidden="true">→</span></a>
                    <a routerLink="/inscription" [queryParams]="{ discipline: d.slug }" class="bx-btn bx-btn--outline">S'inscrire</a>
                  </div>
                </div>
              </article>
            } @empty {
              <app-empty title="Aucune discipline" text="Les disciplines seront bientôt présentées ici." />
            }
          </div>
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    .list { display: grid; gap: clamp(1.5rem, 4vw, 3rem); }
    .item {
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      align-items: stretch;
      overflow: hidden;
      border: 1px solid var(--bx-card-border);
      border-radius: var(--bx-radius-lg);
      background: var(--bx-card);
    }
    .item--rev .item__img { order: 2; }
    .item__img { width: 100%; height: 100%; min-height: 300px; object-fit: cover; }
    .item__body { display: grid; align-content: center; justify-items: start; gap: 0.8rem; padding: clamp(1.5rem, 4vw, 3rem); }
    .item__num { font-family: var(--bx-font-display); font-size: 3rem; font-weight: 700; line-height: 1; color: var(--bx-primary); }
    h2 { font-size: clamp(1.8rem, 3.5vw, 2.6rem); }
    p { margin: 0; color: var(--bx-ink-soft); }
    .item__actions { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 0.4rem; }
    @media (max-width: 800px) {
      .item { grid-template-columns: 1fr; }
      .item--rev .item__img { order: 0; }
      .item__img { min-height: 0; aspect-ratio: 16 / 9; }
    }
  `,
})
export class DisciplineListComponent implements OnInit {
  private readonly api = inject(ClubService);
  protected readonly list = createLoader<Discipline[]>();
  protected readonly photos = DISCIPLINE_PHOTOS;

  ngOnInit(): void {
    this.list.run(() => this.api.getDisciplines());
  }
}
