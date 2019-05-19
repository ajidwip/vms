import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Platform, ToastController, AlertController, NavParams } from 'ionic-angular';
import { HttpHeaders } from "@angular/common/http";
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-month',
  templateUrl: 'month.html',
})
export class MonthPage {

  public calendar = [];
  public years = [];
  public year: any;
  public userid: any;

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
    this.year = '2019'
    this.doGetCalendar()
  }
  doGetCalendar() {
    console.log('userid', this.userid)
    this.api.get("table/z_calendar", { params: { filter: 'pic=' + "'" + this.userid + "' AND year=" + "'" + this.year + "'", limit: 1000, sort: 'month ASC', group: 'month, month_description', groupSummary: "sum (total_visiting) as visit" } })
      .subscribe(val => {
        this.calendar = val['data']
        console.log(this.calendar)
      });
  }
  doGetYear() {
    this.api.get("table/z_calendar_year", { params: { limit: 1000, sort: 'year ASC' } })
      .subscribe(val => {
        this.years = val['data']
      });
  }
  doCalendar(date) {
    this.navCtrl.push('CalendarPage', {
      date: date,
      userid: this.userid,
      year: this.year
    })
  }
  doShowYear() {
    this.doGetYear()
    document.getElementById('showyear').style.display = 'block';
  }
  doCloseYear() {
    document.getElementById('showyear').style.display = 'none';
  }
  doSelectYear() {
    this.doGetCalendar()
    this.doCloseYear()
  }
}