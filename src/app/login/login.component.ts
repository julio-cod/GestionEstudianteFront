import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Servicio de autenticación

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null; 

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router
  ) {
    // Crear el formulario con validación
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      clave: ['', Validators.required]
    });
  }

  onLogin() {
    // Verificar que el formulario sea válido
    if (this.loginForm.valid) {
      const { usuario, clave } = this.loginForm.value;

      // Llamar al servicio de autenticación
      this.authService.login(usuario, clave).subscribe({
        next: (response) => {
          if (response.operation) {
            // Redirigir a la vista de estudiantes si el login es exitoso
            this.router.navigate(['/estudiantes']);
          } else {
            // Mostrar mensaje de error si el login falla
            this.loginError = 'Usuario o clave incorrecta.';
          }
        },
        error: (err) => {
          // Manejo de errores
          console.error('Error en la autenticación', err);
          this.loginError = 'Error al intentar loguearse. Por favor, inténtelo de nuevo.';
        }
      });
    } else {
      this.loginError = 'Por favor complete todos los campos.'; 
    }
  }
}