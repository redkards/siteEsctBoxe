// src/app/services/palmares.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Palmares } from '../models/palmares.models';

@Injectable({
  providedIn: 'root',
})
export class PalmaresService {
  private apiUrl = 'http://localhost:8000/api/palmares'; // URL de l'API Symfony

  constructor(private http: HttpClient) {}

  getAllPalmares(): Observable<Palmares[]> {
    return this.http.get<Palmares[]>(`${this.apiUrl}/`);
  }

  getPalmaresById(id: number): Observable<Palmares> {
    return this.http.get<Palmares>(`${this.apiUrl}/${id}`);
  }

  createPalmares(palmares: Palmares): Observable<any> {
    return this.http.post(`${this.apiUrl}/new`, palmares);
  }

  updatePalmares(id: number, palmares: Palmares): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/edit`, palmares);
  }

  deletePalmares(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
