import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController, ModalController } from 'ionic-angular';

import { ConnectivityService } from '../../providers/connectivity-service';
import { BiketripsService } from '../../providers/biketrips-service';

import { TourenInfoModal } from '../touren-info-modal/touren-info-modal';

import { Geolocation, Geoposition, PositionError } from 'ionic-native';

declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  providers: [BiketripsService]

})

export class Navigation {

  //#map aus map.html ermitteln
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  mapInitialised: boolean = false;
  apiKey: any = "AIzaSyBckgn5lj8eGN1YHSTLiza4vapodPb3KQo";
  loading: any;
  subscription: any;
  biketrips: any;
  gestarteteTour: any = "none";

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public modalCtrl: ModalController,
    public connectivityService: ConnectivityService,
    public loadingCtrl: LoadingController,
    public tourenService: BiketripsService
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
    this.loadGoogleMaps();

  }

  //Marker mit Überischt der einzlenen Touren laden (Daten werden von biketrips-service Provider bereitgestellt)
  loadBiketrips() {
    console.log(this.gestarteteTour);
    if (this.gestarteteTour == 'none' || this.gestarteteTour == undefined) {
      console.log("load - none");

      this.tourenService.load()
        .then(data => {
          this.biketrips = data;
        });

    }
    else {
      console.log("load - ID");
      this.tourenService.load()
        .then(data => {
          this.biketrips = data.find(x => x.id === this.gestarteteTour).checkpoints;
          // this.biketrips = this.biketrips.checkpoints;
          console.log(this.biketrips);
        });

    }
  }

  //Google Maps laden.
  loadGoogleMaps() {

    this.addConnectivityListeners();

    if (typeof google == "undefined" || typeof google.maps == "undefined") {

      console.log("Google maps JavaScript needs to be loaded.");
      this.disableMap();

      if (this.connectivityService.isOnline()) {
        console.log("online, loading map");

        //Load the SDK
        window['mapInit'] = () => {
          this.initMap();
          this.enableMap();
        }

        let script = document.createElement("script");
        script.id = "googleMaps";

        if (this.apiKey) {
          script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
        } else {
          script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
        }
        document.body.appendChild(script);
      }
    }
    else {

      if (this.connectivityService.isOnline()) {
        console.log("showing map");
        this.initMap();
        this.enableMap();
      }
      else {
        console.log("disabling map");
        this.disableMap();
        //Spinner ausblenden, wenn keine Internetverbindung vorhanden ist.
        this.loading.dismiss();
      }
    }
  }

  //Map Initialisieren
  initMap() {

    this.mapInitialised = true;
    console.log("init map - start");

    Geolocation.getCurrentPosition().then((position) => {
      //Position festlegen
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      //POI und Bahnhoefe ausblenden
      let myStyles = [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [
            { visibility: "off" }
          ]
        },
        {
          featureType: "transit",
          elementType: "labels",
          stylers: [
            { visibility: "off" }
          ]
        }
      ];
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: "terrain",
        disableDefaultUI: true,
        styles: myStyles,
        zoomControl: true
      }
      //Karte erzeugen.
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      //Spinner ausblenden, wenn Karte geladen.
      console.log("init map - end");
      this.loading.dismiss();
      // this.updatePosition();
      if (this.gestarteteTour !== 'none' && this.gestarteteTour !== undefined) {
        this.addCheckpoints();
      }

    });

  }

  //Position aktualisieren mit watchPosition.subscribe
  updatePosition() {
    this.subscription = Geolocation.watchPosition().subscribe((position: Geoposition) => {
      //  console.log(position.coords.longitude + ' ' + position.coords.latitude);
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15
      }
      //Karte aktualisieren.
      this.map.setOptions(mapOptions);
    });
  }

  disableMap() {
    console.log("disable map");
  }

  enableMap() {
    console.log("enable map");
  }

  addConnectivityListeners() {

    let onOnline = () => {

      setTimeout(() => {
        if (typeof google == "undefined" || typeof google.maps == "undefined") {

          console.log("conn-listener: load google map");
          this.loadGoogleMaps();

        } else {

          if (!this.mapInitialised) {
            this.initMap();
          }
          this.enableMap();
        }
      }, 2000);

    };

    let onOffline = () => {
      this.disableMap();
    };

    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);

  }

  //Erueugt die Marker der Touren
  addCheckpoints() {
    console.log("add Markers - start");
    for (let entry of this.biketrips) {
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: { lat: entry.lat, lng: entry.lng }
      });
      let content = "<h4>Information!</h4>";
      this.addInfoWindow(marker, content);
    }
  }

  //Marker ins Zentrum der Karte hinzufügen (Demo-Funktion)
  addMarker() {

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = "<h4>Information!</h4>";

    this.addInfoWindow(marker, content);

  }


  //Fuegt Marker zur Karte hinzu.
  addInfoWindow(marker, content) {

    // let infoWindow = new google.maps.InfoWindow({
    //   content: content
    // });

    google.maps.event.addListener(marker, 'click', (event) => {
      // infoWindow.open(this.map, marker);
      // console.log(event);
      // this.showTourInfoModal(content);
    });
  }

  //Oeffnet die Uebersichtsseite (Model) einer Tour.
  showTourInfoModal(t) {
    let infoModal = this.modalCtrl.create(TourenInfoModal, { tour: t });
    infoModal.present();
  }
}
