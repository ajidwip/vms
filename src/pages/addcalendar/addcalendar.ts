import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Platform, ToastController, AlertController, NavParams, ActionSheetController } from 'ionic-angular';
import { HttpHeaders } from "@angular/common/http";
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';
import { UUID } from 'angular2-uuid';

@IonicPage()
@Component({
  selector: 'page-addcalendar',
  templateUrl: 'addcalendar.html',
})
export class AddcalendarPage {

  public userid = '';
  public users = [];
  public sales: any;
  public startdate: any;
  public finishdate: any;
  public loading: any;

  constructor(
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParam: NavParams,
    public api: ApiProvider,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController
  ) {
    this.getUsers()
  }
  getUsers() {
    this.api.get('table/z_users', { params: { limit: 100 } }).subscribe(val => {
      this.users = val['data'];
    });
  }
  onChange(user) {
    this.userid = user.id_user;
  }
  doOn() {
    document.getElementById("myModal").style.display = "block";
  }
  doOff() {
    document.getElementById("myModal").style.display = "none";
  }
  doSave() {
    this.sales = this.userid
    this.doOff()
  }
  doCreateCalendar() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.loading.present()
    var startDate = moment(this.startdate, 'YYYY-MM-DD');
    var endDate = moment(this.finishdate, 'YYYY-MM-DD');
    var diff = endDate.diff(startDate, 'days')
    let datestart = moment(this.startdate).format('YYYY-MM-DD')
    let datenext: any;
    for (let i = 0; i <= diff; i++) {
      datenext = moment(datestart, 'YYYY-MM-DD')
        .add(i, 'day')
        .format('ddd YYYY-MM-DD');
      let date = new Date(moment(datenext).format('YYYY-MM-DD'));
      date.setHours(0, 0, 0, 0);
      // Thursday in current week decides the year.
      date.setDate(date.getDate() + 3 - (date.getDay() + 7) % 7);
      // January 4 is always in week 1.
      let week1 = new Date(date.getFullYear(), 0, 4);
      // Adjust to Thursday in week 1 and count number of weeks from date to week1.
      let batch = (Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 7) % 7) / 7) + 1)
      //let batchno = (date.getFullYear().toString().substr(-2)) //Get Year 2 Digit
      this.doPostCalendar(datenext, batch)
    }
  }
  doPostCalendar(datenext, batch) {
    this.api.get("table/z_calendar", { params: { limit: 1000, filter: 'fulldate=' + "'" + moment(datenext).format('YYYY-MM-DD') + "' AND pic=" + "'" + this.sales + "'" } })
      .subscribe(val => {
        let data = val['data']
        if (data.length == 0) {
          const headers = new HttpHeaders()
            .set("Content-Type", "application/json");
          this.api.post("table/z_calendar",
            {
              "fulldate": moment(datenext).format('YYYY-MM-DD'),
              "day": moment(datenext).format('ddd'),
              "day_id": moment(datenext).format('dddd'),
              "date": moment(datenext).format('DD'),
              "month": moment(datenext).format('MM'),
              "month_description": moment(datenext).format('MMMM'),
              "year": moment(datenext).format('YYYY'),
              "week": batch,
              "holidays": 0,
              "total_visiting": 0,
              "pic": this.sales,
              "uuid": UUID.UUID()
            },
            { headers })
            .subscribe(val => {
              if (this.finishdate == moment(datenext).format('YYYY-MM-DD')) {
                let alert = this.alertCtrl.create({
                  subTitle: 'Sukses',
                  buttons: ['OK']
                });
                alert.present();
                this.loading.dismiss()
              }
            }, err => {
              this.doPostCalendar(datenext, batch)
            });
        }
      }, err => {
        this.doPostCalendar(datenext, batch)
      });
  }

}
