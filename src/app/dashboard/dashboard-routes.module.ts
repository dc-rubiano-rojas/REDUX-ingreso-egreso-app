import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { dashboardRoutes } from './dashboard.routes';
// import { AuthGuard } from '../services/auth.guard';
import { RouterModule, Routes } from '@angular/router';


const rutasHijas: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: dashboardRoutes,
        // canActivate: [AuthGuard]
    },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild( rutasHijas )
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardRoutesModule { }
