import { Injectable } from '@angular/core';

import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';

import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private firestore: AngularFirestore,
              private auhService: AuthService) { }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const uid = this.auhService.user.uid;

    delete ingresoEgreso.uid;

    return this.firestore.doc(`${uid}/ingresos-egresos`)
        .collection('items')
        // .add recibe un objeto no una instancia de la clase
        .add({...ingresoEgreso});
        // .then( (ref) => console.log('Exito', ref))
        // .catch( err => console.warn(err));
  }

  initIngresosEgresosListener(uid: string) {

    return this.firestore.collection(`${uid}/ingresos-egresos/items`)
                  // .valueChanges() -> me devuelve los valores pero no puedo acceder al id
                  .snapshotChanges()
                  .pipe(
                    // map() nos permite tomar la respuesta
                    // y permite regresar cualquier cosa que quiera
                    map( snapshot => snapshot.map(doc => {
                        // data() metodo que me permite ver los datos que llegan
                        // del snapshotChanges()
                        // console.log(doc.payload.doc.data());
                        return {
                          uid: doc.payload.doc.id,
                          ...doc.payload.doc.data() as any
                        };
                      })
                    )
                  );
  }


  borrarIngresoEgreso(uidItem: string) {
    const uid = this.auhService.user.uid;
    return this.firestore.doc(`${uid}/ingresos-egresos/items/${uidItem}`).delete();
  }


}
