import { Injectable } from '@angular/core';
import { RequestOptionsArgs, Headers, Http } from '@angular/http';
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
  constructor(public http: Http) {

  }

  protected formatRequestOptions(): RequestOptionsArgs {
    return <RequestOptionsArgs> {
        headers: new Headers({
          'X-Requested-With': 'XMLHttpRequest',
          'Accepts': 'application/json'
        }),
        withCredentials: true
      };
  }

  protected formatBodyRequestOptions(body: any): RequestOptionsArgs {
    return <RequestOptionsArgs> {
        headers: new Headers({
          'Content-Type': body ? 'application/json' : 'application/x-www-urlencoded',
          'Accepts': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }),
        withCredentials: true
      };
  }



 /**
  * whatever domain/feature method name
  */
  get(url: string, options?: any) {
    if(!url.startsWith(ApiPrefix))
      url = ApiPrefix + url;
   

    return this.http.get(url, options ||  this.formatRequestOptions())
      .map(res => res.json());
  }

}

@Injectable()
export class ModelService {

  constructor(public api: ApiService, public cache: CacheService) {

  }

  get(url) {
    // you want to return the cache if there is a response in it. 
    // This would cache the first response so if your API isn't idempotent you probably 
    // want to remove the item from the cache after you use it. LRU of 1
    let key = url;


    if (this.cache.has(key)) {
      let res = Observable.of(this.cache.get(key));
      this.cache.remove(key);
      return res;
    }

    // you probably shouldn't .share() and you should write the correct logic
    return this.api.get(url)
      .do(json => {
        this.cache.set(key, json);
      })
      .share();
  }

}
