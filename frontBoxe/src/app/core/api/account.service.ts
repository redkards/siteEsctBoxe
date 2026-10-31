import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from '../auth/auth.service';
import { CurrentUser, MessageResponse, ProfileUpdate } from '../auth/auth.models';

/**
 * Espace membre : profil, mot de passe et droits RGPD (export, suppression).
 */
@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  updateProfile(changes: ProfileUpdate): Observable<CurrentUser> {
    return this.api.patch<unknown>('me', changes).pipe(switchMap(() => this.auth.loadCurrentUser()));
  }

  /**
   * Le serveur révoque toutes les sessions : on se reconnecte aussitôt avec le nouveau mot de passe.
   */
  changePassword(currentPassword: string, newPassword: string): Observable<MessageResponse> {
    return this.api.post<MessageResponse>('me/password', { currentPassword, newPassword }).pipe(
      switchMap((res) => this.auth.login(this.auth.user()?.email ?? '', newPassword).pipe(map(() => res))),
    );
  }

  /** Droit d'accès / portabilité : télécharge le fichier JSON */
  downloadExport(): Observable<void> {
    return this.api.getBlob('me/export').pipe(
      map((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `esct-boxe-mes-donnees-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(url);
      }),
    );
  }

  /** Étape 1 : envoie l'email de confirmation */
  requestDeletion(password: string): Observable<MessageResponse> {
    return this.api.delete<MessageResponse>('me', { password });
  }

  /** Étape 2 : lien de l'email ; la session locale est fermée */
  confirmDeletion(token: string): Observable<MessageResponse> {
    return this.api
      .post<MessageResponse>('account-deletion/confirm', { token })
      .pipe(tap(() => this.auth.logout(false)));
  }
}
