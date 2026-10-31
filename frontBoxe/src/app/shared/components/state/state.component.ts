import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

/** Grille de cartes « squelette » pendant le chargement */
@Component({
  selector: 'app-skeleton-grid',
  template: `
    <div class="bx-grid" [style.--bx-grid-min]="min()" role="status" aria-live="polite">
      <span class="bx-sr-only">Chargement…</span>
      @for (i of items(); track i) {
        <div class="sk" aria-hidden="true">
          <span class="bx-skeleton sk__media" [style.aspect-ratio]="ratio()"></span>
          <span class="bx-skeleton sk__line"></span>
          <span class="bx-skeleton sk__line sk__line--short"></span>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    .sk { display: grid; gap: 0.6rem; }
    .sk__media { width: 100%; }
    .sk__line { height: 1rem; width: 85%; }
    .sk__line--short { width: 55%; }
  `,
})
export class SkeletonGridComponent {
  readonly count = input(6);
  readonly ratio = input('4 / 3');
  readonly min = input('260px');
  protected items(): number[] {
    return Array.from({ length: this.count() }, (_, i) => i);
  }
}

/** Message d'erreur de chargement avec bouton « Réessayer » */
@Component({
  selector: 'app-load-error',
  template: `
    <div class="bx-alert bx-alert--error err" role="alert">
      <span>{{ message() }}</span>
      <button type="button" class="bx-btn bx-btn--outline bx-btn--sm" (click)="retry.emit()">Réessayer</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    .err { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.8rem; }
    .err .bx-btn { color: inherit; }
  `,
})
export class LoadErrorComponent {
  readonly message = input('Le contenu n’a pas pu être chargé.');
  readonly retry = output<void>();
}

/** État vide */
@Component({
  selector: 'app-empty',
  template: `
    <div class="bx-empty">
      <strong>{{ title() }}</strong>
      @if (text()) {
        <p>{{ text() }}</p>
      }
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class EmptyStateComponent {
  readonly title = input('Rien pour le moment');
  readonly text = input('');
}
