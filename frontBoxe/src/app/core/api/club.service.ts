import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { ApiService } from './api.service';
import { ClubInfo, Coach, Discipline, DisciplineDetail, Partner, Pricing, TrainingSlot, Venue } from './models';

/**
 * Contenus « vitrine » du club : infos, disciplines, coachs, salles, planning, tarifs, partenaires.
 * Les listes quasi statiques sont mises en cache pour la durée de la session.
 */
@Injectable({ providedIn: 'root' })
export class ClubService {
  private readonly api = inject(ApiService);
  private readonly cache = new Map<string, Observable<unknown>>();

  getClub(): Observable<ClubInfo> {
    return this.cached('club');
  }

  getDisciplines(): Observable<Discipline[]> {
    return this.cached('disciplines');
  }

  getDiscipline(slug: string): Observable<DisciplineDetail> {
    return this.api.get<DisciplineDetail>(`disciplines/${encodeURIComponent(slug)}`);
  }

  getCoaches(): Observable<Coach[]> {
    return this.cached('coaches');
  }

  getVenues(): Observable<Venue[]> {
    return this.cached('venues');
  }

  getPlanning(): Observable<TrainingSlot[]> {
    return this.cached('planning');
  }

  getPricing(): Observable<Pricing[]> {
    return this.cached('pricing');
  }

  getPartners(): Observable<Partner[]> {
    return this.cached('partners');
  }

  /** Une erreur n'est pas mise en cache : le prochain appel retente */
  private cached<T>(path: string): Observable<T> {
    let request = this.cache.get(path) as Observable<T> | undefined;
    if (!request) {
      request = this.api.get<T>(path).pipe(shareReplay({ bufferSize: 1, refCount: false }));
      this.cache.set(path, request);
      request.subscribe({ error: () => this.cache.delete(path) });
    }
    return request;
  }
}
