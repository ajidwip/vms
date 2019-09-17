import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  private api_url = '';

  constructor(public http: HttpClient) {
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
      if (req.readyState == XMLHttpRequest.DONE) {
        console.log(JSON.parse(req.responseText))
        this.api_url = JSON.parse(req.responseText)[0]
      }
    };

    req.open("GET", "https://raw.githubusercontent.com/ajidwip/json/master/ip.json", true);
    //req.setRequestHeader("secret-key", "$2a$10$wALNNmqblYorA8O3aAjGDuV7Ig1IucXC92bkr44jOe93HbpPuEQVK");
    req.send();
  }

  get(endpoint: string, params?: any) {
    return this.http.get(this.api_url + '/' + endpoint, params);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.api_url + '/' + endpoint, body, reqOpts)
  }
  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.api_url + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.api_url + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(this.api_url + '/' + endpoint, body, reqOpts);
  }
}
