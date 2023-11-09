import { AuthService } from '../../service/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})  
export class RegistrarComponent {
  signupForm: FormGroup;
  constructor( private authService: AuthService) {
    this.signupForm = this.createFormGroup(); 
  }
  
  createFormGroup(): FormGroup {
    return new FormGroup({
      DNI_Docente: new FormControl("", [Validators.required, Validators.minLength(2)]),
      Apellidos: new FormControl("", [Validators.required, Validators.minLength(2)]),
      Nombres: new FormControl("", [Validators.required, Validators.minLength(2)]),
      Correo: new FormControl("", [Validators.required, Validators.email]),
      Pass: new FormControl("", [Validators.required, Validators.minLength(7)]),
    });
  }
  
  
  signup(): void {
    this.authService
    .signup(this.signupForm.value)
    .subscribe((msg)=> console.log(msg)) ; 
}

} 
