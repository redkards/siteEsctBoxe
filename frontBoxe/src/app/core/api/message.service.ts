import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { MemberMessage, Paginated } from './models';

/** Messagerie interne membre ↔ club */
@Injectable({ providedIn: 'root' })
export class MessageService {
  private readonly api = inject(ApiService);

  list(page = 1, limit = 20): Observable<Paginated<MemberMessage>> {
    return this.api.get<Paginated<MemberMessage>>('me/messages', { page, limit });
  }

  /** Envoi d'un message au club */
  send(subject: string, body: string): Observable<MemberMessage> {
    return this.api.post<MemberMessage>('me/messages', { subject, body });
  }

  markRead(id: number): Observable<unknown> {
    return this.api.post<unknown>(`me/messages/${id}/read`);
  }
}
