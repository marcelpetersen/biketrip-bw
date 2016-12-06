import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, BackgroundGeolocation } from 'ionic-native';

//Seiten importieren, um für die Navigation zu verwenden
import { Startseite } from '../pages/startseite/startseite';
import { TourenSuche } from '../pages/touren-suche/touren-suche';
import { Erlebnisradwege } from '../pages/erlebnisradwege/erlebnisradwege';
import { Navigation } from '../pages/navigation/map';
import { Routenplaner } from '../pages/routenplaner/routenplaner';
import { Pannentipps } from '../pages/pannentipps/pannentipps';
import { Impressum } from '../pages/impressum/about';

import { Routing } from 'leaflet-routing-machine';
import * as L from 'leaflet';


@Component({
  templateUrl: 'app.html'
})
export class BiketripBW {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Startseite;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {

    this.initializeApp();

    // Seiten zum Menü hinzuzufügen
    this.pages = [
      { title: 'Startseite', component: Startseite },
      { title: 'Suche nach Touren', component: TourenSuche },
      { title: 'Erlebnisradwege', component: Erlebnisradwege },
      { title: 'Navigation', component: Navigation },
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

      let config = {
        desiredAccuracy: 10,
        stationaryRadius: 20,
        distanceFilter: 30,
        debug: true, //  enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: false, // enable this to clear background location settings when the app terminates
      };
      BackgroundGeolocation.configure((location) => {
           console.log('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);

            // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
            // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
            // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
            BackgroundGeolocation.finish(); // FOR IOS ONLY

       }, (error) => {
         console.log('BackgroundGeolocation error');
       }, config);

      // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
      BackgroundGeolocation.start();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
