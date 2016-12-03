import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the BiketripTourService provider.
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class BiketripsService {

  data: any;
  filteredData: any;

  constructor(public http: Http) {
    // this.load()
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
      this.http.get('https://api.myjson.com/bins/2785q')
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

  console.log(suchwort);
  console.log(schwierigkeitsgrad);
  console.log(maxLaenge);
  console.log(minLaenge);

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
      this.http.get('https://api.myjson.com/bins/2785q')
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

// filterItems(suchwort: string, minLaenge: number, maxLaenge: number, schwierigkeitsgrad: number){
//     return this.data.filter((item) => {
//       return (item.title.toLowerCase().indexOf(suchwort.toLowerCase()) > -1 ||
//       item.startpunkt.stadt.toLowerCase().indexOf(suchwort.toLowerCase()) > -1) &&
//       item.schwieriegkeit == schwierigkeitsgrad &&
//       (item.laenge >= minLaenge && item.laenge <= maxLaenge);
//     });
// }

}
