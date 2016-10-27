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
          this.loadTimer = setTimeout(_ => this.loadData(), 1000);
      })  
      .catch(e => this.errorMessage = e.message || e.toString())
  }  

  get memorySeries(): Array<LineSeries> {
    return [{
        name: 'Free',
        points: this.history.map(p => ({ 
          x: p.ts, 
          y: p.mem_free / 1024 / 1024
        }))

      }];
  } 


  get cpuSeries(): Array<LineSeries> {
    return [{
        name: 'System',
        color: '#f0ad4e',
        points: this.history.map(p => ({ 
          x: p.ts, 
          y: p.cpu_sys
        }))
      }, {
        name: 'User',
        color: '#5bc0de',
        points: this.history.map(p => ({ 
          x: p.ts, 
          y: p.cpu_user
        }))
      }, {
        name: 'IRQ',
        color: '#5cb85c',
        points: this.history.map(p => ({ 
          x: p.ts, 
          y: p.cpu_irq
        }))
      }];
  } 

  toPercentage(value: number) {
    return value * 100 + '%';
  }
}
