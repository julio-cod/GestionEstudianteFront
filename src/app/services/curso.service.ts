import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Interfaz para los datos del curso
export interface Curso {
  idCurso: number;
  descripcion: string;
}

// Interfaz para la respuesta de la API
export interface ApiResponse<T> {
  operation: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private apiUrl = 'https://localhost:7190/api/cursos'; // Base URL de la API

  constructor(private http: HttpClient) {}

  // Método para obtener la lista de cursos desde el backend
  getCursos(): Observable<ApiResponse<Curso[]>> {
    return this.http.get<ApiResponse<Curso[]>>(`${this.apiUrl}/ListaDeCursos`);
  }
}