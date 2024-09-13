import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { Router } from '@angular/router';
import Login from '../interfaces/login';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'token'; // Clé pour stocker le token dans le localStorage

  // private apiUrl = 'https://localhost:8000/api';
  private apiUrl = 'http://localhost:8000/api';

  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn()); // BehaviorSubject pour suivre l'état de connexion

  // Injection des services HttpClient et Router dans le constructeur
  constructor(private httpClient: HttpClient, private router: Router) {}

  // Méthode pour vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey); // Vérifie la présence du token dans le localStorage
  }

  // Getter pour obtenir un Observable de l'état de connexion
  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable(); // Retourne l'Observable du BehaviorSubject
  }

  // Méthode pour créer un nouvel utilisateur
  register(userData: any): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/register`, userData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  // Méthode pour se connecter
  login(credentials: Login): Observable<{ token: string }> {
    return this.httpClient
      .post<{ token: string }>(`${this.apiUrl}/login_check`, credentials)
      .pipe(
        tap((response) => {
          localStorage.setItem(this.tokenKey, response.token); // Stocke le token dans le localStorage
          this.loggedIn.next(true); // Met à jour l'état de connexion
        })
      );
  }

  // Méthode pour se déconnecter
  logout(): void {
    localStorage.removeItem(this.tokenKey); // Supprime le token du localStorage
    this.loggedIn.next(false); // Met à jour l'état de connexion
    this.router.navigate(['/login']); // Redirige vers la page de login
  }

  // Méthode pour obtenir le rôle de l'utilisateur
  getRole(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Décode le payload du token
        return payload.roles ? payload.roles[0] : null; // Retourne le premier rôle trouvé
      } catch (e) {
        console.error('Invalid token format', e); // Log une erreur si le format du token est invalide
        return null;
      }
    }
    return null; // Retourne null si aucun token n'est trouvé
  }

  //méthode pour enregistrer le token dans local storage
  saveToken(token: string): void {
    localStorage.setItem('storageToken', token);
    this.router.navigate(['accueil']);
  }
  // Méthode pour recupérer le token dans le local storage
  getToken(): any {
    const token = localStorage.getItem('storageToken');

    return token;
  }

  // Méthode pour décoder le token et obtenir les informations de l'utilisateur
  decodeToken(): any {
    const Token = this.getToken();
    if (Token) {
      const decodedToken = jwtDecode(Token);
      return decodedToken;
    }

    return null;
  }
}
