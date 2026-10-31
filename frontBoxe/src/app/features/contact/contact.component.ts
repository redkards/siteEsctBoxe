import { Component, OnInit, computed, effect, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { apiErrorMessage, apiViolations } from '../../core/api/api.service';
import { ClubService } from '../../core/api/club.service';
import { MembershipService } from '../../core/api/membership.service';
import { ClubInfo, Venue } from '../../core/api/models';
import { AuthService } from '../../core/auth/auth.service';
import { openingLines, osmEmbed, osmLink } from '../../shared/utils/format.utils';
import { createLoader } from '../../shared/utils/loader';

type Field = 'name' | 'email' | 'subject' | 'message';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ContactComponent implements OnInit {
  private readonly api = inject(ClubService);
  private readonly memberships = inject(MembershipService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly auth = inject(AuthService);

  protected readonly club = createLoader<ClubInfo>();
  protected readonly venues = createLoader<Venue[]>();
  protected readonly hours = computed(() => openingLines(this.club.data()?.openingHours));
  protected readonly mainVenue = computed(() => this.venues.data()?.find((v) => v.latitude !== null && v.longitude !== null) ?? null);
  protected readonly map = computed<SafeResourceUrl | null>(() => {
    const v = this.mainVenue();
    return v ? this.sanitizer.bypassSecurityTrustResourceUrl(osmEmbed(Number(v.latitude), Number(v.longitude))) : null;
  });
  protected readonly mapLink = computed(() => {
    const v = this.mainVenue();
    return v ? osmLink(v.latitude, v.longitude) : osmLink(null, null, this.club.data()?.address ?? 'Tergnier');
  });

  protected readonly subjects = ["Séance d'essai", 'Inscription', 'Compétition / gala', 'Partenariat', 'Autre'];

  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email]],
    subject: [this.subjects[0], [Validators.required, Validators.maxLength(150)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(3000)]],
  });
  protected readonly sending = signal(false);
  protected readonly sent = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly serverErrors = signal<Partial<Record<Field, string>>>({});

  constructor() {
    effect(() => {
      const user = this.auth.user();
      if (user && !this.form.controls.email.value) {
        this.form.patchValue({ name: `${user.firstName} ${user.lastName}`.trim(), email: user.email });
      }
    });
  }

  ngOnInit(): void {
    this.club.run(() => this.api.getClub());
    this.venues.run(() => this.api.getVenues());
  }

  protected fieldError(field: Field): string | null {
    const server = this.serverErrors()[field];
    if (server) return server;
    const c = this.form.controls[field];
    if (!c.touched || c.valid) return null;
    return {
      name: 'Indiquez votre nom.',
      email: 'Saisissez une adresse email valide.',
      subject: 'Choisissez un sujet.',
      message: 'Votre message doit contenir au moins 10 caractères.',
    }[field];
  }

  protected tel(phone: string): string {
    return `tel:${phone.replace(/[^\d+]/g, '')}`;
  }

  protected submit(): void {
    this.serverErrors.set({});
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.sending.set(true);
    this.error.set(null);
    const v = this.form.getRawValue();
    this.memberships.contact({ name: v.name.trim(), email: v.email.trim(), subject: v.subject, message: v.message.trim() }).subscribe({
      next: () => {
        this.sending.set(false);
        this.sent.set(true);
        this.form.reset();
      },
      error: (err: unknown) => {
        this.sending.set(false);
        const violations = apiViolations(err);
        if (Object.keys(violations).length) {
          this.serverErrors.set(violations);
          return;
        }
        this.error.set(apiErrorMessage(err, "Le message n'a pas pu être envoyé, réessayez."));
      },
    });
  }
}
