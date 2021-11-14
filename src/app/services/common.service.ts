import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(public toastController: ToastController) { }

  async presentToast(message: any) {
    console.log(message);
    const toast = await this.toastController.create({
      message: `${message}`,
      duration: 2000
    });
    toast.present();
  }
}
