import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import User from '../models/user.models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // URL de base de l'API
  // private apiUrl = 'http://localhost:8000/api';
  private apiUrl = 'https://localhost:8000/api';

  // Injection du service HttpClient
  constructor(private httpClient: HttpClient) {}

  // Récupération de la liste des users
  getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.apiUrl}/users`);
  }

  getUserByEmail(email: string): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrl}/users/email/${email}`);
  }

  // Récupérer un users par son ID
  getUserDetail(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrl}/users/${id}`);
  }

  // Mettre à jour un user existant
  updateUser(user: User): Observable<User> {
    return this.httpClient.put<User>(`${this.apiUrl}/users/${user.id}`, user);
  }

  // Supprimer un user par son ID
  deleteUser(id: number): Observable<User> {
    return this.httpClient.delete<User>(`${this.apiUrl}/users/${id}`);
  }
}
