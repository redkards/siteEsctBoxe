import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { AccountService } from '../../../core/api/account.service';
import { AuthService } from '../../../core/auth/auth.service';
import { CurrentUser } from '../../../core/auth/auth.models';
import { ProfileTabComponent, toDateInput } from './profile-tab.component';

const ME: CurrentUser = {
  id: 7,
  email: 'demo@esctboxe.local',
  firstName: 'Léa',
  lastName: 'Démo',
  phone: '06 12 34 56 78',
  birthDate: '2000-05-12T00:00:00+00:00',
  roles: ['ROLE_USER'],
  createdAt: '2026-10-01T10:00:00+00:00',
};

describe('ProfileTabComponent', () => {
  let fixture: ComponentFixture<ProfileTabComponent>;
  let el: HTMLElement;
  let account: jasmine.SpyObj<AccountService>;

  const input = (id: string) => el.querySelector<HTMLInputElement>(`#${id}`)!;
  const type = (id: string, value: string) => {
    const field = input(id);
    field.value = value;
    field.dispatchEvent(new Event('input'));
    field.dispatchEvent(new Event('blur'));
  };
  const submit = (formLabel: string) => {
    el.querySelector<HTMLFormElement>(`form[aria-labelledby="${formLabel}"]`)!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  };

  beforeEach(() => {
    account = jasmine.createSpyObj<AccountService>('AccountService', ['updateProfile', 'changePassword']);
    TestBed.configureTestingModule({
      imports: [ProfileTabComponent],
      providers: [
        { provide: AccountService, useValue: account },
        { provide: AuthService, useValue: { user: signal(ME).asReadonly() } },
      ],
    });
    fixture = TestBed.createComponent(ProfileTabComponent);
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it("pré-remplit le formulaire avec l'utilisateur connecté", () => {
    expect(input('p-firstName').value).toBe('Léa');
    expect(input('p-lastName').value).toBe('Démo');
    expect(input('p-phone').value).toBe('06 12 34 56 78');
    expect(input('p-birthDate').value).toBe('2000-05-12');
    expect(el.textContent).toContain('demo@esctboxe.local');
  });

  it('chaque champ a un label associé', () => {
    for (const id of ['p-firstName', 'p-lastName', 'p-phone', 'p-birthDate', 'p-currentPassword', 'p-newPassword']) {
      expect(el.querySelector(`label[for="${id}"]`)).withContext(id).not.toBeNull();
    }
  });

  describe('profil', () => {
    it('envoie firstName, lastName, phone, birthDate nettoyés (vide → null)', () => {
      account.updateProfile.and.returnValue(of(ME));
      type('p-firstName', '  Léa-Marie ');
      type('p-phone', '   ');
      type('p-birthDate', '');
      submit('profile-title');

      expect(account.updateProfile).toHaveBeenCalledOnceWith({
        firstName: 'Léa-Marie',
        lastName: 'Démo',
        phone: null,
        birthDate: null,
      });
      expect(el.querySelector('.bx-alert--success')?.textContent).toContain('enregistrées');
    });

    it("bloque l'envoi si le prénom est vide", () => {
      type('p-firstName', '');
      submit('profile-title');
      fixture.detectChanges();
      expect(account.updateProfile).not.toHaveBeenCalled();
      expect(input('p-firstName').getAttribute('aria-invalid')).toBe('true');
      expect(el.querySelector('#p-firstName-error')?.textContent).toContain('Le prénom est obligatoire.');
    });

    it('refuse un téléphone invalide et une date de naissance future', () => {
      type('p-phone', 'abc');
      type('p-birthDate', '2999-01-01');
      submit('profile-title');
      fixture.detectChanges();
      expect(account.updateProfile).not.toHaveBeenCalled();
      expect(el.querySelector('#p-phone-error')).not.toBeNull();
      expect(el.querySelector('#p-birthDate-error')).not.toBeNull();
    });

    it("affiche les violations de l'API sur les champs", () => {
      account.updateProfile.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: 422, error: { violations: [{ propertyPath: 'lastName', title: 'Nom trop long.' }] } })),
      );
      submit('profile-title');
      expect(el.querySelector('#p-lastName-error')?.textContent).toContain('Nom trop long.');
      expect(el.querySelector('.bx-alert--error')?.textContent).toContain('Certains champs sont à corriger.');
    });

    it("affiche le message d'erreur générique de l'API", () => {
      account.updateProfile.and.returnValue(throwError(() => new HttpErrorResponse({ status: 500, error: { message: 'Oups.' } })));
      submit('profile-title');
      expect(el.querySelector('[role="alert"]')?.textContent).toContain('Oups.');
    });
  });

  describe('mot de passe', () => {
    it('change le mot de passe et vide le formulaire', () => {
      account.changePassword.and.returnValue(of({ message: 'Mot de passe modifié.' }));
      type('p-currentPassword', 'Ancien123!');
      type('p-newPassword', 'Nouveau123!');
      submit('password-title');

      expect(account.changePassword).toHaveBeenCalledOnceWith('Ancien123!', 'Nouveau123!');
      expect(input('p-currentPassword').value).toBe('');
      expect(el.querySelector('.bx-alert--success')?.textContent).toContain('Mot de passe modifié.');
    });

    it('refuse un nouveau mot de passe trop court', () => {
      type('p-currentPassword', 'Ancien123!');
      type('p-newPassword', 'court');
      submit('password-title');
      expect(account.changePassword).not.toHaveBeenCalled();
      expect(el.querySelector('#p-newPassword-help')?.textContent).toContain('Au moins 8 caractères.');
    });

    it("refuse un nouveau mot de passe identique à l'actuel", () => {
      type('p-currentPassword', 'Meme1234!');
      type('p-newPassword', 'Meme1234!');
      submit('password-title');
      expect(account.changePassword).not.toHaveBeenCalled();
      expect(el.querySelector('#p-newPassword-help')?.textContent).toContain('différent');
    });

    it('affiche une erreur de mot de passe actuel incorrect', () => {
      account.changePassword.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: 422, error: { violations: [{ propertyPath: 'currentPassword', title: 'Mot de passe incorrect.' }] } })),
      );
      type('p-currentPassword', 'Faux1234!');
      type('p-newPassword', 'Nouveau123!');
      submit('password-title');
      expect(el.querySelector('#p-currentPassword-error')?.textContent).toContain('Mot de passe incorrect.');
    });
  });

  it('toDateInput tronque une date ISO', () => {
    expect(toDateInput('2000-05-12T00:00:00+00:00')).toBe('2000-05-12');
    expect(toDateInput(null)).toBe('');
  });
});
