import { Asignatura } from './../../model/Asignatura';
import { Laboratorio } from './../../model/Laboratorio';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { ProfesorService } from '../../service/profesor.service';
import { CrearReservaService } from '../../service/reserva/crear-reserva.service';
import { Reserva } from '../../model/Reserva';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
@Component({
  selector: 'app-new-reserva',
  templateUrl: './new-reserva.component.html',
  styleUrls: ['./new-reserva.component.css']
})
export class NewReservaComponent implements OnInit {
  dniDocente: string = '';
  fechaDeRegistro: Date;
  fechaDeReserva: string = '';
  opcionSeleccionadaInicio: number = 0;
  opcionSeleccionadaFin: number = 0;
  cantidadLicencias: string = '';
  minDate: Date;
  asignaturas: Asignatura[] = [];
  selectedAsignatura: string = '';
  laboratorios: Laboratorio[] = [];
  selectedLaboratorio: string = '';
  availableLicenses: number = 0;
  showError: boolean = false;
  errorMessage: string = '';
  isButtonDisabled: boolean = true;
  esmayor: boolean = false;
  isLoggedIn: boolean = false;
  constructor(
    private dateAdapter: DateAdapter<Date>,
    private profesorService: ProfesorService,
    private crearReservaService: CrearReservaService,
    private router: Router,
    private authService: AuthService
  ) {
    this.fechaDeRegistro = new Date();
    this.dateAdapter.setLocale('es');
    this.minDate = new Date();
    //Obtienene el dni del docente
    this.dniDocente = this.profesorService.getDNIDocente() || 'undefined';
    if (!this.dniDocente || this.dniDocente=='undefined') {
      this.router.navigate(['/ingresar']);
    }else{
          this.isLoggedIn = this.authService.isUserLoggedIn$.value;
    this.authService.isUserLoggedIn$.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });
    //carga las asignaturas del docente
    this.loadAsignaturas();
    }

  }
  formatoFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  onFechaSeleccionada(event: any) {
    this.fechaDeReserva = this.formatoFecha(event.value);
    console.log(this.fechaDeReserva);
  }
  
  ngOnInit() {}
  onOpcionSeleccionadaInicio(event: any) {
    this.opcionSeleccionadaInicio = event;
    this.compareFechas();
  }
  
  onOpcionSeleccionadaFin(event: any) {
    this.opcionSeleccionadaFin = event;
    this.compareFechas();
  }
  
  compareFechas() {
    if (this.opcionSeleccionadaInicio && this.opcionSeleccionadaFin) {
      this.esmayor = this.opcionSeleccionadaInicio > this.opcionSeleccionadaFin;
    } else {
      this.esmayor = true;
    }
  }
  loadAsignaturas() {
    if (this.dniDocente) {
      this.crearReservaService.getAsignaturas(this.dniDocente).subscribe((data) => {
        this.asignaturas = data;
      });
    }
  }
  onAsignaturaChange() {
    if (this.selectedAsignatura && this.dniDocente) {
      this.loadLaboratorios();
    }
    console.log(this.selectedAsignatura);
  }
  //carga los laboratorios
  loadLaboratorios() {
    if (this.selectedAsignatura) {
      this.crearReservaService.getLaboratorios(this.selectedAsignatura).subscribe((data) => {
        this.laboratorios = data;
        if (this.laboratorios.length === 0) {
          console.log('No hay laboratorios para esta asignatura.');
        }
      });
    } else {
      console.log('Valores insuficientes para cargar laboratorios.');
    }
  }
  //cuando selecciones el laboratorio cargara la cantidad de licencias
  onLaboratorioChange() {
    if (this.selectedLaboratorio && this.dniDocente) {
      this.loadCantidadLicencia();
    }
    console.log(this.selectedLaboratorio);
  }
  //carga cantidad de licencias
  loadCantidadLicencia() {
    if (this.selectedLaboratorio) {
      this.crearReservaService.getCantidadLicencias(this.selectedLaboratorio).subscribe(
        (data) => {
          this.availableLicenses = data.Cantidad_Licencias || 0;
        },
        (error) => {
          console.error('Error fetching licenses:', error);
          this.availableLicenses = 0;
        }
      );
    } else {
      console.log('Esperando la selección de un laboratorio para cargar las licencias.');
    }
  }
  getCantidadLicenciasSolicitadas(): number {
    return parseInt(this.cantidadLicencias, 10);
  }
  //compara las licencias
  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const inputValue = input.value;
    const numericValue = parseInt(inputValue, 10);
    if (isNaN(numericValue)) {
      this.errorMessage = 'Por favor, introduce un número válido.';
      this.showError = true;
      this.isButtonDisabled=true;
    } else {
      if (numericValue > this.availableLicenses) {
        this.errorMessage = 'No hay suficientes licencias disponibles';
        this.showError = true;
        this.isButtonDisabled=true;
      } else {
        this.errorMessage = '';
        this.showError = false;
        this.cantidadLicencias = numericValue.toString();
        this.isButtonDisabled=false;
      }
    }
  }
  cantidadLicenciasValida(): boolean {
    const cantidadSolicitada = parseInt(this.cantidadLicencias, 10);
    return cantidadSolicitada <= this.availableLicenses;
  }
  validado(): boolean {
    const fechaValida = this.fechaDeReserva !== '';
    const horaInicioValida = this.opcionSeleccionadaInicio > 0;
    const horaFinValida = this.opcionSeleccionadaFin > 0;
    const asignaturaValida = this.selectedAsignatura !== '';
    const laboratorioValido = this.selectedLaboratorio !== '';
    const licenciasValidas = this.cantidadLicenciasValida(); 
  
    return (
      fechaValida &&
      horaInicioValida &&
      horaFinValida &&
      asignaturaValida &&
      laboratorioValido &&
      licenciasValidas
    );
  }
  
  onSubmit() {
      const cantidadSolicitada = parseInt(this.cantidadLicencias, 10);
      if (cantidadSolicitada > this.availableLicenses) {
        this.showError = true;
        this.errorMessage = 'La cantidad solicitada supera las licencias disponibles.';
      } else {
        this.showError = false;
        this.errorMessage = '';
        const reserva: Reserva = {
          Fecha_Reserva: this.fechaDeReserva,
          Inicio_Reserva: this.opcionSeleccionadaInicio,
          Fin_Reserva: this.opcionSeleccionadaFin,
          Cantidad_Licencias_Reservadas: cantidadSolicitada,
          ID_Laboratorio: this.selectedLaboratorio,
          ID_Asignatura: this.selectedAsignatura,
        };
        console.log('Reserva a enviar:', reserva);

        this.authService.postReserva(reserva).subscribe(
          (response) => {
            console.log('Reserva enviada con éxito:', response);
            this.router.navigate(['/reserva']);
          },
          (error) => {
            console.error('Error al enviar la reserva:', error);
          }
        );
      }
    }
  }
