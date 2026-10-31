import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { apiErrorMessage, apiViolations } from '../../../core/api/api.service';
import { AccountService } from '../../../core/api/account.service';
import { Feedback } from '../profile-tab/profile-tab.component';

/**
 * Onglet « Mes données » : export RGPD (droit d'accès / portabilité) et suppression du compte (droit à l'effacement).
 */
@Component({
  selector: 'app-data-tab',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="tab-grid">
      <section class="bx-panel" aria-labelledby="export-title">
        <h2 id="export-title" class="tab-title">Télécharger mes données</h2>
        <p class="bx-muted">
          Recevez une copie de toutes les données liées à votre compte (identité, consentements, inscriptions au club,
          messages échangés) dans un fichier JSON.
          <a routerLink="/confidentialite">Politique de confidentialité</a>
        </p>
        <div aria-live="polite">
          @if (exportFeedback(); as f) {
            <div class="bx-alert" [class.bx-alert--success]="f.type === 'success'" [class.bx-alert--error]="f.type === 'error'" [attr.role]="f.type === 'error' ? 'alert' : 'status'">{{ f.text }}</div>
          }
        </div>
        <button type="button" class="bx-btn bx-btn--outline" [disabled]="busy() === 'export'" [attr.aria-busy]="busy() === 'export'" (click)="exportData()">
          {{ busy() === 'export' ? 'Préparation…' : 'Exporter mes données' }}
        </button>
      </section>

      <section class="bx-panel danger" aria-labelledby="delete-title">
        <h2 id="delete-title" class="tab-title">Supprimer mon compte</h2>
        <p class="bx-muted">
          Votre compte et vos données personnelles seront effacés définitivement. Les dossiers d'adhésion déjà validés
          restent conservés par l'association le temps de la saison et des obligations fédérales et comptables. Un email
          de confirmation vous sera envoyé.
        </p>
        @if (!showDeletion()) {
          <button type="button" class="bx-btn bx-btn--ghost danger__open" (click)="openDeletion()">Je veux supprimer mon compte</button>
        } @else {
          <form [formGroup]="deletionForm" (ngSubmit)="requestDeletion()" novalidate aria-labelledby="delete-title">
            <div class="bx-field">
              <label for="delete-password">Confirmez avec votre mot de passe <span class="bx-req" aria-hidden="true">*</span></label>
              <input
                id="delete-password"
                class="bx-input"
                type="password"
                formControlName="password"
                autocomplete="current-password"
                required
                [attr.aria-invalid]="deletionForm.controls.password.touched && deletionForm.controls.password.invalid"
              />
            </div>
            <div aria-live="polite">
              @if (deletionFeedback(); as f) {
                <div class="bx-alert" [class.bx-alert--success]="f.type === 'success'" [class.bx-alert--error]="f.type === 'error'" [attr.role]="f.type === 'error' ? 'alert' : 'status'">{{ f.text }}</div>
              }
            </div>
            <div class="actions">
              <button type="submit" class="bx-btn bx-btn--primary" [disabled]="busy() === 'deletion'" [attr.aria-busy]="busy() === 'deletion'">
                {{ busy() === 'deletion' ? 'Envoi…' : "Recevoir l'email de confirmation" }}
              </button>
              <button type="button" class="bx-btn bx-btn--outline" (click)="showDeletion.set(false)">Annuler</button>
            </div>
          </form>
        }
      </section>
    </div>
  `,
  styleUrl: '../account-tab.scss',
  styles: `
    .danger {
      border-top: 4px solid var(--bx-danger);
    }
    .danger__open {
      color: var(--bx-danger);
      padding-inline: 0;
      text-decoration: underline;
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class DataTabComponent {
  private readonly account = inject(AccountService);

  protected readonly deletionForm = inject(NonNullableFormBuilder).group({
    password: ['', Validators.required],
  });

  protected readonly exportFeedback = signal<Feedback>(null);
  protected readonly deletionFeedback = signal<Feedback>(null);
  protected readonly busy = signal<'export' | 'deletion' | null>(null);
  protected readonly showDeletion = signal(false);

  protected exportData(): void {
    this.busy.set('export');
    this.exportFeedback.set(null);
    this.account.downloadExport().subscribe({
      next: () => {
        this.busy.set(null);
        this.exportFeedback.set({ type: 'success', text: 'Votre fichier a été téléchargé.' });
      },
      error: (err: unknown) => {
        this.busy.set(null);
        this.exportFeedback.set({ type: 'error', text: apiErrorMessage(err, "L'export a échoué, réessayez.") });
      },
    });
  }

  protected openDeletion(): void {
    this.deletionFeedback.set(null);
    this.showDeletion.set(true);
    queueMicrotask(() => document.getElementById('delete-password')?.focus());
  }

  protected requestDeletion(): void {
    if (this.deletionForm.invalid) {
      this.deletionForm.markAllAsTouched();
      this.deletionFeedback.set({ type: 'error', text: 'Saisissez votre mot de passe.' });
      return;
    }
    this.busy.set('deletion');
    this.account.requestDeletion(this.deletionForm.getRawValue().password).subscribe({
      next: (res) => {
        this.busy.set(null);
        this.deletionForm.reset();
        this.deletionFeedback.set({
          type: 'success',
          text: res.message || 'Un email de confirmation vient de vous être envoyé. Cliquez sur le lien pour finaliser la suppression.',
        });
      },
      error: (err: unknown) => {
        this.busy.set(null);
        const text =
          err instanceof HttpErrorResponse && (err.status === 422 || err.status === 403 || err.status === 401)
            ? (apiViolations(err)['password'] ?? 'Mot de passe incorrect.')
            : apiErrorMessage(err);
        this.deletionFeedback.set({ type: 'error', text });
      },
    });
  }
}
