import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { Geolocation, Geoposition, PositionError } from 'ionic-native';

import { ConnectivityService } from '../../providers/connectivity-service';
import { BiketripsService } from '../../providers/biketrips-service';
import { NavigationService } from '../../providers/navigation-service';

import { TourenInfoModal } from '../touren-info-modal/touren-info-modal';

import * as L from 'leaflet';


@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class Map {//#map aus map.html ermitteln
  @ViewChild('map') mapElement: HTMLElement;
  public map: any;
  //Aktuelle Position
  private latLng: any;
  //Mapbox oder Thunderforest
  private layer: any;
  //UserPosition
  private locate: any;
  //Ladeanimation
  private loading: any;
  //Touren (Array mit Objekten)
  private biketrips: any;

  //Routing (Mapbox)
  private accessToken = 'pk.eyJ1IjoiYmlrZXRyaXAtYnciLCJhIjoiY2l1OGRvY2dyMDAwZDJ0bWt2c3V1NTg3ZCJ9.wS5IN1Ke_I3_jmOfuX7u8A';
  private options = {
    serviceUrl: 'https://api.mapbox.com/directions/v5',
    profile: 'mapbox/cycling',
    useHints: false
  };

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public modalCtrl: ModalController,
    private connectivityService: ConnectivityService,
    public loadingCtrl: LoadingController,
    private tourenService: BiketripsService,
    private navigationService: NavigationService
  ) { }

  ionViewDidLoad() {
    console.log("didLoad");
    if (this.map === undefined) {
      console.log("map neu laden");
      this.map = L.map('map', {
        zoomControl: false
      });
    } else {
      console.log("map already initialized");
    }

    this.showLoadingSpinner();

    //Thunderforest
    this.layer = L.tileLayer('https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?{apikey}', {
      apikey: 'bb5cfe7826394f618732d66f50ca567e',
      attribution: 'Maps by <a href="https://thunderforest.com/">Thunderforest</a>',
      minZoom: 5,
      maxZoom: 17
    });

    //Mapbox
    // this.layer = L.tileLayer('https://api.mapbox.com/styles/v1/biketrip-bw/ciu8drfz1002l2inxsnyde0xj/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    //   accessToken: 'pk.eyJ1IjoiYmlrZXRyaXAtYnciLCJhIjoiY2l1OGRvY2dyMDAwZDJ0bWt2c3V1NTg3ZCJ9.wS5IN1Ke_I3_jmOfuX7u8A',
    //   attribution: '<a href="http://openstreetmap.org">OSM</a> | <a href="http://mapbox.com">Mapbox</a>',
    //   minZoom: 5,
    //   maxZoom: 17
    // });
    this.loadBiketrips();
    this.loadMaps();
  }

  ionViewWillLeave() {
    console.log("exit navigation");
    this.map.off();
    this.map.remove();
  }

  dismiss() {
    console.log("dismiss");
    this.map.off();
    this.map.remove();
  }

  //Loading Spinner: Wird während dem Laden der Karte angezeigt.
  showLoadingSpinner() {
    this.loading = this.loadingCtrl.create({
      content: 'Karte wird geladen...'
    });
    this.loading.present();
  }

  //Marker mit Überischt der einzlenen Touren laden (Daten werden von biketrips-service Provider bereitgestellt)
  loadBiketrips() {
    this.tourenService.load().then(data => {
      this.biketrips = data;
    });
  }

  //Maps laden.
  loadMaps() {
    console.log("showing map");
    if (this.navigationService.initialized) {
      this.navigationService.getPosition().then(latLng => {
        this.latLng = latLng;
        this.initMap();
        this.addCheckpoints();
        this.loading.dismiss();
      });
    } else {
      setTimeout(() => { this.loadMaps(); }, 500);
    }
  }

  initMap() {
    console.log("init");
    this.map.setView(this.latLng, 13);

    L.control.zoom({
      position: 'bottomright'
    }).addTo(this.map);

    this.locate = L.marker({ lat: this.latLng.lat, lng: this.latLng.lng }, { icon: this.navigationService.userLocationIcon });
    this.locate.addTo(this.map);

    if (!this.map.hasLayer(this.layer)) {
      console.log('add layer');
      this.layer.addTo(this.map);
    }
  }

  //Nutzer per GPS lokalisieren
  locateUser() {
    Geolocation.getCurrentPosition().then((position) => {
      this.latLng = L.latLng(position.coords.latitude, position.coords.longitude);
      this.map.setView(this.latLng, 15);

      if (this.locate !== null) {
        console.log("update marker");
        this.locate.setLatLng({ lat: position.coords.latitude, lng: position.coords.longitude });
      }
      else {
        this.locate = L.marker({ lat: position.coords.latitude, lng: position.coords.longitude });
        this.locate.addTo(this.map);
        console.log("marker hinzufügen");
      }
    });
  }


  //Erzeugt die Checkpoints der Touren
  addCheckpoints() {
    console.log("add Markers - start");
    let marker: any[] = [];
    for (let i in this.biketrips) {
      marker.push(L.marker({ lat: this.biketrips[i].startpunkt.lat, lng: this.biketrips[i].startpunkt.lng }));
      marker[i].addTo(this.map);
      this.addInfoWindow(marker[i], this.biketrips[i]);
    }
  }
  //Fuegt Marker zur Karte hinzu.
  addInfoWindow(marker, obj) {
    marker.on('click', (event) => {
      this.showTourInfoModal(obj);
    });
  }

  //Oeffnet die Uebersichtsseite (Modal) einer Tour.
  showTourInfoModal(tData) {
    let infoModal = this.modalCtrl.create(TourenInfoModal, { tour: tData.id });
    infoModal.present();
  }
}
