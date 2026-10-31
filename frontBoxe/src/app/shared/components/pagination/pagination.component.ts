import { Component, computed, input, output, ChangeDetectionStrategy } from '@angular/core';

/** Pagination numérotée (fenêtre de 5 pages autour de la page courante) */
@Component({
  selector: 'app-pagination',
  template: `
    @if (pages() > 1) {
      <nav class="pager" aria-label="Pagination">
        <button type="button" [disabled]="page() <= 1" (click)="change.emit(page() - 1)" aria-label="Page précédente">←</button>
        @for (p of numbers(); track p) {
          <button
            type="button"
            class="num"
            [class.is-active]="p === page()"
            [attr.aria-current]="p === page() ? 'page' : null"
            [attr.aria-label]="'Page ' + p"
            (click)="change.emit(p)"
          >
            {{ p }}
          </button>
        }
        <button type="button" [disabled]="page() >= pages()" (click)="change.emit(page() + 1)" aria-label="Page suivante">→</button>
      </nav>
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    .pager {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.4rem;
      margin-top: 2.5rem;
    }
    button {
      display: grid;
      place-items: center;
      min-width: 44px;
      height: 44px;
      border: 1.5px solid var(--bx-line);
      border-radius: var(--bx-btn-radius);
      background: var(--bx-card);
      color: var(--bx-ink);
      font: 600 0.92rem var(--bx-font-body);
      cursor: pointer;
    }
    button:hover:not(:disabled) {
      border-color: var(--bx-ink);
    }
    button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .num.is-active {
      border-color: var(--bx-primary);
      background: var(--bx-primary);
      color: var(--bx-primary-ink);
    }
  `,
})
export class PaginationComponent {
  readonly page = input.required<number>();
  readonly pages = input.required<number>();
  readonly change = output<number>();

  protected readonly numbers = computed(() => {
    const total = this.pages();
    const start = Math.max(1, Math.min(this.page() - 2, total - 4));
    const end = Math.min(total, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });
}
