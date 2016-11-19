import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
//Um zu verhindern, dass die Google Maps crashen, wenn kein Internet verfügbar ist.
import { ConnectivityService } from '../providers/connectivity-service';


//Komponenten importieren (muss bei neuen Pages ergaenzt werden.)
import { MyApp } from './app.component';
import { Main } from '../pages/startseite/startseite';
import { TourenSuche } from '../pages/touren-suche/touren-suche';
import { TourenInfoModal } from '../pages/touren-info-modal/touren-info-modal';
import { CheckpointInfoModal } from '../pages/checkpoint-info-modal/checkpoint-info-modal';
import { Erlebnisradwege } from '../pages/erlebnisradwege/erlebnisradwege';
import { Navigation } from '../pages/navigation/map';
import { Routenplaner } from '../pages/routenplaner/routenplaner';
import { Pannentipps } from '../pages/pannentipps/pannentipps';
import { Einstellungen } from '../pages/einstellungen/einstellungen';

//Module laden
@NgModule({
  declarations: [
    MyApp,
    Main,
    TourenSuche,
    TourenInfoModal,
    CheckpointInfoModal,
    Erlebnisradwege,
    Navigation,
    Routenplaner,
    Pannentipps,
    Einstellungen
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      backButtonText: 'Zurück',
    }, {}
  )],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Main,
    TourenSuche,
    TourenInfoModal,
    CheckpointInfoModal,
    Erlebnisradwege,
    Navigation,
    Routenplaner,
    Pannentipps,
    Einstellungen
  ],
  providers: [ConnectivityService]
})
export class AppModule {}
