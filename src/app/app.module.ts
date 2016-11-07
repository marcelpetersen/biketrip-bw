import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
//Um zu verhindern, dass die Google Maps crashen, wenn kein Internet verfügbar ist.
import { ConnectivityService } from '../providers/connectivity-service';


//Komponenten importieren
import { MyApp } from './app.component';
import { Main } from '../pages/main/startseite';
import { Search } from '../pages/search/search';
import { Touren } from '../pages/touren/touren';
import { Navigation } from '../pages/navigation/map';
import { Routenplaner } from '../pages/routenplaner/routenplaner';
import { Pannentipps } from '../pages/pannentipps/pannentipps';
import { Settings } from '../pages/settings/settings';

//Module laden
@NgModule({
  declarations: [
    MyApp,
    Main,
    Search,
    Touren,
    Navigation,
    Routenplaner,
    Pannentipps,
    Settings
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
    Search,
    Touren,
    Navigation,
    Routenplaner,
    Pannentipps,
    Settings
  ],
  providers: [ConnectivityService]
})
export class AppModule {}
