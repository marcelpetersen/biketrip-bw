import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the CheckpointInfoModal page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-checkpoint-info-modal',
  templateUrl: 'checkpoint-info-modal.html'
})
export class CheckpointInfoModal {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello CheckpointInfoModal Page');
  }

}
