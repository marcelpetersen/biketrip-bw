import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { BiketripsService } from '../../providers/biketrips-service';
import { NativeStorage } from 'ionic-native';
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
    public tourenService: BiketripsService,
    public modalCtrl: ModalController
  ) {}

  ionViewDidLoad() {

    NativeStorage.getItem('gespeichert').then(
      data => {
        if(data !== "-" || data !== null || data !== undefined) {
        //Aus zurückgeliefertem String ein Array machen und dieses String-Array in Number-Array umwandeln
        this.gespeicherteIds = data.split(",").map(Number);
        //Biketrips laden und nach gespeicherten IDs filtern
        this.tourenService.load()
          .then(data => {
            this.gespeicherteTouren = data.filter((item) => {
              return (this.gespeicherteIds.indexOf(item.id) !== -1);
            });
          });
        } else {
          this.gespeicherteTouren = null;
        }
      },
      error => {
        console.log("Nothing Found!");
        this.gespeicherteTouren = null;

      }
    );
  }

  //Oeffnet die Uebersichtsseite (Model) einer Tour.
  showTourInfoModal(t) {
    let infoModal = this.modalCtrl.create(TourenInfoModal, { tour: t });
    infoModal.present();
  }

  deleteAll() {
    // this.storage.remove("gespeichert");
    NativeStorage.setItem("gespeichert", "-");
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
      NativeStorage.setItem("gespeichert", this.gespeicherteIds.toString());
    }
  }
}
