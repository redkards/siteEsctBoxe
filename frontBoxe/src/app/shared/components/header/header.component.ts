import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/auth/auth.service';
import { initials } from '../../../core/auth/auth.models';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, LogoComponent],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly menuOpen = signal(false);
  protected readonly adminUrl = environment.adminUrl;
  protected readonly initials = initials;

  protected readonly links = [
    { path: '/', label: 'Accueil', exact: true },
    { path: '/club', label: 'Le club', exact: false },
    { path: '/disciplines', label: 'Disciplines', exact: false },
    { path: '/planning', label: 'Planning', exact: false },
    { path: '/tarifs', label: 'Tarifs', exact: false },
    { path: '/boxeurs', label: 'Boxeurs', exact: false },
    { path: '/evenements', label: 'Événements', exact: false },
    { path: '/actualites', label: 'Actus', exact: false },
    { path: '/contact', label: 'Contact', exact: false },
  ];

  constructor() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.menuOpen.set(false));
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }
}
