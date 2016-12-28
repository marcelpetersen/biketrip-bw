import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

//Providers
import { ConnectivityService } from '../providers/connectivity-service';
import { NavigationService } from '../providers/navigation-service';
import { BiketripsService } from '../providers/biketrips-service';
import { PannentippsService } from '../providers/pannentipps-service';
import { Storage } from '@ionic/storage';

//Komponenten importieren (muss bei neuen Pages ergaenzt werden.)
import { Main } from './app.component';
import { Startseite } from '../pages/startseite/startseite';
//Seiten
import { TourenSuche } from '../pages/touren-suche/touren-suche';
import { TourenSucheErgebnis } from '../pages/touren-suche-ergebnis/touren-suche-ergebnis';
import { GespeicherteTouren } from '../pages/gespeicherte-touren/gespeicherte-touren';
import { Erlebnisradwege } from '../pages/erlebnisradwege/erlebnisradwege';
import { Navigation } from '../pages/navigation/navigation';
import { Map } from '../pages/map/map';
import { Routenplaner } from '../pages/routenplaner/routenplaner';
import { Pannentipps } from '../pages/pannentipps/pannentipps';
import { Impressum } from '../pages/impressum/about';
//Modals
import { TourenInfoModal } from '../pages/touren-info-modal/touren-info-modal';
import { CheckpointInfoModal } from '../pages/checkpoint-info-modal/checkpoint-info-modal';

//Custom Libraries
// import * as L from 'leaflet';

@NgModule({
  //Pages hinzufügen
  declarations: [
    Main,
    Startseite,
    TourenSuche,
    TourenSucheErgebnis,
    TourenInfoModal,
    GespeicherteTouren,
    CheckpointInfoModal,
    Erlebnisradwege,
    Navigation,
    Map,
    Routenplaner,
    Pannentipps,
    Impressum
  ],
  imports: [
    IonicModule.forRoot(Main, {
      backButtonText: 'Zurück',
    }, {}
  )],
  bootstrap: [
    IonicApp
  ],
  //Pages hinzufügen
  entryComponents: [
    Main,
    Startseite,
    TourenSuche,
    TourenSucheErgebnis,
    TourenInfoModal,
    GespeicherteTouren,
    CheckpointInfoModal,
    Erlebnisradwege,
    Navigation,
    Map,
    Routenplaner,
    Pannentipps,
    Impressum
  ],
  //Providers (Service Handler) hinzufügen
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ConnectivityService,
    Storage,
    NavigationService,
    BiketripsService,
    PannentippsService
  ]
})
export class AppModule {}
