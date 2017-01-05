import { Component, ViewChild } from '@angular/core';
import { App, Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage';

//Seiten importieren, um für die Navigation zu verwenden
import { Startseite } from '../pages/startseite/startseite';
import { TourenSuche } from '../pages/touren-suche/touren-suche';
import { Erlebnisradwege } from '../pages/erlebnisradwege/erlebnisradwege';
import { GespeicherteTouren } from '../pages/gespeicherte-touren/gespeicherte-touren';
import { Map } from '../pages/map/map';
import { Routenplaner } from '../pages/routenplaner/routenplaner';
import { Pannentipps } from '../pages/pannentipps/pannentipps';
import { Impressum } from '../pages/impressum/about';

//Custom Libraries
import * as L from 'leaflet';
import * as Control from 'leaflet-control-geocoder';
import * as Routing from 'leaflet-routing-machine';


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
    public tourenService: BiketripsService,
    public storage: Storage) {

    this.initializeApp();

    // Seiten zum Menü hinzuzufügen
    this.pages = [
      { title: 'Startseite', component: Startseite },
      { title: 'Suche nach Touren', component: TourenSuche },
      { title: 'Erlebnisradwege', component: Erlebnisradwege },
      { title: 'Karte', component: Map },
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
      StatusBar.styleLightContent();
      Splashscreen.hide();
      L.Icon.Default.imagePath = "./assets/img/map/";
      this.navigationService.initialize();
      this.tourenService.initialize();
      //Favoriten (Storage) initialisieren
      console.log(this.storage.keys.length);
      if(this.storage.keys.length === 0) {
        this.storage.set("gespeichert", "-");
      } else {
        this.storage.get("gespeichert").then((val) => {
          if(val === null || val === undefined) {
            this.storage.set("gespeichert", "-");
          }
        });
      }
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
