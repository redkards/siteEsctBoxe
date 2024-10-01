import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import News from '../models/news.models';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiUrl = 'http://localhost:8000/api'; // URL de l'API Symfony

  constructor(private http: HttpClient) {}

  // Récupérer la liste complète des actualités
  getNews(): Observable<News[]> {
    return this.http.get<News[]>(`${this.apiUrl}/news`);
  }

  // Récupérer les détails d'une actualité spécifique
  getNewsDetail(id: number): Observable<News> {
    return this.http.get<News>(`${this.apiUrl}/news/${id}`);
  }

  // Créer une nouvelle actualité
  createNews(news: News): Observable<News> {
    return this.http.post<News>(`${this.apiUrl}/news/new`, news);
  }

  // Mettre à jour une actualité existante
  updateNews(id: number, news: News): Observable<News> {
    return this.http.put<News>(`${this.apiUrl}/news/${id}/edit`, news);
  }

  // Supprimer une actualité
  deleteNews(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/news/${id}`);
  }
}
