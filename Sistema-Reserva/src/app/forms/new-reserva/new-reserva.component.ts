import { Asignatura } from './../../model/Asignatura';
import { Laboratorio } from './../../model/Laboratorio';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { ProfesorService } from '../../service/profesor.service';
import { CrearReservaService } from '../../service/reserva/crear-reserva.service';
import { FormControl, Validators } from '@angular/forms';
import { Reserva } from '../../model/Reserva';
@Component({
  selector: 'app-new-reserva',
  templateUrl: './new-reserva.component.html',
  styleUrl: './new-reserva.component.css'
})
export class NewReservaComponent {
  dniDocente: string ='';
  fechaDeRegistro: Date;
  fechaDeReserva: Date = new Date();
  opcionSeleccionadaInicio: string = '';
  opcionSeleccionadaFin: string = '';
  cantidadLicencias: string = '';
  minDate: Date;
  asignaturas: Asignatura[] = [];
  selectedAsignatura: string = '';
  laboratorios: Laboratorio[] = [];
  selectedLaboratorio: string = '';

  constructor(
    private dateAdapter: DateAdapter<Date>,
    private profesorService: ProfesorService,
    private crearReservaService: CrearReservaService,
  ) {
    this.fechaDeRegistro = new Date();
    this.dateAdapter.setLocale('es');
    this.minDate = new Date();
    this.dniDocente = this.profesorService.getDNIDocente() || 'ValorPredeterminado';
    this.loadAsignaturas();
  }

  ngOnInit() {}

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
  }

  loadLaboratorios() {
    if (this.selectedAsignatura && this.dniDocente) {
      this.crearReservaService.getLaboratorios(this.selectedAsignatura, this.dniDocente).subscribe((data) => {
        this.laboratorios = data;
        if (this.laboratorios.length === 0) {
          console.log('No hay laboratorios para esta asignatura.');
        }
      });
    } else {
      console.log('Valores insuficientes para cargar laboratorios.');
    }
  }
  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const inputValue = input.value;

    const numericValue = inputValue.replace(/[^0-9]/g, '');

    input.value = numericValue;
    this.cantidadLicencias = numericValue;
  }
  onSubmit(form: NgForm) {
    if (form.valid) {
      const reserva: Reserva = {
        Fecha_Registro: this.fechaDeRegistro,
        Fecha_Reserva: this.fechaDeReserva,
        Inicio_Reserva: this.opcionSeleccionadaInicio,
        Fin_Reserva: this.opcionSeleccionadaFin,
        Cantidad_Licencias_Reservadas: parseInt(this.cantidadLicencias, 10),
        DNI_Docente: this.dniDocente,
        ID_Laboratorio: parseInt(this.selectedLaboratorio, 10), 
        NRC: this.selectedAsignatura 
      };
      console.log('Reserva a enviar:', reserva);

      this.crearReservaService.postReserva(reserva).subscribe(
        (response) => {
          console.log('Reserva enviada con éxito:', response);
        },
        (error) => {
          console.error('Error al enviar la reserva:', error);
        }
      );
    }
  }
}