import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';

import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando = false;
  uiSubscription: Subscription;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private store: Store<AppState>,
              private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSubscription = this.store.select('ui')
                              .subscribe( ui => {
                                this.cargando = ui.isLoading;
                                // console.log('Cargando subs');
                              });

  }

  ngOnDestroy() {
    // Esto se ejecuta cuando la pagina es destruida
    // aca haremos las limpiezas de las subscripciones al store
    this.uiSubscription.unsubscribe();
  }


  loginSubmit() {

    if ( this.loginForm.invalid) { return; }

    this.store.dispatch(ui.isLoading());

    // Loading
    // Swal.fire({
    //   title: 'Espere por favor!',
    //   onBeforeOpen: () => {
    //     Swal.showLoading();
    //   }
    // });

    const { correo, password } = this.loginForm.value;

    this.authService.loginUsuario(correo, password)
        .then( res => {
          console.log(res);
          // Swal.close() -> me cierra la ventana del sweet alert
          // en este caso del Loading
          // Swal.close();
          this.store.dispatch( ui.stopLoading() );
          this.router.navigateByUrl('/');
        })
        .catch(err => {
          this.store.dispatch( ui.stopLoading() );
          // console.error(err)
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message,
          });
        });
    // console.log(this.loginForm.value);
  }

}
