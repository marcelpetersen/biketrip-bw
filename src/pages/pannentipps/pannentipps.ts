import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

/*
  Generated class for the Pannentipps page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-pannentipps',
  templateUrl: 'pannentipps.html'
})
export class Pannentipps {

  constructor(public navCtrl: NavController, public toastCtrl: ToastController) {}

  ionViewDidLoad() {
    console.log('Hello Pannentipps Page');
  }
  
  presentToast() {
  let toast = this.toastCtrl.create({
    message: 'User was added successfully',
    duration: 3000,
    position: 'top'
  });

  toast.onDidDismiss(() => {
    console.log('Dismissed toast');
  });

  toast.present();
}

}
