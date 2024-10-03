import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Boxeur } from '../models/boxeur.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoxeurService {
  private apiUrl = 'http://localhost:8000/api/boxeurs'; // Remplacer par l'URL de l'API Symfony

  constructor(private http: HttpClient) {}

  // Récupérer tous les boxeurs
  getAllBoxeurs(): Observable<Boxeur[]> {
    return this.http.get<Boxeur[]>(`${this.apiUrl}/`);
  }

  // Récupérer un boxeur par ID
  getBoxeurById(id: number): Observable<Boxeur> {
    return this.http.get<Boxeur>(`${this.apiUrl}/${id}`);
  }

  // Créer un nouveau boxeur
  createBoxeur(boxeur: Boxeur): Observable<any> {
    return this.http.post(`${this.apiUrl}`, boxeur);
  }

  // Mettre à jour un boxeur existant
  updateBoxeur(id: number, boxeur: Boxeur): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/edit`, boxeur);
  }

  // Supprimer un boxeur
  deleteBoxeur(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
