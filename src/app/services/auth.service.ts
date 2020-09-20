import { Injectable } from '@angular/core';

import 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth,
              public firestore: AngularFirestore) { }

  // Este metedo (authState) se va a encargar de avisar cuando tengamos
  // algun cambio con la autenticacion login logout.
  // si quiere entrar a una ruta y no esta autenticado
  // decir si la puede ver o no
  initAuthListener() {
    this.auth.authState.subscribe( fuser => {
      console.log(fuser);
      console.log(fuser?.uid);
      console.log(fuser?.email);
    });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    // console.log(nombre, email, password);
    return this.auth.createUserWithEmailAndPassword(email, password)
                .then( ({user}) => {

                  const newUser = new Usuario(user.uid, nombre, user.email);

                  return this.firestore.doc(`${user.uid}/usuario`).set({...newUser});
                });
  }


  loginUsuario(email: string, password: string){
    return this.auth.signInWithEmailAndPassword(email, password);

  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    // pipe() metodo de rxjs que me permite ver los cambios
    // que me retorna el authState que es un observable
    return  this.auth.authState.pipe(
      // map() es de las extensiones reactivas
      // es un operador de rx que me permite tomar la informacion y
      // regresar lo que yo quiera true, false mutar el objeto
      map( fbUser => fbUser != null));
  }


}
