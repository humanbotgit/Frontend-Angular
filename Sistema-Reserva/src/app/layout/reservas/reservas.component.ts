import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  dniDocente: string | undefined;
  reservas: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
  this.dniDocente = this.authService.docenteDNI?.toString();
  console.log('DNI del docente:', this.dniDocente);
  if (this.dniDocente) {
    this.authService.getReservasByDNI(this.dniDocente)
      .subscribe(reservas => {
        console.log('Reservas recibidas:', reservas);
        this.reservas = reservas;
      });
  }
}

}