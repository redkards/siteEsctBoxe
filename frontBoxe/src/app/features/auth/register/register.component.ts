import { Component, computed, inject, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { apiErrorMessage, apiViolations } from '../../../core/api/api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthShellComponent } from '../auth-shell/auth-shell.component';

type Field = 'firstName' | 'lastName' | 'email' | 'password' | 'acceptCgu';

/** Prénom / nom : lettres (accents compris), espaces, apostrophes et tirets */
const NAME_PATTERN = /^[\p{L}][\p{L}' \-.]*$/u;

/** Indication visuelle seulement : la vraie règle est appliquée par le serveur */
export function passwordScore(value: string): number {
  let score = 0;
  if (value.length >= 8) score++;
  if (value.length >= 12) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^\w\s]/.test(value)) score++;
  return Math.min(score, 4);
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);

  /** Transmis à la connexion après activation (?returnUrl=) */
  readonly returnUrl = input<string>();

  protected readonly form = inject(NonNullableFormBuilder).group({
    firstName: ['', [Validators.required, Validators.maxLength(80), Validators.pattern(NAME_PATTERN)]],
    lastName: ['', [Validators.required, Validators.maxLength(80), Validators.pattern(NAME_PATTERN)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(180)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    // RGPD : case non pré-cochée
    acceptCgu: [false, Validators.requiredTrue],
  });

  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly serverErrors = signal<Partial<Record<Field, string>>>({});
  protected readonly showPassword = signal(false);
  /** Email du compte créé : affiche l'écran « vérifiez votre boîte mail » */
  protected readonly registeredEmail = signal<string | null>(null);
  protected readonly resending = signal(false);
  protected readonly resendMessage = signal<string | null>(null);

  private readonly passwordValue = toSignal(this.form.controls.password.valueChanges, { initialValue: '' });
  protected readonly strength = computed(() => passwordScore(this.passwordValue()));
  protected readonly strengthLabel = computed(() => ['Très faible', 'Faible', 'Moyen', 'Bon', 'Excellent'][this.strength()]);

  protected fieldError(field: Field): string | null {
    const server = this.serverErrors()[field];
    if (server) return server;
    const control = this.form.controls[field];
    if (!control.touched || control.valid) return null;

    switch (field) {
      case 'firstName':
      case 'lastName': {
        const label = field === 'firstName' ? 'prénom' : 'nom';
        if (control.hasError('required')) return `Le ${label} est obligatoire.`;
        if (control.hasError('maxlength')) return `Le ${label} ne doit pas dépasser 80 caractères.`;
        return `Le ${label} ne peut contenir que des lettres, espaces, apostrophes et tirets.`;
      }
      case 'email':
        return control.hasError('required') ? "L'email est obligatoire." : 'Saisissez une adresse email valide.';
      case 'password':
        return 'Le mot de passe doit contenir au moins 8 caractères.';
      case 'acceptCgu':
        return 'Vous devez accepter les CGU et la politique de confidentialité.';
    }
  }

  protected submit(): void {
    this.serverErrors.set({});
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const raw = this.form.getRawValue();
    const payload = { ...raw, firstName: raw.firstName.trim(), lastName: raw.lastName.trim(), email: raw.email.trim() };
    this.auth.register(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.registeredEmail.set(payload.email);
      },
      error: (err: unknown) => {
        this.loading.set(false);
        const violations = apiViolations(err);
        if (Object.keys(violations).length) {
          this.serverErrors.set(violations);
          return;
        }
        if (err instanceof HttpErrorResponse && err.status === 409) {
          this.serverErrors.set({ email: apiErrorMessage(err, 'Un compte existe déjà avec cette adresse email.') });
          return;
        }
        this.error.set(apiErrorMessage(err));
      },
    });
  }

  protected resend(): void {
    const email = this.registeredEmail();
    if (!email) return;
    this.resending.set(true);
    this.auth.resendVerification(email).subscribe({
      next: (res) => {
        this.resending.set(false);
        this.resendMessage.set(res.message || 'Un nouveau lien vous a été envoyé.');
      },
      error: (err: unknown) => {
        this.resending.set(false);
        this.resendMessage.set(apiErrorMessage(err));
      },
    });
  }
}
