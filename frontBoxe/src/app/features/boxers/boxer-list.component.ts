import { Component, DestroyRef, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BoxerService } from '../../core/api/boxer.service';
import { ClubService } from '../../core/api/club.service';
import { BOXER_LEVELS, BoxerLevel, BoxerSummary, Discipline, Paginated, SEXES, Sex } from '../../core/api/models';
import { BoxerCardComponent } from '../../shared/components/boxer-card/boxer-card.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { EmptyStateComponent, LoadErrorComponent, SkeletonGridComponent } from '../../shared/components/state/state.component';
import { createLoader } from '../../shared/utils/loader';

/** Boxeurs actifs : grille filtrable (discipline, niveau, sexe, recherche) et paginée */
@Component({
  selector: 'app-boxer-list',
  imports: [RouterLink, BoxerCardComponent, PaginationComponent, SkeletonGridComponent, LoadErrorComponent, EmptyStateComponent],
  template: `
    <section class="bx-page-head">
      <div class="bx-container">
        <nav class="bx-breadcrumb" aria-label="Fil d'Ariane"><a routerLink="/">Accueil</a><span aria-hidden="true">/</span><span>Boxeurs</span></nav>
        <h1>Nos boxeurs</h1>
        <p>Éducatifs, amateurs, élite et pros : les boxeurs qui défendent les couleurs de Tergnier, avec leur palmarès.</p>
      </div>
    </section>

    <section class="bx-section">
      <div class="bx-container">
        <form class="filters" role="search" (submit)="$event.preventDefault()">
          <div class="bx-field">
            <label for="q">Rechercher un boxeur</label>
            <input id="q" type="search" class="bx-input" placeholder="Nom, prénom, surnom…" [value]="q()" (input)="search$.next($any($event.target).value)" maxlength="60" />
          </div>
          <div class="bx-field">
            <label for="f-disc">Discipline</label>
            <select id="f-disc" class="bx-input" [value]="discipline() ?? ''" (change)="setFilter('discipline', $any($event.target).value)">
              <option value="">Toutes</option>
              @for (d of disciplines.data() ?? []; track d.id) {
                <option [value]="d.slug">{{ d.name }}</option>
              }
            </select>
          </div>
          <div class="bx-field">
            <label for="f-level">Niveau</label>
            <select id="f-level" class="bx-input" [value]="level() ?? ''" (change)="setFilter('level', $any($event.target).value)">
              <option value="">Tous</option>
              @for (l of levels; track l.value) {
                <option [value]="l.value">{{ l.label }}</option>
              }
            </select>
          </div>
          <div class="bx-field">
            <span class="bx-label" id="f-sex">Catégorie</span>
            <div class="bx-chips" role="group" aria-labelledby="f-sex">
              <button type="button" class="bx-chip" [attr.aria-pressed]="sex() === null" (click)="setFilter('sex', '')">Tous</button>
              @for (s of sexes; track s.value) {
                <button type="button" class="bx-chip" [attr.aria-pressed]="sex() === s.value" (click)="setFilter('sex', s.value)">{{ s.label }}</button>
              }
            </div>
          </div>
        </form>

        <p class="count" role="status" aria-live="polite">
          @if (list.data(); as d) {
            {{ d.total }} boxeur{{ d.total > 1 ? 's' : '' }}
          }
        </p>

        @if (list.loading() && !list.data()) {
          <app-skeleton-grid [count]="8" ratio="4 / 5" min="230px" />
        } @else if (list.error()) {
          <app-load-error [message]="list.error()!" (retry)="list.retry()" />
        } @else if (list.data()?.items?.length) {
          <div class="bx-grid grid" [class.is-loading]="list.loading()">
            @for (b of list.data()!.items; track b.id) {
              <app-boxer-card [boxer]="b" />
            }
          </div>
          <app-pagination [page]="page()" [pages]="list.data()!.pages" (change)="goTo($event)" />
        } @else {
          <app-empty title="Aucun boxeur trouvé" text="Essayez d'autres filtres ou une autre recherche.">
            <button type="button" class="bx-btn bx-btn--outline bx-btn--sm" (click)="reset()">Réinitialiser</button>
          </app-empty>
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    .filters {
      display: grid;
      grid-template-columns: 1.4fr 1fr 1fr auto;
      align-items: end;
      gap: 0 1rem;
      padding: 1.2rem 1.2rem 0.1rem;
      border: 1px solid var(--bx-card-border);
      border-radius: var(--bx-radius);
      background: var(--bx-card);
    }
    .count { min-height: 1.5rem; margin: 1.2rem 0; color: var(--bx-muted); font-size: 0.9rem; font-weight: 600; }
    .grid { --bx-grid-min: 230px; transition: opacity 0.2s; }
    .grid.is-loading { opacity: 0.5; }
    @media (max-width: 960px) {
      .filters { grid-template-columns: 1fr 1fr; }
      .filters .bx-field:first-child { grid-column: 1 / -1; }
    }
    @media (max-width: 520px) {
      .filters { grid-template-columns: 1fr; }
    }
  `,
})
export class BoxerListComponent implements OnInit {
  private readonly api = inject(BoxerService);
  private readonly club = inject(ClubService);

  protected readonly list = createLoader<Paginated<BoxerSummary>>();
  protected readonly disciplines = createLoader<Discipline[]>();
  protected readonly levels = BOXER_LEVELS;
  protected readonly sexes = SEXES;

  protected readonly q = signal('');
  protected readonly discipline = signal<string | null>(null);
  protected readonly level = signal<BoxerLevel | null>(null);
  protected readonly sex = signal<Sex | null>(null);
  protected readonly page = signal(1);
  protected readonly search$ = new Subject<string>();

  constructor() {
    this.search$.pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(inject(DestroyRef))).subscribe((value) => {
      this.q.set(value.trim());
      this.page.set(1);
      this.load();
    });
  }

  ngOnInit(): void {
    this.disciplines.run(() => this.club.getDisciplines());
    this.load();
  }

  protected setFilter(name: 'discipline' | 'level' | 'sex', value: string): void {
    const v = value || null;
    if (name === 'discipline') this.discipline.set(v);
    if (name === 'level') this.level.set(v as BoxerLevel | null);
    if (name === 'sex') this.sex.set(v as Sex | null);
    this.page.set(1);
    this.load();
  }

  protected goTo(page: number): void {
    this.page.set(page);
    this.load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected reset(): void {
    this.q.set('');
    this.discipline.set(null);
    this.level.set(null);
    this.sex.set(null);
    this.page.set(1);
    this.load();
  }

  private load(): void {
    const query = { q: this.q(), discipline: this.discipline(), level: this.level(), sex: this.sex(), page: this.page(), limit: 12 };
    this.list.run(() => this.api.list(query));
  }
}
