import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { PannentippsService } from '../../providers/pannentipps-service';
import { PannentippsInfoModal } from '../pannentipps-info-modal/pannentipps-info-modal';

import * as Swiper from "swiper";

/*
  Generated class for the Pannentipps page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-pannentipps',
  templateUrl: 'pannentipps.html',
  providers: [PannentippsService]
})
export class Pannentipps {

  public pannentipps: any;
  public pSwiper: any;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public pannentippsData: PannentippsService
  ) {}

  ionViewDidLoad() {
    this.pSwiper = new Swiper('.image-wrapper', {
    loop: true,
    autoplay: 3000,
    pagination: '.swiper-pagination'
    });
    this.loadPannentipps();
  }

  loadPannentipps() {
    this.pannentippsData.load().then(data => {
      this.pannentipps = data;
    });
  }
  showPannentipp(id) {
    let data = this.pannentipps.find(x => x.id === id);
    let infoModal = this.modalCtrl.create(PannentippsInfoModal, { data: data, type: "pannentipp" });
    infoModal.present();
  }

  showCheckliste() {
    let data;
    let infoModal;
    this.pannentippsData.loadCheckliste().then(checkliste => {
      data = checkliste;
      infoModal = this.modalCtrl.create(PannentippsInfoModal, { data: data, type: "checkliste" });
      infoModal.present();
    });
  }

}
