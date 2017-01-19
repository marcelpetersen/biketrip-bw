import { Component } from '@angular/core';

import { NavController, NavParams, App,  Nav, LoadingController, ModalController } from 'ionic-angular';
import { Geolocation, Geoposition, PositionError, Vibration, NativeAudio } from 'ionic-native';
import { Storage } from '@ionic/storage';

import { ConnectivityService } from '../../providers/connectivity-service';
import { BiketripsService } from '../../providers/biketrips-service';
import { NavigationService } from '../../providers/navigation-service';

import { Startseite } from '../startseite/startseite';
import { CheckpointInfoModal } from '../checkpoint-info-modal/checkpoint-info-modal';
import { CheckpointInfoModalLocked } from '../checkpoint-info-modal-locked/checkpoint-info-modal-locked';

import * as L from 'leaflet';
import * as Routing from 'leaflet-routing-machine';

@Component({
  selector: 'page-navigation',
  templateUrl: 'navigation.html'
})

export class Navigation {
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
  public gestarteteTour: any = "none";
  private subscription: any;
  private route: any;
  //Checkpoints
  private nextCheckpoint: any = 0;
  private waypts: any[] = [];
  //Entfernung zum nächsten Checkpoint
  private distanceToWaypoint: any = -1;
  private distanceToCheckpoint: any = -1;
  private distanceToSecondWaypoint: any = -1;

  public navigationGestartet: string = "none";

  //Routing (Mapbox)
  private accessToken = 'pk.eyJ1IjoiYmlrZXRyaXAtYnciLCJhIjoiY2l1OGRvY2dyMDAwZDJ0bWt2c3V1NTg3ZCJ9.wS5IN1Ke_I3_jmOfuX7u8A';
  private options = {
    serviceUrl: 'https://api.mapbox.com/directions/v5',
    profile: 'mapbox/cycling',
    useHints: false,
    alternatives: false
  };

