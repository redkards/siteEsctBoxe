import { environment } from '../environments/environment';
import { Component, ChangeDetectionStrategy, DOCUMENT, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { variantForUrl } from './core/layout/page-variant';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly demo = 'demo' in environment;
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  /** Variante Mix de la page courante (gala sombre / claire), cf. core/layout/page-variant.ts */
  protected readonly variant = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => variantForUrl(e.urlAfterRedirects)),
    ),
    { initialValue: variantForUrl(this.router.url || this.document.location?.pathname || '/') },
  );

  constructor() {
    effect(() => this.document.body.setAttribute('data-variant', this.variant()));
  }

  /** Lien d'évitement : en routage hash (démo), « #contenu » serait pris pour une route ; on déplace le focus nous-mêmes. */
  protected skipToContent(event: Event): void {
    event.preventDefault();
    const main = this.document.getElementById('contenu');
    main?.focus();
    main?.scrollIntoView();
  }
}
