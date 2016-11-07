import { Component } from '@angular/core';

import {  ViewController, NavParams } from 'ionic-angular';
//Modal

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class Search {

  constructor(public viewCtrl: ViewController, params: NavParams) {
    console.log('Parameter: ', params.get('userId'));
  }
  dismiss() {
   this.viewCtrl.dismiss();
 }
}
