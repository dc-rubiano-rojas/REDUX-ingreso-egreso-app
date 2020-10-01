import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private authService: AuthService,
              private router: Router) {}

  canLoad(): Observable<boolean> {
    return this.authService.isAuth()
                .pipe(
                  // tap() sirve para disparar un efecto secundario
                  tap( estado => {
                    if (!estado) { this.router.navigateByUrl('/login')}
                  }),
                  // Este take() me permite que solo lo haga una vez y la
                  // subscripcion se cancele
                  take(1)
                );
  }

  canActivate(): Observable<boolean> {
    return this.authService.isAuth()
                .pipe(
                  // tap() sirve para disparar un efecto secundario
                  tap( estado => {
                    if (!estado) { this.router.navigateByUrl('/login')}
                  })
                );
  }
}
