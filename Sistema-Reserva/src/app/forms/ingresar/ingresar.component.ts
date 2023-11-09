import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http'; // Importa HttpErrorResponse
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ingresar',
  templateUrl: './ingresar.component.html',
  styleUrls: ['./ingresar.component.css']
})
export class IngresarComponent {
  loginForm: FormGroup;
  showPassword: boolean = false;
  loading: boolean = false;
  loginFailed: boolean = false;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      Correo: ['', [Validators.required, Validators.email]],
      Pass: ['', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    const { Correo, Pass } = this.loginForm.value;

    this.loading = true;
    this.loginFailed = false; // Reiniciar en cada intento de inicio de sesión
    this.errorMessage = ''; // Reiniciar en cada intento de inicio de sesión

    this.authService.login(Correo, Pass)
      .subscribe(
        (response: any) => {
          console.log('Respuesta de la API:', response);

          if (response && response.token) {
            console.log('Inicio de sesión exitoso');
            this.router.navigate(['/reserva']);
          } else {
            console.log('Inicio de sesión fallido');
            this.loginFailed = true;

            // Mensaje de error específico en caso de credenciales incorrectas
            if (response && response.error) {
              this.errorMessage = response.error;
            }
          }
        },
        (error: HttpErrorResponse) => { // Proporciona un tipo explícito
          console.error('Error al iniciar sesión:', error);
          this.loginFailed = true;
          this.errorMessage = 'Error al iniciar sesión. Por favor, intenta nuevamente más tarde.';
        },
        () => {
          this.loading = false;
        }
      );
  }

  isInvalid(controlName: string, errorType: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!control && control.hasError(errorType) && (control.dirty || control.touched);
  }
}
