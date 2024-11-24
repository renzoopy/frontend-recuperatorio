import { provideRouter } from '@angular/router';
import { Routes } from '@angular/router';

import { CategoriaListaComponent } from './categoria/lista/lista.component';
import { CategoriaFormularioComponent } from './categoria/formulario/formulario.component';

import { ProductoListaComponent } from './producto/lista/lista.component';
import { ProductoFormularioComponent } from './producto/formulario/formulario.component';

import { VentaListaComponent } from './venta/lista/lista.component';
import { DetalleVentaComponent } from './venta/detalle-venta/detalle-venta.component'; 
import { VentaPrincipalComponent } from './venta/venta-principal/venta-principal.component';

const routes: Routes = [
  { path: 'categorias/lista', component: CategoriaListaComponent },
  { path: 'categorias/formulario/:id', component: CategoriaFormularioComponent },
  { path: 'productos/lista', component: ProductoListaComponent },
  { path: 'productos/formulario/:id', component: ProductoFormularioComponent },
  { path: 'ventas/lista', component: VentaListaComponent },
  { path: 'ventas/detalle/:idVenta', component: DetalleVentaComponent },
  { path: '', component: VentaPrincipalComponent },
  { path: '**', redirectTo: '' }
];

export const appRoutes = [
  provideRouter(routes)
];
