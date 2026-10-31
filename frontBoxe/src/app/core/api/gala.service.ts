import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Gala, GalaDetail, GalaType, Paginated } from './models';

export interface GalaQuery {
  when?: 'upcoming' | 'past';
  type?: GalaType | null;
  page?: number;
  limit?: number;
}

/** Événements du club : galas, compétitions, stages, portes ouvertes */
@Injectable({ providedIn: 'root' })
export class GalaService {
  private readonly api = inject(ApiService);

  list(query: GalaQuery = {}): Observable<Paginated<Gala>> {
    return this.api.get<Paginated<Gala>>('galas', { when: 'upcoming', page: 1, limit: 9, ...query });
  }

  get(slug: string): Observable<GalaDetail> {
    return this.api.get<GalaDetail>(`galas/${encodeURIComponent(slug)}`);
  }
}
