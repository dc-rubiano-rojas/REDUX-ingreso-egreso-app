import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }


  loginSubmit() {

    if ( this.loginForm.invalid) { return; }

    // Loading
    Swal.fire({
      title: 'Espere por favor!',
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });

    const { correo, password } = this.loginForm.value;

    this.authService.loginUsuario(correo, password)
        .then( res => {
          console.log(res);
          // Swal.close() -> me cierra la ventana del sweet alert
          // en este caso del Loading
          Swal.close();
          this.router.navigateByUrl('/');
        })
        .catch(err => {
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
