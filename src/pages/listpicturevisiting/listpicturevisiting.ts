import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Platform, ToastController, AlertController, NavParams } from 'ionic-angular';
import { HttpHeaders } from "@angular/common/http";
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';
import { ImageViewerController } from 'ionic-img-viewer';

@IonicPage()
@Component({
  selector: 'page-listpicturevisiting',
  templateUrl: 'listpicturevisiting.html',
})
export class ListpicturevisitingPage {

  public visit: any;
  public images = [];

  constructor(
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParam: NavParams,
    public api: ApiProvider,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public alertCtrl: AlertController
  ) {
    this.visit = this.navParam.get('visit')
    this.doGetImage()
  }
  doGetImage() {
    this.api.get("table/z_visiting_picture", { params: { limit: 1000, filter: 'uuid_parent=' + "'" + this.visit['uuid'] + "'", sort: 'datetime ASC' } })
      .subscribe(val => {
        this.images = val['data']
      }, err => {
        this.doGetImage()
      });
  }

}
