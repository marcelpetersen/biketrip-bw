import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Erlebnisradwege } from '../erlebnisradwege/erlebnisradwege';
import { Map } from '../map/map';
import { Pannentipps } from '../pannentipps/pannentipps';
import { Impressum } from '../impressum/about';
import { Routenplaner } from '../routenplaner/routenplaner';
import { TourenSuche } from '../touren-suche/touren-suche';
import { GespeicherteTouren } from '../gespeicherte-touren/gespeicherte-touren';

import * as Swiper from "swiper";

//Startseite

@Component({
  selector: 'page-startseite',
  templateUrl: 'startseite.html'
})

export class Startseite {

  mainSwiper: any;

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    this.mainSwiper = new Swiper('.image-wrapper', {
    loop: true,
    autoplay: 3000,
    pagination: '.swiper-pagination'
    });
  }

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
    this.navCtrl.push(Map);
  }
  goToPannentipps() {
    this.navCtrl.push(Pannentipps);
  }
  goToRoutenplaner() {
    this.navCtrl.push(Routenplaner);
  }
  goToFavoriten() {
    this.navCtrl.push(GespeicherteTouren);
  }
}
