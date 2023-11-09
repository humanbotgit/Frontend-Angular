import { Router } from "@angular/router";
import { Docente } from '../model/Docente';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Observable, BehaviorSubject } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { ErrorService } from './error/error.service';

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
          this.docenteDNI = tokenObject.docenteDNI;
          localStorage.setItem("token", tokenObject.token);
          
          // Asegúrate de que this.docenteDNI no sea undefined antes de intentar guardarlo
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
  getReservasByDNI(dni: string): Observable<any[]> {
    const url = `${this.url}/reserva/${dni}`;
    console.log('URL de la solicitud:', url);
  
    return this.http.get<any[]>(url, this.httpOptions)
      .pipe(
        tap(res => console.log('Respuesta de la API:', res)),
        catchError((error: any) => {
          console.error('Error de la API:', error);
          return this.ErrorService.handleError<any[]>('getReservasByDNI');
        })
      );
  }  
}
