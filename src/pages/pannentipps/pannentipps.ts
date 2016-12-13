import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { PannentippsService } from '../../providers/pannentipps-service';


/*
  Generated class for the Pannentipps page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-pannentipps',
  templateUrl: 'pannentipps.html',
  providers: [PannentippsService]
})
export class Pannentipps {

  public pannentipps: any;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public pannentippsData: PannentippsService
  ) {}

  ionViewDidLoad() {
    this.loadPannentipps();
    console.log('Hello Pannentipps Page');
  }

  loadPannentipps() {
    this.pannentippsData.load().then(data => {
      this.pannentipps = data;
      console.log(this.pannentipps);
    });
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
