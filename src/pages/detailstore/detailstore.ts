import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Platform, ToastController, AlertController, NavParams } from 'ionic-angular';
import { HttpHeaders } from "@angular/common/http";
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';
import { ImageViewerController } from 'ionic-img-viewer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

@IonicPage()
@Component({
  selector: 'page-detailstore',
  templateUrl: 'detailstore.html',
})
export class DetailstorePage {
  public store: any;
  public userid: any;
  public url: any;
  public namatoko: any;
  public alamat1: any;
  public alamat2: any;
  public kota: any;
  public kodepos: any;
  public telp: any;
  public email: any;
  public tipetoko: any;
  public disable: boolean = true;
  public loading: any;
  public imageurl: any;
  imageURI: string = '';
  imageFileName: string = '';

  constructor(
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParam: NavParams,
    public api: ApiProvider,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    private transfer: FileTransfer,
    private camera: Camera,
    public alertCtrl: AlertController
  ) {
    this.store = this.navParam.get('store')
    this.disable = this.navParam.get('disable')
    this.userid = this.navParam.get('userid')
    this.namatoko = this.store['name']
    this.alamat1 = this.store['address_1']
    this.alamat2 = this.store['address_2']
    this.kota = this.store['city']
    this.kodepos = this.store['post_code']
    this.telp = this.store['telp']
    this.email = this.store['email']
    this.tipetoko = this.store['type_store']
    this.imageurl = this.store['image_url']
    this.url = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyCyS0sAM18a1JhzYSwZEBkfyE5--qFoN1U&zoom=18&q=' + this.store['latitude'] + "," + this.store['longitude']
  }
  doGetTipeToko() {
    if (this.disable == false) {
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
            value: 'Perorangan',
            label: 'Perorangan'
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
      this.doGetLatLon()
    }
  }
  readTextFile(file, callback) {
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
  }
  doSave(latitude, longitude) {
    console.log('do sukses')
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");
    this.api.put("table/z_store",
      {
        "id": this.store['id'],
        "name": this.namatoko,
        "address_1": this.alamat1,
        "address_2": this.alamat2,
        "city": this.kota,
        "post_code": this.kodepos,
        "latitude": latitude,
        "longitude": longitude,
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
          this.doSave(latitude, longitude)
        })
  }
  doPopUp() {
    let alert = this.alertCtrl.create({
      subTitle: 'Sukses',
      buttons: ['OK']
    });
    alert.present();
  }
  doHapus() {
    const headers = new HttpHeaders()
    .set("Content-Type", "application/json");
  this.api.put("table/z_store",
    {
      "id": this.store['id'],
      "image_url": ''
    },
    { headers })
    .subscribe(
      (val) => {
        this.imageurl = ''
      });
  }
  doCamera() {
    this.api.get("table/configuration_picture").subscribe(val => {
      let configuration = val['data'];
      let options: CameraOptions = {
        quality: configuration[0].camera_quality,
        destinationType: this.camera.DestinationType.FILE_URI
      }
      options.sourceType = this.camera.PictureSourceType.CAMERA

      this.camera.getPicture(options).then((imageData) => {
        this.imageURI = imageData;
        this.imageFileName = this.imageURI;
        if (this.imageURI == '') return;
        let loader = this.loadingCtrl.create({
          content: "Uploading..."
        });
        loader.present();
        const fileTransfer: FileTransferObject = this.transfer.create();

        let options: FileUploadOptions = {
          fileKey: 'fileToUpload',
          //fileName: this.imageURI.substr(this.imageURI.lastIndexOf('/') + 1),
          fileName: this.store['store_code'] + '.jpeg',
          chunkedMode: true,
          mimeType: "image/jpeg",
          headers: {}
        }

        let url = "http://101.255.60.202/apitesting/api/Upload";
        fileTransfer.upload(this.imageURI, url, options)
          .then((data) => {
            loader.dismiss();
            let date = moment().format('YYYY-MM-DD HH:mm:ss');
            const headers = new HttpHeaders()
              .set("Content-Type", "application/json");

            this.api.put("table/z_store",
              {
                "id": this.store['id'],
                "image_url": 'http://101.255.60.202/apitesting/img/' + this.store['store_code']
              },
              { headers })
              .subscribe(
                (val) => {
                  this.presentToast("Image uploaded successfully");
                  this.imageurl = 'http://101.255.60.202/apitesting/img/' + this.store['store_code']
                });
            this.imageURI = '';
            this.imageFileName = '';
          }, (err) => {
            loader.dismiss();
            this.presentToast('Silahkan Coba lagi');
          });
      }, (err) => {
        this.presentToast('This Platform is Not Supported');
      });
    });
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
    });

    toast.present();
  }

}
