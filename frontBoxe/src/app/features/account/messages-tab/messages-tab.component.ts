import { Component, ElementRef, OnInit, computed, inject, signal, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { apiErrorMessage, apiViolations } from '../../../core/api/api.service';
import { MessageService } from '../../../core/api/message.service';
import { MemberMessage, Paginated, PersonRef } from '../../../core/api/models';
import { AuthService } from '../../../core/auth/auth.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { EmptyStateComponent, LoadErrorComponent } from '../../../shared/components/state/state.component';
import { createLoader } from '../../../shared/utils/loader';
import { fullName } from '../../../shared/utils/format.utils';

export const MESSAGES_PER_PAGE = 10;
export const SUBJECT_MAX = 150;
export const BODY_MAX = 5000;

export const CLUB_LABEL = 'Le club';

/** Nom affiché d'un correspondant : `null` désigne le club */
export function correspondentName(person: PersonRef | null): string {
  return person ? fullName(person) || 'Membre' : CLUB_LABEL;
}

/**
 * Onglet « Messagerie » : échanges entre le membre et le club.
 * GET /api/me/messages (reçus + envoyés, paginé) · POST /api/me/messages · POST /api/me/messages/{id}/read
 */
@Component({
  selector: 'app-messages-tab',
  imports: [DatePipe, ReactiveFormsModule, PaginationComponent, EmptyStateComponent, LoadErrorComponent],
  templateUrl: './messages-tab.component.html',
  styleUrls: ['../account-tab.scss', './messages-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class MessagesTabComponent implements OnInit {
  private readonly messages = inject(MessageService);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly subjectMax = SUBJECT_MAX;
  protected readonly bodyMax = BODY_MAX;

  protected readonly list = createLoader<Paginated<MemberMessage>>();
  protected readonly page = signal(1);
  /** Message déplié */
  protected readonly openId = signal<number | null>(null);

  protected readonly composing = signal(false);
  protected readonly sending = signal(false);
  protected readonly sendError = signal<string | null>(null);
  protected readonly sendErrors = signal<Record<string, string>>({});
  protected readonly notice = signal<string | null>(null);

  protected readonly form = this.fb.group({
    subject: ['', [Validators.required, Validators.maxLength(SUBJECT_MAX)]],
    body: ['', [Validators.required, Validators.maxLength(BODY_MAX)]],
  });
  protected readonly bodyLength = toSignal(this.form.controls.body.valueChanges.pipe(map((v) => v.length)), { initialValue: 0 });

  /** Non lus sur la page affichée */
  protected readonly unreadCount = computed(() => (this.list.data()?.items ?? []).filter((m) => this.isUnread(m)).length);

  private readonly subjectInput = viewChild<ElementRef<HTMLInputElement>>('subjectInput');
  private readonly composeButton = viewChild<ElementRef<HTMLButtonElement>>('composeButton');

  ngOnInit(): void {
    this.load(1);
  }

  protected load(page: number): void {
    this.page.set(page);
    this.openId.set(null);
    this.list.run(() => this.messages.list(page, MESSAGES_PER_PAGE));
  }

  /** Reçu = envoyé par le club (sender null) ou adressé au membre connecté */
  protected isReceived(message: MemberMessage): boolean {
    if (message.sender === null) return true;
    if (message.recipient === null) return false;
    const me = this.auth.user()?.id;
    return message.recipient.id !== undefined && message.recipient.id === me;
  }

  protected isUnread(message: MemberMessage): boolean {
    return this.isReceived(message) && !message.readAt;
  }

  protected correspondent(message: MemberMessage): string {
    return this.isReceived(message) ? correspondentName(message.sender) : correspondentName(message.recipient);
  }

  protected toggle(message: MemberMessage): void {
    if (this.openId() === message.id) {
      this.openId.set(null);
      return;
    }
    this.openId.set(message.id);
    if (this.isUnread(message)) {
      this.messages.markRead(message.id).subscribe({
        next: () => this.patch(message.id, { readAt: new Date().toISOString() }),
        // Échec silencieux : le message reste « non lu » et sera re-marqué à la prochaine ouverture
        error: () => undefined,
      });
    }
  }

  protected openCompose(prefillSubject = ''): void {
    this.notice.set(null);
    this.sendError.set(null);
    this.sendErrors.set({});
    if (prefillSubject) {
      this.form.controls.subject.setValue(prefillSubject.slice(0, SUBJECT_MAX));
    }
    this.composing.set(true);
    queueMicrotask(() => this.subjectInput()?.nativeElement.focus());
  }

  protected reply(message: MemberMessage): void {
    this.openCompose(/^re\s*:/i.test(message.subject) ? message.subject : `Re : ${message.subject}`);
  }

  protected cancelCompose(): void {
    this.composing.set(false);
    this.form.reset();
    queueMicrotask(() => this.composeButton()?.nativeElement.focus());
  }

  protected fieldError(field: 'subject' | 'body'): string | null {
    const server = this.sendErrors()[field];
    if (server) return server;
    const control = this.form.controls[field];
    if (!control.touched || control.valid) return null;
    if (control.hasError('maxlength')) {
      return field === 'subject' ? `L'objet ne doit pas dépasser ${SUBJECT_MAX} caractères.` : `Le message ne doit pas dépasser ${BODY_MAX} caractères.`;
    }
    return field === 'subject' ? "Indiquez l'objet de votre message." : 'Écrivez votre message.';
  }

  protected send(): void {
    this.sendError.set(null);
    this.sendErrors.set({});
    const subject = this.form.controls.subject.value.trim();
    const body = this.form.controls.body.value.trim();
    if (!subject) this.form.controls.subject.setValue('');
    if (!body) this.form.controls.body.setValue('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.sending.set(true);
    this.messages.send(subject, body).subscribe({
      next: () => {
        this.sending.set(false);
        this.composing.set(false);
        this.form.reset();
        this.notice.set('Votre message a bien été envoyé au club. Un coach vous répondra ici.');
        this.load(1);
        queueMicrotask(() => this.composeButton()?.nativeElement.focus());
      },
      error: (err: unknown) => {
        this.sending.set(false);
        const violations = apiViolations(err);
        this.sendErrors.set(violations);
        this.sendError.set(Object.keys(violations).length ? null : apiErrorMessage(err, "L'envoi a échoué, réessayez."));
      },
    });
  }

  private patch(id: number, changes: Partial<MemberMessage>): void {
    this.list.data.update((data) =>
      data ? { ...data, items: data.items.map((m) => (m.id === id ? { ...m, ...changes } : m)) } : data,
    );
  }
}
