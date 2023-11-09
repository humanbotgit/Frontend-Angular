import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { InicioComponent } from './layout/inicio/inicio.component';

const routes: Routes = [
  {path: '', redirectTo: 'inicio', pathMatch:'full'},
  {path: 'inicio', component:InicioComponent},
  {path: 'header', component:HeaderComponent},
  {path: 'footer', component:FooterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
