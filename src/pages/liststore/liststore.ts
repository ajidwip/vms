import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Platform, ToastController, AlertController, NavParams, ActionSheetController } from 'ionic-angular';
import { HttpHeaders } from "@angular/common/http";
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-liststore',
  templateUrl: 'liststore.html',
})
export class ListstorePage {

  public userid = '';
  public store = [];
  halaman = 0;

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
    this.userid = this.navParam.get('userid')
  }
  ionViewDidEnter() {
    this.store = [];
    this.halaman = 0;
    this.doGetStore()
  }
  doGetStore() {
    return new Promise(resolve => {
      let offset = 30 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get("table/z_store", { params: { limit: 30, filter: 'pic_update=' + "'" + this.userid + "'", offset: offset, sort: 'name ASC' } })
        .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.store.push(data[i]);
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
    this.store = [];
    this.halaman = 0;
    this.doGetStore().then(response => {
      refresher.complete();

    })
  }
  doInfinite(infiniteScroll) {
    this.doGetStore().then(response => {
      infiniteScroll.complete();

    })
  }
  doAddStore() {
    this.navCtrl.push('AddstorePage', {
      userid: this.userid
    })
  }
  doMore(st) {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Detail Toko',
          handler: () => {
            this.navCtrl.push('DetailstorePage', {
              store: st,
              userid: this.userid,
              disable: true
            })
          }
        },
        {
          text: 'Update Toko',
          handler: () => {
            this.navCtrl.push('DetailstorePage', {
              store: st,
              userid: this.userid,
              disable: false
            })
          }
        },
        {
          text: 'Riwayat Kunjungan',
          handler: () => {

          }
        },
        {
          text: 'Hapus Toko',
          handler: () => {
            this.doDeleteStore(st)
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
  doDeleteStore(st) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Yakin ingin menghapus toko ini?',
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
            this.doDelete(st)
          }
        }
      ]
    });
    alert.present();
  }
  doDelete(st) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");
    this.api.delete("table/z_store", { params: { filter: "id=" + "'" + st.id + "'" }, headers })
      .subscribe(val => {
        let alert = this.alertCtrl.create({
          subTitle: 'Hapus Toko Sukses',
          buttons: ['OK']
        });
        alert.present();
        this.ionViewDidEnter()
      }, err => {
        this.doDelete(st)
      });
  }
}
