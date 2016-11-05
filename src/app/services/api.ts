import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';


import { CacheService  } from './universal-cache';

export function hashCode(str) {
  let hash = 0;
  if (str.length === 0) {
    return hash;
  }
  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

const ApiPrefix = '/api';

@Injectable()
export class ApiService {
  constructor(public http: Http, public cache: CacheService) {
  }

  get(url) {
    if(!url.startsWith(ApiPrefix))
      url = ApiPrefix + url;
    let key = url;

    if (this.cache.has(key)) {
      //let res = Observable.of(this._cache.get(key));
      //this.cache.set(key, undefined);
      //return res;
    }

    return this.http.get(url)
      .map(res => res.json())
      .do(json => {
        this.cache.set(key, json);
      })
      .share();
  }

}
