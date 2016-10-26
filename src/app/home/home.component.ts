import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ApiService } from '../services/api';


class CPU {
  model: string;
  speed: string;
  times: any;
}

@Component({
  selector: 'home',
  templateUrl: './home.template.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  isBrowser: boolean;
  cpus: Array<CPU> = new Array<CPU>();
  loadTimer: number;
  errorMessage: string;


  constructor (@Inject('isBrowser') isBrowser: boolean, public api: ApiService) {
    this.isBrowser = isBrowser;
  }

  ngOnInit() {
    console.log('home ngOnInit')
    this.loadCpus();
  
  }
  
  ngOnDestroy() {
    if(this.loadTimer)
      clearTimeout(this.loadTimer);
  }

  loadCpus() {
    this.api.get('/cpus').toPromise()
      .then(data => {
        this.cpus = data as Array<CPU>;
        if(this.isBrowser)
          this.loadTimer = setTimeout(_ => this.loadCpus(), 100);
      })  
      .catch(e => this.errorMessage = e.message || e.toString())

  }  
}
