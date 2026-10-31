import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Logo du club (photo officielle) + nom */
@Component({
  selector: 'app-logo',
  imports: [RouterLink],
  template: `
    <a routerLink="/" class="logo" [class.logo--compact]="compact()" aria-label="ESC Boxe Tergnier — accueil">
      <img class="logo__mark" src="img/logo.jpg" alt="" width="48" height="51" />
      <span class="logo__text">
        <span class="logo__name">ESC Boxe</span>
        <span class="logo__city">Tergnier</span>
      </span>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    .logo {
      display: inline-flex;
      align-items: center;
      gap: 0.7rem;
      color: inherit;
      text-decoration: none;
      border-radius: var(--bx-radius-sm);
    }
    .logo__mark {
      width: 46px;
      height: 46px;
      object-fit: cover;
      border-radius: var(--bx-radius-sm);
      box-shadow: 0 0 0 1px var(--bx-dark-line);
    }
    .logo__text {
      display: grid;
      line-height: 1;
      font-family: var(--bx-font-display);
      text-transform: uppercase;
    }
    .logo__name {
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: 0.04em;
    }
    .logo__city {
      margin-top: 0.15rem;
      color: var(--bx-primary);
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.32em;
    }
    .logo--compact .logo__mark {
      width: 40px;
      height: 40px;
    }
  `,
})
export class LogoComponent {
  readonly compact = input(false);
}
