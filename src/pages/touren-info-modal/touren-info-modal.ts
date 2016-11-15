import { Component } from '@angular/core';
import {  ViewController, NavController, NavParams } from 'ionic-angular';
import { BiketripsService } from '../../providers/biketrips-service';


/*
  Generated class for the TourenInfoModal page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-touren-info-modal',
  templateUrl: 'touren-info-modal.html',
  providers: [BiketripsService]

})
export class TourenInfoModal {

  public tourID : number;
  public biketrips: any;
  public tour : any;


  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public params: NavParams,
    public tourenService: BiketripsService
  ) {
    this.tourID = params.get('tour');
    this.loadBiketrips();

  }

  //Marker mit Überischt der einzlenen Touren laden (Daten werden von biketrips-service Provider bereitgestellt)
  loadBiketrips() {
    this.tourenService.load()
      .then(touren => {
        this.biketrips = touren;
        // Tour finden, die zur jeweiligen ID passt.
        this.tour = this.biketrips.find(x => x.id === this.tourID);
        // console.log(this.tour);

      });
  }

  dismiss() {
   this.viewCtrl.dismiss();
 }

}
