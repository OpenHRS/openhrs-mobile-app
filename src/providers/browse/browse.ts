import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class BrowseProvider {

  data: any;

  constructor(public http: Http) {
    this.data = null;
  }

  getStatute(){

  }

}
