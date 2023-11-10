import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private authService: AuthService) {}

  // Método para cerrar sesión
  logout() {
    this.authService.logout();
  }

  // Método para verificar si el usuario está autenticado
  isUserLoggedIn(): boolean {
    return this.authService.isUserLoggedIn$.value;
  }
}
