import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {
  private jwtHelper = new JwtHelperService();

  constructor() { }

  getDNIDocente(): string | null {
    // Verifica si localStorage está disponible antes de intentar acceder a él
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      
      if (token) {
        const tokenPayload = this.jwtHelper.decodeToken(token);
        return tokenPayload.docenteid || null;
      }
    }

    return null;
  }
}
