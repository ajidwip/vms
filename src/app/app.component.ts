import { Component } from '@angular/core';
import { App, MenuController, Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpHeaders } from "@angular/common/http";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  public loading: any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public appCtrl: App,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      this.loading.present().then(() => {
        if (localStorage.getItem('user') == null) {
          this.appCtrl.getRootNav().setRoot('LoginPage');
        }
        else {
          this.appCtrl.getRootNav().setRoot('MonthPage', {
            userid: localStorage.getItem('user')
          });
        }
        this.loading.dismiss()
      });
    });
  }
  doLogout() {
    localStorage.removeItem('user')
    this.menuCtrl.close();
    this.appCtrl.getRootNav().setRoot('LoginPage');
  }
  doListStore() {
    this.menuCtrl.close();
    this.appCtrl.getRootNav().setRoot('ListstorePage', {
      userid: localStorage.getItem('user')
    });
  }
  doHome() {
    this.menuCtrl.close();
    this.appCtrl.getRootNav().setRoot('MonthPage', {
      userid: localStorage.getItem('user')
    });
  }
 }

