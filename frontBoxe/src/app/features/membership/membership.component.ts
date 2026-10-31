import { Component, OnInit, computed, effect, inject, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { apiErrorMessage, apiViolations } from '../../core/api/api.service';
import { ClubService } from '../../core/api/club.service';
import { MembershipService } from '../../core/api/membership.service';
import { Discipline, MembershipPayload, PERIOD_LABELS, Pricing } from '../../core/api/models';
import { AuthService } from '../../core/auth/auth.service';
import { LoadErrorComponent } from '../../shared/components/state/state.component';
import { EurosPipe } from '../../shared/pipes/euros.pipe';
import { createLoader } from '../../shared/utils/loader';
import { ageOn, currentSeason, isMinor, isPlausibleBirthDate } from '../../shared/utils/membership.utils';

export type StepId = 'identite' | 'pratique' | 'responsable' | 'validation';

export const STEP_LABELS: Record<StepId, string> = {
  identite: 'Identité',
  pratique: 'Discipline et formule',
  responsable: 'Responsable légal',
  validation: 'Validation',
};

/** Étapes du parcours : « Responsable légal » n'apparaît que pour un mineur */
export function membershipSteps(minor: boolean): StepId[] {
  return minor ? ['identite', 'pratique', 'responsable', 'validation'] : ['identite', 'pratique', 'validation'];
}

/**
 * Inscription au club (Membership) en plusieurs étapes, publique ou connectée (préremplie).
 */
@Component({
  selector: 'app-membership',
  imports: [ReactiveFormsModule, RouterLink, EurosPipe, LoadErrorComponent],
  templateUrl: './membership.component.html',
  styleUrl: './membership.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class MembershipComponent implements OnInit {
  private readonly club = inject(ClubService);
  private readonly memberships = inject(MembershipService);
  protected readonly auth = inject(AuthService);
  private readonly fb = inject(NonNullableFormBuilder);

  /** ?discipline=slug et ?tarif=id (liens depuis les pages Disciplines et Tarifs) */
  readonly discipline = input<string>();
  readonly tarif = input<string>();

  protected readonly disciplines = createLoader<Discipline[]>();
  protected readonly pricing = createLoader<Pricing[]>();
  protected readonly season = currentSeason();
  protected readonly periods = PERIOD_LABELS;
  protected readonly labels = STEP_LABELS;

  protected readonly form = this.fb.group({
    identite: this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(80)]],
      lastName: ['', [Validators.required, Validators.maxLength(80)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[+\d][\d\s.-]{8,18}$/)]],
      birthDate: ['', [Validators.required]],
    }),
    pratique: this.fb.group({
      discipline: [0, [Validators.min(1)]],
      pricing: [0],
      message: ['', Validators.maxLength(1000)],
    }),
    responsable: this.fb.group({
      legalGuardian: ['', Validators.maxLength(160)],
    }),
    validation: this.fb.group({
      medicalCertificate: [false],
      consent: [false, Validators.requiredTrue],
    }),
  });

  private readonly birthDate = toSignal(this.form.controls.identite.controls.birthDate.valueChanges, { initialValue: '' });
  protected readonly minor = computed(() => isMinor(this.birthDate()));
  protected readonly age = computed(() => ageOn(this.birthDate()));
  protected readonly steps = computed(() => membershipSteps(this.minor()));
  protected readonly index = signal(0);
  protected readonly step = computed<StepId>(() => this.steps()[Math.min(this.index(), this.steps().length - 1)]);

  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly serverErrors = signal<Record<string, string>>({});
  protected readonly done = signal<{ id: number; email: string; firstName: string } | null>(null);

  private readonly pratique = toSignal(this.form.controls.pratique.valueChanges, { initialValue: this.form.controls.pratique.getRawValue() });
  protected readonly selectedDiscipline = computed(() => this.disciplines.data()?.find((d) => d.id === Number(this.pratique().discipline)) ?? null);
  protected readonly selectedPricing = computed(() => this.pricing.data()?.find((p) => p.id === Number(this.pratique().pricing)) ?? null);
  protected readonly sortedPricing = computed(() => [...(this.pricing.data() ?? [])].sort((a, b) => a.position - b.position));
  /** Âge insuffisant pour la discipline choisie */
  protected readonly tooYoung = computed(() => {
    const d = this.selectedDiscipline();
    const age = this.age();
    return !!d?.minAge && age !== null && age < d.minAge;
  });

  constructor() {
    // Responsable légal obligatoire pour un mineur uniquement
    effect(() => {
      const control = this.form.controls.responsable.controls.legalGuardian;
      control.setValidators(this.minor() ? [Validators.required, Validators.minLength(3), Validators.maxLength(160)] : [Validators.maxLength(160)]);
      control.updateValueAndValidity({ emitEvent: false });
    });

    // Préremplissage si connecté
    effect(() => {
      const user = this.auth.user();
      if (!user) return;
      const identite = this.form.controls.identite;
      identite.patchValue({
        firstName: identite.controls.firstName.value || user.firstName,
        lastName: identite.controls.lastName.value || user.lastName,
        email: identite.controls.email.value || user.email,
        phone: identite.controls.phone.value || (user.phone ?? ''),
        birthDate: identite.controls.birthDate.value || (user.birthDate ?? '').slice(0, 10),
      });
    });

    // Présélection depuis ?discipline= / ?tarif=
    effect(() => {
      const slug = this.discipline();
      const found = this.disciplines.data()?.find((d) => d.slug === slug);
      if (found && !this.form.controls.pratique.controls.discipline.value) {
        this.form.controls.pratique.controls.discipline.setValue(found.id);
      }
    });
    effect(() => {
      const id = Number(this.tarif());
      if (id && this.pricing.data()?.some((p) => p.id === id) && !this.form.controls.pratique.controls.pricing.value) {
        this.form.controls.pratique.controls.pricing.setValue(id);
      }
    });
  }

  ngOnInit(): void {
    this.disciplines.run(() => this.club.getDisciplines());
    this.pricing.run(() => this.club.getPricing());
  }

  protected fieldError(group: StepId, field: string): string | null {
    const server = this.serverErrors()[field];
    if (server) return server;
    const control = this.groupOf(group).get(field);
    if (!control || !control.touched || control.valid) return null;
    switch (field) {
      case 'email':
        return 'Saisissez une adresse email valide.';
      case 'phone':
        return 'Saisissez un numéro de téléphone valide.';
      case 'birthDate':
        return 'Indiquez une date de naissance valide.';
      case 'discipline':
        return 'Choisissez une discipline.';
      case 'legalGuardian':
        return 'Indiquez le nom et le prénom du responsable légal.';
      case 'consent':
        return 'Votre accord est nécessaire pour traiter votre inscription.';
      default:
        return 'Ce champ est obligatoire.';
    }
  }

  private stepValid(step: StepId): boolean {
    const group = this.groupOf(step);
    group.markAllAsTouched();
    if (step === 'identite') {
      const birth = group.get('birthDate');
      if (birth && birth.value && !isPlausibleBirthDate(birth.value)) {
        birth.setErrors({ implausible: true });
      }
    }
    return group.valid;
  }

  protected next(): void {
    if (!this.stepValid(this.step())) {
      this.focusFirstError();
      return;
    }
    this.index.update((i) => Math.min(i + 1, this.steps().length - 1));
    this.scrollTop();
  }

  protected previous(): void {
    this.index.update((i) => Math.max(i - 1, 0));
    this.scrollTop();
  }

  protected goTo(i: number): void {
    if (i < this.index()) {
      this.index.set(i);
    }
  }

  protected submit(): void {
    this.serverErrors.set({});
    this.error.set(null);
    for (const [i, step] of this.steps().entries()) {
      if (!this.stepValid(step)) {
        this.index.set(i);
        this.focusFirstError();
        return;
      }
    }

    const v = this.form.getRawValue();
    const payload: MembershipPayload = {
      firstName: v.identite.firstName.trim(),
      lastName: v.identite.lastName.trim(),
      email: v.identite.email.trim(),
      phone: v.identite.phone.trim(),
      birthDate: v.identite.birthDate,
      discipline: Number(v.pratique.discipline),
      pricing: Number(v.pratique.pricing) || null,
      season: this.season,
      legalGuardian: this.minor() ? v.responsable.legalGuardian.trim() : null,
      medicalCertificate: v.validation.medicalCertificate,
      message: v.pratique.message.trim() || null,
      consent: v.validation.consent,
    };

    this.submitting.set(true);
    this.memberships.create(payload).subscribe({
      next: (res) => {
        this.submitting.set(false);
        this.done.set({ id: res.id, email: payload.email, firstName: payload.firstName });
        this.scrollTop();
      },
      error: (err: unknown) => {
        this.submitting.set(false);
        const violations = apiViolations(err);
        if (Object.keys(violations).length) {
          this.serverErrors.set(violations);
          const firstStep = this.steps().findIndex((s) => Object.keys(violations).some((f) => this.groupOf(s).get(f)));
          if (firstStep >= 0) this.index.set(firstStep);
          this.error.set('Certaines informations sont à corriger.');
          return;
        }
        this.error.set(apiErrorMessage(err, "L'inscription n'a pas pu être envoyée, réessayez."));
      },
    });
  }

  private groupOf(step: StepId): AbstractControl {
    return this.form.controls[step] as AbstractControl;
  }

  private focusFirstError(): void {
    setTimeout(() => document.querySelector<HTMLElement>('.wizard [aria-invalid="true"], .wizard .ng-invalid.ng-touched')?.focus());
  }

  private scrollTop(): void {
    setTimeout(() => document.getElementById('inscription-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }
}
