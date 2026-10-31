import { Component, inject, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { apiErrorMessage } from '../../../core/api/api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthShellComponent } from '../auth-shell/auth-shell.component';

/** N'accepte qu'un chemin interne (« /… » mais pas « //hote » ni une URL absolue) */
export function safeReturnUrl(value: string | null | undefined, fallback = '/mon-espace'): string {
  return value && value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\') ? value : fallback;
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './login.component.html',
  styles: `
    .switch--sub {
      margin-top: 0.5rem;
      font-size: 0.86rem;
    }
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** Page demandée avant redirection par l'authGuard (?returnUrl=) */
  readonly returnUrl = input<string>();

  protected readonly form = inject(NonNullableFormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly notVerified = signal(false);
  protected readonly showPassword = signal(false);
  protected readonly resending = signal(false);
  protected readonly resendMessage = signal<string | null>(null);

  protected showError(field: 'email' | 'password'): boolean {
    const control = this.form.controls[field];
    return control.touched && control.invalid;
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.notVerified.set(false);
    this.resendMessage.set(null);

    const { email, password } = this.form.getRawValue();
    this.auth.login(email.trim(), password).subscribe({
      next: () => void this.router.navigateByUrl(safeReturnUrl(this.returnUrl())),
      error: (err: unknown) => {
        this.loading.set(false);
        if (err instanceof HttpErrorResponse && err.status === 401) {
          const message: string = err.error?.message ?? '';
          this.notVerified.set(message.includes('confirmer votre adresse'));
          this.error.set(this.notVerified() ? message : 'Email ou mot de passe incorrect.');
          return;
        }
        this.error.set(apiErrorMessage(err));
      },
    });
  }

  protected resend(): void {
    this.resending.set(true);
    this.auth.resendVerification(this.form.controls.email.value.trim()).subscribe({
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
