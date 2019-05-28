import { Component } from '@angular/core';
import { Events, App, MenuController, Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpHeaders } from "@angular/common/http";
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  public loading: any;
  public group: any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public appCtrl: App,
    public menuCtrl: MenuController,
    public events: Events,
    public locationAccuracy: LocationAccuracy,
    public androidPermissions: AndroidPermissions,
    public loadingCtrl: LoadingController) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
        result => {
        },
        err => this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION, this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION, this.androidPermissions.PERMISSION.CAMERA])
      );
      this.locationAccuracy.canRequest()
        .then((canRequest: boolean) => {
          if (canRequest) {
            let accuracy = this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY;
            this.locationAccuracy.request(accuracy)
              .then(() => {

              },
                error => {

                }
              );
          }
        });
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      this.group = localStorage.getItem('group')
      events.subscribe('user:group', (role, time) => {
        this.group = role[0].group;
      });
      this.loading.present().then(() => {
        if (localStorage.getItem('user') == null) {
          this.appCtrl.getRootNav().setRoot('LoginPage');
        }
        else {
          if (localStorage.getItem('group') == 'MANAGER') {
            this.appCtrl.getRootNav().setRoot('ListvisitingPage', {
              userid: localStorage.getItem('user')
            });
          }
          else {
            this.appCtrl.getRootNav().setRoot('MonthPage', {
              userid: localStorage.getItem('user')
            });
          }
        }
        this.loading.dismiss()
      });
    });
  }
  doLogout() {
    localStorage.removeItem('user')
    localStorage.removeItem('group')
    this.group = '';
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
    if (localStorage.getItem('group') == 'MANAGER') {
      this.appCtrl.getRootNav().setRoot('ListvisitingPage', {
        userid: localStorage.getItem('user')
      });
    }
    else {
      this.appCtrl.getRootNav().setRoot('MonthPage', {
        userid: localStorage.getItem('user')
      });
    }
  }
  doAddCalendar() {
    this.menuCtrl.close();
    this.appCtrl.getRootNav().setRoot('AddcalendarPage');
  }
}

