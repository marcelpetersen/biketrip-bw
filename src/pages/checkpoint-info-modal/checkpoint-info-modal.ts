import { Component } from '@angular/core';
import { Slides, ViewController, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: 'page-checkpoint-info-modal',
  templateUrl: 'checkpoint-info-modal.html',
})
export class CheckpointInfoModal {

  //Slideshow
  mySlideOptions = {
    initialSlide: 0,
    loop: true,
    autoplay: 3000,
    pager: true
  };
  sketchfab;
  checkpointData: any;

  constructor(
    public navCtrl: NavController,
    private params: NavParams,
    private viewCtrl: ViewController,
    public sanitizer: DomSanitizer
  ) {
    this.checkpointData = params.get("c");
  }

  ionViewDidLoad() {

  }

  dismiss() {
   this.viewCtrl.dismiss();
 }

}
