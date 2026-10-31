import { Component, input, ChangeDetectionStrategy } from '@angular/core';

/**
 * Gabarit des pages d'authentification et de compte : panneau sombre « coin du ring » + formulaire.
 */
@Component({
  selector: 'app-auth-shell',
  template: `
    <section class="bx-container shell">
      <div class="shell__aside" aria-hidden="true">
        <span class="shell__mark">
          <img src="img/logo.jpg" alt="" width="56" height="60" />
          <span>ESC Boxe<br />Tergnier</span>
        </span>
        <p class="shell__quote">{{ quote() }}</p>
        <span class="shell__ropes"><span></span><span></span><span></span></span>
      </div>
      <div class="shell__main">
        <span class="bx-eyebrow">{{ eyebrow() }}</span>
        <h1>{{ heading() }}</h1>
        <ng-content />
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    :host {
      display: block;
      padding-block: clamp(1.5rem, 5vw, 3.5rem);
    }
    .shell {
      display: grid;
      grid-template-columns: 0.85fr 1.15fr;
      max-width: 1040px;
      overflow: hidden;
      border: 1px solid var(--bx-card-border);
      border-radius: var(--bx-radius-lg);
      background: var(--bx-card);
      box-shadow: var(--bx-shadow);
    }
    .shell__aside {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 2rem;
      overflow: hidden;
      padding: 2.5rem;
      background: var(--bx-dark);
      color: var(--bx-dark-ink);
    }
    .shell__aside::after {
      content: '';
      position: absolute;
      right: -90px;
      top: -90px;
      width: 240px;
      height: 240px;
      border: 26px solid var(--bx-primary);
      border-radius: 50%;
      opacity: 0.22;
    }
    .shell__mark {
      position: relative;
      z-index: 1;
      display: inline-flex;
      align-items: center;
      gap: 0.8rem;
      font-family: var(--bx-font-display);
      font-weight: var(--bx-display-weight);
      text-transform: var(--bx-display-transform);
      line-height: 1.05;
    }
    .shell__mark img {
      width: 52px;
      height: 52px;
      object-fit: cover;
      border-radius: var(--bx-radius-sm);
    }
    .shell__quote {
      position: relative;
      z-index: 1;
      margin: 0;
      font-family: var(--bx-font-display);
      font-size: clamp(1.6rem, 3vw, 2.3rem);
      font-weight: var(--bx-display-weight);
      letter-spacing: var(--bx-display-tracking);
      text-transform: var(--bx-display-transform);
      line-height: 1.12;
    }
    /* Trois cordes du ring */
    .shell__ropes {
      display: grid;
      gap: 0.55rem;
    }
    .shell__ropes span {
      height: 4px;
      border-radius: 4px;
      background: var(--bx-primary);
    }
    .shell__ropes span:nth-child(2) {
      background: var(--bx-dark-ink);
      opacity: 0.7;
    }
    .shell__ropes span:nth-child(3) {
      background: var(--bx-dark-muted);
    }
    .shell__main {
      padding: clamp(1.75rem, 4vw, 3.25rem);
    }
    h1 {
      margin: 0.6rem 0 1.6rem;
      font-size: clamp(2rem, 4vw, 2.8rem);
    }
    @media (max-width: 820px) {
      .shell {
        grid-template-columns: 1fr;
      }
      .shell__aside {
        gap: 1rem;
        padding: 1.5rem 1.75rem;
      }
      .shell__quote {
        font-size: 1.35rem;
      }
    }
  `,
})
export class AuthShellComponent {
  readonly eyebrow = input('');
  readonly heading = input('');
  readonly quote = input('Le travail paie toujours. On vous attend à la salle.');
}
