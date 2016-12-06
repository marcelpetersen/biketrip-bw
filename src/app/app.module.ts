import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
//Um zu verhindern, dass die Google Maps crashen, wenn kein Internet verfügbar ist.
import { ConnectivityService } from '../providers/connectivity-service';

//Komponenten importieren (muss bei neuen Pages ergaenzt werden.)
import { BiketripBW } from './app.component';
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


//Module laden
@NgModule({
  declarations: [
    BiketripBW,
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
    IonicModule.forRoot(BiketripBW, {
      backButtonText: 'Zurück',
    }, {}
  )],
  bootstrap: [IonicApp],
  entryComponents: [
    BiketripBW,
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
  providers: [ConnectivityService]
})
export class AppModule {}
