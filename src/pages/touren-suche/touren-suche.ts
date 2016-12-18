import { Component } from '@angular/core';
import { ViewController, NavController  } from 'ionic-angular';
import { TourenSucheErgebnis } from '../touren-suche-ergebnis/touren-suche-ergebnis';

@Component({
  selector: 'page-touren-suche',
  templateUrl: 'touren-suche.html'

})
export class TourenSuche {

  suchwort: any = "";
  laengeRange: any = [
    {lower: 0},
    {upper: 200}
  ];
  schwierigkeitsgrad: any = [
    {name:'Einfach', value:1, checked:false},
    {name:'Mittel', value:2, checked:false},
    {name:'Schwer', value:3, checked:false}
  ];
  advancedSearch: boolean = false;

  constructor(
    private viewCtrl: ViewController,
    private navCtrl: NavController
  ) {
  }


  selectedOptions() {
    return this.schwierigkeitsgrad.filter(opt => opt.checked).map(opt => opt.value);
  }

  toggleErweitert() {
    this.advancedSearch = !this.advancedSearch;

  }

  suchen() {
    this.navCtrl.push(TourenSucheErgebnis, {s:this.suchwort, mi:this.laengeRange.lower, mx:this.laengeRange.upper, d:this.selectedOptions()});
  }

}
