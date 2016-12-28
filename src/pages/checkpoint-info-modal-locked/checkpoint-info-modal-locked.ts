import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-checkpoint-info-modal-locked',
  templateUrl: 'checkpoint-info-modal-locked.html'
})
export class CheckpointInfoModalLocked {

  constructor(
    public navCtrl: NavController,
    private params: NavParams,
    private viewCtrl: ViewController
  ) {
    this.checkpointName = params.get("n");
    this.distance = Math.floor(params.get("d"));
  }

  checkpointName: any;
  distance: Number;

  ionViewDidLoad() {

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
