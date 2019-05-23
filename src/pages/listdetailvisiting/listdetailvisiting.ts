import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Platform, ToastController, AlertController, NavParams } from 'ionic-angular';
import { HttpHeaders } from "@angular/common/http";
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-listdetailvisiting',
  templateUrl: 'listdetailvisiting.html',
})
export class ListdetailvisitingPage {
  public pic: any;
  public date: any;
  public dateformat: any;
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
    this.pic = this.navParam.get('pic')
    this.date = this.navParam.get('date')
    this.dateformat = moment(this.date).format('dddd, DD MMMM YYYY')
    this.doGetVisiting()
  }
  doGetVisiting() {
    this.api.get("table/z_visiting", { params: { limit: 100, filter: 'date_visit=' + "'" + this.date + "' AND pic=" + "'" + this.pic + "'", sort: 'name ASC' } })
      .subscribe(val => {
        this.visiting = val['data']
        console.log(this.visiting)
      });
  }
  doImage(visit) {
    this.navCtrl.push('ListpicturevisitingPage', {
      visit: visit
    })
  }

}
