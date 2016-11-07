import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';
import { Touren } from '../touren/touren';
import { Navigation } from '../navigation/map';
import { Pannentipps } from '../pannentipps/pannentipps';
import { Settings } from '../settings/settings';
import { Search } from '../search/search';

//Startseite

@Component({
  selector: 'page-startseite',
  templateUrl: 'startseite.html'
})
export class Main {


  constructor(public navCtrl: NavController, public modalCtrl: ModalController) {

  }
  presentSearchModal() {
    let searchModal = this.modalCtrl.create(Search, { userId: 8675309 });
    searchModal.present();
  }

  goToTouren() {
    //setRoot (kein Zurück Button) oder push (mit Zurück Button)
    this.navCtrl.push(Touren);
  }
  goToSettings() {
    this.navCtrl.push(Settings);
  }
  goToMap() {
    this.navCtrl.push(Navigation);
  }
  goToPannentipps() {
    this.navCtrl.push(Pannentipps);
  }

}
