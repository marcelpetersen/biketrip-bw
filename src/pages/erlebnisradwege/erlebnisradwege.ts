import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { LocalNotifications } from 'ionic-native';
import { BiketripsService } from '../../providers/biketrips-service';
import { TourenInfoModal } from '../touren-info-modal/touren-info-modal';


@Component({
  selector: 'page-erlebnisradwege',
  templateUrl: 'erlebnisradwege.html'
})
export class Erlebnisradwege {

  public touren: any;
  public screenOrientation: any;

  constructor(
    private navCtrl: NavController,
    public tourenService: BiketripsService,
    public modalCtrl: ModalController
  ) {}

  ionViewDidLoad() {   
    this.loadTour();
  }

  loadTour() {
    this.tourenService.load().then(data => {this.touren = data;});
  }

  //Oeffnet die Uebersichtsseite (Model) einer Tour.
  showTourInfoModal(t) {
    let infoModal = this.modalCtrl.create(TourenInfoModal, { tour: t });
    infoModal.present();
  }

  changeOrientation() {
       switch (window.orientation) {
           case 0:
               this.screenOrientation = 'portrait';
               break;
           case 90:
               this.screenOrientation = 'landscape';
               break;
           case 180:
               this.screenOrientation = 'portrait';
               break;
           case -90:
               this.screenOrientation = 'landscape';
               break;
           default:
               this.screenOrientation = 'unknown';
       }
   }
}
