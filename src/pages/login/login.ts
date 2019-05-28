import { Component, ElementRef, ViewChild } from '@angular/core';
import { Events, AlertController, App, IonicPage, NavController, LoadingController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Http, Headers, RequestOptions } from '@angular/http';
import { Md5 } from 'ts-md5/dist/md5';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  myForm: FormGroup;
  public loading: any;
  public token: any;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public app: App,
    public loadingCtrl: LoadingController,
    public fb: FormBuilder,
    public navParams: NavParams,
    public storage: Storage,
    public events: Events,
    public api: ApiProvider) {
    this.myForm = fb.group({
      userid: [''],
      password: ['']
    })
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present().then(() => {
      this.loading.dismiss()
    });

  }
  doLogin() {
    this.api.get("table/z_users", { params: { limit: 10, filter: 'id_user=' + "'" + this.myForm.value.userid + "' AND password=" + "'" + Md5.hashStr(this.myForm.value.password) + "'" } })
      .subscribe(val => {
        let data = val['data']
        if (data.length == 0) {
          let alert = this.alertCtrl.create({
            subTitle: 'Password salah',
            buttons: ['OK']
          });
          alert.present();
          this.myForm.get('password').setValue('')
        }
        else {
          this.events.publish('user:group', data, Date.now());
          if (data[0].group == 'MANAGER') {
            this.doListVisiting(data)
          }
          else {
            this.doMonth(data)
          }
        }
      });
  }
  doMonth(data) {
    localStorage.setItem('user', data[0].id_user)
    localStorage.setItem('group', data[0].group)
    this.app.getRootNav().setRoot('MonthPage', {
      userid: this.myForm.value.userid,
    });
  }
  doListVisiting(data) {
    localStorage.setItem('user', data[0].id_user)
    localStorage.setItem('group', data[0].group)
    this.app.getRootNav().setRoot('ListvisitingPage', {
      userid: this.myForm.value.userid,
    });
  }
}
