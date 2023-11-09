import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ErrorService } from './error/error.service';
import { Docente } from './../model/Docente';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'https://nodeaplication.onrender.com/docente';
  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  docenteDNI: Pick<Docente, 'DNI_Docente'> | null = null;
  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private error: ErrorService,
  ) { }

  signup(docente: Docente): Observable<Docente> {
    return this.http
      .post<Docente>(`${this.url}/signup`, docente, this.httpOptions)
      .pipe(
        catchError(this.handleError<Docente>('signup'))
      );
  }

  login(Correo: string, Pass: string): Observable<{ token: string; docenteDNI: Pick<Docente, 'DNI_Docente'> }> {
    return this.http
      .post<{ token: string; docenteDNI: Pick<Docente, 'DNI_Docente'> }>(
        `${this.url}/login`,
        { Correo, Pass },
        this.httpOptions
      )
      .pipe(
        tap(
          (tokenObject: any) => {
            this.docenteDNI = tokenObject.docenteDNI;
            localStorage.setItem('token', tokenObject.token);
            this.isUserLoggedIn$.next(true);
            this.router.navigate(['reservas']);
          },
          error => this.handleError(error)
        )
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      // Puedes agregar lógica para mostrar mensajes de error más específicos al usuario
      return throwError(error);
    };
  }
}
