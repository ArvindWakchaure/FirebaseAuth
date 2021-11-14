import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FirebaseAuthService {
  dataValue: any;
  checkUser: AngularFirestoreCollection<any>
  users: any;
  public emailExists = new Subject();
  // checkUser: any;
  constructor(private firestore: AngularFirestore) {  
    console.log(this.firestore.collection('users').snapshotChanges());
  }


  signUp(data: any) {
    const res = this.firestore.collection('users').add(data);
    return res;
  }

  checkEmail(data: any): Observable<any> {
     this.firestore.collection('users', ref => ref.where('email', '==', data.email).limit(1)).get().subscribe(res => {
      console.log(res);
      console.log(res.size);
      console.log(res.docs);
      if(res.size >= 1) {
        return this.emailExists.next(1);
      }
      else {
        return this.emailExists.next(0)
      }
    });
    console.log(this.checkUser);
    return;
    // return this.checkUser;
    // return this.checkUser.snapshotChanges();
  }

  getUserData(): Observable<any> {
      return this.firestore.collection('users').snapshotChanges();
  }
}
