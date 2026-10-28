import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import User from '../models/user.models';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  // URL de base de l'API
  private apiUrl = environment.apiUrl;

  // Injection du service HttpClient
  constructor(private httpClient: HttpClient) {}

  // Méthode pour enregistrer un nouvel utilisateur
  register(userData: User): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/register`, userData);
  }
}
