import { Component, OnInit, inject, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { apiErrorMessage } from '../../../core/api/api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthShellComponent } from '../auth-shell/auth-shell.component';

type State = 'loading' | 'success' | 'expired' | 'invalid';

/**
 * Cible du lien reçu par email : /verifier-email?token=…
 */
@Component({
  selector: 'app-verify-email',
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-auth-shell eyebrow="Activation du compte" [heading]="headings[state()]" quote="Le gong a sonné : bienvenue au club.">
      @switch (state()) {
        @case ('loading') {
          <p class="bx-hint" role="status" aria-live="polite">Vérification de votre lien en cours…</p>
        }
        @case ('success') {
          <div class="bx-alert bx-alert--success" role="status">{{ message() }}</div>
          <a routerLink="/connexion" class="bx-btn bx-btn--primary bx-btn--lg">
            Se connecter <span class="bx-arrow" aria-hidden="true">→</span>
          </a>
        }
        @default {
          <div class="bx-alert bx-alert--error" role="alert">{{ message() }}</div>
          <form [formGroup]="form" (ngSubmit)="resend()" novalidate aria-label="Recevoir un nouveau lien d'activation">
            <div class="bx-field">
              <label for="resend-email">Recevoir un nouveau lien à cette adresse</label>
              <input
                id="resend-email"
                class="bx-input"
                type="email"
                formControlName="email"
                autocomplete="email"
                required
                [attr.aria-invalid]="form.controls.email.touched && form.controls.email.invalid"
                [attr.aria-describedby]="form.controls.email.touched && form.controls.email.invalid ? 'resend-email-error' : null"
              />
              @if (form.controls.email.touched && form.controls.email.invalid) {
                <p class="bx-error" id="resend-email-error">Saisissez une adresse email valide.</p>
              }
            </div>
            @if (resendMessage(); as m) {
              <div class="bx-alert bx-alert--info" role="status">{{ m }}</div>
            }
            <button type="submit" class="bx-btn bx-btn--primary" [disabled]="sending()">
              {{ sending() ? 'Envoi…' : 'Renvoyer le lien' }} <span class="bx-arrow" aria-hidden="true">→</span>
            </button>
          </form>
        }
      }
    </app-auth-shell>
  `,
})
export class VerifyEmailComponent implements OnInit {
  private readonly auth = inject(AuthService);

  readonly token = input<string>('');

  protected readonly state = signal<State>('loading');
  protected readonly message = signal('');
  protected readonly sending = signal(false);
  protected readonly resendMessage = signal<string | null>(null);
  protected readonly form = inject(NonNullableFormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
  });

  protected readonly headings: Record<State, string> = {
    loading: 'Un instant…',
    success: 'Compte activé',
    expired: 'Lien expiré',
    invalid: 'Lien invalide',
  };

  ngOnInit(): void {
    if (!this.token()) {
      this.state.set('invalid');
      this.message.set('Ce lien ne contient pas de jeton de vérification.');
      return;
    }

    this.auth.verifyEmail(this.token()).subscribe({
      next: (res) => {
        this.state.set('success');
        this.message.set(res.message || 'Votre adresse email est confirmée. Vous pouvez vous connecter.');
      },
      error: (err: unknown) => {
        const expired = err instanceof HttpErrorResponse && err.status === 410;
        this.state.set(expired ? 'expired' : 'invalid');
        this.message.set(apiErrorMessage(err, expired ? 'Ce lien a expiré.' : 'Ce lien est invalide ou a déjà été utilisé.'));
      },
    });
  }

  protected resend(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.sending.set(true);
    this.auth.resendVerification(this.form.getRawValue().email.trim()).subscribe({
      next: (res) => {
        this.sending.set(false);
        this.resendMessage.set(res.message || 'Si un compte existe à cette adresse, un nouveau lien vient de partir.');
      },
      error: (err: unknown) => {
        this.sending.set(false);
        this.resendMessage.set(apiErrorMessage(err));
      },
    });
  }
}
