import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Platform, ToastController, AlertController, NavParams, ActionSheetController } from 'ionic-angular';
import { HttpHeaders } from "@angular/common/http";
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';
import { DatePicker } from '@ionic-native/date-picker';

@IonicPage()
@Component({
  selector: 'page-listvisiting',
  templateUrl: 'listvisiting.html',
})
export class ListvisitingPage {
  public userid: any;
  public datenow: any;
  public datenowformat: any;
  public visiting = [];
  halaman = 0;
  public sort: any;
  public input: any;

  constructor(
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParam: NavParams,
    public api: ApiProvider,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public datePicker: DatePicker
  ) {
    this.sort = 'pic ASC'
    this.datenowformat = moment().format('dddd, DD MMMM YYYY')
    this.datenow = moment().format('YYYY-MM-DD')
    this.userid = this.navParam.get('userid')
    this.doGetVisiting()
  }
  onInput(ev: any) {
    let value = ev.target.value;
    this.api.get("table/z_visiting", { params: { limit: 30, filter: 'date_visit=' + "'" + this.datenow + "' AND pic LIKE '%" + value + "%'", sort: this.sort, group: 'pic', groupSummary: "count (pic) as totalvisit" } })
      .subscribe(val => {
        let data = val['data'];
        if (value && value.trim() != '') {
          this.visiting = data.filter(visit => {
            return visit.pic.toLowerCase().indexOf(value.toLowerCase()) > -1;
          })
        } else {
          this.visiting = [];
          this.halaman = 0;
          this.doGetVisiting()
        }
      });
  }
  onCancel(ev: any) {
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
        this.api.get("table/z_visiting", { params: { limit: 30, filter: 'date_visit=' + "'" + this.datenow + "'", offset: offset, sort: this.sort, group: 'pic', groupSummary: "count (pic) as totalvisit" } })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.visiting.push(data[i]);
            }
            console.log(this.visiting)
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    })
  }
  doInfinite(infiniteScroll) {
    this.doGetVisiting().then(response => {
      infiniteScroll.complete();

    })
  }
  doDetail(visit) {
    this.navCtrl.push('ListdetailvisitingPage', {
      pic: visit.pic,
      date: this.datenow
    })
  }
  doUrutkan() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'URUTKAN BERDASARKAN',
      buttons: [
        {
          text: 'Nama Sales A-Z',
          handler: () => {
            this.sort = 'pic ASC'
            this.halaman = 0;
            this.visiting = [];
            this.doGetVisiting()
          }
        },
        {
          text: 'Nama Sales Z-A',
          handler: () => {
            this.sort = 'pic DESC'
            this.halaman = 0;
            this.visiting = [];
            this.doGetVisiting()
          }
        },
        {
          text: 'Total Kunjungan Terbanyak',
          handler: () => {
            this.sort = 'totalvisit DESC'
            this.halaman = 0;
            this.visiting = [];
            this.doGetVisiting()
          }
        },
        {
          text: 'Total Kunjungan Terendah',
          handler: () => {
            this.sort = 'totalvisit ASC'
            this.halaman = 0;
            this.visiting = [];
            this.doGetVisiting()
          }
        },
        {
          text: 'Tutup',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });

    actionSheet.present();
  }
  doOpenDatePicker() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    }).then(date => {
      this.datenow = moment(date).format('YYYY-MM-DD')
      this.halaman = 0;
      this.visiting = [];
      this.doGetVisiting()
    })
  }
}
