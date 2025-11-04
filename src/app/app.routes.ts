import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { ClientesComponent } from './features/clientes/clientes.component';
import { CuentasComponent } from './features/cuentas/cuentas.component';
import { MovimientosComponent } from './features/movimientos/movimientos.component';
import { ReportesComponent } from './features/reportes/reportes.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'clientes',
        pathMatch: 'full'
      },
      {
        path: 'clientes',
        component: ClientesComponent
      },
      {
        path: 'cuentas',
        component: CuentasComponent
      },
      {
        path: 'movimientos',
        component: MovimientosComponent
      },
      {
        path: 'reportes',
        component: ReportesComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'clientes'
  }
];