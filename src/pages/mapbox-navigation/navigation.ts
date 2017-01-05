import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { Geolocation, Geoposition, PositionError } from 'ionic-native';
import { Storage } from '@ionic/storage';

import { ConnectivityService } from '../../providers/connectivity-service';
import { BiketripsService } from '../../providers/biketrips-service';
import { NavigationService } from '../../providers/navigation-service';

import { CheckpointInfoModal } from '../checkpoint-info-modal/checkpoint-info-modal';
import { CheckpointInfoModalLocked } from '../checkpoint-info-modal-locked/checkpoint-info-modal-locked';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import MapboxDirections from 'mapbox-gl/plugins/src/mapbox-gl-directions/v2.2.0/mapbox-gl-directions.js';

@Component({
  selector: 'page-navigation',
  templateUrl: 'navigation.html'
})

export class Navigation {
  //#map aus map.html ermitteln
  private map: any;
  //Aktuelle Position
  private lngLat: any;
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
  private distance: any = 999;
  private distanceToCheckpoint: Number = 10;

  public navigationGestartet: string = "none";


  //Routing (Mapbox)
  private accessToken = 'pk.eyJ1IjoiYmlrZXRyaXAtYnciLCJhIjoiY2l1OGRvY2dyMDAwZDJ0bWt2c3V1NTg3ZCJ9.wS5IN1Ke_I3_jmOfuX7u8A';
  private options = {
    accessToken: this.accessToken,
    serviceUrl: 'https://api.mapbox.com/directions/v5',
    profile: 'mapbox/cycling',
    unit: 'metric',
    useHints: false
  };

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public modalCtrl: ModalController,
    private connectivityService: ConnectivityService,
    public loadingCtrl: LoadingController,
    private tourenService: BiketripsService,
    private navigationService: NavigationService,
    private storage: Storage
  ) {

  }

  ionViewDidLoad() {
    mapboxgl.accessToken = this.accessToken;
    this.showLoadingSpinner();
    this.gestarteteTour = this.params.get('tourID');

    this.loadBiketrips();
    this.loadMaps();
  }

  //Beim verlassen des Views wird watchPosition beendet.
  ionViewWillLeave() {
    console.log("unload");

    //Aktivieren, damit die Navigation gestoppt wird, wenn der Nutzer die Map verlässt.
    // this.subscription.unsubscribe();
  }

  dismiss() {
    console.log("dismiss");
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

  //Maps laden.
  loadMaps() {
    console.log("showing map");
    if(this.navigationService.initialized){
      this.navigationService.getPosition().then(lngLat => {
        this.lngLat = lngLat;
        this.initMap();
        this.addCheckpoints();
        this.loading.dismiss();
      });
    } else {
      setTimeout(() => {this.loadMaps();},500);
    }
  }

  initMap() {

    this.map = new mapboxgl.Map({
        container: 'map',
        center: this.lngLat,
        zoom: 13,
        style: 'mapbox://styles/biketrip-bw/ciu8drfz1002l2inxsnyde0xj'
    });
    // this.map.setLayoutProperty('country-label-lg', 'text-field', '{name_de}');
    this.map.addControl(new mapboxgl.NavigationControl());

    this.locate = new mapboxgl.Marker().setLngLat([this.lngLat.lng, this.lngLat.lat]);

    this.locate.addTo(this.map);
    // this.map.addControl(new MapboxDirections({
    //   accessToken: mapboxgl.accessToken
    // }), 'top-left');

  }

  locateUser() {
    Geolocation.getCurrentPosition().then((position) => {
      this.lngLat = new mapboxgl.LngLat(position.coords.longitude, position.coords.latitude);
      this.map.setCenter(this.lngLat);

      if(this.locate !== null){
        console.log("update marker");
        this.locate.setLngLat([ position.coords.longitude, position.coords.latitude ]);
      }
      else {
        this.locate = new mapboxgl.Marker().setLngLat([ position.coords.longitude, position.coords.latitude ]);
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
      this.lngLat = new mapboxgl.LngLat(position.coords.longitude, position.coords.latitude);
      this.waypts[0] = new mapboxgl.LngLat(position.coords.longitude, position.coords.latitude);
      this.locate.setLngLat([ position.coords.longitude, position.coords.latitude ]);
      // this.route.setWaypoints(this.waypts);
      this.map.setCenter(this.lngLat);
    });
  }

  cancelNavigation() {
    this.navigationGestartet = "starten";
    this.subscription.unsubscribe();
  }


  //Erueugt die Checkpoints der Touren
  addCheckpoints() {
    console.log("add Markers - start");
    let marker : any[] = [];

    for (let i in this.biketrips) {
      marker.push( new mapboxgl.Marker().setLngLat( [this.biketrips[i].lng, this.biketrips[i].lat ] ) );
      marker[i].addTo(this.map);
      this.addInfoWindow(marker[i], i, this.biketrips[i]);
    }
  }
  //Fuegt Marker zur Karte hinzu.
  addInfoWindow(marker, index,  obj) {
    marker.on('click', (event) => {
      console.log("NextChkpt: " + this.nextCheckpoint + " Index: " + index);
      //> if (index < this.nextCheckpoint) {
        //Wenn die Distanz zum Marker kleiner als 10m ist, dann wird dieser geöffnet
        this.showCheckpointInfoModal(obj);
      //> } else {
        //> this.showLockedInfoModal(obj.name);

      //> }
    });
  }
  //Oeffnet den Checkpoint
  showCheckpointInfoModal(cData) {
    let infoModal = this.modalCtrl.create(CheckpointInfoModal, { c: cData });
    infoModal.present();
  }
  //Oeffnet die gesperrte Checkpoint Ansicht
  showLockedInfoModal(name) {
    let infoModal = this.modalCtrl.create(CheckpointInfoModalLocked, { n: name, d:this.distance });
    infoModal.present();
  }
}
