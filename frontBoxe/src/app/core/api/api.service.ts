import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Erreur de validation renvoyée par Symfony (MapRequestPayload) */
export interface ApiViolation {
  propertyPath: string;
  title: string;
}

export type QueryParams = Record<string, string | number | boolean | null | undefined>;

/**
 * Point d'accès unique à l'API Symfony.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  readonly baseUrl = environment.apiUrl;

  get<T>(path: string, params?: QueryParams): Observable<T> {
    const clean = params ? compact(params) : null;
    return this.http.get<T>(this.url(path), { params: clean ? new HttpParams({ fromObject: clean }) : undefined });
  }

  post<T>(path: string, body: unknown = {}): Observable<T> {
    return this.http.post<T>(this.url(path), body);
  }

  patch<T>(path: string, body: unknown = {}): Observable<T> {
    return this.http.patch<T>(this.url(path), body);
  }

  /** Le corps est facultatif (ex. mot de passe de confirmation pour DELETE /me) */
  delete<T>(path: string, body?: unknown): Observable<T> {
    return this.http.delete<T>(this.url(path), body === undefined ? {} : { body });
  }

  /** Téléchargement d'un fichier (ex. export RGPD) */
  getBlob(path: string): Observable<Blob> {
    return this.http.get(this.url(path), { responseType: 'blob' });
  }

  isApiUrl(url: string): boolean {
    return url.startsWith(this.baseUrl);
  }

  /**
   * URL affichable d'une image renvoyée par l'API : absolue telle quelle,
   * `/uploads/...` préfixée par l'origine de l'API, `/img/...` (photos du front) inchangée.
   */
  mediaUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
    if (path.startsWith('/uploads/')) return `${this.baseUrl.replace(/\/api\/?$/, '')}${path}`;
    return path;
  }

  private url(path: string): string {
    return `${this.baseUrl}/${path.replace(/^\//, '')}`;
  }
}

/** Retire les paramètres vides de la query string */
export function compact(params: QueryParams): Record<string, string | number | boolean> {
  return Object.fromEntries(
    Object.entries(params).filter(
      (entry): entry is [string, string | number | boolean] => entry[1] !== null && entry[1] !== undefined && entry[1] !== '',
    ),
  );
}

/** Message lisible à partir d'une erreur HTTP de l'API */
export function apiErrorMessage(error: unknown, fallback = 'Une erreur est survenue, réessayez.'): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return 'Impossible de joindre le serveur. Vérifiez votre connexion.';
    }
    if (error.status === 429) {
      return error.error?.message ?? 'Trop de tentatives. Réessayez dans quelques minutes.';
    }
    return error.error?.message ?? error.error?.detail ?? fallback;
  }
  return fallback;
}

/** Erreurs de validation indexées par champ */
export function apiViolations(error: unknown): Record<string, string> {
  const violations: ApiViolation[] = error instanceof HttpErrorResponse ? (error.error?.violations ?? []) : [];
  return violations.reduce<Record<string, string>>((acc, v) => {
    acc[v.propertyPath] ??= v.title;
    return acc;
  }, {});
}
