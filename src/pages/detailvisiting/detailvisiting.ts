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
    this.store = this.navParam.get('visit')
    this.userid = this.navParam.get('userid')
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
  doSubmit() {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");
    this.api.put("table/z_visiting",
      {
        "uuid": this.store['uuid'],
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
}
