import { Component, ViewChild } from '@angular/core';
import { App, Nav, ViewController, NavController, NavParams } from 'ionic-angular';
import { Navigation } from '../navigation/map';
import { BiketripsService } from '../../providers/biketrips-service';
import { Storage } from '@ionic/storage';


/*
  Generated class for the TourenInfoModal page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-touren-info-modal',
  templateUrl: 'touren-info-modal.html'
})
export class TourenInfoModal {

  public tourID : number;
  public biketrips: any;
  public tour : any;


  constructor(
    private storage: Storage,
    private appCtrl: App,
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private params: NavParams,
    private tourenService: BiketripsService
  ) {
    this.tourID = params.get('tour');
    this.loadBiketrips();

  }

  //Marker mit Überischt der einzlenen Touren laden (Daten werden von biketrips-service Provider bereitgestellt)
  loadBiketrips() {
    this.tourenService.load()
      .then(data => {
        this.biketrips = data;
        // Tour finden, die zur jeweiligen ID passt.
        this.tour = this.biketrips.find(x => x.id === this.tourID);
        // console.log(this.tour);

      });
  }

  tourStarten() {
    //Dismiss, damit die Karte nicht über die Seite gelegt wird, sondern wirklich neu geöffnet wird.
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().setRoot(Navigation, {
      tourID: this.tourID
    });
  }

  tourSpeichern(id){
    this.storage.set('gespeichert', id);
  }

  dismiss() {
   this.viewCtrl.dismiss();
 }

}
