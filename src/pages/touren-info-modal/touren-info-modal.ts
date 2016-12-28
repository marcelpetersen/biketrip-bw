import { Component, ViewChild } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { Navigation } from '../navigation/navigation';
import { BiketripsService } from '../../providers/biketrips-service';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-touren-info-modal',
  templateUrl: 'touren-info-modal.html'
})
export class TourenInfoModal {

  public tourID : number;
  public biketrips: any;
  public tour : any;
  public gespeicherteTouren: any = "0";

  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private params: NavParams,
    private tourenService: BiketripsService
  ) {}

  ionViewDidLoad() {
    this.tourID = this.params.get('tour');
    this.loadBiketrips();

    this.storage.get('gespeichert').then((val) => {
      if( val === "-" || val === null || val === undefined ){
        this.gespeicherteTouren = "0";
      } else {
        this.gespeicherteTouren = val;
      }
    });
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

    // this.navViewCtrl.dismiss();
    this.navCtrl.push(Navigation, {
      tourID: this.tourID
    });
  }

  tourSpeichern(id) {
    // console.log("click");

    // console.log("Gespeichert: " + this.storage.get("gespeichert"));

    this.storage.get('gespeichert').then((val) => {
      if( val === "-" || val === null || val === undefined ){
        // console.log("init = null");
        this.gespeicherteTouren = String(id);
      } else {
        // console.log("else");
        this.gespeicherteTouren = val + "," + String(id);
      }
      // console.log("Gespeicherte Tour: " + this.gespeicherteTouren);

      this.storage.set("gespeichert", this.gespeicherteTouren);
    });

    //Kontrolle
    this.storage.get('gespeichert').then((val) => {
      // console.log('Gespeicherte Touren: ', val);
    });
  }

  dismiss() {
   this.viewCtrl.dismiss();
 }

}
