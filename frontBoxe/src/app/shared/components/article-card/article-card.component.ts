import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ARTICLE_CATEGORIES, ArticleSummary } from '../../../core/api/models';
import { MediaPipe } from '../../pipes/media.pipe';
import { labelOf } from '../../utils/format.utils';

/** Carte d'actualité */
@Component({
  selector: 'app-article-card',
  imports: [RouterLink, DatePipe, MediaPipe],
  template: `
    @let a = article();
    <article class="card">
      <div class="card__media">
        <img [src]="a.coverImage | media: 'img/training1.jpg'" alt="" loading="lazy" />
        <span class="bx-badge card__cat">{{ category() }}</span>
      </div>
      <div class="card__body">
        <time class="card__date" [attr.datetime]="a.publishedAt">{{ a.publishedAt | date: 'd MMMM y' }}</time>
        <h3><a [routerLink]="['/actualites', a.slug]" class="card__link">{{ a.title }}</a></h3>
        @if (a.excerpt) {
          <p>{{ a.excerpt }}</p>
        }
        <span class="bx-link" aria-hidden="true">Lire <span class="bx-arrow">→</span></span>
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    :host { display: block; }
    .card {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      border: 1px solid var(--bx-card-border);
      border-radius: var(--bx-radius);
      background: var(--bx-card);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .card:hover { transform: translateY(-4px); box-shadow: var(--bx-shadow); }
    .card:focus-within { box-shadow: var(--bx-focus); }
    .card__media { position: relative; aspect-ratio: 16 / 10; overflow: hidden; background: var(--bx-surface); }
    .card__media img { width: 100%; height: 100%; object-fit: cover; }
    .card__cat { position: absolute; left: 0.8rem; bottom: 0.8rem; }
    .card__body { display: flex; flex-direction: column; gap: 0.5rem; flex: 1; padding: 1.1rem 1.2rem 1.3rem; }
    .card__date { color: var(--bx-muted); font-size: 0.82rem; font-weight: 600; }
    h3 { font-size: 1.3rem; }
    .card__link { color: var(--bx-ink); text-decoration: none; }
    .card__link::after { content: ''; position: absolute; inset: 0; }
    .card__link:focus-visible { box-shadow: none; }
    p {
      margin: 0;
      color: var(--bx-muted);
      font-size: 0.93rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .bx-link { margin-top: auto; padding-top: 0.4rem; color: var(--bx-primary); }
  `,
})
export class ArticleCardComponent {
  readonly article = input.required<ArticleSummary>();
  protected readonly category = computed(() => labelOf(ARTICLE_CATEGORIES, this.article().category));
}
