import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Platform, ToastController, AlertController, NavParams } from 'ionic-angular';
import { HttpHeaders } from "@angular/common/http";
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-historyvisiting',
  templateUrl: 'historyvisiting.html',
})
export class HistoryvisitingPage {
  public store: any;
  public userid: any;
  halaman = 0;
  public visiting = [];

  constructor(
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParam: NavParams,
    public api: ApiProvider,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public alertCtrl: AlertController
  ) {
    this.store = this.navParam.get('visit')
    this.userid = this.navParam.get('userid')
  }
ionViewDidEnter() {
    this.visiting = [];
    this.halaman = 0;
    this.doGetVisiting()
  }
  doGetVisiting() {
    return new Promise(resolve => {
      let offset = 30 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get("table/z_visiting", { params: { limit: 30, filter: 'pic=' + "'" + this.userid + "' AND store_code=" + "'" + this.store['store_code'] + "'", offset: offset, sort: 'date_visit DESC' } })
        .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.visiting.push(data[i]);
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    })
  }
  doRefresh(refresher) {
    this.visiting = [];
    this.halaman = 0;
    this.doGetVisiting().then(response => {
      refresher.complete();

    })
  }
  doInfinite(infiniteScroll) {
    this.doGetVisiting().then(response => {
      infiniteScroll.complete();

    })
  }
}
