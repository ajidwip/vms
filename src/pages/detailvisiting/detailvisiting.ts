import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Platform, ToastController, AlertController, NavParams } from 'ionic-angular';
import { HttpHeaders } from "@angular/common/http";
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';
import { ImageViewerController } from 'ionic-img-viewer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { UUID } from 'angular2-uuid';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

@IonicPage()
@Component({
  selector: 'page-detailvisiting',
  templateUrl: 'detailvisiting.html',
})
export class DetailvisitingPage {
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
  public status: any;
  public deskripsi: any;
  public loading: any;
  public imageurl: any;
  imageURI: string = '';
  imageFileName: string = '';
  public images = [];
  constructor(
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParam: NavParams,
    public api: ApiProvider,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    private transfer: FileTransfer,
    private camera: Camera,
    public locationAccuracy: LocationAccuracy,
    public androidPermissions: AndroidPermissions,
    public alertCtrl: AlertController
  ) {
    this.store = this.navParam.get('visit')
    this.userid = this.navParam.get('userid')
    this.doGetImage()
    this.namatoko = this.store['name']
    this.alamat1 = this.store['address_1']
    this.alamat2 = this.store['address_2']
    this.kota = this.store['city']
    this.kodepos = this.store['post_code']
    this.telp = this.store['telp']
    this.email = this.store['email']
    this.tipetoko = this.store['type_store']
    this.status = this.store['status']
    this.deskripsi = this.store['description']
    this.url = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyCyS0sAM18a1JhzYSwZEBkfyE5--qFoN1U&zoom=18&q=' + this.store['latitude'] + "," + this.store['longitude']
  }
  doGetStatus() {
    let prompt = this.alertCtrl.create({
      subTitle: 'Status Kunjungan ',
      inputs: [
        {
          type: 'radio',
          value: 'Visit dan Order',
          label: 'Visit dan Order'
        },
        {
          type: 'radio',
          value: 'Tidak Order',
          label: 'Tidak Order'
        },
        {
          type: 'radio',
          value: 'Toko Tutup',
          label: 'Toko Tutup'
        },
        {
          type: 'radio',
          value: 'Tidak Kunjungan',
          label: 'Tidak Kunjungan'
        },
        {
          type: 'radio',
          value: 'Order By Phone',
          label: 'Order By Phone'
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
            this.status = data
          }
        }
      ]
    });
    prompt.present();
  }
  doGetImage() {
    this.api.get("table/z_visiting_picture", { params: { limit: 1000, filter: 'uuid_parent=' + "'" + this.store['uuid'] + "'", sort: 'datetime ASC' } })
      .subscribe(val => {
        this.images = val['data']
      }, err => {
        this.doGetImage()
      });
  }
  doSubmit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (this.store['latitude'].substring(0, 8) == position.coords.latitude.toString().substring(0, 8) && this.store['longitude'].substring(0, 9) == position.coords.longitude.toString().substring(0, 9)) {
          console.log('1', this.store['latitude'].substring(0, 8), position.coords.latitude.toString().substring(0, 8), this.store['longitude'].substring(0, 9), position.coords.longitude.toString().substring(0, 9))
          const headers = new HttpHeaders()
            .set("Content-Type", "application/json");
          this.api.put("table/z_visiting",
            {
              "uuid": this.store['uuid'],
              "latitude_visit": position.coords.latitude,
              "longitude_visit": position.coords.longitude,
              "status": this.status,
              "description": this.deskripsi
            },
            { headers })
            .subscribe(
              (val) => {
                this.navCtrl.pop()
              }, err => {
                this.doSubmit()
              });

        }
        else if (this.images.length != 0) {
          console.log('2')
          const headers = new HttpHeaders()
            .set("Content-Type", "application/json");
          this.api.put("table/z_visiting",
            {
              "uuid": this.store['uuid'],
              "latitude_visit": position.coords.latitude,
              "longitude_visit": position.coords.longitude,
              "status": this.status,
              "description": this.deskripsi
            },
            { headers })
            .subscribe(
              (val) => {
                this.navCtrl.pop()
              }, err => {
                this.doSubmit()
              });
        }
        else {
          console.log('r')
          let alert = this.alertCtrl.create({
            title: 'Perhatian',
            subTitle: 'Lokasi anda tidak sesuai dengan lokasi toko',
            message: 'Anda ingin foto toko sekarang?',
            buttons: [
              {
                text: 'YA',
                handler: () => {
                  this.doCamera(position)
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
        }
      }, err => {
        this.doSubmit()
      }, { timeout: 5000 })
    }
  }
  doCamera(position) {
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
        let uuid = UUID.UUID()
        let options: FileUploadOptions = {
          fileKey: 'fileToUpload',
          //fileName: this.imageURI.substr(this.imageURI.lastIndexOf('/') + 1),
          fileName: uuid + '.jpeg',
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

            this.api.post("table/z_visiting_picture",
              {
                "uuid": UUID.UUID(),
                "uuid_parent": this.store['uuid'],
                "store_code": this.store['store_code'],
                "date_visit": this.store['date_visit'],
                "pic": this.store['pic'],
                "latitude": position.coords.latitude,
                "longitude": position.coords.longitude,
                "image_url": 'http://101.255.60.202/apitesting/img/' + uuid,
                "datetime": date
              },
              { headers })
              .subscribe(
                (val) => {
                  this.presentToast("Image uploaded successfully");
                  this.doGetImage()
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
  doCameraWithPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
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
            let uuid = UUID.UUID()
            let options: FileUploadOptions = {
              fileKey: 'fileToUpload',
              //fileName: this.imageURI.substr(this.imageURI.lastIndexOf('/') + 1),
              fileName: uuid + '.jpeg',
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

                this.api.post("table/z_visiting_picture",
                  {
                    "uuid": UUID.UUID(),
                    "uuid_parent": this.store['uuid'],
                    "store_code": this.store['store_code'],
                    "date_visit": this.store['date_visit'],
                    "pic": this.store['pic'],
                    "latitude": position.coords.latitude,
                    "longitude": position.coords.longitude,
                    "image_url": 'http://101.255.60.202/apitesting/img/' + uuid,
                    "datetime": date
                  },
                  { headers })
                  .subscribe(
                    (val) => {
                      this.presentToast("Image uploaded successfully");
                      this.doGetImage()
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
      }, err => {
        this.doCameraWithPosition()
      }, { timeout: 5000 })
    }
  }
  doHapus(foto) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");
    this.api.delete("table/z_visiting_picture", { params: { filter: "uuid=" + "'" + foto.uuid + "'" }, headers })
      .subscribe(val => {
        this.presentToast('Hapus Sukses');
        this.doGetImage()
      }, err => {
        this.doHapus(foto)
      });
  }
}
