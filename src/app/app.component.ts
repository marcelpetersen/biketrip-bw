import { Component, ViewChild } from '@angular/core';
import { App, Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

//Seiten importieren, um für die Navigation zu verwenden
import { Startseite } from '../pages/startseite/startseite';
import { TourenSuche } from '../pages/touren-suche/touren-suche';
import { Erlebnisradwege } from '../pages/erlebnisradwege/erlebnisradwege';
import { GespeicherteTouren } from '../pages/gespeicherte-touren/gespeicherte-touren';
import { Navigation } from '../pages/navigation/map';
import { Routenplaner } from '../pages/routenplaner/routenplaner';
import { Pannentipps } from '../pages/pannentipps/pannentipps';
import { Impressum } from '../pages/impressum/about';

//Custom Libraries
import * as L from 'leaflet';

//Service providers
import { BiketripsService } from '../providers/biketrips-service';
import { NavigationService } from '../providers/navigation-service';
import { PannentippsService } from '../providers/pannentipps-service';

@Component({
  templateUrl: 'app.html',

})
export class Main {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Startseite;

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public appCtrl: App,
    public navigationService: NavigationService,
    public tourenService: BiketripsService) {

    this.initializeApp();

    // Seiten zum Menü hinzuzufügen
    this.pages = [
      { title: 'Startseite', component: Startseite },
      { title: 'Suche nach Touren', component: TourenSuche },
      { title: 'Erlebnisradwege', component: Erlebnisradwege },
      { title: 'Navigation', component: Navigation },
      { title: 'Gespeicherte Touren', component: GespeicherteTouren },
      { title: 'Routenplaner', component: Routenplaner },
      { title: 'Pannentipps', component: Pannentipps },
      { title: 'Impressum', component: Impressum }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      L.Icon.Default.imagePath = "../assets/img/map/";
      this.navigationService.initialize();
      this.tourenService.initialize();
    });
  }

  openPage(page) {
    //BUG: Funktioniert auf Devices nicht!


    // Um zu verhindern, dass Views zweimal aufgerufen werden, kann nicht auf das bereits aktive Menü Element geklickt werden.
    // console.log("Active: " + this.appCtrl.getRootNav().getActive().name + ", Klick auf: "+ page.component.name);
    // if(page.component.name !== this.appCtrl.getRootNav().getActive().name) {
      this.nav.setRoot(page.component);
    // }
  }
}
