import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { EstudiantesComponent } from './estudiantes/estudiantes.component';

export const routes: Routes = [
    { path: '', component: LoginComponent }, // Ruta principal (Login)
    { path: 'estudiantes', component: EstudiantesComponent }, // Vista de estudiantes
    { path: '**', redirectTo: '' } // Redirigir cualquier otra ruta al login
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }