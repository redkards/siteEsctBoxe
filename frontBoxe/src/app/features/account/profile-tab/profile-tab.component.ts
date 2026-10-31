import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { apiErrorMessage, apiViolations } from '../../../core/api/api.service';
import { AccountService } from '../../../core/api/account.service';
import { AuthService } from '../../../core/auth/auth.service';
import { ProfileUpdate } from '../../../core/auth/auth.models';

export type Feedback = { type: 'success' | 'error'; text: string } | null;

const NAME_PATTERN = /^[\p{L}][\p{L}' \-.]*$/u;
/** Téléphone français ou international : chiffres, espaces, points, tirets, « + » initial */
const PHONE_PATTERN = /^\+?[\d .-]{10,20}$/;

/** Prénom / nom obligatoire, contrôlé sans les espaces de début et de fin */
export function nameValidator(control: AbstractControl<string>): ValidationErrors | null {
  const value = (control.value ?? '').trim();
  if (!value) return { required: true };
  if (value.length > 80) return { maxlength: true };
  return NAME_PATTERN.test(value) ? null : { pattern: true };
}

/** Téléphone facultatif : vide (ou blancs) accepté, sinon format attendu */
export function phoneValidator(control: AbstractControl<string>): ValidationErrors | null {
  const value = (control.value ?? '').trim();
  return !value || PHONE_PATTERN.test(value) ? null : { phone: true };
}

/** Date de naissance passée et plausible (moins de 110 ans) */
export function birthDateValidator(control: AbstractControl<string>): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return { birthDate: true };
  const now = new Date();
  const min = new Date(now.getFullYear() - 110, now.getMonth(), now.getDate());
  return date > now || date < min ? { birthDate: true } : null;
}

/** AAAA-MM-JJ à partir d'une date ISO renvoyée par l'API */
export function toDateInput(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : '';
}

/**
 * Onglet « Profil » : identité (prénom, nom, téléphone, date de naissance) et mot de passe.
 */
@Component({
  selector: 'app-profile-tab',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-tab.component.html',
  styleUrl: '../account-tab.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ProfileTabComponent {
  protected readonly auth = inject(AuthService);
  private readonly account = inject(AccountService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly today = new Date().toISOString().slice(0, 10);

  protected readonly profileForm = this.fb.group({
    firstName: [this.auth.user()?.firstName ?? '', nameValidator],
    lastName: [this.auth.user()?.lastName ?? '', nameValidator],
    phone: [this.auth.user()?.phone ?? '', phoneValidator],
    birthDate: [toDateInput(this.auth.user()?.birthDate), birthDateValidator],
  });

  protected readonly passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected readonly profileFeedback = signal<Feedback>(null);
  protected readonly profileErrors = signal<Record<string, string>>({});
  protected readonly passwordFeedback = signal<Feedback>(null);
  protected readonly passwordErrors = signal<Record<string, string>>({});
  protected readonly busy = signal<'profile' | 'password' | null>(null);
  protected readonly showPasswords = signal(false);

  protected profileError(field: 'firstName' | 'lastName' | 'phone' | 'birthDate'): string | null {
    const server = this.profileErrors()[field];
    if (server) return server;
    const control = this.profileForm.controls[field];
    if (!control.touched || control.valid) return null;
    switch (field) {
      case 'firstName':
      case 'lastName': {
        const label = field === 'firstName' ? 'prénom' : 'nom';
        return control.hasError('required') ? `Le ${label} est obligatoire.` : `Saisissez un ${label} valide (lettres, espaces, tirets).`;
      }
      case 'phone':
        return 'Saisissez un numéro valide, par exemple 06 12 34 56 78.';
      case 'birthDate':
        return 'Saisissez une date de naissance valide.';
    }
  }

  protected passwordError(field: 'currentPassword' | 'newPassword'): string | null {
    const server = this.passwordErrors()[field];
    if (server) return server;
    const control = this.passwordForm.controls[field];
    if (!control.touched || control.valid) return null;
    return field === 'currentPassword' ? 'Saisissez votre mot de passe actuel.' : 'Au moins 8 caractères.';
  }

  protected saveProfile(): void {
    this.profileErrors.set({});
    this.profileFeedback.set(null);
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const raw = this.profileForm.getRawValue();
    const changes: ProfileUpdate = {
      firstName: raw.firstName.trim(),
      lastName: raw.lastName.trim(),
      phone: raw.phone.trim() || null,
      birthDate: raw.birthDate || null,
    };

    this.busy.set('profile');
    this.account.updateProfile(changes).subscribe({
      next: () => {
        this.busy.set(null);
        this.profileForm.markAsPristine();
        this.profileFeedback.set({ type: 'success', text: 'Vos informations ont été enregistrées.' });
      },
      error: (err: unknown) => {
        this.busy.set(null);
        const violations = apiViolations(err);
        this.profileErrors.set(violations);
        this.profileFeedback.set(
          Object.keys(violations).length
            ? { type: 'error', text: 'Certains champs sont à corriger.' }
            : { type: 'error', text: apiErrorMessage(err, "L'enregistrement a échoué, réessayez.") },
        );
      },
    });
  }

  protected savePassword(): void {
    this.passwordErrors.set({});
    this.passwordFeedback.set(null);
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    const { currentPassword, newPassword } = this.passwordForm.getRawValue();
    if (currentPassword === newPassword) {
      this.passwordErrors.set({ newPassword: "Le nouveau mot de passe doit être différent de l'actuel." });
      return;
    }

    this.busy.set('password');
    this.account.changePassword(currentPassword, newPassword).subscribe({
      next: (res) => {
        this.busy.set(null);
        this.passwordForm.reset();
        this.passwordFeedback.set({ type: 'success', text: res.message || 'Mot de passe modifié. Vos autres appareils ont été déconnectés.' });
      },
      error: (err: unknown) => {
        this.busy.set(null);
        const violations = apiViolations(err);
        this.passwordErrors.set(violations);
        this.passwordFeedback.set(Object.keys(violations).length ? null : { type: 'error', text: apiErrorMessage(err) });
      },
    });
  }
}
