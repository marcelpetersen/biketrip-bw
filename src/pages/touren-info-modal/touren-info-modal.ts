import { Component, ViewChild } from '@angular/core';
import { ViewController, NavController, NavParams, App } from 'ionic-angular';
import { Navigation } from '../navigation/navigation';
import { BiketripsService } from '../../providers/biketrips-service';
import { NativeStorage } from 'ionic-native';


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
    private navCtrl: NavController,
    private appCtrl: App,
    private viewCtrl: ViewController,
    private params: NavParams,
    private tourenService: BiketripsService
  ) {}

  ionViewDidLoad() {
    this.tourID = this.params.get('tour');
    this.loadBiketrips();

    NativeStorage.getItem('gespeichert').then(
      data => {
        if(data !== "-" || data !== null || data !== undefined) {
          this.gespeicherteTouren = data;
        } else {
          this.gespeicherteTouren = "0";
        }
      },
      error => this.gespeicherteTouren = "0"
    );
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
    this.appCtrl.getRootNav().setRoot(Navigation, {
      tourID: this.tourID
    });
  }

  tourSpeichern(id) {
    NativeStorage.getItem('gespeichert').then(
      data => {
        if(data !== "-" || data !== null || data !== undefined) {
          this.gespeicherteTouren = data + "," + String(id);
          NativeStorage.setItem("gespeichert", this.gespeicherteTouren).then(
            () => console.log('Stored item!'),
            error => console.error('Error storing item', error)
          );
        } else {
          this.gespeicherteTouren = String(id);
          NativeStorage.setItem("gespeichert", this.gespeicherteTouren).then(
            () => console.log('Stored item!'),
            error => console.error('Error storing item', error)
          );
        }
      },
      error => {
        this.gespeicherteTouren = String(id);
        NativeStorage.setItem("gespeichert", this.gespeicherteTouren).then(
          () => console.log('Stored item!'),
          error => console.error('Error storing item', error)
        );
      }
    );
  }

  dismiss() {
   this.viewCtrl.dismiss();
 }

}
