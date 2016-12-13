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

  constructor(private navCtrl: NavController, public tourenService: BiketripsService, public modalCtrl: ModalController ) {
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
}
