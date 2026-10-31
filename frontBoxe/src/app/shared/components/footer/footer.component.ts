import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ClubService } from '../../../core/api/club.service';
import { LogoComponent } from '../logo/logo.component';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, LogoComponent, ThemeSwitcherComponent],
  template: `
    <footer class="footer">
      <div class="footer__cta">
        <div class="bx-container footer__cta-inner">
          <p class="footer__cta-title">Prêt à monter sur le ring&nbsp;?</p>
          <div class="footer__cta-actions">
            <a routerLink="/inscription" class="bx-btn bx-btn--primary bx-btn--lg">Essai gratuit / S'inscrire</a>
            <a routerLink="/planning" class="bx-btn bx-btn--light bx-btn--lg">Voir le planning</a>
          </div>
        </div>
      </div>

      <div class="bx-container footer__grid">
        <div class="footer__brand">
          <app-logo />
          <p>{{ club()?.tagline ?? 'Club de boxe anglaise de Tergnier : boxe éducative, loisir, amateur et professionnelle.' }}</p>
          @if (club()?.socials; as s) {
            <ul class="footer__socials" aria-label="Réseaux sociaux">
              @if (s.facebook) {
                <li><a [href]="s.facebook" target="_blank" rel="noopener">Facebook<span class="bx-sr-only"> (nouvel onglet)</span></a></li>
              }
              @if (s.instagram) {
                <li><a [href]="s.instagram" target="_blank" rel="noopener">Instagram<span class="bx-sr-only"> (nouvel onglet)</span></a></li>
              }
              @if (s.youtube) {
                <li><a [href]="s.youtube" target="_blank" rel="noopener">YouTube<span class="bx-sr-only"> (nouvel onglet)</span></a></li>
              }
            </ul>
          }
        </div>

        <nav aria-labelledby="footer-club">
          <h2 id="footer-club" class="footer__title">Le club</h2>
          <ul>
            <li><a routerLink="/club">Histoire et coachs</a></li>
            <li><a routerLink="/disciplines">Disciplines</a></li>
            <li><a routerLink="/planning">Planning</a></li>
            <li><a routerLink="/tarifs">Tarifs et documents</a></li>
            <li><a routerLink="/boxeurs">Nos boxeurs</a></li>
            <li><a routerLink="/evenements">Événements</a></li>
            <li><a routerLink="/actualites">Actualités</a></li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-member">
          <h2 id="footer-member" class="footer__title">Membres</h2>
          <ul>
            <li><a routerLink="/inscription">S'inscrire au club</a></li>
            <li><a routerLink="/mon-espace">Mon espace</a></li>
            <li><a routerLink="/connexion">Connexion</a></li>
            <li><a routerLink="/inscription-compte">Créer un compte</a></li>
            <li><a routerLink="/contact">Contact</a></li>
          </ul>
        </nav>

        <div>
          <h2 class="footer__title">Nous trouver</h2>
          <address>
            @if (club(); as c) {
              <strong>{{ c.name }}</strong><br />
              {{ c.address }}<br />
              @if (c.phone) {
                <a [href]="tel(c.phone)">{{ c.phone }}</a><br />
              }
              @if (c.email) {
                <a [href]="'mailto:' + c.email">{{ c.email }}</a>
              }
            } @else {
              <strong>ESC Boxe Tergnier</strong><br />
              02700 Tergnier (Aisne)
            }
          </address>
        </div>
      </div>

      <div class="bx-container footer__bottom">
        <p>© {{ year }} ESC Boxe Tergnier · Association loi 1901</p>
        <nav class="footer__legal" aria-label="Liens légaux">
          <a routerLink="/mentions-legales">Mentions légales</a>
          <a routerLink="/confidentialite">Confidentialité</a>
          <a routerLink="/cgu">CGU</a>
        </nav>
        <app-theme-switcher />
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    .footer {
      margin-top: 0;
      background: var(--bx-footer-bg);
      color: var(--bx-footer-ink);
      font-size: 0.93rem;
    }
    .footer__cta {
      background: var(--bx-primary);
      color: var(--bx-primary-ink);
    }
    .footer__cta-inner {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1.2rem;
      padding-block: 2rem;
    }
    .footer__cta-title {
      margin: 0;
      font-family: var(--bx-font-display);
      font-size: clamp(1.6rem, 4vw, 2.4rem);
      font-weight: var(--bx-display-weight);
      letter-spacing: var(--bx-display-tracking);
      text-transform: var(--bx-display-transform);
      line-height: 1.1;
    }
    .footer__cta-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem;
    }
    .footer__cta .bx-btn--primary {
      background: var(--bx-dark);
      color: var(--bx-dark-ink);
    }
    .footer__cta .bx-btn--primary:hover {
      background: var(--bx-dark-2);
    }
    .footer__cta .bx-btn--light {
      color: var(--bx-primary-ink);
    }
    .footer__cta .bx-btn--light:hover {
      background: var(--bx-primary-ink);
      color: var(--bx-primary);
    }
    .footer__grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
      gap: 2rem;
      padding-block: 3rem 2rem;
    }
    .footer__brand p {
      max-width: 34ch;
      margin: 1rem 0;
      color: var(--bx-footer-muted);
    }
    .footer__title {
      margin-bottom: 0.9rem;
      color: var(--bx-footer-ink);
      font-size: 1rem;
      letter-spacing: 0.1em;
    }
    ul {
      display: grid;
      gap: 0.45rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .footer__socials {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem 1rem;
    }
    a {
      color: var(--bx-footer-ink);
      text-decoration: none;
    }
    a:hover {
      color: var(--bx-primary);
      text-decoration: underline;
    }
    .footer__socials a {
      font-weight: 600;
    }
    address {
      color: var(--bx-footer-muted);
      font-style: normal;
      line-height: 1.8;
    }
    address strong {
      color: var(--bx-footer-ink);
    }
    .footer__bottom {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem 2rem;
      padding-block: 1.3rem 1.6rem;
      border-top: 1px solid var(--bx-dark-line);
      color: var(--bx-footer-muted);
      font-size: 0.84rem;
    }
    .footer__bottom p {
      margin: 0;
    }
    .footer__legal {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem 1.4rem;
    }
    .footer__legal a {
      color: var(--bx-footer-muted);
    }
    @media (max-width: 900px) {
      .footer__grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    @media (max-width: 560px) {
      .footer__grid {
        grid-template-columns: 1fr;
      }
      .footer__cta-actions .bx-btn {
        width: 100%;
      }
    }
  `,
})
export class FooterComponent {
  protected readonly year = new Date().getFullYear();
  protected tel(phone: string): string {
    return `tel:${phone.replace(/[^\d+]/g, '')}`;
  }
  protected readonly club = toSignal(inject(ClubService).getClub().pipe(catchError(() => of(null))), { initialValue: null });
}
