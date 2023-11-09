import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private reservasUrl = 'https://nodeaplication.onrender.com/reserva';

  constructor(private http: HttpClient) {}

  // Método para obtener reservas por docenteid
  getReservasByDocenteId(docenteId: string): Observable<any> {
    // Agrega cualquier encabezado necesario para la solicitud
    const httpOptions: { headers: HttpHeaders } = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // Puedes agregar otros encabezados según sea necesario
      })
    };

    // Realiza la solicitud HTTP para obtener las reservas por docenteid
    return this.http.get(`${this.reservasUrl}/${docenteId}`, httpOptions);
  }
}
