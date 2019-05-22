import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Platform, ToastController, AlertController, NavParams } from 'ionic-angular';
import { HttpHeaders } from "@angular/common/http";
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-addstore',
  templateUrl: 'addstore.html',
})
export class AddstorePage {
  public namatoko = ''
  public alamat1 = '';
  public alamat2 = '';
  public kota = '';
  public kodepos = '';
  public telp = '';
  public email = '';
  public tipetoko = '';
  public userid = '';
  public loading: any;
  constructor(
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParam: NavParams,
    public api: ApiProvider,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public alertCtrl: AlertController
  ) {
    this.userid = this.navParam.get('userid')
  }

  doGetTipeToko() {
    let prompt = this.alertCtrl.create({
      subTitle: 'Tipe Toko ',
      inputs: [
        {
          type: 'radio',
          value: 'Toko',
          label: 'Toko'
        },
        {
          type: 'radio',
          value: 'Bengkel',
          label: 'Bengkel'
        }

      ],
      buttons: [
        {
          text: "Cancel",
          handler: data => {
          }
        },
        {
          text: "OK",
          handler: data => {
            this.tipetoko = data
          }
        }
      ]
    });
    prompt.present();
  }
  doAlert(string) {
    let alert = this.alertCtrl.create({
      subTitle: 'Perhatian',
      message: string,
      buttons: ['OK']
    });
    alert.present();
  }
  validateEmail() {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(this.email)
  }
  doSubmit() {
    if (this.namatoko.length == 0) {
      this.doAlert('Nama toko harus diisi')
    }
    else if (this.alamat1.length == 0) {
      this.doAlert('Alamat 1 toko harus diisi')
    }
    else if (this.alamat2.length == 0) {
      this.doAlert('Alamat 2 toko harus diisi')
    }
    else if (this.kota.length == 0) {
      this.doAlert('Kota harus diisi')
    }
    else if (this.kodepos.length == 0) {
      this.doAlert('Kode POS toko harus diisi')
    }
    else if (this.telp.length == 0) {
      this.doAlert('Telp toko harus diisi')
    }
    else if (!this.validateEmail()) {
      this.doAlert('Email tidak valid')
    }
    else if (this.tipetoko.length == 0) {
      this.doAlert('Nama toko harus diisi')
    }
    else {
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
    
      this.loading.present()
      this.doSave()
    }
  }
  /*readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4) {
        callback(rawFile.responseText);
      }
    }
    rawFile.send(null);
  }
  doGetLatLon() {
    console.log('startgetlatlon')
    let addressfull = this.alamat1 + " " + this.alamat2 + " " + this.kota
    let dataurl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + addressfull + '&key=AIzaSyCyS0sAM18a1JhzYSwZEBkfyE5--qFoN1U'
    var self = this;
    this.readTextFile(dataurl, function (text) {
      console.log('sukses get latlon')
      var datalatlon = JSON.parse(text);
      let latitude = datalatlon.results[0].geometry.location.lat
      let longitude = datalatlon.results[0].geometry.location.lng
      self.doSave(latitude, longitude)
    });
  }*/
  getNextNo() {
    return this.api.get('nextno/z_store/id')
  }
  doSave() {
    console.log('dosave')
    this.getNextNo().subscribe(val => {
      console.log('do sukses')
      let nextno = val['nextno'];
      const headers = new HttpHeaders()
        .set("Content-Type", "application/json");
      this.api.post("table/z_store",
        {
          "id": nextno,
          "store_code": 'TGR' + moment().format('YYMMDD') + nextno,
          "name": this.namatoko,
          "address_1": this.alamat1,
          "address_2": this.alamat2,
          "city": this.kota,
          "post_code": this.kodepos,
          "latitude": '',
          "longitude": '',
          "telp": this.telp,
          "email": this.email,
          "pic_update": this.userid,
          "type_store": this.tipetoko,
          "date_update": moment().format('YYYY-MM-DD HH:mm:ss')
        },
        { headers })
        .subscribe(
          (val) => {
            console.log('sukses')
            this.doPopUp()
            this.loading.dismiss()
            this.navCtrl.pop()
          }, err => {
            this.doSave()
          })
    }, err => {
      this.doSave()
    });
  }
  doPopUp() {
    let alert = this.alertCtrl.create({
      subTitle: 'Sukses',
      buttons: ['OK']
    });
    alert.present();
  }
}
