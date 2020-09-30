import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Usuario } from '../../models/usuario.model';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit, OnDestroy {

  user: Usuario;
  userSubscription: Subscription;
  nombre: string;

  constructor(private authService: AuthService,
              private router: Router,
              private store: Store<AppState>) { }

  ngOnInit() {
    this.userSubscription = this.store.select('user')
                                      .pipe(
                                        filter( auth => auth.user != null )
                                      )
                                      .subscribe(({user}) => {
                                          this.nombre = user.nombre;
                                      });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  logout() {

    // Loading
    Swal.fire({
      title: 'Espere por favor!',
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.logout()
        .then( () => {
          Swal.close();
          this.router.navigateByUrl('/login')});
  }

}
