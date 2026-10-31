import { Component, inject, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { apiErrorMessage } from '../../../core/api/api.service';
import { AccountService } from '../../../core/api/account.service';
import { AuthShellComponent } from '../../auth/auth-shell/auth-shell.component';

type State = 'confirm' | 'loading' | 'done' | 'error';

/**
 * Cible du lien reçu par email : /suppression-compte?token=…
 * La suppression n'est déclenchée que par un clic (un simple aperçu du lien par la messagerie ne supprime rien).
 */
@Component({
  selector: 'app-account-deletion',
  imports: [RouterLink, AuthShellComponent],
  template: `
    <app-auth-shell
      eyebrow="Mes données"
      [heading]="state() === 'done' ? 'Compte supprimé' : 'Supprimer mon compte'"
      quote="Merci d’avoir porté les couleurs de l’ESC Boxe Tergnier."
    >
      @switch (state()) {
        @case ('done') {
          <div class="bx-alert bx-alert--success" role="status">{{ message() }}</div>
          <a routerLink="/" class="bx-btn bx-btn--primary">Retour à l'accueil <span class="bx-arrow" aria-hidden="true">→</span></a>
        }
        @case ('error') {
          <div class="bx-alert bx-alert--error" role="alert">{{ message() }}</div>
          <a routerLink="/mon-espace" [queryParams]="{ onglet: 'donnees' }" class="bx-btn bx-btn--outline">Aller à mon espace</a>
        }
        @default {
          @if (!token()) {
            <div class="bx-alert bx-alert--error" role="alert">Ce lien est incomplet. Recommencez depuis votre espace, onglet « Mes données ».</div>
          } @else {
            <p>
              En confirmant, votre compte est <strong>supprimé immédiatement et définitivement</strong> : identité, email,
              mot de passe, téléphone, date de naissance et messages échangés avec le club. Les dossiers d'adhésion déjà
              validés restent conservés par l'association pour la durée légale indiquée dans la
              <a routerLink="/confidentialite">politique de confidentialité</a>.
            </p>
            <div class="actions">
              <button type="button" class="bx-btn bx-btn--primary" [disabled]="state() === 'loading'" [attr.aria-busy]="state() === 'loading'" (click)="confirm()">
                {{ state() === 'loading' ? 'Suppression…' : 'Supprimer définitivement mon compte' }}
              </button>
              <a routerLink="/" class="bx-btn bx-btn--outline">Annuler</a>
            </div>
          }
        }
      }
    </app-auth-shell>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    p {
      margin: 0 0 1.5rem;
      color: var(--bx-ink-soft);
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
  `,
})
export class AccountDeletionComponent {
  private readonly account = inject(AccountService);

  readonly token = input('');

  protected readonly state = signal<State>('confirm');
  protected readonly message = signal('');

  protected confirm(): void {
    this.state.set('loading');
    this.account.confirmDeletion(this.token()).subscribe({
      next: (res) => {
        this.message.set(res.message || 'Votre compte a été supprimé.');
        this.state.set('done');
      },
      error: (err: unknown) => {
        this.message.set(apiErrorMessage(err, 'Le lien est invalide ou expiré.'));
        this.state.set('error');
      },
    });
  }
}
