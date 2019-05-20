import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Platform, ToastController, AlertController, NavParams, ActionSheetController } from 'ionic-angular';
import { HttpHeaders } from "@angular/common/http";
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-visiting',
  templateUrl: 'visiting.html',
})
export class VisitingPage {

  public date: any;
  public userid: any;
  public visiting = [];

  constructor(
    public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public navParam: NavParams,
    public api: ApiProvider,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public alertCtrl: AlertController
  ) {
    this.date = this.navParam.get('date')
    this.userid = this.navParam.get('userid')
  }
  doAdd() {
    this.navCtrl.push('AddvisitingPage', {
      date: this.date,
      userid: this.userid
    })
  }
  ionViewDidEnter() {
    this.doGetVisiting()
  }
  doGetVisiting() {
    this.api.get("table/z_visiting", { params: { limit: 1000, filter: 'pic=' + "'" + this.userid + "' AND date_visit=" + "'" + this.date['fulldate'] + "'", sort: 'name ASC' } })
      .subscribe(val => {
        this.visiting = val['data']
        console.log(this.visiting)
      }, err => {
        this.doGetVisiting()
      });
  }
  doMore(visit) {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Detail Kunjungan',
          handler: () => {
            this.navCtrl.push('DetailvisitingPage', {
              visit: visit,
              userid: this.userid
            })
          }
        },
        {
          text: 'Riwayat Kunjungan',
          handler: () => {
            this.navCtrl.push('HistoryvisitingPage', {
              visit: visit,
              userid: this.userid
            })
          }
        },
        {
          text: 'Hapus Jadwal',
          handler: () => {
            this.doDeleteVisiting(visit)
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });

    actionSheet.present();
  }
  doDeleteVisiting(visit) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Yakin ingin menghapus jadwal ini?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Hapus',
          handler: () => {
            this.doDelete(visit)
          }
        }
      ]
    });
    alert.present();
  }
  doDelete(visit) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");
    this.api.delete("table/z_visiting", { params: { filter: "uuid=" + "'" + visit.uuid + "'" }, headers })
      .subscribe(val => {
        let alert = this.alertCtrl.create({
          subTitle: 'Hapus Jadwal Sukses',
          buttons: ['OK']
        });
        alert.present();
        this.doGetCalendar()
        this.ionViewDidEnter()
      }, err => {
        this.doDelete(visit)
      });
  }
  doGetCalendar() {
    this.api.get("table/z_calendar", { params: { limit: 10, filter: 'fulldate=' + "'" + this.date['fulldate'] + "' AND pic=" + "'" + this.userid + "'" } })
      .subscribe(val => {
        let data = val['data']
        this.doUpdateCalendar(data)
      }, err => {
        this.doGetCalendar()
      });
  }
  doUpdateCalendar(data) {
    if (data[0].total_visiting > 0) {
      const headers = new HttpHeaders()
        .set("Content-Type", "application/json");
      this.api.put("table/z_calendar",
        {
          "uuid": data[0].uuid,
          "total_visiting": data[0].total_visiting - 1
        },
        { headers })
        .subscribe(
          (val) => {
          }, err => {
            this.doUpdateCalendar(data)
          });
    }
  }
}
