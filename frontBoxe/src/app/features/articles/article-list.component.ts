import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArticleService } from '../../core/api/article.service';
import { ARTICLE_CATEGORIES, ArticleCategory, ArticleSummary, Paginated } from '../../core/api/models';
import { ArticleCardComponent } from '../../shared/components/article-card/article-card.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { EmptyStateComponent, LoadErrorComponent, SkeletonGridComponent } from '../../shared/components/state/state.component';
import { createLoader } from '../../shared/utils/loader';

@Component({
  selector: 'app-article-list',
  imports: [RouterLink, ArticleCardComponent, PaginationComponent, SkeletonGridComponent, LoadErrorComponent, EmptyStateComponent],
  template: `
    <section class="bx-page-head">
      <div class="bx-container">
        <nav class="bx-breadcrumb" aria-label="Fil d'Ariane"><a routerLink="/">Accueil</a><span aria-hidden="true">/</span><span>Actualités</span></nav>
        <h1>Actualités</h1>
        <p>Résultats, galas, stages et vie du club : toute l'actualité de l'ESC Boxe Tergnier.</p>
      </div>
    </section>
    <section class="bx-section">
      <div class="bx-container">
        <div class="bx-chips filters" role="group" aria-label="Catégorie">
          <button type="button" class="bx-chip" [attr.aria-pressed]="category() === null" (click)="setCategory(null)">Toutes</button>
          @for (c of categories; track c.value) {
            <button type="button" class="bx-chip" [attr.aria-pressed]="category() === c.value" (click)="setCategory(c.value)">{{ c.label }}</button>
          }
        </div>
        @if (list.loading() && !list.data()) {
          <app-skeleton-grid [count]="6" ratio="16 / 10" min="300px" />
        } @else if (list.error()) {
          <app-load-error [message]="list.error()!" (retry)="list.retry()" />
        } @else if (list.data()?.items?.length) {
          <div class="bx-grid grid" [class.is-loading]="list.loading()">
            @for (a of list.data()!.items; track a.id) {
              <app-article-card [article]="a" />
            }
          </div>
          <app-pagination [page]="page()" [pages]="list.data()!.pages" (change)="goTo($event)" />
        } @else {
          <app-empty title="Aucune actualité" text="Rien de publié dans cette catégorie pour le moment." />
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    .filters { margin-bottom: 1.8rem; }
    .grid { --bx-grid-min: 300px; transition: opacity 0.2s; }
    .grid.is-loading { opacity: 0.5; }
  `,
})
export class ArticleListComponent implements OnInit {
  private readonly api = inject(ArticleService);
  protected readonly list = createLoader<Paginated<ArticleSummary>>();
  protected readonly categories = ARTICLE_CATEGORIES;
  protected readonly category = signal<ArticleCategory | null>(null);
  protected readonly page = signal(1);

  ngOnInit(): void {
    this.load();
  }

  protected setCategory(category: ArticleCategory | null): void {
    this.category.set(category);
    this.page.set(1);
    this.load();
  }

  protected goTo(page: number): void {
    this.page.set(page);
    this.load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private load(): void {
    const query = { page: this.page(), limit: 9, category: this.category() };
    this.list.run(() => this.api.list(query));
  }
}
