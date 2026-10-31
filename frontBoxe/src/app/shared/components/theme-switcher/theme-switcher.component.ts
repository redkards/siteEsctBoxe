import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { THEMES, ThemeId, ThemeService } from './theme';

/**
 * Sélecteur de direction artistique : 3 pastilles (radiogroup accessible).
 * Le thème est appliqué via `data-theme` sur <html> par ThemeService.
 */
@Component({
  selector: 'app-theme-switcher',
  template: `
    <div class="ts" role="radiogroup" aria-label="Apparence du site">
      <span class="ts__label" aria-hidden="true">Apparence</span>
      @for (t of themes; track t.id) {
        <button
          type="button"
          role="radio"
          class="ts__opt"
          [attr.aria-checked]="current() === t.id"
          [attr.tabindex]="current() === t.id ? 0 : -1"
          [attr.data-theme-option]="t.id"
          (click)="select(t.id)"
          (keydown)="onKey($event, t.id)"
        >
          <span class="ts__dot" aria-hidden="true"
            [style.background]="'linear-gradient(135deg,' + t.swatch[0] + ' 0 50%,' + t.swatch[1] + ' 50% 100%)'"></span>
          <span class="ts__name">{{ t.label }}</span>
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { display: block; }
    .ts {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.4rem;
      font-family: var(--bx-font-body, system-ui, sans-serif);
    }
    .ts__label {
      font-size: 0.72rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      opacity: 0.75;
      margin-right: 0.25rem;
    }
    .ts__opt {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      min-height: 36px;
      padding: 0.3rem 0.75rem 0.3rem 0.35rem;
      border: 1px solid currentColor;
      border-color: color-mix(in srgb, currentColor 30%, transparent);
      border-radius: 999px;
      background: transparent;
      color: inherit;
      font: inherit;
      font-size: 0.8rem;
      cursor: pointer;
      transition: border-color 0.15s, background-color 0.15s;
    }
    .ts__opt:hover { border-color: color-mix(in srgb, currentColor 70%, transparent); }
    .ts__opt[aria-checked='true'] {
      border-color: currentColor;
      background: color-mix(in srgb, currentColor 12%, transparent);
      font-weight: 600;
    }
    .ts__opt:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
    .ts__dot {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.35), 0 0 0 1px rgb(0 0 0 / 0.25);
      flex: none;
    }
  `,
})
export class ThemeSwitcherComponent {
  private readonly themeService = inject(ThemeService);
  protected readonly themes = THEMES;
  protected readonly current = this.themeService.theme;

  protected select(id: ThemeId): void {
    this.themeService.set(id);
  }

  /** Navigation clavier façon radiogroup (flèches, Début/Fin). */
  protected onKey(event: KeyboardEvent, id: ThemeId): void {
    const ids = this.themes.map((t) => t.id);
    let i = ids.indexOf(id);
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown': i = (i + 1) % ids.length; break;
      case 'ArrowLeft':
      case 'ArrowUp': i = (i - 1 + ids.length) % ids.length; break;
      case 'Home': i = 0; break;
      case 'End': i = ids.length - 1; break;
      default: return;
    }
    event.preventDefault();
    this.select(ids[i]);
    const group = (event.currentTarget as HTMLElement).parentElement;
    group?.querySelector<HTMLElement>(`[data-theme-option="${ids[i]}"]`)?.focus();
  }
}
