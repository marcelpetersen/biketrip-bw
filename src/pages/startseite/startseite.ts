import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Erlebnisradwege } from '../erlebnisradwege/erlebnisradwege';
import { Navigation } from '../navigation/map';
import { Pannentipps } from '../pannentipps/pannentipps';
import { Einstellungen } from '../einstellungen/einstellungen';
import { TourenSuche } from '../touren-suche/touren-suche';

//Startseite

@Component({
  selector: 'page-startseite',
  templateUrl: 'startseite.html'
})
export class Main {


  constructor(public navCtrl: NavController) {

  }
  goToSuche() {
    this.navCtrl.push(TourenSuche);
  }

  goToTouren() {
    //setRoot (kein Zurück Button) oder push (mit Zurück Button)
    this.navCtrl.push(Erlebnisradwege);
  }
  goToSettings() {
    this.navCtrl.push(Einstellungen);
  }
  goToMap() {
    this.navCtrl.push(Navigation);
  }
  goToPannentipps() {
    this.navCtrl.push(Pannentipps);
  }

}
