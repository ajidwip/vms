import { Component, ElementRef, ViewChild } from '@angular/core';
import { AlertController, App, IonicPage, NavController, LoadingController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Http, Headers, RequestOptions } from '@angular/http';

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
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json");
    this.api.post("token",
      {
        "userid": this.myForm.value.userid,
        "password": this.myForm.value.password
      },
      { headers })
      .subscribe((val) => {
        this.token = val['token'];
        this.doMonth()
      }, err => {
        let alert = this.alertCtrl.create({
          subTitle: 'Password salah',
          buttons: ['OK']
        });
        alert.present();
        this.myForm.get('password').setValue('')
      });
  }
  doMonth() {
    localStorage.setItem('user', this.myForm.value.userid)
    this.app.getRootNav().setRoot('MonthPage', {
      userid: this.myForm.value.userid,
    });
  }
}
