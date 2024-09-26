import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CursoService } from '../services/curso.service';
import { EstudianteService } from '../services/estudiante.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.css'],
  imports: [CommonModule, ReactiveFormsModule] 
})
export class EstudiantesComponent implements OnInit {
  estudianteForm: FormGroup;
  cursos: any[] = [];
  estudiantes: any[] = [];
  selectedEstudianteId: number | null = null; 
  mensaje: string | null = null; 

  constructor(
    private fb: FormBuilder,
    private estudianteService: EstudianteService,
    private cursoService: CursoService,
    private authService: AuthService,
    private router: Router
  ) {
    this.estudianteForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(1)]],
      fechaNacimiento: ['', Validators.required],
      idCurso: ['', Validators.required],
      direccion: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.cursoService.getCursos().subscribe(response => {
      if (response.operation) {  // Verificamos si la operación fue exitosa
        this.cursos = response.data;  // Asignamos la lista de cursos
      } else {
        
        console.error('Error al obtener los cursos:', response.message);
      }
    }, error => {
      console.error('Error en la solicitud de cursos:', error);
    });
    this.loadEstudiantes();
  }

  loadEstudiantes() {
    this.estudianteService.getEstudiantes().subscribe(response => {
      this.estudiantes = response.data; 
    });
  }

  onSubmit() {
    if (this.estudianteForm.valid) {
      const estudiante = { ...this.estudianteForm.value };
  
      if (this.selectedEstudianteId) {
        // Si hay un estudiante seleccionado, realizar una actualización
        estudiante.idEstudiante = this.selectedEstudianteId; 
        this.estudianteService.updateEstudiante(estudiante)
          .subscribe(() => {
            this.loadEstudiantes(); // Recargar la lista después de editar
            this.resetForm();
          });
      } else {
        // Si no hay un estudiante seleccionado, registrar uno nuevo
        this.estudianteService.registerEstudiante(estudiante).subscribe(() => {
          this.loadEstudiantes(); // Recargar la lista después de agregar un estudiante
          this.resetForm();
        });
      }
    }
  }

  editEstudiante(idEstudiante: number): void {
    const estudiante = this.estudiantes.find(e => e.idEstudiante === idEstudiante);
    if (estudiante) {
      const formattedFechaNacimiento = this.formatDate(estudiante.fechaNacimiento);  // Formatear la fecha
      this.estudianteForm.setValue({
        nombre: estudiante.nombre,
        apellido: estudiante.apellido,
        edad: estudiante.edad,
        fechaNacimiento: formattedFechaNacimiento, // Asignar la fecha formateada
        idCurso: estudiante.idCurso,
        direccion: estudiante.direccion
      });
      this.selectedEstudianteId = idEstudiante;
    }
  }
  
  // Método para formatear la fecha en 'yyyy-MM-dd'
  formatDate(fecha: string): string {
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Añadir cero si es necesario
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  deleteEstudiante(id: number) {
    if (confirm('¿Estás seguro de que deseas borrar este estudiante?')) {
      this.estudianteService.deleteEstudiante(id).subscribe(() => {
        this.loadEstudiantes(); 
        this.mensaje = 'Estudiante borrado correctamente!';
      });
    }
  }

  resetForm() {
    this.estudianteForm.reset();
    this.selectedEstudianteId = null; 
    this.mensaje = null; // Limpiar el mensaje al resetear el formulario
  }

  getCursoDescripcion(idCurso: number): string {
    const curso = this.cursos.find(c => c.idCurso === idCurso);
    return curso ? curso.descripcion : 'Sin curso';
  }

  // Llamar al método de cerrar sesión
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
