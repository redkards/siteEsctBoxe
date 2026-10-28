import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Messagerie from '../models/messagerie.models';

@Injectable({
  providedIn: 'root',
})
export class MessagerieService {
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  getMessageries(): Observable<Messagerie[]> {
    return this.httpClient.get<Messagerie[]>(`${this.apiUrl}/messagerie`);
  }

  getMessagerie(id: number): Observable<Messagerie> {
    return this.httpClient.get<Messagerie>(`${this.apiUrl}/messagerie/${id}`);
  }

  addMessagerie(messagerie: Messagerie): Observable<Messagerie> {
    return this.httpClient.post<Messagerie>(
      `${this.apiUrl}/messagerie`,
      messagerie
    );
  }

  updateMessagerie(messagerie: Messagerie): Observable<Messagerie> {
    return this.httpClient.put<Messagerie>(
      `${this.apiUrl}/messagerie/${messagerie.id}`,
      messagerie
    );
  }

  deleteMessagerie(id: number): Observable<Messagerie> {
    return this.httpClient.delete<Messagerie>(
      `${this.apiUrl}/messagerie/${id}`
    );
  }
}
