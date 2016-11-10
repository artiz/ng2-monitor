import * as os from 'os';
import { HistoryRecord } from '../../shared/entities/history-record';

const DATA_LOAD_INTERVAL = 1000; // ms
const HISTORY_POINTS_COUNT = 600;

class ServiceImpl {
  history: Array<HistoryRecord> = [];
  timer: number;
  prevCpus: any;

  start() {
    if(this.timer)
      this.stop();
    this.prevCpus = os.cpus();

    this.loadData(); 
  }

  stop() {
    if(this.timer)
      clearTimeout(this.timer);
    this.timer = 0;
  }


  private loadData() {
    let rec: HistoryRecord = {
      mem_free: os.freemem(),
      mem_total: os.totalmem(),
      ts: 0
    };

    let cpus = os.cpus();
    let len = cpus.length;

    for(let ndx=0; ndx<len; ++ndx) {
      let cpu = cpus[ndx];
      let cpuPrev = this.prevCpus[ndx];

      let total = 0;
      for(let tp in cpu.times)
        total += cpu.times[tp] - cpuPrev.times[tp];
     
      for(let tp in cpu.times) {
        let delta = cpu.times[tp] - cpuPrev.times[tp];
        rec['cpu_' + tp] = Math.round(100 * delta / total);
      }
    }

    this.prevCpus = cpus;
    let prevPoint = this.history[this.history.length - 1]; 
    rec.ts = Date.now();
    this.history.push(rec);
    if(this.history.length > HISTORY_POINTS_COUNT)
      this.history.shift();

    let timeout = prevPoint 
      ? Math.min(DATA_LOAD_INTERVAL, 2 * DATA_LOAD_INTERVAL - rec.ts + prevPoint.ts) 
      : DATA_LOAD_INTERVAL;
    this.timer = setTimeout(_ => this.loadData(), timeout);
  }
}


export const SystemService = new ServiceImpl();