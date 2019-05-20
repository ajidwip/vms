import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Platform, ToastController, AlertController, NavParams } from 'ionic-angular';
import { HttpHeaders } from "@angular/common/http";
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {
  public calendar = [];
  public date: any;
  public userid: any;
  public year: any;
  public month: any;
  public datenow: any;

  constructor(
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParam: NavParams,
    public api: ApiProvider,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public alertCtrl: AlertController
  ) {
    this.datenow = moment().format('YYYY-MM-DD')
    this.userid = this.navParam.get('userid')
    this.date = this.navParam.get('date')
    this.month = this.date['month_description']
    this.year = this.navParam.get('year')
    console.log(this.date)
  }
  ionViewDidEnter() {
    this.doGetCalendar()
  }
  doGetCalendar() {
    this.api.get("table/z_calendar", { params: { limit: 1000, filter: 'month=' + "'" + this.date['month'] + "' AND pic=" + "'" + this.userid + "' AND year=" + "'" + this.year + "'", group: 'week' } })
      .subscribe(val => {
        let weekall = val['data']
        let array = [];
        for (let i = 0; i < weekall.length; i++) {
          array.push(weekall[i].week)
        }
        console.log(Math.min.apply(Math, array), Math.max.apply(Math, array))
        this.api.get("table/z_calendar", { params: { limit: 100, filter: 'week >=' + Math.min.apply(Math, array) + ' AND week <=' + Math.max.apply(Math, array), sort: 'week ASC, year ASC, month ASC, date ASC' } })
          .subscribe(val => {
            this.calendar = val['data']
            console.log(this.calendar)
          });
      });
  }
  doKunjungan(date) {
    this.navCtrl.push('VisitingPage', {
      date: date,
      userid: this.userid
    })
  }
}