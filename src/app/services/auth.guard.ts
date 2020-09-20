import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {}

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
