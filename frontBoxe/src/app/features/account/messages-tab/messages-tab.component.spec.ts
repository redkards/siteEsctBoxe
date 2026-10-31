import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { signal } from '@angular/core';
import { Subject, of, throwError } from 'rxjs';
import { MessageService } from '../../../core/api/message.service';
import { MemberMessage, Paginated } from '../../../core/api/models';
import { AuthService } from '../../../core/auth/auth.service';
import { CurrentUser } from '../../../core/auth/auth.models';
import { MESSAGES_PER_PAGE, MessagesTabComponent, correspondentName } from './messages-tab.component';

const ME: CurrentUser = {
  id: 7,
  email: 'demo@esctboxe.local',
  firstName: 'Léa',
  lastName: 'Démo',
  phone: null,
  birthDate: null,
  roles: ['ROLE_USER'],
  createdAt: '2026-10-01T10:00:00+00:00',
};

const FROM_CLUB_UNREAD: MemberMessage = {
  id: 1,
  subject: 'Certificat médical',
  body: 'Bonjour Léa,\npensez à apporter votre certificat.',
  createdAt: '2026-10-20T18:00:00+00:00',
  readAt: null,
  sender: null,
  recipient: { id: 7, firstName: 'Léa', lastName: 'Démo' },
};

const SENT_TO_CLUB: MemberMessage = {
  id: 2,
  subject: 'Horaires du mercredi',
  body: 'Le cours enfants a-t-il lieu pendant les vacances ?',
  createdAt: '2026-10-18T09:30:00+00:00',
  readAt: null,
  sender: { id: 7, firstName: 'Léa', lastName: 'Démo' },
  recipient: null,
};

const FROM_COACH_READ: MemberMessage = {
  id: 3,
  subject: 'Re : Horaires du mercredi',
  body: 'Oui, le cours est maintenu.',
  createdAt: '2026-10-19T12:00:00+00:00',
  readAt: '2026-10-19T13:00:00+00:00',
  sender: { id: 2, firstName: 'Karim', lastName: 'Coach' },
  recipient: { id: 7, firstName: 'Léa', lastName: 'Démo' },
};

function page(items: MemberMessage[], current = 1, pages = 1): Paginated<MemberMessage> {
  return { items, page: current, limit: MESSAGES_PER_PAGE, total: items.length, pages };
}

