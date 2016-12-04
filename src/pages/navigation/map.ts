import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController, ModalController } from 'ionic-angular';
import { Geolocation, Geoposition, PositionError } from 'ionic-native';

import { ConnectivityService } from '../../providers/connectivity-service';
import { BiketripsService } from '../../providers/biketrips-service';
import { NavigationService } from '../../providers/navigation-service';

import { TourenInfoModal } from '../touren-info-modal/touren-info-modal';
import { CheckpointInfoModal } from '../checkpoint-info-modal/checkpoint-info-modal';


declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  providers: [BiketripsService, NavigationService]

})

export class Navigation {

  //#map aus map.html ermitteln
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('panel') panelElement: ElementRef;
  map: any;
  mapInitialised: boolean = false;
  private apiKey: any = "AIzaSyBckgn5lj8eGN1YHSTLiza4vapodPb3KQo";
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
    this.loadGoogleMaps();

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
    this.directionsService = new google.maps.DirectionsService();
    // this.directionsDisplay = new google.maps.DirectionsRenderer();
    console.log("init map - start");



    Geolocation.getCurrentPosition().then((position) => {
      //Position festlegen
      this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
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
        center: this.latLng,
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
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15
      }
      //Karte aktualisieren.
      this.map.setOptions(mapOptions);
    });
  }

  navigation(current, next, waypts, map, marker) {
    let directionsDisplay = new google.maps.DirectionsRenderer();
    //Karte hinzufügen: Hier wird die Route dargestellt.
    directionsDisplay.setMap(map);
    //Panel hinzufügen: Hier werden die Navigations-Instruktionen angezeigt
    directionsDisplay.setPanel(this.panelElement.nativeElement);

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.panelElement.nativeElement);

    // Display the route between the initial start and end selections.
    let request = {
      origin: current,
      destination: next,
      waypoints: waypts,
      travelMode: google.maps.TravelMode.BICYCLING
    };
    this.directionsService.route(request, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        //Route anzeigen
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
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

  //Erueugt die Checkpoints der Touren
  addCheckpoints() {
    console.log("add Markers - start");
    for (let entry of this.biketrips) {
      console.log(entry);
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: { lat: entry.lat, lng: entry.lng }
      });
      let id = entry.checkpointId;
      this.addInfoWindow(marker, entry);
    }
  }

  //Fuegt Marker zur Karte hinzu.
  addInfoWindow(marker, checkpoint) {

    // let infoWindow = new google.maps.InfoWindow({
    //   content: content
    // });

    google.maps.event.addListener(marker, 'click', (event) => {
      // infoWindow.open(this.map, marker);
      // console.log(event);
      this.showCheckpointInfoModal(checkpoint);
    });
  }

  //Oeffnet die Uebersichtsseite (Modal) einer Tour.
  showTourInfoModal(t) {
    let infoModal = this.modalCtrl.create(TourenInfoModal, { tour: t });
    infoModal.present();
  }

  //Oeffnet die Uebersichtsseite (Modal) einer Tour.
  showCheckpointInfoModal(cData: Object) {
    let infoModal = this.modalCtrl.create(CheckpointInfoModal, { c: cData });
    infoModal.present();
  }
}
