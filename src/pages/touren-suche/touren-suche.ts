import { Component } from '@angular/core';

import {  ViewController, NavParams, Keyboard } from 'ionic-angular';
//Modal

@Component({
  selector: 'page-touren-suche',
  templateUrl: 'touren-suche.html'
})
export class TourenSuche {

  constructor(public viewCtrl: ViewController, params: NavParams, public keyboardCtrl: Keyboard) {
    console.log('Parameter: ', params.get('userId'));
  }
  dismiss() {
  //  let data = { 'foo': 'bar' };
  this.viewCtrl.dismiss();
  this.keyboardCtrl.close();
 }
}
