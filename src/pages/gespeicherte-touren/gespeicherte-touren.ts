import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the GespeicherteTouren page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-gespeicherte-touren',
  templateUrl: 'gespeicherte-touren.html'
})
export class GespeicherteTourenPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello GespeicherteTourenPage Page');
  }

}
