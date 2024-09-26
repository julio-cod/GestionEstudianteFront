import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

// Interfaz para la respuesta del API
export interface LoginResponse {
  operation: boolean;
  message: string;
  data: {
    idUsuario: number;
    usuario: string;
    token: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7190/api/Auth/Login'; // URL de la API para el login
  private tokenKey = 'auth_token'; 

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  // Método para hacer login y almacenar el token en una cookie
  login(usuario: string, clave: string): Observable<LoginResponse> {
    const loginData = { usuario, clave };

    return this.http.post<LoginResponse>(this.apiUrl, loginData).pipe(
      tap(response => {
        if (response.operation && response.data.token) {
          // Guardar el token en una cookie
          this.cookieService.set(this.tokenKey, response.data.token);
        }
      })
    );
  }

  // Obtener el token desde la cookie
  getToken(): string | null {
    return this.cookieService.get(this.tokenKey);
  }

  // Método para incluir el token en las cabeceras de peticiones
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Método para cerrar sesión
  logout(): void {
    this.cookieService.delete(this.tokenKey); // Eliminar el token de la cookie
  }
}