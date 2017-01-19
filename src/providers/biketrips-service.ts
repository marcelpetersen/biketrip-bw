import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class BiketripsService {

  data: any;
  filteredData: any;

  constructor(public http: Http) {
    // this.load()
  }

  initialize() {
    // this.http.get('https://api.myjson.com/bins/2785q')
    this.http.get('./assets/data/biketrips.json')
      .map(res => res.json())
      .subscribe(data => {
        this.data = data.results;
      });
      console.log("JSON geladen");
  }

  load() {
  if (this.data) {
    // already loaded data
    console.log("data already loaded");
    return Promise.resolve(this.data);
  }
  else {
    // don't have the data yet
    console.log("load data");
    return new Promise(resolve => {
      // this.http.get('https://api.myjson.com/bins/2785q')
      this.http.get('./assets/data/biketrips.json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data.results;
          resolve(this.data);
        });
    });
  }
}


//Filterung bei Suche:
//Suchwort ist pflicht. Hier kann der Name oder der Startpunkt eingegeben werden.
//Mindest- und Maximallänge können optional mitgegeben werden.
//Der Schwierigkeitsgrad kann optional mitgegeben werden.
filterItems(suchwort: string, minLaenge?: number, maxLaenge?: number, schwierigkeitsgrad?: any){

  if(!suchwort) {
    suchwort = "";
  }
  if(!schwierigkeitsgrad || schwierigkeitsgrad.length === 0) {
    schwierigkeitsgrad = [1,2,3];
  }
  if(!minLaenge && !maxLaenge) {
    minLaenge = 0;
    maxLaenge = 9999;

  }

  // console.log(suchwort);
  // console.log(schwierigkeitsgrad);
  // console.log(maxLaenge);
  // console.log(minLaenge);

  if (this.filteredData) {
    console.log('JSON vorhanden');
    return this.filteredData.filter((item) => {
      return (item.title.toLowerCase().indexOf(suchwort.toLowerCase()) > -1 ||
      item.startpunkt.stadt.toLowerCase().indexOf(suchwort.toLowerCase()) > -1) &&
      (item.laenge >= minLaenge && item.laenge <= maxLaenge) &&
      (schwierigkeitsgrad.indexOf(item.schwierigkeitsgrad) !== -1);
    });
  } else {
    console.log('JSON laden');
    return new Promise(resolve => {
      // this.http.get('https://api.myjson.com/bins/2785q')
      this.http.get('./assets/data/biketrips.json')
        .map(res => res.json())
        .subscribe(data => {
          this.filteredData = data.results.filter((item) => {
            return (item.title.toLowerCase().indexOf(suchwort.toLowerCase()) > -1 ||
            item.startpunkt.stadt.toLowerCase().indexOf(suchwort.toLowerCase()) > -1) &&
            (item.laenge >= minLaenge && item.laenge <= maxLaenge) &&
            (schwierigkeitsgrad.indexOf(item.schwierigkeitsgrad) !== -1);
          });
          resolve(this.filteredData);
        });
    });
  }
}

}