  //BUG: Routing Machine nicht vollständig übersetzt!


  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public appCtrl: App,
    public modalCtrl: ModalController,
    private connectivityService: ConnectivityService,
    public loadingCtrl: LoadingController,
    private tourenService: BiketripsService,
    private navigationService: NavigationService,
    private storage: Storage
  ) {}

  ionViewDidLoad() {
    console.log("didLoad");
    if(this.map === undefined) {
      console.log("map neu laden");
      this.map = L.map('navigation', {
        zoomControl: false
      });
    } else {
      console.log("map already initialized");
    }
    console.log(this.map);
    NativeAudio.preloadSimple('notification', './assets/audio/notification/bw_notification.mp3').then(onSucces => {
      console.log("Success");
    }, onError => {
      console.log("Error")
    });
    this.showLoadingSpinner();
    this.gestarteteTour = this.params.get('tourID');

    //Thunderforest
    this.layer = L.tileLayer('https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?{apikey}', {
      apikey: 'bb5cfe7826394f618732d66f50ca567e',
      attribution: 'Maps by <a href="https://thunderforest.com/">Thunderforest</a>',
      minZoom: 5,
      maxZoom: 17
    });
    this.loadBiketrips();
    this.retriveGeoPosition();
  }
  //Beim verlassen des Views wird watchPosition beendet.
  ionViewWillLeave() {
    console.log("exit navigation");
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
    this.navigationGestartet = "starten";
    this.tourenService.load().then(data => {
      this.biketrips = data.find(item => item.id === this.gestarteteTour).checkpoints;
    });
  }
  //Auf GPS Signal warten
  retriveGeoPosition() {
    console.log("showing map");
    if(this.navigationService.initialized){
      this.navigationService.getPosition().then(latLng => {
        this.latLng = latLng;
        this.createMap();
        this.initNavigation();
        this.loading.dismiss();
      });
    } else {
      setTimeout(() => {this.retriveGeoPosition();},500);
    }
  }
  //Map erstellen
  createMap() {
    console.log("init");
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
  //Zum aktuellen Checkpoint navigieren
  navigateTo() {
    console.log('start');
    this.navigationGestartet = "stoppen";
    //Wenn der Nutzer auf Start klickt, dann wird die Position aktualisiert.
    this.subscription = Geolocation.watchPosition().subscribe((position: Geoposition) => {

      this.latLng = L.latLng(position.coords.latitude, position.coords.longitude);
      this.waypts[0] = L.latLng(position.coords.latitude, position.coords.longitude);
      this.locate.setLatLng({ lat: position.coords.latitude, lng: position.coords.longitude });
      this.route.setWaypoints(this.waypts);

      this.map.setView(L.latLng(position.coords.latitude, position.coords.longitude), 18);
      //Wenn der erste Eintrag in Waypts (Current Position) dem nächsten gleicht, dann wird dieser gelöscht.
      this.distanceToCheckpoint = this.waypts[0].distanceTo(this.waypts[this.waypts.length-1]);
      this.distanceToWaypoint = this.waypts[0].distanceTo(this.waypts[1]);

      if(this.waypts.length > 2) {
        this.distanceToSecondWaypoint = this.waypts[0].distanceTo(this.waypts[2]);
      } else {
        this.distanceToSecondWaypoint = -1;
      }

      console.log("Distanz zum nächsten waypts: " + this.distanceToWaypoint);
      console.log("Distanz zum letzten wpts: " + this.distanceToCheckpoint);
      console.log("Anzahl der wpts (waypoint.length):  " + this.waypts.length);
      console.log("NextCheckpoint: " + this.nextCheckpoint);
      console.log("Alle Waypoints: " + this.waypts);

      if(this.distanceToCheckpoint <= 10) {

          this.nextCheckpoint ++;

          console.log("Checkpoint erreicht!");
          //Sound Abspielen
          NativeAudio.play('notification', () => console.log('Notification is done playing'));
          Vibration.vibrate(1000);
          //Modal öffnen
          this.showCheckpointInfoModal(this.biketrips[this.nextCheckpoint-1]);
          if(this.nextCheckpoint < this.biketrips.length) {
            this.updateNavigation();
          } else {
            this.finishNavigation();
          }

      }
      else if(this.distanceToSecondWaypoint < this.distanceToWaypoint && this.distanceToSecondWaypoint !== -1) {
        console.log("Waypoint entfernen, da übernächster Waypoint näher als nächster WPT");
        console.log("secondWaypoint: " + this.distanceToSecondWaypoint + " Waypoint: " + this.distanceToWaypoint);
        this.waypts.shift();
        this.route.setWaypoints(this.waypts);
      }

      else {
        console.log("Positionsupdate ohne Änderung.");
      }
      this.route.showAlternatives = false;

    });
  }
  //Waypoints (Array) erstellen und mit dem ersten Checkpoint befüllen
  initNavigation() {
    //Wenn eine Tour gestartet wurde, dann werden die Checkpoints hinzugefügt.
    console.log("initNavigation");
    this.waypts = [];
      this.addCheckpoints();
      //Aktuelle Position zum Array Waypoints hinzufügen
      this.waypts.push(this.latLng);

      //Wenn der nächste Checkpoint zusätzliche Wegpunkte hat, dann werden diese hinzugefügt.
      if (this.biketrips[this.nextCheckpoint].waypoints) {
        for (let i of this.biketrips[this.nextCheckpoint].waypoints) {
          this.waypts.push(
            L.latLng(i.lat, i.lng)
          );
        }
      }
      //Zuletzt wird die Position des nächsten Markers zum Array hinzugefügt.
      this.waypts.push(
        L.latLng(this.biketrips[this.nextCheckpoint].lat, this.biketrips[this.nextCheckpoint].lng)
      );

      //Init Distance
      this.distanceToWaypoint = this.waypts[0].distanceTo(this.waypts[1]);
      this.distanceToCheckpoint = this.waypts[0].distanceTo(this.waypts[this.waypts.length-1]);
      if(this.waypts.length > 2) {
        this.distanceToSecondWaypoint = this.waypts[0].distanceTo(this.waypts[2]);
      } else {
        this.distanceToSecondWaypoint = -1;
      }
      this.addRoutingMachine();
  }
  //Waypoints aktualisieren: naechsten Checkpoint laden.
  updateNavigation() {
    //Wenn eine Tour gestartet wurde, dann werden die Checkpoints hinzugefügt.
    console.log("updateNavigation");
    this.waypts = [];
      this.addCheckpoints();
      //Aktuelle Position zum Array Waypoints hinzufügen
      this.waypts.push(this.latLng);

      //Wenn der nächste Checkpoint zusätzliche Wegpunkte hat, dann werden diese hinzugefügt.
      if (this.biketrips[this.nextCheckpoint].waypoints) {
        for (let i of this.biketrips[this.nextCheckpoint].waypoints) {
          this.waypts.push(
            L.latLng(i.lat, i.lng)
          );
        }
      }
      //Zuletzt wird die Position des nächsten Markers zum Array hinzugefügt.
      this.waypts.push(
        L.latLng(this.biketrips[this.nextCheckpoint].lat, this.biketrips[this.nextCheckpoint].lng)
      );

      //Reset Distances
      this.distanceToWaypoint = this.waypts[0].distanceTo(this.waypts[1]);
      this.distanceToCheckpoint = this.waypts[0].distanceTo(this.waypts[this.waypts.length-1]);
      if(this.waypts.length > 2) {
        this.distanceToSecondWaypoint = this.waypts[0].distanceTo(this.waypts[2]);
      } else {
        this.distanceToSecondWaypoint = -1;
      }

      this.route.setWaypoints(this.waypts);
  }
  finishNavigation() {
    this.navigationGestartet = "starten";
    this.subscription.unsubscribe();
    //Ton abspielen?
  }
  //Schließt die View und kehrt zur Startseite zurueck
  exitNavigation() {
    //Kehrt zur Startseite zurück.
    this.appCtrl.getRootNav().setRoot(Startseite);
  }
  //Beendet die Navigation
  cancelNavigation() {
    this.navigationGestartet = "starten";
    this.subscription.unsubscribe();
  }
  //Fuegt LRM zur Map hinzu
  addRoutingMachine() {

    this.route = Routing.control({
      waypoints: this.waypts,
      language: 'de',
      router: Routing.mapbox(this.accessToken, this.options),
      draggableWaypoints: false,
      createMarker: function() { return null; },
      pointMarkerStyle: {radius: 5,color: '#145648',fillColor: 'white',opacity: 1,fillOpacity: 0.7},
      summaryTemplate: "",
      containerClassName: 'checkpoint-navigation',
      alternativeClassName: 'checkpoint-navigation',
      minimizedClassName: 'checkpoint-navigation',
      itineraryClassName: 'checkpoint-navigation',
      showAlternatives: false,
      position: 'topleft'
    });
    this.route.addTo(this.map);
    this.navigateTo();
  }
  //Erzeugt die Checkpoints der Tour
  addCheckpoints() {
    console.log("add Markers - start");
    let marker : any[] = [];

    for (let i in this.biketrips) {
      marker.push(L.marker({ lat: this.biketrips[i].lat, lng: this.biketrips[i].lng }));
      marker[i].addTo(this.map);
      this.addInfoWindow(marker[i], i, this.biketrips[i]);
    }
    console.log(L.layerGroup(marker).toGeoJSON());
  }
  //Fuegt Marker zur Karte hinzu.
  addInfoWindow(marker, index,  obj) {
    marker.on('click', (event) => {
      console.log("NextChkpt: " + this.nextCheckpoint + " Index: " + index);
      // if (index < this.nextCheckpoint) {
        //Wenn die Distanz zum Marker kleiner als 10m ist, dann wird dieser geöffnet
        this.showCheckpointInfoModal(obj);
      // } else {
        // this.showLockedInfoModal(obj.name);
      // }
    });
  }
  //Oeffnet den Checkpoint
  showCheckpointInfoModal(cData) {
    let infoModal = this.modalCtrl.create(CheckpointInfoModal, { c: cData });
    infoModal.present();
  }
  //Oeffnet die gesperrte Checkpoint Ansicht
  showLockedInfoModal(name) {
    let infoModal = this.modalCtrl.create(CheckpointInfoModalLocked, { n: name, d:this.distanceToCheckpoint });
    infoModal.present();
  }
}
