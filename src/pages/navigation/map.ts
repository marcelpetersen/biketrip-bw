import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform, LoadingController } from 'ionic-angular';
import { ConnectivityService } from '../../providers/connectivity-service';
import { Geolocation, Geoposition, PositionError } from 'ionic-native';
// import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng } from 'ionic-native';

declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})

// export class Navigation {
//
//     map: GoogleMap;
//
//     constructor(public navCtrl: NavController, public platform: Platform) {
//         platform.ready().then(() => {
//             this.loadMap();
//         });
//     }
//
//     loadMap(){
//
//         let location = new GoogleMapsLatLng(-34.9290,138.6010);
//
//         this.map = new GoogleMap('map', {
//           'backgroundColor': 'white',
//           'controls': {
//             'compass': true,
//             'myLocationButton': true,
//             'indoorPicker': true,
//             'zoom': true
//           },
//           'gestures': {
//             'scroll': true,
//             'tilt': true,
//             'rotate': true,
//             'zoom': true
//           },
//           'camera': {
//             'latLng': location,
//             'tilt': 30,
//             'zoom': 15,
//             'bearing': 50
//           }
//         });
//
//         this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
//             console.log('Map is ready!');
//         });
//
//     }
// }

export class Navigation {

  //#map aus map.html ermitteln
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  mapInitialised: boolean = false;
  apiKey: any = "AIzaSyBckgn5lj8eGN1YHSTLiza4vapodPb3KQo";
  loading: any;
  subscription: any;

  constructor(public navCtrl: NavController, public connectivityService: ConnectivityService, public loadingCtrl: LoadingController) {
    this.presentLoadingDefault();
  }

  //Beim verlassen des Views wird watchPosition beendet.
  dismiss() {
    this.subscription.unsubscribe();
  }

  //Loading Spinner: Wird während dem Laden der Karte angezeigt.
  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Karte wird geladen...'
    });
    this.loading.present();
    //Aufruf der Karte
    this.loadGoogleMaps();

  }

  //Google Maps laden.
  loadGoogleMaps(){

    this.addConnectivityListeners();

  if(typeof google == "undefined" || typeof google.maps == "undefined"){

    console.log("Google maps JavaScript needs to be loaded.");
    this.disableMap();

    if(this.connectivityService.isOnline()){
      console.log("online, loading map");

      //Load the SDK
      window['mapInit'] = () => {
        this.initMap();
        this.enableMap();
      }

      let script = document.createElement("script");
      script.id = "googleMaps";

      if(this.apiKey){
        script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
      } else {
        script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
      }

      document.body.appendChild(script);

    }
  }
  else {

    if(this.connectivityService.isOnline()){
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
  initMap(){

    this.mapInitialised = true;

    Geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      //Karte erzeugen.
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      //Spinner ausblenden, wenn Karte geladen.
      this.loading.dismiss();
      this.updatePosition();

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

  disableMap(){
    console.log("disable map");
  }

  enableMap(){
    console.log("enable map");
  }

  addConnectivityListeners(){

    let onOnline = () => {

      setTimeout(() => {
        if(typeof google == "undefined" || typeof google.maps == "undefined"){

          this.loadGoogleMaps();

        } else {

          if(!this.mapInitialised){
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

  addInfoWindow(marker, content){

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }
}
