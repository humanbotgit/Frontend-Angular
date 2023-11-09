import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ingresar',
  templateUrl: './ingresar.component.html',
  styleUrls: ['./ingresar.component.css']
})
export class IngresarComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService,private router: Router) {
    this.loginForm = this.fb.group({
      Correo: ['', [Validators.required, Validators.email]],
      Pass: ['', Validators.required]
    });
  }

  login() {
    const { Correo, Pass } = this.loginForm.value;

    this.authService.login(Correo, Pass)
      .subscribe(
        (response: any) => {
          console.log('Respuesta de la API:', response);

          if (response.token) {
            console.log('Inicio de sesión exitoso');
            this.router.navigate(['/reserva']);
          } else {
            console.log('Inicio de sesión fallido');
          }
        },
        (error) => {
          console.error('Error al iniciar sesión:', error);
        }
      );
  }
  isInvalid(controlName: string, errorType: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!control && control.hasError(errorType) && (control.dirty || control.touched);
  }
}