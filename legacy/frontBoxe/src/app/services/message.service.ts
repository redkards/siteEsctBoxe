import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Message from '../models/message.models';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  getAllMessages(): Observable<Message[]> {
    return this.httpClient.get<Message[]>(`${this.apiUrl}/messages`);
  }

  getMessage(id: number): Observable<Message> {
    return this.httpClient.get<Message>(`${this.apiUrl}/messages/${id}`);
  }

  createMessage(message: Message): Observable<Message> {
    return this.httpClient.post<Message>(`${this.apiUrl}/messages`, message);
  }

  updateMessage(id: number, message: Message): Observable<Message> {
    return this.httpClient.put<Message>(
      `${this.apiUrl}/messages/${id}`,
      message
    );
  }

  deleteMessage(id: number): Observable<Message> {
    return this.httpClient.delete<Message>(`${this.apiUrl}/messages/${id}`);
  }
}
