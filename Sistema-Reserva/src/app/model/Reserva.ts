export interface Reserva{
    Fecha_Registro: Date,
    Fecha_Reserva: Date,
    Inicio_Reserva: string, 
    Fin_Reserva: string, 
    Cantidad_Licencias_Reservadas: number,
    DNI_Docente: string,
    ID_Laboratorio: number,
    NRC: string
}