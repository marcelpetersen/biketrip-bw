import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { Slides } from 'ionic-angular';

/*
  Generated class for the PannentippsInfoModal page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-pannentipps-info-modal',
  templateUrl: 'pannentipps-info-modal.html'
})
export class PannentippsInfoModal {

  data: any;
  type: any;
  pannentippsSlideOptions = {
    initialSlide: 0,
    loop: false,
    pager: true
  };

  constructor(
      private navCtrl: NavController,
      private viewCtrl: ViewController,
      private params: NavParams
    ) {
      this.data = this.params.get('data');
      this.type = this.params.get('type');
    }

  ionViewDidLoad() {

    console.log("Data: " + this.data);
  }

  dismiss() {
   this.viewCtrl.dismiss();
 }

}
