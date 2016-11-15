import { Injectable } from '@angular/core';


@Injectable()
export class BiketripsService {

  tourenMarker: any = [
    {parentId: 1, id: 1001, lat:49.4829556,  lng:8.4604577,  name: 'Barockschloss Mannheim', description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.'},//Schloss
    {parentId: 1, id: 1002, lat:49.48525,    lng:8.462546,   name: 'Wohnhaus M1, 8', description: 'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'},        //Wohnhaus M1, 8
    {parentId: 1, id: 1003, lat:49.482215,   lng:8.4640637,  name: 'Schlossgarten', image:'https://images.unsplash.com/23/parked-bike.JPG'},         //Schlossgarten
    {parentId: 1, id: 1004, lat:49.4713253,  lng:8.4819766,  name: 'Neckarauer Übergang'},   //Neckarauer Übergang
    {parentId: 1, id: 1005, lat:49.4447154,  lng:8.5102447,  name: 'Casterfeldstrasse'},     //Casterfeldstrasse
    {parentId: 1, id: 1006, lat:49.439063,   lng:8.5229175,  name: 'Karl Drais Denkmal'},    //Drais Denkmal
    {parentId: 1, id: 1007, lat:49.463337,   lng:8.516767,   name: 'SAP Arena'},             //SAP Arena
    {parentId: 1, id: 1008, lat:49.476813,   lng:8.494371,   name: 'Technoseum'},            //Technoseum
    {parentId: 1, id: 1009, lat:49.4840577,  lng:8.4733625,  name: 'Wasserturm'},            //Wasserturm
    {parentId: 1, id: 1010, lat:49.482981,   lng:8.4777895,  name: 'Karl Benz Denkmal'}      //Benz Denkmal
  ];

  touren: any = [
    {id:1, lat:49.4829556,  lng:8.4604577,  name: 'Karl Drais Tour', laenge:'19.4km', schwierigkeitsgrad:'mittel', description:'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.', image:'https://images.unsplash.com/23/parked-bike.JPG'},
    {id:2, lat:49.0134942,  lng:8.4021663,  name: 'Karlsruhe erleben', laenge:'9.0km', schwierigkeitsgrad:'leicht',},
    {id:3, lat:48.49256,    lng:8.0213413,  name: 'Weinschmeckertour', laenge:'25.8km', schwierigkeitsgrad:'schwer',}

  ];

  constructor(){}

  load() {
    return Promise.resolve(this.touren);
  }

}
