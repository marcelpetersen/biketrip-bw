import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController, ModalController } from 'ionic-angular';
import { Geolocation, Geoposition, PositionError } from 'ionic-native';

import { ConnectivityService } from '../../providers/connectivity-service';
import { BiketripsService } from '../../providers/biketrips-service';
import { NavigationService } from '../../providers/navigation-service';

import { TourenInfoModal } from '../touren-info-modal/touren-info-modal';
import { CheckpointInfoModal } from '../checkpoint-info-modal/checkpoint-info-modal';

import * as L from 'leaflet';
import * as Routing from 'leaflet-routing-machine';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  providers: [BiketripsService, NavigationService]
})

export class Navigation {
  //#map aus map.html ermitteln
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  layer: any;
  waypts: any[] = [];
  loading: any;
  subscription: any;
  biketrips: any;
  gestarteteTour: any = "none";
  latLng: any;
  directionsService: any;
  markerArray: any[] = [];

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public modalCtrl: ModalController,
    private connectivityService: ConnectivityService,
    public loadingCtrl: LoadingController,
    private tourenService: BiketripsService,
    private navigationService: NavigationService
  ) {
    this.gestarteteTour = params.get('tourID');
  }

  ionViewDidLoad() {
    this.showLoadingSpinner();
    this.loadBiketrips();
    this.loadMaps();
  }

  //Beim verlassen des Views wird watchPosition beendet.
  dismiss() {
    console.log("dismiss");
    this.map.remove();
    this.subscription.unsubscribe();
    this.disableMap();
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
    // console.log(this.gestarteteTour);
    if (this.gestarteteTour == 'none' || this.gestarteteTour == undefined) {
      this.tourenService.load()
        .then(data => {
          this.biketrips = data;
        });
    }
    else {
      this.tourenService.load()
        .then(data => {
          this.biketrips = data.find(x => x.id === this.gestarteteTour).checkpoints;
        });

    }
  }

  //Maps laden.
  loadMaps() {
    console.log("showing map");
    this.enableMap();
    Geolocation.getCurrentPosition().then((position) => {
      let c = L.latLng(position.coords.latitude, position.coords.longitude)
      this.initMap(c);
      //Spinner ausblenden, wenn Karte geladen.
      this.loading.dismiss();
      //Position aktualisieren
      this.initCheckpoints(c);
      // this.updatePosition();
    });
  }

  initMap(coordinates) {
    //Position festlegen
    console.log('Koordinaten festlegen...');
    this.latLng = coordinates;
    console.log('Koordinaten festgelegt');
    if (this.map == null) {
      console.log('map war null');
      this.map = L.map('map');
    }
    this.map.setView(this.latLng, 13);
    console.log('set view ausgeführt');
    this.layer = L.tileLayer('https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?{apikey}', {
      apikey: 'bb5cfe7826394f618732d66f50ca567e',
      attribution: 'Maps by <a href="https://thunderforest.com/">Thunderforest</a>',
      maxZoom: 18
    });

    L.control.zoom({
     position:'bottomright'
    }).addTo(this.map);

    if (!this.map.hasLayer(this.layer)) {
      console.log('add layer');
      this.layer.addTo(this.map);
    }
  }

  //Position aktualisieren mit watchPosition.subscribe
  updatePosition() {
    this.subscription = Geolocation.watchPosition().subscribe((position: Geoposition) => {
      //  console.log(position.coords.longitude + ' ' + position.coords.latitude);
      // let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let latLng = L.latLng(position.coords.latitude, position.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15
      }
      //Karte aktualisieren.
      this.map.setView(mapOptions);
      this.navigation();
    });
  }

  initCheckpoints(position) {
    if (this.gestarteteTour !== 'none' && this.gestarteteTour !== undefined) {
      this.addCheckpoints();
      this.waypts.push(position);

      if (this.biketrips[1].waypoints) {
        for (let i of this.biketrips[1].waypoints) {
          this.waypts.push(
            L.latLng(i.lat, i.lng)
          );
        }
      }
      this.waypts.push(
        L.latLng(this.biketrips[1].lat, this.biketrips[1].lng)
      );

      this.navigation();
    }
    else {
      this.addCheckpoints();
    }
  }

  navigation() {
    let accessToken = 'pk.eyJ1IjoiYmlrZXRyaXAtYnciLCJhIjoiY2l1OGRvY2dyMDAwZDJ0bWt2c3V1NTg3ZCJ9.wS5IN1Ke_I3_jmOfuX7u8A';
    let options = {
      serviceUrl: 'https://api.mapbox.com/directions/v5',
      profile: 'mapbox/cycling',
      useHints: false
    };
    Routing.control({
      waypoints: this.waypts,
      language: 'de',
      router: Routing.mapbox(accessToken, options),
      zoomControl: false,
      position: 'topleft',
    }).addTo(this.map);
  }

  disableMap() {
    console.log("disable map");
  }

  enableMap() {
    console.log("enable map");
  }

  //Erueugt die Checkpoints der Touren
  addCheckpoints() {
    console.log("add Markers - start");
    for (let entry of this.biketrips) {
      let marker;
      if (this.gestarteteTour !== 'none' && this.gestarteteTour !== undefined) {
        marker = L.marker({ lat: entry.lat, lng: entry.lng });
      } else {
        marker = L.marker({ lat: entry.startpunkt.lat, lng: entry.startpunkt.lng });
      }
      marker.addTo(this.map);
      this.addInfoWindow(marker, entry);
    }
  }
  //Fuegt Marker zur Karte hinzu.
  addInfoWindow(marker, checkpoint) {
    marker.on('click', (event) => {
      if (this.gestarteteTour !== 'none' && this.gestarteteTour !== undefined) {
        this.showCheckpointInfoModal(checkpoint);
      } else {
        this.showTourInfoModal(checkpoint);
      }
    });
  }
  //Oeffnet die Uebersichtsseite (Modal) einer Tour.
  showCheckpointInfoModal(cData) {
    let infoModal = this.modalCtrl.create(CheckpointInfoModal, { c: cData });
    infoModal.present();
  }
  //Oeffnet die Uebersichtsseite (Modal) einer Tour.
  showTourInfoModal(tData) {
    let infoModal = this.modalCtrl.create(TourenInfoModal, { tour: tData.id });
    infoModal.present();
  }
}
