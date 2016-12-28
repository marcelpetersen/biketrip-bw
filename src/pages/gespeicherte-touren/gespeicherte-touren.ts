import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { BiketripsService } from '../../providers/biketrips-service';
import { Storage } from '@ionic/storage';
import { TourenInfoModal } from '../touren-info-modal/touren-info-modal';


// declare var mapbox;

@Component({
  selector: 'page-gespeicherte-touren',
  templateUrl: 'gespeicherte-touren.html'
})
export class GespeicherteTouren {

  public gespeicherteTouren: any;
  public gespeicherteIds: any;

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public tourenService: BiketripsService,
    public modalCtrl: ModalController
  ) {}

  ionViewDidLoad() {

    this.storage.get('gespeichert').then((val) => {

      if(val !== "-" || val !== null || val !== undefined) {
      //Aus zurückgeliefertem String ein Array machen und dieses String-Array in Number-Array umwandeln
      this.gespeicherteIds = val.split(",").map(Number);
      //Biketrips laden und nach gespeicherten IDs filtern
      this.tourenService.load()
        .then(data => {
          this.gespeicherteTouren = data.filter((item) => {
            return (this.gespeicherteIds.indexOf(item.id) !== -1);
          });
        });
      }

    });
  }

  //Oeffnet die Uebersichtsseite (Model) einer Tour.
  showTourInfoModal(t) {
    let infoModal = this.modalCtrl.create(TourenInfoModal, { tour: t });
    infoModal.present();
  }

  deleteAll() {
    // this.storage.remove("gespeichert");
    this.storage.set("gespeichert", "-");
    this.gespeicherteTouren = null;

  }

  deleteFavourite(g) {
    // console.log("gelöschte ID: " + g);
    // console.log("IDs: " + this.gespeicherteIds);
    // console.log("indexOf" + this.gespeicherteIds.indexOf(g, 0));

    //Einzelne Tour aus dem Array gespeicherteTouren und aus dem Storage Value löschen.
    if(this.gespeicherteIds.indexOf(g, 0) > -1){
      this.gespeicherteIds.splice(this.gespeicherteIds.indexOf(g, 0), 1);
      this.gespeicherteTouren = this.gespeicherteTouren.filter((item) => {
        return (this.gespeicherteIds.indexOf(item.id) !== -1);
      });
      this.storage.set("gespeichert", this.gespeicherteIds.toString());
    }
  }
}
