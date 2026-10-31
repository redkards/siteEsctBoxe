import { Component, ElementRef, computed, inject, input, linkedSignal, viewChildren, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { initials } from '../../core/auth/auth.models';
import { ProfileTabComponent } from './profile-tab/profile-tab.component';
import { MembershipsTabComponent } from './memberships-tab/memberships-tab.component';
import { MessagesTabComponent } from './messages-tab/messages-tab.component';
import { DataTabComponent } from './data-tab/data-tab.component';

export type AccountTab = 'profil' | 'inscriptions' | 'messagerie' | 'donnees';

export const ACCOUNT_TABS: readonly { id: AccountTab; label: string }[] = [
  { id: 'profil', label: 'Profil' },
  { id: 'inscriptions', label: 'Mes inscriptions' },
  { id: 'messagerie', label: 'Messagerie' },
  { id: 'donnees', label: 'Mes données' },
];

function isTab(value: string | null | undefined): value is AccountTab {
  return ACCOUNT_TABS.some((t) => t.id === value);
}

/**
 * /mon-espace — Espace membre en onglets (?onglet=profil|inscriptions|messagerie|donnees).
 * Onglets ARIA : flèches gauche/droite, Début/Fin ; un seul onglet monté à la fois.
 */
@Component({
  selector: 'app-account',
  imports: [DatePipe, ProfileTabComponent, MembershipsTabComponent, MessagesTabComponent, DataTabComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AccountComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** Query param ?onglet= (liaison des inputs du routeur) */
  readonly onglet = input<string>();

  protected readonly tabs = ACCOUNT_TABS;
  protected readonly active = linkedSignal<AccountTab>(() => {
    const tab = this.onglet();
    return isTab(tab) ? tab : 'profil';
  });
  protected readonly initials = computed(() => {
    const user = this.auth.user();
    return user ? initials(user) : '?';
  });

  private readonly tabButtons = viewChildren<ElementRef<HTMLButtonElement>>('tabButton');

  protected select(tab: AccountTab, focus = false): void {
    this.active.set(tab);
    void this.router.navigate([], { queryParams: { onglet: tab === 'profil' ? null : tab }, queryParamsHandling: 'merge', replaceUrl: true });
    if (focus) {
      const index = this.tabs.findIndex((t) => t.id === tab);
      this.tabButtons()[index]?.nativeElement.focus();
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    const index = this.tabs.findIndex((t) => t.id === this.active());
    const last = this.tabs.length - 1;
    const target: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    if (event.key in target) {
      event.preventDefault();
      this.select(this.tabs[target[event.key]].id, true);
    }
  }
}
