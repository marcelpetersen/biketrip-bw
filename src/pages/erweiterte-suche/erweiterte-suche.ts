import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'page-erweiterte-suche',
  templateUrl: 'erweiterte-suche.html'
})
export class ErweiterteSuche {

  constructor(public viewCtrl: ViewController) {}

  close() {
    this.viewCtrl.dismiss();
  }

}
