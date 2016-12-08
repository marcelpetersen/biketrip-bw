import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { ConnectivityService } from '../providers/connectivity-service';


//Komponenten importieren (muss bei neuen Pages ergaenzt werden.)
import { Main } from './app.component';
import { Startseite } from '../pages/startseite/startseite';
//Seiten
import { TourenSuche } from '../pages/touren-suche/touren-suche';
import { TourenSucheErgebnis } from '../pages/touren-suche-ergebnis/touren-suche-ergebnis';
import { Erlebnisradwege } from '../pages/erlebnisradwege/erlebnisradwege';
import { Navigation } from '../pages/navigation/map';
import { Routenplaner } from '../pages/routenplaner/routenplaner';
import { Pannentipps } from '../pages/pannentipps/pannentipps';
import { Impressum } from '../pages/impressum/about';
//Modals
import { TourenInfoModal } from '../pages/touren-info-modal/touren-info-modal';
import { CheckpointInfoModal } from '../pages/checkpoint-info-modal/checkpoint-info-modal';

import { Routing } from 'leaflet-routing-machine';
import * as L from 'leaflet';


@NgModule({
  declarations: [
    Main,
    Startseite,
    TourenSuche,
    TourenSucheErgebnis,
    TourenInfoModal,
    CheckpointInfoModal,
    Erlebnisradwege,
    Navigation,
    Routenplaner,
    Pannentipps,
    Impressum
  ],
  imports: [
    IonicModule.forRoot(Main, {
      backButtonText: 'Zurück',
    }, {}
  )],
  bootstrap: [IonicApp],
  entryComponents: [
    Main,
    Startseite,
    TourenSuche,
    TourenSucheErgebnis,
    TourenInfoModal,
    CheckpointInfoModal,
    Erlebnisradwege,
    Navigation,
    Routenplaner,
    Pannentipps,
    Impressum
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, ConnectivityService]
})
export class AppModule {}
