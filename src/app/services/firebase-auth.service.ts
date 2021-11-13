import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  dataValue: any;
  checkUser: AngularFirestoreCollection<any>
  users: any;
  constructor(private firestore: AngularFirestore) {  
    console.log(this.firestore.collection('users').snapshotChanges());
  }


  signUp(data: any) {
    const res = this.firestore.collection('users').add(data);
    return res;
  }

  checkEmail(data: any): Observable<any> {
    this.checkUser = this.firestore.collection('users', ref => ref.where('email', '==', data.email ));
    return this.checkUser.snapshotChanges();
  }
}
