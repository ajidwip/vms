import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, Platform, ToastController, AlertController, NavParams } from 'ionic-angular';
import { HttpHeaders } from "@angular/common/http";
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';
import { UUID } from 'angular2-uuid';

@IonicPage()
@Component({
  selector: 'page-addvisiting',
  templateUrl: 'addvisiting.html',
})
export class AddvisitingPage {

  public date: any;
  public liststore = [];
  public userid: any;
  public store = [];
  public loading: any;

  constructor(
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParam: NavParams,
    public api: ApiProvider,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public alertCtrl: AlertController
  ) {
    this.date = this.navParam.get('date')
    this.userid = this.navParam.get('userid')
    this.doGetStore()
  }
  ionViewDidEnter() {
    this.doGetStore()
  }
  doGetStore() {
    this.api.get("table/z_store", { params: { limit: 1000, filter: 'pic_update=' + "'" + this.userid + "'", sort: 'name ASC' } })
      .subscribe(val => {
        this.store = val['data']
      });
  }
  doCheckAll() {
    let checkall: any = document.getElementsByName('liststoreall[]')
    if (checkall[0].checked == true) {
      let array: any = document.getElementsByName('liststore[]')
      for (let i = 0; i < array.length; i++) {
        array[i].checked = true;
        this.liststore.push(array[i].value)
      }
      console.log(this.liststore)
    }
    else {
      let array: any = document.getElementsByName('liststore[]')
      for (let i = 0; i < array.length; i++) {
        array[i].checked = false;
        this.liststore = [];
      }
    }
  }
  doCheck(user) {
    let index = user.Row - 1
    let check: any = document.getElementsByName('liststore[]')[index]
    if (check.checked == true) {
      this.liststore.push(check.value)
      console.log(this.liststore)
    }
    else {
      let search = check.value
      for (var i = this.liststore.length - 1; i >= 0; i--) {
        if (this.liststore[i] === search) {
          this.liststore.splice(i, 1);
          console.log(this.liststore)
        }
      }
    }
  }
  doPopUp() {
    let alert = this.alertCtrl.create({
      subTitle: 'Sukses',
      buttons: ['OK']
    });
    alert.present();
  }
  doSubmit() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    this.loading.present()
    var self = this;
    for (let i = 0, a: any = Promise.resolve(); i < this.liststore.length; i++) {
      a = a.then(_ => new Promise(resolve =>
        setTimeout(function () {
          let liststore = self.liststore[i]
          self.doGetStoreLoop(liststore, i)
          resolve();
        }, Math.random() * 1000)
      ));
    }
  }
  doGetStoreLoop(liststore, i) {
    this.api.get("table/z_store", { params: { limit: 10, filter: 'pic_update=' + "'" + this.userid + "' AND store_code=" + "'" + liststore + "'", sort: 'name ASC' } })
      .subscribe(val => {
        let data = val['data']
        let datastore = data[0]
        this.doPostVisiting(datastore, i)
      }, err => {
        this.doGetStoreLoop(liststore, i)
      });
  }
  doPostVisiting(datastore, i) {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");
    this.api.post("table/z_visiting",
      {
        "store_code": datastore.store_code,
        "name": datastore.name,
        "address_1": datastore.address_1,
        "address_2": datastore.address_2,
        "city": datastore.city,
        "post_code": datastore.post_code,
        "latitude": datastore.latitude,
        "longitude": datastore.longitude,
        "telp": datastore.telp,
        "email": datastore.email,
        "pic": this.userid,
        "status": '',
        "description": '',
        "date_visit": this.date['fulldate'],
        "datetime": moment().format('YYYY-MM-DD HH:mm:ss'),
        "uuid": UUID.UUID()
      },
      { headers })
      .subscribe(
        (val) => {
          if (i == this.liststore.length - 1) {
            this.doPopUp()
            this.loading.dismiss()
            this.navCtrl.pop()
          }
        }, err => {
          this.doPostVisiting(datastore, i)
        });
  }

}
