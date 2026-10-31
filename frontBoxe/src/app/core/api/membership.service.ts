import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ContactPayload, Membership, MembershipCreated, MembershipPayload } from './models';

/** Inscriptions au club (adhésions) et formulaire de contact */
@Injectable({ providedIn: 'root' })
export class MembershipService {
  private readonly api = inject(ApiService);

  /** Public ou connecté (le JWT est joint s'il existe : l'inscription est rattachée au compte) */
  create(payload: MembershipPayload): Observable<MembershipCreated> {
    return this.api.post<MembershipCreated>('memberships', payload);
  }

  mine(): Observable<Membership[]> {
    return this.api.get<Membership[]>('me/memberships');
  }

  contact(payload: ContactPayload): Observable<unknown> {
    return this.api.post<unknown>('contact', payload);
  }
}