describe('MessagesTabComponent', () => {
  let fixture: ComponentFixture<MessagesTabComponent>;
  let el: HTMLElement;
  let service: jasmine.SpyObj<MessageService>;

  const items = () => Array.from(el.querySelectorAll<HTMLLIElement>('.message'));
  const heads = () => Array.from(el.querySelectorAll<HTMLButtonElement>('.message__head'));
  const button = (label: string) =>
    Array.from(el.querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent?.trim().startsWith(label));

  function setup(initial: Paginated<MemberMessage> | HttpErrorResponse = page([FROM_CLUB_UNREAD, SENT_TO_CLUB, FROM_COACH_READ])): void {
    service = jasmine.createSpyObj<MessageService>('MessageService', ['list', 'send', 'markRead']);
    service.list.and.returnValue(initial instanceof HttpErrorResponse ? throwError(() => initial) : of(initial));
    service.markRead.and.returnValue(of({}));

    TestBed.configureTestingModule({
      imports: [MessagesTabComponent],
      providers: [
        { provide: MessageService, useValue: service },
        { provide: AuthService, useValue: { user: signal(ME).asReadonly() } },
      ],
    });
    fixture = TestBed.createComponent(MessagesTabComponent);
    el = fixture.nativeElement;
    fixture.detectChanges();
  }

  it('charge la première page de messages', () => {
    setup();
    expect(service.list).toHaveBeenCalledOnceWith(1, MESSAGES_PER_PAGE);
    expect(items().length).toBe(3);
  });

  it('affiche « Le club » quand sender ou recipient vaut null, et distingue reçus et envoyés', () => {
    setup();
    const [fromClub, sent, fromCoach] = items();
    expect(fromClub.querySelector('.message__who')?.textContent).toContain('Le club');
    expect(fromClub.querySelector('.message__who')?.textContent).toContain('Reçu de');
    expect(sent.querySelector('.message__who')?.textContent).toContain('Envoyé à');
    expect(sent.querySelector('.message__who')?.textContent).toContain('Le club');
    expect(fromCoach.querySelector('.message__who')?.textContent).toContain('Karim Coach');
    expect(correspondentName(null)).toBe('Le club');
  });

  it('signale uniquement les messages reçus non lus', () => {
    setup();
    const [fromClub, sent, fromCoach] = items();
    expect(fromClub.classList).toContain('message--unread');
    expect(sent.classList).not.toContain('message--unread');
    expect(fromCoach.classList).not.toContain('message--unread');
    expect(el.querySelector('.unread-count')?.textContent).toContain('1 non lu');
  });

  it('ouvre un message reçu non lu et le marque comme lu', () => {
    setup();
    heads()[0].click();
    fixture.detectChanges();

    expect(service.markRead).toHaveBeenCalledOnceWith(1);
    expect(heads()[0].getAttribute('aria-expanded')).toBe('true');
    expect(el.querySelector('#msg-body-1')?.textContent).toContain('pensez à apporter votre certificat');
    expect(items()[0].classList).not.toContain('message--unread');
    expect(el.querySelector('.unread-count')).toBeNull();
  });

  it("n'appelle pas markRead pour un message envoyé ou déjà lu", () => {
    setup();
    heads()[1].click();
    fixture.detectChanges();
    heads()[2].click();
    fixture.detectChanges();
    expect(service.markRead).not.toHaveBeenCalled();
  });

  it('referme un message déplié au second clic', () => {
    setup();
    heads()[2].click();
    fixture.detectChanges();
    heads()[2].click();
    fixture.detectChanges();
    expect(heads()[2].getAttribute('aria-expanded')).toBe('false');
    expect(el.querySelector('#msg-body-3')).toBeNull();
  });

  it('affiche un état vide sans message', () => {
    setup(page([]));
    expect(el.querySelector('.bx-empty')?.textContent).toContain('Aucun message');
  });

  it("affiche l'erreur de chargement et permet de réessayer", () => {
    setup(new HttpErrorResponse({ status: 500, error: { message: 'Serveur indisponible.' } }));
    expect(el.querySelector('[role="alert"]')?.textContent).toContain('Serveur indisponible.');

    service.list.and.returnValue(of(page([FROM_COACH_READ])));
    button('Réessayer')!.click();
    fixture.detectChanges();
    expect(service.list).toHaveBeenCalledTimes(2);
    expect(items().length).toBe(1);
  });

  it("affiche le squelette pendant le chargement", () => {
    service = jasmine.createSpyObj<MessageService>('MessageService', ['list', 'send', 'markRead']);
    const pending = new Subject<Paginated<MemberMessage>>();
    service.list.and.returnValue(pending);
    TestBed.configureTestingModule({
      imports: [MessagesTabComponent],
      providers: [
        { provide: MessageService, useValue: service },
        { provide: AuthService, useValue: { user: signal(ME).asReadonly() } },
      ],
    });
    fixture = TestBed.createComponent(MessagesTabComponent);
    el = fixture.nativeElement;
    fixture.detectChanges();
    expect(el.querySelector('[role="status"]')?.textContent).toContain('Chargement des messages');
  });

  it('change de page via la pagination', () => {
    setup(page([FROM_CLUB_UNREAD], 1, 3));
    service.list.and.returnValue(of(page([FROM_COACH_READ], 2, 3)));
    (el.querySelector('button[aria-label="Page 2"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(service.list).toHaveBeenCalledWith(2, MESSAGES_PER_PAGE);
    expect(items()[0].textContent).toContain('Re : Horaires du mercredi');
  });

  describe('envoi', () => {
    function compose(subject: string, body: string): void {
      button('Nouveau message')!.click();
      fixture.detectChanges();
      const subjectInput = el.querySelector<HTMLInputElement>('#msg-subject')!;
      const bodyInput = el.querySelector<HTMLTextAreaElement>('#msg-body')!;
      subjectInput.value = subject;
      subjectInput.dispatchEvent(new Event('input'));
      bodyInput.value = body;
      bodyInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    }

    function submit(): void {
      el.querySelector<HTMLFormElement>('.compose form')!.dispatchEvent(new Event('submit'));
      fixture.detectChanges();
    }

    it('envoie {subject, body} nettoyés puis recharge la page 1', () => {
      setup();
      service.send.and.returnValue(of({ ...SENT_TO_CLUB, id: 9 }));
      compose('  Licence  ', '  Où en est ma licence ?  ');
      submit();

      expect(service.send).toHaveBeenCalledOnceWith('Licence', 'Où en est ma licence ?');
      expect(service.list).toHaveBeenCalledTimes(2);
      expect(el.querySelector('.compose')).toBeNull();
      expect(el.querySelector('.bx-alert--success')?.textContent).toContain('bien été envoyé');
    });

    it("refuse l'envoi d'un message vide ou blanc", () => {
      setup();
      compose('   ', '');
      submit();
      expect(service.send).not.toHaveBeenCalled();
      expect(el.querySelector('#msg-subject')?.getAttribute('aria-invalid')).toBe('true');
      expect(el.textContent).toContain("Indiquez l'objet de votre message.");
      expect(el.textContent).toContain('Écrivez votre message.');
    });

    it("affiche les violations renvoyées par l'API", () => {
      setup();
      service.send.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: 422, error: { violations: [{ propertyPath: 'body', title: 'Message trop court.' }] } })),
      );
      compose('Question', 'ok');
      submit();
      expect(el.querySelector('#msg-body-help')?.textContent).toContain('Message trop court.');
      expect(el.querySelector('.compose')).not.toBeNull();
    });

    it("affiche l'erreur réseau sans fermer le formulaire", () => {
      setup();
      service.send.and.returnValue(throwError(() => new HttpErrorResponse({ status: 0 })));
      compose('Question', 'Bonjour');
      submit();
      expect(el.querySelector('.compose [role="alert"]')?.textContent).toContain('Impossible de joindre le serveur');
    });

    it('pré-remplit « Re : » en répondant à un message reçu', () => {
      setup();
      heads()[0].click();
      fixture.detectChanges();
      button('Répondre')!.click();
      fixture.detectChanges();
      expect(el.querySelector<HTMLInputElement>('#msg-subject')!.value).toBe('Re : Certificat médical');
    });
  });
});
