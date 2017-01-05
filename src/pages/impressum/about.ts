import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class Impressum {

  constructor(
    public navCtrl: NavController,
    public platform: Platform) {

  }

}
