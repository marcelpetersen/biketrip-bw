import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-checkpoint-info-modal',
  templateUrl: 'checkpoint-info-modal.html',
})
export class CheckpointInfoModal {

  checkpointData: Object;

  constructor(
    public navCtrl: NavController,
    private params: NavParams,
    private viewCtrl: ViewController
  ) {
    this.checkpointData = params.get("c");
  }

  ionViewDidLoad() {

  }

  dismiss() {
   this.viewCtrl.dismiss();
 }

}
