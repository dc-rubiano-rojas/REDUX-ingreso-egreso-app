import { Injectable } from '@angular/core';

import 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import * as authActions from '../auth/auth.actions';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

import { map, subscribeOn } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;
  private _user: Usuario;

  // Este es el getter del _user
  get user() {
    return this._user;
  }

  constructor(public auth: AngularFireAuth,
              private firestore: AngularFirestore,
              private store: Store<AppState>) { }

  // Este metedo (authState) se va a encargar de avisar cuando tengamos
  // algun cambio con la autenticacion login logout.
  // si quiere entrar a una ruta y no esta autenticado
  // decir si la puede ver o no
  initAuthListener() {

    this.auth.authState.subscribe( fuser => {
      if (fuser) {
        // Existe
        this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`)
                                    .valueChanges()
                                    .subscribe( (firestoreUser: any) => {

                                      // console.log({firestoreUser});

                                      const user = Usuario.fromFirebase(firestoreUser);
                                      this._user = user;
                                      this.store.dispatch( authActions.setUser({user}));
            });
          } else {
            // No existe
            this._user = null;
            this.userSubscription?.unsubscribe();
            this.store.dispatch( authActions.unSetUser() );
            this.store.dispatch(ingresoEgresoActions.unSetItems());
      }
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
