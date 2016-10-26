import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ApiService } from '../services/api';
import { HistoryRecord } from '../../shared/entities/history-record';

@Component({
  selector: 'home',
  templateUrl: './home.template.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  isBrowser: boolean;
  history: Array<HistoryRecord> = [];
  loadTimer: number;
  errorMessage: string;


  constructor (@Inject('isBrowser') isBrowser: boolean, public api: ApiService) {
    this.isBrowser = isBrowser;
  }

  ngOnInit() {
    this.loadData();
  
    if(this.isBrowser) {
      // TODO: open websocket
      // https://github.com/theturtle32/WebSocket-Node
    }
        
  }
  
  ngOnDestroy() {
    if(this.loadTimer)
      clearTimeout(this.loadTimer);
  }

  loadData() {
    this.api.get('/history').toPromise()
      .then(data => {
        this.history = data as Array<HistoryRecord>;
        if(this.isBrowser)
          this.loadTimer = setTimeout(_ => this.loadData(), 300);
      })  
      .catch(e => this.errorMessage = e.message || e.toString())

  }  

  get columnWidth(): string {
    return (99 / (this.history.length || 1)).toFixed(3) + '%';
  }

  toPercentage(value: number) {
    return value * 100 + '%';
  }
}
