import { Component } from '@angular/core';
import { ViewController, ModalController, PopoverController, NavParams, Keyboard } from 'ionic-angular';
import { BiketripsService } from '../../providers/biketrips-service';
import { TourenInfoModal } from '../touren-info-modal/touren-info-modal';
import { ErweiterteSuche } from '../erweiterte-suche/erweiterte-suche';
import { Global } from '../../providers/global-declarations';

declare var google;

@Component({
  selector: 'page-touren-suche',
  templateUrl: 'touren-suche.html',
  providers: [BiketripsService, Global]

})
export class TourenSuche {

  structure: any = { lower: 33, upper: 60 };
  biketrips: string[] = [];
  erweitert: boolean = false;
  apiKey: any = this.global.apiKey;
  result: any;


  constructor(
    private viewCtrl: ViewController,
    private params: NavParams,
    private keyboardCtrl: Keyboard,
    private tourenService: BiketripsService,
    private global: Global,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController
  ) {
    this.loadBiketrips();
    this.loadGoogleMaps();
    //console.log('Parameter: ', params.get('userId'));
  }

  loadBiketrips() {
    this.tourenService.load()
      .then(data => {
        this.biketrips = data;
        // this.biketrips = [];
        // for (let r of results) {
        //   this.biketrips.push(r.title);
        // }
        // console.log(this.biketrips);

      });
  }

  loadGoogleMaps() {
    if (typeof google == "undefined" || typeof google.maps == "undefined") {
      //Load the SDK
      window['mapInit'] = () => {
        // this.reverseGeocode();
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


  reverseGeocode(lat, lng) {
    // console.log("hello maps!");
    let geocoder = new google.maps.Geocoder();
    let request = {latLng: new google.maps.LatLng(lat, lng)};
    geocoder.geocode(request, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {

        if (results[0]) {
            for (var i = 0; i < results.length; i++) {
                if (results[i].types[0] === "locality") {
                    var city = results[i].address_components[0].long_name;
                    console.log(city)
                    this.result = city;
                };
            };
        } else {
          //alert("No address available");
          this.result =  "No Location";
        }
      }
    });

    // console.log(result);

  return this.result;
  }

  getItems(ev: any) {
    // this.biketrips = [];

    // Reset items back to all of the items
    // this.loadBiketrips();

    // set val to the value of the searchbar
    let val = ev.target.value;
    // console.log(val);



    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.biketrips = this.tourenService.filterItems(val);
      // this.biketrips = this.biketrips.filter((t) => {
      //   return (t.toLowerCase().indexOf(val.toLowerCase()) > -1);
      // })
    } else {
      this.loadBiketrips();
    }
  }

  toggleErweitert() {
    //Toggle variable (true/ false)
    this.erweitert = !this.erweitert;
    let popover = this.popoverCtrl.create(ErweiterteSuche);
    popover.present();
  }

  //Oeffnet die Uebersichtsseite (Model) einer Tour.
  showTourInfoModal(t) {
    let infoModal = this.modalCtrl.create(TourenInfoModal, { tour: t });
    infoModal.present();
  }

  dismiss() {
  //  let data = { 'foo': 'bar' };
  this.viewCtrl.dismiss();
  this.keyboardCtrl.close();
 }
}
