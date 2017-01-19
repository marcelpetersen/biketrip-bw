import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class PannentippsService {

  data: any;
  checkliste: any;

  constructor(public http: Http) {
    // this.load()
  }

  initialize() {
    // this.http.get('https://api.myjson.com/bins/iobux')
    this.http.get('./assets/data/pannentipps.json')
      .map(res => res.json())
      .subscribe(data => {
        this.data = data.results;
        this.checkliste = data.checkliste;
      });
  }

  load() {
  if (this.data) {
    // already loaded data
    return Promise.resolve(this.data);
  }
  else {
    // don't have the data yet
    return new Promise(resolve => {
      // this.http.get('https://api.myjson.com/bins/iobux')
      this.http.get('./assets/data/pannentipps.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data.results;
          resolve(this.data);
        });
    });
  }
}
  loadCheckliste() {
  if (this.checkliste) {
    // already loaded data
    return Promise.resolve(this.checkliste);
  }
  else {
    // don't have the data yet
    return new Promise(resolve => {
      // this.http.get('https://api.myjson.com/bins/iobux')
      this.http.get('./assets/data/pannentipps.json')
        .map(res => res.json())
        .subscribe(data => {
          this.checkliste = data.checkliste;
          resolve(this.checkliste);
        });
    });
  }
}

}
