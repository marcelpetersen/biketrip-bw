import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as L from 'leaflet';
import * as Routing from 'leaflet-routing-machine';
import * as Geocoder from 'leaflet-control-geocoder';

@Component({
  selector: 'page-routenplaner',
  templateUrl: 'routenplaner.html'
})
export class Routenplaner {

  public map: any;
  public routingPlan: any;
  public controlPanel: any;
  //Routing (Mapbox)
  private accessToken = 'pk.eyJ1IjoiYmlrZXRyaXAtYnciLCJhIjoiY2l1OGRvY2dyMDAwZDJ0bWt2c3V1NTg3ZCJ9.wS5IN1Ke_I3_jmOfuX7u8A';
  private options = {
    serviceUrl: 'https://api.mapbox.com/directions/v5',
    profile: 'mapbox/cycling',
    useHints: false,
    alternatives: false
  };
  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    this.map = L.map('routenplaner', {
      zoomControl: false
    }).setView(L.latLng(48.673, 8.039), 8);

    L.tileLayer('https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?{apikey}', {
      apikey: 'bb5cfe7826394f618732d66f50ca567e',
      attribution: 'Maps by <a href="https://thunderforest.com/">Thunderforest</a>',
      minZoom: 5,
      maxZoom: 17
    }).addTo(this.map);

    this.map.on('click', e => {
      let container = L.DomUtil.create('div');
      let startBtn = this.createButton('Start festlegen?', container);
      let destBtn = this.createButton('Ziel festlegen?', container);

      L.popup()
          .setContent(container)
          .setLatLng(e.latlng)
          .openOn(this.map);
      L.DomEvent.on(startBtn, 'click', () => {
          this.controlPanel.spliceWaypoints(0, 1, e.latlng);
          this.map.closePopup();
      });
      L.DomEvent.on(destBtn, 'click', () => {
      this.controlPanel.spliceWaypoints(this.controlPanel.getWaypoints().length - 1, 1, e.latlng);
      this.map.closePopup();
      });
    });


    L.control.zoom({
     position:'bottomright'
    }).addTo(this.map);

    let ReservablePlan = Routing.Plan.extend({createGeocoders: function() {
        let container = Routing.Plan.prototype.createGeocoders.call(this);
        let reverseButton = L.DomUtil.create('button', '', container);
        reverseButton.setAttribute('type', 'button');
        reverseButton.innerHTML = '&#x2191;&#x2193;';
        return container;
      }
    });

    this.routingPlan = new ReservablePlan([
        //Vorausgefüllte Koordinaten
        //L.latLng(57.74, 11.94),
        //L.latLng(57.6792, 11.949)
    ], {
        geocoder: Geocoder.nominatim(),
        routeWhileDragging: true,
        language: 'de'
    });


    this.controlPanel = Routing.control({
      plan: this.routingPlan,
      language: 'de',
      router: Routing.mapbox(this.accessToken, this.options),
      pointMarkerStyle: {radius: 5,color: '#145648',fillColor: 'white',opacity: 1,fillOpacity: 0.7},
      position: 'topleft'
    }).addTo(this.map);
  }

  createButton(label, container) {
    let btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
  }



}
