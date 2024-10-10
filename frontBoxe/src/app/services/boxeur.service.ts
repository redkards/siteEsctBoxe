import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Boxeur } from '../models/boxeur.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoxeurService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Récupérer tous les boxeurs
  getAllBoxeurs(): Observable<Boxeur[]> {
    return this.http.get<Boxeur[]>(`${this.apiUrl}/boxeurs`);
  }

  // Récupérer un boxeur par ID
  getBoxeurById(id: number): Observable<Boxeur> {
    return this.http.get<Boxeur>(`${this.apiUrl}/boxeurs/${id}`);
  }

  // Créer un nouveau boxeur
  createBoxeur(boxeur: Boxeur): Observable<any> {
    return this.http.post(`${this.apiUrl}/boxeurs`, boxeur);
  }

  // Mettre à jour un boxeur existant
  updateBoxeur(id: number, boxeur: Boxeur): Observable<any> {
    return this.http.put(`${this.apiUrl}/boxeurs/${id}`, boxeur);
  }

  // Supprimer un boxeur
  deleteBoxeur(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/boxeurs/${id}`);
  }
}
