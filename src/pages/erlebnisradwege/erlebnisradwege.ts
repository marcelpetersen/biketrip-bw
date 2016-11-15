import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocalNotifications } from 'ionic-native';
import { BiketripsService } from '../../providers/biketrips-service';


@Component({
  selector: 'page-erlebnisradwege',
  templateUrl: 'erlebnisradwege.html',
  providers: [BiketripsService]

})
export class Erlebnisradwege {

  public touren: any;

  constructor(private navCtrl: NavController, public tourenService: BiketripsService, ) {
    this.loadTour();

  }

  loadTour() {
    this.tourenService.load()
      .then(touren => {
        this.touren = touren;
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
