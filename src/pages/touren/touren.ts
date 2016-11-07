import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocalNotifications } from 'ionic-native';
import { BiketripTourService } from '../../providers/biketrip-tour-service';


@Component({
  selector: 'page-touren',
  templateUrl: 'touren.html',
  providers: [BiketripTourService]

})
export class Touren {

  public touren: any;

  constructor(private navCtrl: NavController, public tourService: BiketripTourService, ) {
    this.loadTour();

  }

  loadTour() {
    this.tourService.load()
      .then(data => {
        this.touren = data;
      });
  }

  public schedule() {
    LocalNotifications.schedule({
      title: "Test Title",
      text: "Delayed Notification",
      at: new Date(new Date().getTime() + 5 * 1000),
      sound: null
    });
  }
}
