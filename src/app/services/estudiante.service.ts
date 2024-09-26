import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

// Definir la interfaz para los datos de estudiante
export interface Estudiante {
  idEstudiante?: number; 
  nombre: string;
  apellido: string;
  edad: number;
  fechaNacimiento: string; 
  idCurso: number;
  direccion: string;
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
export class EstudianteService {
  private apiBaseUrl = 'https://localhost:7190/api/Estudiantes'; // Base URL de la API

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  // Crear los headers con el token obtenido de la cookie
  private createHeaders(): HttpHeaders {
    const token = this.cookieService.get('auth_token'); // Nombre de la cookie que contiene el token
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Obtener la lista de estudiantes
  getEstudiantes(): Observable<ApiResponse<Estudiante[]>> {
    const headers = this.createHeaders();
    return this.http.get<ApiResponse<Estudiante[]>>(`${this.apiBaseUrl}/ListaDeEstudiantes`, { headers });
  }

  // Registrar un nuevo estudiante
  registerEstudiante(estudiante: Omit<Estudiante, 'idEstudiante'>): Observable<ApiResponse<Estudiante>> {
    const headers = this.createHeaders();
    return this.http.post<ApiResponse<Estudiante>>(`${this.apiBaseUrl}/RegistrarEstudiante`, estudiante, { headers });
  }

  // Eliminar un estudiante
  deleteEstudiante(idEstudiante: number): Observable<ApiResponse<null>> {
    const headers = this.createHeaders();
    return this.http.post<ApiResponse<null>>(`${this.apiBaseUrl}/EliminarEstudiante`, { idEstudiante }, { headers });
  }

  // Actualizar un estudiante
  updateEstudiante(estudiante: Estudiante): Observable<ApiResponse<Estudiante>> {
    const headers = this.createHeaders();
    return this.http.post<ApiResponse<Estudiante>>(`${this.apiBaseUrl}/EditarEstudiante`, estudiante, { headers });
  }
}