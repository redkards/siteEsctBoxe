import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Page 404 : « K.-O. technique ».
 * (Le serveur doit idéalement répondre 404 sur les URL inconnues ; ce composant couvre la navigation côté client.)
 */
@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section class="nf" aria-labelledby="nf-title">
      <div class="bx-container nf__inner">
        <p class="nf__code" aria-hidden="true">
          <span>4</span><span class="nf__glove">0</span><span>4</span>
        </p>
        <span class="bx-eyebrow">Erreur 404</span>
        <h1 id="nf-title">K.-O. technique</h1>
        <p class="nf__text">
          Cette page est restée dans les cordes : elle n'existe pas ou a été déplacée. Retournez au centre du ring.
        </p>
        <div class="nf__actions">
          <a routerLink="/" class="bx-btn bx-btn--primary bx-btn--lg">Retour à l'accueil <span class="bx-arrow" aria-hidden="true">→</span></a>
          <a routerLink="/planning" class="bx-btn bx-btn--light bx-btn--lg">Voir le planning</a>
        </div>
        <nav class="nf__links" aria-label="Pages utiles">
          <a routerLink="/club">Le club</a>
          <a routerLink="/disciplines">Disciplines</a>
          <a routerLink="/evenements">Événements</a>
          <a routerLink="/contact">Contact</a>
        </nav>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    .nf {
      position: relative;
      overflow: hidden;
      padding-block: clamp(3.5rem, 10vw, 7rem);
      background: var(--bx-dark);
      color: var(--bx-dark-ink);
    }
    .nf::before,
    .nf::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--bx-primary);
      opacity: 0.5;
    }
    .nf::before {
      top: 22%;
    }
    .nf::after {
      bottom: 22%;
      background: var(--bx-dark-muted);
    }
    .nf__inner {
      position: relative;
      z-index: 1;
      display: grid;
      justify-items: center;
      gap: 1rem;
      text-align: center;
    }
    .nf__code {
      display: flex;
      gap: 0.1em;
      margin: 0;
      font-family: var(--bx-font-display);
      font-size: clamp(6rem, 22vw, 12rem);
      font-weight: var(--bx-display-weight);
      line-height: 0.9;
      letter-spacing: var(--bx-display-tracking);
    }
    .nf__glove {
      color: var(--bx-primary);
      display: inline-block;
      transform: rotate(-12deg);
    }
    h1 {
      font-size: clamp(2.2rem, 5vw, 3.4rem);
    }
    .nf__text {
      max-width: 52ch;
      margin: 0;
      color: var(--bx-dark-muted);
      font-size: 1.08rem;
    }
    .nf__actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.75rem;
      margin-top: 0.8rem;
    }
    .nf__links {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.4rem 1.4rem;
      margin-top: 1rem;
    }
    .nf__links a {
      color: var(--bx-dark-ink);
      font-weight: 600;
    }
    .nf__links a:hover {
      color: var(--bx-primary);
    }
    @media (prefers-reduced-motion: no-preference) {
      .nf__glove {
        animation: nf-sway 2.4s ease-in-out infinite;
      }
      @keyframes nf-sway {
        50% {
          transform: rotate(8deg);
        }
      }
    }
  `,
})
export class NotFoundComponent {}
