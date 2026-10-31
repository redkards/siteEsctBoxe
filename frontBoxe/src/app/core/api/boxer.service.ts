import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Boxer, BoxerLevel, BoxerSummary, Paginated, Sex } from './models';

export interface BoxerQuery {
  discipline?: string | null;
  level?: BoxerLevel | null;
  sex?: Sex | null;
  q?: string | null;
  page?: number;
  limit?: number;
}

/** Boxeurs actifs et palmarès */
@Injectable({ providedIn: 'root' })
export class BoxerService {
  private readonly api = inject(ApiService);

  list(query: BoxerQuery = {}): Observable<Paginated<BoxerSummary>> {
    return this.api.get<Paginated<BoxerSummary>>('boxers', { page: 1, limit: 12, ...query });
  }

  featured(): Observable<BoxerSummary[]> {
    return this.api.get<BoxerSummary[]>('boxers/featured');
  }

  get(slug: string): Observable<Boxer> {
    return this.api.get<Boxer>(`boxers/${encodeURIComponent(slug)}`);
  }
}
