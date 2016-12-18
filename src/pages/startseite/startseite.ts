import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Erlebnisradwege } from '../erlebnisradwege/erlebnisradwege';
import { Navigation } from '../navigation/map';
import { Pannentipps } from '../pannentipps/pannentipps';
import { Impressum } from '../impressum/about';
import { TourenSuche } from '../touren-suche/touren-suche';

//Startseite

@Component({
  selector: 'page-startseite',
  templateUrl: 'startseite.html'
})

export class Startseite {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {}

  goToSuche() {
    this.navCtrl.push(TourenSuche);
  }

  goToTouren() {
    //setRoot (kein Zurück Button) oder push (mit Zurück Button)
    this.navCtrl.push(Erlebnisradwege);
  }
  goToAbout() {
    this.navCtrl.push(Impressum);
  }
  goToMap() {
    this.navCtrl.push(Navigation);
  }
  goToPannentipps() {
    this.navCtrl.push(Pannentipps);
  }
}
