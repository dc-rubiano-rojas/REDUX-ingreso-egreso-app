import { Component, OnInit, OnDestroy } from '@angular/core';

import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubscription: Subscription;
  ingresosSubscription: Subscription;

  constructor(private store: Store<AppState>,
              private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit() {
    // El pipe() me permite manipular, transforma y hacer
    // otras cosas con los observables
    // El filter() permite establecer una condicion que
    // regresa true o false. Si es true deja pasar la informacion a
    // traves del observable si es false lo bloquea.
    this.userSubscription = this.store.select('user')
                                .pipe(
                                  filter( auth => auth.user != null )
                                )
                                .subscribe(({user}) => {
                                  // console.log(user);
                                  this.ingresosSubscription = this.ingresoEgresoService.initIngresosEgresosListener(user.uid)
                                                                  .subscribe( ingresosEgresosFB => {

                                                            this.store.dispatch(ingresoEgresoActions.setItems({items: ingresosEgresosFB}));
                                                            });
                                });
  }

  ngOnDestroy() {
    // Cuando el usuario cierre sesion y salga del dashboard
    // se destruya la subscripcion
    this.ingresosSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }

}
