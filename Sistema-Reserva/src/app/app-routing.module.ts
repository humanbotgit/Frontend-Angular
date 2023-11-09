import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { CarruselComponent } from './shared/carrusel/carrusel.component';
import { FooterComponent } from './shared/footer/footer.component';
import { InicioComponent } from './layout/inicio/inicio.component';
import { IngresarComponent} from './forms/ingresar/ingresar.component'
import { ReservasComponent } from './layout/reservas/reservas.component';
const routes: Routes = [
  {path: '', redirectTo: 'inicio', pathMatch:'full'},
  {path: 'inicio', component:InicioComponent},
  {path: 'header', component:HeaderComponent},
  {path: 'footer', component:FooterComponent},
  {path: 'ingresar', component:IngresarComponent},
  {path: 'reserva',component:ReservasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
