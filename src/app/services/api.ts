import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';


import { Cache  } from './universal-cache';

const ApiPrefix = '/api';

@Injectable()
export class ApiService {

  constructor(public http: Http, public _cache: Cache) {

  }

  get(url) {
    if(!url.startsWith(ApiPrefix))
      url = ApiPrefix + url;


    let key = url;
    if (this._cache.has(key)) {
      //let res = Observable.of(this._cache.get(key));
      //this._cache.set(key, undefined);
      //return res;
    }

    // you probably shouldn't .share() and you should write the correct logic
    return this.http.get(url)
      .map(res => res.json())
      .do(json => {
        this._cache.set(key, json);
      })
      .share();
  }
}
