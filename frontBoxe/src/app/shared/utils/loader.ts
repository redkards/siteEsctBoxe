import { DestroyRef, inject, signal } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { apiErrorMessage } from '../../core/api/api.service';

/**
 * État de chargement d'une donnée de l'API (données, chargement, erreur) sous forme de signals.
 * Un nouvel appel à `run` annule le précédent (filtres, pagination).
 */
export class Loader<T> {
  readonly data = signal<T | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  /** Vrai si la ressource n'existe pas (404) */
  readonly notFound = signal(false);
  private sub: Subscription | null = null;
  private last: (() => Observable<T>) | null = null;

  run(source: () => Observable<T>): void {
    this.last = source;
    this.sub?.unsubscribe();
    this.loading.set(true);
    this.error.set(null);
    this.notFound.set(false);
    this.sub = source().subscribe({
      next: (value) => {
        this.data.set(value);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.notFound.set(err instanceof HttpErrorResponse && err.status === 404);
        this.error.set(apiErrorMessage(err, 'Le contenu n’a pas pu être chargé.'));
      },
    });
  }

  retry(): void {
    if (this.last) this.run(this.last);
  }

  destroy(): void {
    this.sub?.unsubscribe();
  }
}

/** Crée un Loader lié au cycle de vie du composant (à appeler dans un contexte d'injection) */
export function createLoader<T>(): Loader<T> {
  const loader = new Loader<T>();
  inject(DestroyRef).onDestroy(() => loader.destroy());
  return loader;
}
