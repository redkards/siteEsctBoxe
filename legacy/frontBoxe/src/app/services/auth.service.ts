import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';
import Login from '../interfaces/login';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { TOKEN_KEY } from '../core/auth.interceptor';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(private httpClient: HttpClient, private router: Router) {}

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  // Connecté = token présent et non expiré
  isLoggedIn(): boolean {
    const payload = this.decodeToken();
    if (!payload) return false;
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem(TOKEN_KEY);
      return false;
    }
    return true;
  }

  register(userData: unknown): Observable<unknown> {
    return this.httpClient.post(`${this.apiUrl}/register`, userData);
  }

  // Symfony attend { email, password } (security.yaml : username_path: email)
  login(credentials: Login): Observable<{ token: string }> {
    return this.httpClient
      .post<{ token: string }>(`${this.apiUrl}/login_check`, {
        email: credentials.username,
        password: credentials.password,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem(TOKEN_KEY, response.token);
          this.loggedIn.next(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getUserId(): number | null {
    return this.decodeToken()?.id ?? null;
  }

  getRole(): string | null {
    return this.decodeToken()?.roles?.[0] ?? null;
  }

  hasRole(role: string): boolean {
    return this.isLoggedIn() && !!this.decodeToken()?.roles?.includes(role);
  }

  decodeToken(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  }
}
