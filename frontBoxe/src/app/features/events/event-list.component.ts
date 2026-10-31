import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GalaService } from '../../core/api/gala.service';
import { GALA_TYPES, Gala, GalaType, Paginated } from '../../core/api/models';
import { GalaCardComponent } from '../../shared/components/gala-card/gala-card.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { EmptyStateComponent, LoadErrorComponent, SkeletonGridComponent } from '../../shared/components/state/state.component';
import { createLoader } from '../../shared/utils/loader';

type When = 'upcoming' | 'past';

/** Événements : à venir / passés, filtre par type */
@Component({
  selector: 'app-event-list',
  imports: [RouterLink, GalaCardComponent, PaginationComponent, SkeletonGridComponent, LoadErrorComponent, EmptyStateComponent],
  template: `
    <section class="bx-page-head">
      <div class="bx-container">
        <nav class="bx-breadcrumb" aria-label="Fil d'Ariane"><a routerLink="/">Accueil</a><span aria-hidden="true">/</span><span>Événements</span></nav>
        <h1>Événements</h1>
        <p>Galas, compétitions, stages et portes ouvertes : venez encourager nos boxeurs.</p>
      </div>
    </section>

    <section class="bx-section">
      <div class="bx-container">
        <div class="bar">
          <div class="tabs" role="tablist" aria-label="Période">
            @for (t of tabs; track t.value) {
              <button type="button" role="tab" class="tab" [attr.aria-selected]="when() === t.value" (click)="setWhen(t.value)">{{ t.label }}</button>
            }
          </div>
          <div class="bx-chips" role="group" aria-label="Type d'événement">
            <button type="button" class="bx-chip" [attr.aria-pressed]="type() === null" (click)="setType(null)">Tous</button>
            @for (t of types; track t.value) {
              <button type="button" class="bx-chip" [attr.aria-pressed]="type() === t.value" (click)="setType(t.value)">{{ t.label }}</button>
            }
          </div>
        </div>

        <div role="tabpanel" [attr.aria-label]="when() === 'upcoming' ? 'Événements à venir' : 'Événements passés'">
          @if (list.loading() && !list.data()) {
            <app-skeleton-grid [count]="4" ratio="5 / 1" min="420px" />
          } @else if (list.error()) {
            <app-load-error [message]="list.error()!" (retry)="list.retry()" />
          } @else if (list.data()?.items?.length) {
            <div class="list" [class.is-loading]="list.loading()">
              @for (g of list.data()!.items; track g.id) {
                <app-gala-card [gala]="g" />
              }
            </div>
            <app-pagination [page]="page()" [pages]="list.data()!.pages" (change)="goTo($event)" />
          } @else {
            <app-empty
              [title]="when() === 'upcoming' ? 'Aucun événement programmé' : 'Aucun événement passé'"
              [text]="when() === 'upcoming' ? 'Les prochaines dates seront annoncées ici et sur nos réseaux.' : 'Rien à afficher pour ce filtre.'"
            />
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    .bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.8rem; }
    .tabs { display: inline-flex; padding: 4px; border-radius: var(--bx-btn-radius); background: var(--bx-surface); }
    .tab {
      min-height: 42px; padding: 0 1.2rem; border: 0; border-radius: var(--bx-btn-radius);
      background: transparent; color: var(--bx-ink-soft); font: 700 0.85rem var(--bx-font-body);
      letter-spacing: 0.05em; text-transform: uppercase; cursor: pointer;
    }
    .tab[aria-selected='true'] { background: var(--bx-ink); color: var(--bx-bg); }
    .list { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 440px), 1fr)); gap: 1rem; transition: opacity 0.2s; }
    .list.is-loading { opacity: 0.5; }
  `,
})
export class EventListComponent implements OnInit {
  private readonly api = inject(GalaService);
  protected readonly list = createLoader<Paginated<Gala>>();
  protected readonly types = GALA_TYPES;
  protected readonly tabs: { value: When; label: string }[] = [
    { value: 'upcoming', label: 'À venir' },
    { value: 'past', label: 'Passés' },
  ];
  protected readonly when = signal<When>('upcoming');
  protected readonly type = signal<GalaType | null>(null);
  protected readonly page = signal(1);

  ngOnInit(): void {
    this.load();
  }

  protected setWhen(when: When): void {
    this.when.set(when);
    this.page.set(1);
    this.load();
  }

  protected setType(type: GalaType | null): void {
    this.type.set(type);
    this.page.set(1);
    this.load();
  }

  protected goTo(page: number): void {
    this.page.set(page);
    this.load();
  }

  private load(): void {
    const query = { when: this.when(), type: this.type(), page: this.page(), limit: 10 };
    this.list.run(() => this.api.list(query));
  }
}
