import { Injectable } from '@angular/core';
import { Categorie } from '../models/categorie.models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategorieService {
  private apiUrl = 'http://localhost:8000/api/categorie'; // URL de l'API Symfony

  constructor(private http: HttpClient) {}

  // Récupérer toutes les catégories
  getAllCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.apiUrl}/`);
  }

  // Récupérer une catégorie par ID
  getCategorieById(id: number): Observable<Categorie> {
    return this.http.get<Categorie>(`${this.apiUrl}/${id}`);
  }

  // Créer une nouvelle catégorie
  createCategorie(categorie: Categorie): Observable<any> {
    return this.http.post(`${this.apiUrl}/new`, categorie);
  }

  // Mettre à jour une catégorie existante
  updateCategorie(id: number, categorie: Categorie): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/edit`, categorie);
  }

  // Supprimer une catégorie
  deleteCategorie(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
