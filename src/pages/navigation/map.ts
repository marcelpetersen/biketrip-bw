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
import 'leaflet-rotatedmarker';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})

export class Navigation {
  //#map aus map.html ermitteln
  @ViewChild('map') mapElement: HTMLElement;
  private map: any;
  private latLng: any;
  private layer: any;
  private waypts: any[] = [];
  private locate: any;
  private loading: any;
  private biketrips: any;
  private gestarteteTour: any = "none";
  private subscription: any;
  private route: any;

  public navigationGestartet: string = "none";

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
  ) {
    this.showLoadingSpinner();
    this.gestarteteTour = params.get('tourID');
  }

  ionViewDidLoad() {
    this.map = L.map('map');
    // this.layer = L.tileLayer('https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?{apikey}', {
    //   apikey: 'bb5cfe7826394f618732d66f50ca567e',
    //   attribution: 'Maps by <a href="https://thunderforest.com/">Thunderforest</a>',
    //   minZoom: 5,
    //   maxZoom: 17
    // });
    this.layer = L.tileLayer('https://api.mapbox.com/styles/v1/biketrip-bw/ciu8drfz1002l2inxsnyde0xj/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
      accessToken: 'pk.eyJ1IjoiYmlrZXRyaXAtYnciLCJhIjoiY2l1OGRvY2dyMDAwZDJ0bWt2c3V1NTg3ZCJ9.wS5IN1Ke_I3_jmOfuX7u8A',
      attribution: '<a href="http://openstreetmap.org">OSM</a> | <a href="http://mapbox.com">Mapbox</a>',
      minZoom: 5,
      maxZoom: 17
    });
    this.loadBiketrips();
    this.loadMaps();
  }

  //Beim verlassen des Views wird watchPosition beendet.
  ionViewWillLeave() {
    console.log("unload");
    this.map.off();
    this.map.remove();
    //Aktivieren, damit die Navigation gestoppt wird, wenn der Nutzer die Map verlässt.
    this.subscription.unsubscribe();
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
    if (this.gestarteteTour == 'none' || this.gestarteteTour == undefined) {
      this.tourenService.load()
        .then(data => {
          this.biketrips = data;
        });
    }
    else {
      this.navigationGestartet = "starten";
      this.tourenService.load()
        .then(data => {
          this.biketrips = data.find(item => item.id === this.gestarteteTour).checkpoints;
        });
    }
  }

  //Maps laden.
  loadMaps() {
    console.log("showing map");
    if(this.navigationService.initialized){
      this.navigationService.getPosition().then(latLng => {
        this.latLng = latLng;
        this.initMap();
        this.initCheckpoints();
        this.loading.dismiss();
      });
    } else {
      setTimeout(() => {this.loadMaps();},500);
    }
  }

  initMap() {

    this.map.setView(this.latLng, 13);

    L.control.zoom({
     position:'bottomright'
    }).addTo(this.map);

    // this.locate = L.marker([this.latLng.lat, this.latLng.lng], {rotationAngle: 90, rotationOrigin: 'center center'}, {icon: this.navigationService.userLocationIcon});
    this.locate = L.marker({lat:this.latLng.lat, lng: this.latLng.lng}, {icon: this.navigationService.userLocationIcon});

    this.locate.addTo(this.map);

    if (!this.map.hasLayer(this.layer)) {
      console.log('add layer');
      this.layer.addTo(this.map);
    }
  }

  locateUser() {
    Geolocation.getCurrentPosition().then((position) => {
      this.latLng = L.latLng(position.coords.latitude, position.coords.longitude);
      this.map.setView(this.latLng, 15);

      if(this.locate !== null){
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

  startNavigation() {
    console.log('start');
    this.navigationGestartet = "stoppen";
    //Wenn der Nutzer auf Start klickt, dann wird die Position aktualisiert.
    this.subscription = Geolocation.watchPosition().subscribe((position: Geoposition) => {
      this.latLng = L.latLng(position.coords.latitude, position.coords.longitude);
      this.waypts[0] = L.latLng(position.coords.latitude, position.coords.longitude);
      this.locate.setLatLng({ lat: position.coords.latitude, lng: position.coords.longitude });
      this.route.setWaypoints(this.waypts);
      this.map.setView(L.latLng(position.coords.latitude, position.coords.longitude), 18);
    });
  }

  cancelNavigation() {
    this.navigationGestartet = "starten";
    this.subscription.unsubscribe();
  }

  initCheckpoints() {
    if (this.gestarteteTour !== 'none' && this.gestarteteTour !== undefined) {
      this.addCheckpoints();
      this.waypts.push(this.latLng);

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
    this.route = Routing.control({
      waypoints: this.waypts,
      language: 'de',
      router: Routing.mapbox(this.accessToken, this.options),
      draggableWaypoints: false,
      createMarker: function() { return null; },
      zoomControl: false,
      position: 'topleft',
    });
    this.route.addTo(this.map);
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
