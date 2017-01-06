import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the BiketripTourService provider.
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PannentippsService {

  data: any;
  checkliste: any;

  constructor(public http: Http) {
    // this.load()
  }

  initialize() {
    this.http.get('https://api.myjson.com/bins/iobux')
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
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      // this.http.get('https://randomuser.me/api/?results=10')
      this.http.get('https://api.myjson.com/bins/iobux')
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
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      // this.http.get('https://randomuser.me/api/?results=10')
      this.http.get('https://api.myjson.com/bins/iobux')
        .map(res => res.json())
        .subscribe(data => {
          this.checkliste = data.checkliste;
          resolve(this.checkliste);
        });
    });
  }
}

}
