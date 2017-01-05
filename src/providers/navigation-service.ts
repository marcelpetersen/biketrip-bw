import { Injectable } from '@angular/core';
import { Geolocation, Geoposition, PositionError } from 'ionic-native';
import * as L from 'leaflet';


// !!! Es muss noch eingebaut werden, was passiert, wenn GPS nicht erreichbar ist. !!!

@Injectable()
export class NavigationService {

  public userPosition: any;
  public initialized: boolean = false;
  public userLocationIcon: any = L.icon({
    iconUrl: './assets/img/map/user-location-marker.png',
    iconSize:     [40, 40], // size of the icon
    iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -50] // point from which the popup should open relative to the iconAnchor
});

  constructor() {}

  initialize() {
    Geolocation.getCurrentPosition().then((position) => {
       this.userPosition = L.latLng(position.coords.latitude, position.coords.longitude);
       this.initialized = true;
       //  console.log(this.userPosition);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getPosition() {
    if (this.userPosition) {
      // already loaded data
      return Promise.resolve(this.userPosition);
    }
    else {
      // don't have the data yet
      return new Promise(resolve => {
        Geolocation.getCurrentPosition().then((position) => {
          this.userPosition = L.latLng(position.coords.latitude, position.coords.longitude);
          return L.latLng(position.coords.latitude, position.coords.longitude);
        }).catch((error) => {
          console.log('Error getting location', error);
        });
      });
    }
  }

  updatePosition() {
    return new Promise(resolve => {
      Geolocation.watchPosition().subscribe((position: Geoposition) => {
        this.userPosition = L.latLng(position.coords.latitude, position.coords.longitude);
        return L.latLng(position.coords.latitude, position.coords.longitude);
      });
    });
  }
}
