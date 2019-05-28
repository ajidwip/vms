import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToastController, IonicPage, NavController, LoadingController, NavParams, AlertController, App } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import moment from 'moment';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

declare var google;

@IonicPage()
@Component({
  selector: 'page-taglocation',
  templateUrl: 'taglocation.html',
})
export class TaglocationPage {

  public marker: any;
  public geocoder: any;
  public map: any;
  public fulladdress: any;
  public store: any;
  public loading: any;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParam: NavParams,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public api: ApiProvider,
    public locationAccuracy: LocationAccuracy,
    public androidPermissions: AndroidPermissions,
    public appCtrl: App
  ) {
    this.store = this.navParam.get('store')
  }
  ngAfterViewInit() {
    this.initMap()
  }
  initMap() {
    var self = this;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.geocoder = new google.maps.Geocoder();
        var myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var myOptions = {
          zoom: 20,
          center: myLatlng,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        this.map = new google.maps.Map(document.getElementById("map"), myOptions);

        this.marker = new google.maps.Marker({
          map: this.map,
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: myLatlng
        });
        this.geocodePosition(myLatlng, position)
        this.marker.addListener('dragend', function (event) {
          self.geocodePosition(event.latLng, position);
        });
      }, err => {
        this.initMap()
      }, { timeout: 5000 });
    } else {
      alert("Geolocation is not supported by this browser.")
    }
  }
  geocodePosition(pos, position) {
    var self = this;
    self.fulladdress = ''
    this.geocoder.geocode({
      latLng: pos
    }, function (responses) {
      if (responses && responses.length > 0) {
        let alert = self.alertCtrl.create({
          title: 'Peringatan',
          subTitle: 'Apakah lokasi ini sudah benar ?',
          message: responses[0].formatted_address,
          buttons: [
            {
              text: 'YA',
              handler: () => {
                self.doSave(responses, position)
              }
            },
            {
              text: 'Batal',
              role: 'cancel',
              handler: () => {

              }
            }
          ]
        });
        alert.present();
      } else {
        console.log('Cannot determine address at this location.');
      }
    });
  }
  doMyLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        var myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.marker.setPosition(myLatlng);
        this.map.panTo(myLatlng)
        this.geocodePosition(myLatlng, position)
      }, err => {
        this.doMyLocation()
      }, { timeout: 5000 })
    }
  }
  doSave(responses, position) {
    console.log('do sukses')
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");
    this.api.put("table/z_store",
      {
        "id": this.store['id'],
        "address_1": responses[0].address_components[1].short_name + " No. " + responses[0].address_components[0].short_name,
        "address_2": responses[0].address_components[4].short_name + ", " + responses[0].address_components[5].short_name,
        "latitude": position.coords.latitude,
        "longitude": position.coords.longitude,
        "city": responses[0].address_components[6].short_name,
        "post_code": responses[0].address_components[9].short_name,
        "date_update": moment().format('YYYY-MM-DD HH:mm:ss')
      },
      { headers })
      .subscribe(
        (val) => {
          console.log('sukses')
          this.doPopUp()
          this.appCtrl.getRootNav().setRoot('ListstorePage', {
            userid: localStorage.getItem('user')
          });
        }, err => {
          this.doSave(responses, position)
        })
  }
  doPopUp() {
    let alert = this.alertCtrl.create({
      subTitle: 'Sukses',
      buttons: ['OK']
    });
    alert.present();
  }
}
