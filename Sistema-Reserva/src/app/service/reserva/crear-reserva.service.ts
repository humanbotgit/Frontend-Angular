import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Reserva } from '../../model/Reserva';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrearReservaService {
  
  apiUrl = 'https://nodeaplication.onrender.com';

  constructor(private http: HttpClient) { }

  getAsignaturas(dniDocente: string): Observable<any[]> {
    const url = `${this.apiUrl}/asignatura/${dniDocente}`;
    return this.http.get<any[]>(url);
  }
  getLaboratorios(idAsignatura: string, dniDocente: string): Observable<any[]> {
    const url = `${this.apiUrl}/laboratorio/labas/${idAsignatura}`;
    return this.http.get<any[]>(url).pipe(
      catchError((error) => {
        console.error('Error en la solicitud:', error);
        throw error;
      })
    );
  }
  postReserva(reserva: Reserva): Observable<Reserva> {
    const url = `${this.apiUrl}/reserva/`;
    return this.http.post<Reserva>(url, reserva).pipe(
      catchError((error) => {
        console.error('Error en la solicitud de reserva:', error);
        return throwError(error);
      })
    );
  }
  
  getCantidadLicencias(idLaboratorio: string): Observable<any> {
    const url = `${this.apiUrl}/laboratorio/cantlicencia/${idLaboratorio}`;
    return this.http.get<any>(url).pipe(
      catchError((error) => {
        console.error('Error en la solicitud:', error);
        throw error;
      })
    );
  }
}
