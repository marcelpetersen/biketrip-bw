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
  mapInitialised: boolean = false;
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
    this.showLoadingSpinner();
    this.loadBiketrips();
  }

  //Beim verlassen des Views wird watchPosition beendet.
  dismiss() {
    this.mapInitialised = false;
    this.subscription.unsubscribe();
    this.disableMap();
  }

  //Loading Spinner: Wird während dem Laden der Karte angezeigt.
  showLoadingSpinner() {
    this.loading = this.loadingCtrl.create({
      content: 'Karte wird geladen...'
    });
    this.loading.present();
    //Aufruf der Karte
    this.loadMaps();

  }

  //Marker mit Überischt der einzlenen Touren laden (Daten werden von biketrips-service Provider bereitgestellt)
  loadBiketrips() {
    console.log(this.gestarteteTour);
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

  //Google Maps laden.
  loadMaps() {
    console.log("showing map");
    this.initMap();
    this.enableMap();
  }

  //Map Initialisieren
  initMap() {

    this.mapInitialised = true;

    Geolocation.getCurrentPosition().then((position) => {
      //Position festlegen
      this.latLng = L.latLng(position.coords.latitude, position.coords.longitude);

      this.map = L.map('map').setView(this.latLng, 13);
      L.tileLayer('https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?{apikey}', {
        apikey: 'bb5cfe7826394f618732d66f50ca567e',
        attribution: 'Maps by <a href="https://thunderforest.com/">Thunderforest</a>',
        maxZoom: 18
      }).addTo(this.map);

      //Navigation !!!
      
      // Routing.control({
      //     waypoints: [
      //         L.latLng(this.latLng),
      //         L.latLng(48.6792, 9.949)
      //     ]
      // }).addTo(this.map);

      //Spinner ausblenden, wenn Karte geladen.
      this.loading.dismiss();

      //Position aktualisieren
      this.updatePosition();

      if (this.gestarteteTour !== 'none' && this.gestarteteTour !== undefined) {
        this.addCheckpoints();
        //Start: Entweder die eigene Position, oder der aktuelle Checkpoint.
        let start = { lat: this.biketrips[0].lat, lng: this.biketrips[0].lng };
        //End: Der nächste Checkpoint
        let end = { lat: this.biketrips[1].lat, lng: this.biketrips[1].lng };
        //Waypoints:Da Google immer die optimale Route berechnet müssen zusätzliche Waypoints hinzugefügt werden,
        //damit die Route mit der echten Route übereinstimmt. Die Waypoints der aktuellen Route sind immer im Ziel-Checkpoint
        //gespeichert.
        let waypts: any[] = [];
        if(this.biketrips[1].waypoints) {
          for (let i of this.biketrips[1].waypoints) {
            waypts.push({
              location: {lat: i.lat, lng: i.lng},
              stopover: false
            });
          }
        }
        this.navigation(start, end, waypts, this.map, this.markerArray);
      }

    });

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
    });
  }

  navigation(current, next, waypts, map, marker) {

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
      console.log(entry);
      let marker = L.marker({ lat: entry.lat, lng: entry.lng });
      marker.addTo(this.map);
      let id = entry.checkpointId;
      this.addInfoWindow(marker, entry);
    }
  }

  //Fuegt Marker zur Karte hinzu.
  addInfoWindow(marker, checkpoint) {
    marker.on('click', (event) => {
      this.showCheckpointInfoModal(checkpoint);
    });
  }

  //Oeffnet die Uebersichtsseite (Modal) einer Tour.
  showTourInfoModal(t) {
    let infoModal = this.modalCtrl.create(TourenInfoModal, { tour: t });
    infoModal.present();
  }

  //Oeffnet die Uebersichtsseite (Modal) einer Tour.
  showCheckpointInfoModal(cData: any) {
    let infoModal = this.modalCtrl.create(CheckpointInfoModal, { c: cData });
    infoModal.present();
  }
}
