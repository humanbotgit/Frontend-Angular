import { Router } from "@angular/router";
import { Docente } from '../model/Docente';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable, BehaviorSubject } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { ErrorService } from './error/error.service';
import { catchError } from 'rxjs/operators';
import { Reserva } from '../model/Reserva';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = "https://nodeaplication.onrender.com/"
  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  docenteDNI: Pick<Docente, "DNI_Docente"> | undefined
  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  }

  constructor(
    private http: HttpClient,
    private ErrorService: ErrorService,
    private router: Router) {}

  signup(docente: Docente): Observable<Docente> {
    return this.http
      .post<Docente>(`${this.url}docente/signup`, docente, this.httpOptions)
      .pipe(first(),
        catchError(this.ErrorService.handleError<Docente>("signup"))
      );
  }

  login(
    Correo: Pick<Docente, "Correo">,
    Pass: Pick<Docente, "Pass">
  ): Observable<{
    token: string;
    docenteDNI: Pick<Docente, "DNI_Docente">;
  }> {
    return this.http
      .post(`${this.url}docente/login`, { Correo, Pass }, this.httpOptions)
      .pipe(
        first(),
        tap((tokenObject: any) => {
          this.docenteDNI = tokenObject.docenteid;
          localStorage.setItem("token", tokenObject.token);
          if (this.docenteDNI !== undefined) {
            localStorage.setItem("DNI_Docente", this.docenteDNI.toString());
          }
          this.isUserLoggedIn$.next(true);
          this.router.navigate(["reservas"]);
        }),
        catchError(
          this.ErrorService.handleError<{
            token: string;
            docenteDNI: Pick<Docente, "DNI_Docente">;
          }>("login"))
      );
  }
  // En el AuthService
logout() {
  // Limpiar el token y cualquier otra información de sesión
  localStorage.removeItem('token');
  localStorage.removeItem('DNI_Docente');
  this.isUserLoggedIn$.next(false);
  this.router.navigate(['login']); // Ajusta la redirección según tu configuración
}

  getReservasByDNI(dni: string): Observable<any[]> {
  const url = `${this.url}reserva/${dni}`;
  console.log('URL de la solicitud:', url);

  return this.http.get<any[]>(url, this.httpOptions)
    .pipe(
      tap(res => console.log('Respuesta de la API:', res)),
      catchError(this.ErrorService.handleError<any[]>('getReservasByDNI'))
    );
}
postReserva(reserva: Reserva): Observable<Reserva> {
  const url = `${this.url}reserva/`;

  // Obtén el token del almacenamiento local
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No se encontró el token en el almacenamiento local');
  }

  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Agrega el token al encabezado 'Authorization'
    })
  };

  return this.http.post<Reserva>(url, reserva, httpOptions)
    .pipe(
      catchError((error) => {
        console.error('Error en la solicitud de reserva:', error);
        return throwError(error);
      })
    );
}


  
}
