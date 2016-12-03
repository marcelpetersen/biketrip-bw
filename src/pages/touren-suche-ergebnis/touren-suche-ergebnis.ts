import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { BiketripsService } from '../../providers/biketrips-service';
import { TourenInfoModal } from '../touren-info-modal/touren-info-modal';

@Component({
  selector: 'page-touren-suche-ergebnis',
  templateUrl: 'touren-suche-ergebnis.html',
  providers: [BiketripsService]

})
export class TourenSucheErgebnis {

  public suchergebnis: any;

  constructor(public navCtrl: NavController, public params: NavParams, public tourenService: BiketripsService, public modalCtrl: ModalController) {

  }

  ionViewDidLoad() {
    this.ergebnisseAnzeigen();
  }

  ergebnisseAnzeigen() {
    this.tourenService.filterItems(this.params.get('s'), this.params.get('mi'), this.params.get('mx'), this.params.get('d'))
      .then(data => {
        this.suchergebnis = data;
      });
  }

  //Oeffnet die Uebersichtsseite (Model) einer Tour.
  showTourInfoModal(t) {
    let infoModal = this.modalCtrl.create(TourenInfoModal, { tour: t });
    infoModal.present();
  }


}
