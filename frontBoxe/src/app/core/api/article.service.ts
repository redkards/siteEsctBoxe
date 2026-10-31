import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Article, ArticleCategory, ArticleComment, ArticleSummary, Paginated } from './models';

export interface ArticleQuery {
  page?: number;
  limit?: number;
  category?: ArticleCategory | null;
}

/** Actualités du club */
@Injectable({ providedIn: 'root' })
export class ArticleService {
  private readonly api = inject(ApiService);

  list(query: ArticleQuery = {}): Observable<Paginated<ArticleSummary>> {
    return this.api.get<Paginated<ArticleSummary>>('articles', { page: 1, limit: 9, ...query });
  }

  get(slug: string): Observable<Article> {
    return this.api.get<Article>(`articles/${encodeURIComponent(slug)}`);
  }

  /** Commentaires publiés (tableau, ou page paginée selon l'API) */
  comments(slug: string): Observable<ArticleComment[] | Paginated<ArticleComment>> {
    return this.api.get<ArticleComment[] | Paginated<ArticleComment>>(`articles/${encodeURIComponent(slug)}/comments`);
  }

  /** Membre connecté ; le commentaire est publié après modération (statut en_attente) */
  addComment(slug: string, body: string): Observable<ArticleComment> {
    return this.api.post<ArticleComment>(`articles/${encodeURIComponent(slug)}/comments`, { body });
  }
}
