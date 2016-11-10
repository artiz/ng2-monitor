import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ApiService } from '../services/api';
import { HistoryRecord } from '../../shared/entities/history-record';
import { LineSeries } from '../components/chart/structures';

@Component({
  selector: 'home',
  templateUrl: './home.template.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  isBrowser: boolean;
  history: Array<HistoryRecord> = [];
  loadTimer: number;
  errorMessage: string;

  _memorySeries: Array<LineSeries>;
  _cpuSeries: Array<LineSeries>;

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
        this._memorySeries = null;
        this._cpuSeries = null;
        this.history = (data as Array<HistoryRecord>) || [];
        if(this.isBrowser)
          this.loadTimer = setTimeout(_ => this.loadData(), 2500);
      })  
      .catch(e => this.errorMessage = e.message || e.toString())
  }  

  get memorySeries(): Array<LineSeries> {
    return this._memorySeries || (this._memorySeries = [<LineSeries>{
        name: 'Occupied',
        points: this.history.map(p => [p.ts, p.mem_total - p.mem_free])
      }, <LineSeries>{
        name: 'Total',
        color: '#0033cc',
        width: 2,
        points: this.history.map(p => [p.ts, p.mem_total])
      }]);
  } 


  get cpuSeries(): Array<LineSeries> {
    return this._cpuSeries || (this._cpuSeries = [
      <LineSeries>{
        name: 'System',
        points: this.history.map(p => [p.ts, p.cpu_sys])
      }, <LineSeries>{
        name: 'User',
        points: this.history.map(p => [p.ts, p.cpu_user])
      }, <LineSeries>{
        name: 'IRQ',
        points: this.history.map(p => [p.ts, p.cpu_irq])
      }
    ]);
  } 

  toPercentage(value: number) {
    return value * 100 + '%';
  }
}
