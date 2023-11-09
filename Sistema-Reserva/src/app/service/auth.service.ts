import { Injectable } from '@angular/core';
import { Docente } from './../model/Docente';
import { Router } from "@angular/router";
import { HttpClient,HttpHeaders } from "@angular/common/http"
import { Observable, BehaviorSubject } from 'rxjs';
import { first, catchError, tap } from 'rxjs/operators';
import { ErrorService } from './error/error.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = "https://nodeaplication.onrender.com/docente"
  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  docenteDNI: Pick<Docente, "DNI_Docente"> | null = null;
  httpOptions : {headers: HttpHeaders }={
    headers: new HttpHeaders({"Content-Type": "application/json"})
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private error: ErrorService,
  ) { }
  signup(docente: Docente):Observable<Docente>{
    return this.http
        .post<Docente>(`${this.url}/signup`, docente,this.httpOptions)
        .pipe(first(),
          catchError(this.error.handleError<Docente>("signup") )
          )
  }
  login(
      Correo: string, Pass: string): Observable<{
      token: string;
      docenteDNI: Pick<Docente, "DNI_Docente">;
    }>
    {
        return this.http
        .post(`${this.url}/login`, {Correo, Pass},this.httpOptions)
        .pipe(
          first(),
          tap((tokenObject: any) => {
            this.docenteDNI = tokenObject.docenteDNI;
            localStorage.setItem("token", tokenObject.token);
            this.isUserLoggedIn$.next(true);
            this.router.navigate(["reservas"]);
          }),
          
          catchError(
            this.error.handleError<{
              token:string;
              docenteDNI: Pick<Docente,"DNI_Docente">;
            }>("login") )
          )
      }
  }
