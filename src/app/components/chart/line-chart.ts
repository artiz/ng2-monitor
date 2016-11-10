import { Component, OnInit, OnDestroy, AfterViewInit, 
  Input, Inject, Injectable, ElementRef, NgZone } from '@angular/core';
import { LineSeries, Bounds, ChartTheme } from './structures';

const CHART_HEIGHT = 100;
const DEFAULT_CHART_RATIO = 2;

const CHART_PADDING = 0.1;


export class Animator {

  startTime?: number = null;
  endTime?: number = null;
  length: number;

  steps = 8;
  timer: any;

  constructor (protected callback: (v: any) => void, 
    protected end: number, 
    protected begin: number = 0, 
    protected duration: number = 500) {

    this.length = end - begin;
    return this;
  }

  start(begin?: number) {
    if(typeof begin != 'undefined') {
      this.begin = begin;
      this.length = this.end - this.begin;
    
    }

    if(this.timer)
      //clearTimeout(this.timer);
      cancelAnimationFrame(this.timer);

    this.startTime = Date.now();
    this.endTime = this.startTime + this.duration;
    //this.timer = setTimeout(this.step.bind(this), this.duration/this.steps);
    this.timer = requestAnimationFrame(this.step.bind(this));
  }

  stop(value?: number){
    if(this.startTime === null)
      return;
    this.callback(value || this.end);
  }

  protected step() {
    let t = Date.now();

    if(t >= this.endTime) {
      this.callback(this.end);
      return;
    }

    let value = this.begin + this.length * (t - this.startTime) / this.duration;
    value = Math.round(value * 100) / 100;
    this.callback(value);
    //this.timer = setTimeout(this.step.bind(this), this.duration/this.steps);
    this.timer = requestAnimationFrame(this.step.bind(this));
  }
}


@Component({
  selector: 'line-chart',
  styles: [`
    path {
      transition: width 1s;
    }
  `],
  template: `
    <svg [style.height]="height" [style.width]="width" version="1.1" 
      [attr.viewBox]="viewBox"
      overflow="auto"
      preserveAspectRatio="none">
      <defs>
        <linearGradient id="bg" x1="0" x2="0" y1="0" y2="1" >
          <stop offset="0%" stop-color="#e3e3e4"/>
          <stop offset="80%" stop-color="#f8f8f9"/>
          <stop offset="100%" stop-color="#e3e3e4"/>
        </linearGradient>
      </defs>
      <rect 
        x="0" 
        y="0" 
        [attr.width]="chartWidth" 
        [attr.height]="chartHeight"
        fill="url(#bg)" 
        [attr.stroke]="theme.borderColor" />
     
         <rect 
          [attr.x]="gridX" 
          [attr.y]="gridY" 
          [attr.width]="gridWidth" 
          [attr.height]="gridHeight"
          fill="none"
          [attr.stroke]="theme.borderColor" />
       

        <polyline *ngFor="let srs of series; let ndx = index"
          fill="none"
          [attr.stroke-width]="srs.width || lineWidth"
          [attr.stroke-opacity]="lineOpacity"
          [attr.stroke]="srs.color || theme.getColor(ndx)" 
          [attr.points]="formatPoints(srs)"/>
      
     </svg>
  `
})
export class LineChart implements OnInit, OnDestroy {

  @Input()
  height: string = '100px';

  @Input()
  width: string = '100%';

  @Input()
  timeline: boolean;

  @Input('min-range')
  minRange: number | null;

  @Input()
  lineWidth: number = 1;

  @Input()
  xAxis: number | null;

  @Input()
  yAxis: number | null;

  theme: ChartTheme = ChartTheme.default;

  @Input()
  set series (data: Array<LineSeries>) {
    
    this.seriesList = this.loadSeries(data);

    if(this.animate) {
      this.lineOpacity = 0.5;
      this.animationZone.run(() => this.animator.start());
    }
  }

  get series() {
    return this.seriesList;
  }


  get gridX () { return this.chartWidth * this.chartPadding; }
  get gridY () { return this.chartHeight * this.chartPadding; }
  get gridWidth () { return this.chartWidth * (1 - 2* this.chartPadding); }
  get gridHeight () { return this.chartHeight * (1 - 2* this.chartPadding); }

  
  /** Used to enable animation in browser */  
  animate: boolean;

  protected lineOpacity: number = 1;

  protected seriesList: Array<LineSeries> = [];
  
  protected chartWidth: number = CHART_HEIGHT * DEFAULT_CHART_RATIO;
  protected chartHeight: number = CHART_HEIGHT;
  protected chartRatio = DEFAULT_CHART_RATIO;
  protected chartPadding = CHART_PADDING;
  
  protected chartBounds = new Bounds();

  protected animator: Animator = null;
  protected animationZone: NgZone;

  constructor (@Inject('isBrowser') isBrowser: boolean, protected ref: ElementRef) {
    this.animate = isBrowser;
    if(this.animate) {
      this.lineOpacity = 0;
      this.animationZone = new NgZone({ enableLongStackTrace: false });
      this.animator = new Animator((v) => this.lineOpacity = v, 
        1, 
        this.lineOpacity,
        500);
      }
  }

  ngOnInit() {
    if(this.animate) {
      // TODO: update with renderer
      // this._renderer.animate( element.nativeElement, 
      // { styles: [{transform : 'translate(0, 0)'}] }, 
      // [ { offset: 1, styles: { styles: [{transform : 'translate(100px, 200px)'}] } } ], 5000, 0, 'ease' ).play();
      
      this.animationZone.run(() => this.animator.start());
    }
  }
  
  ngOnDestroy() {
    if(this.animate) {
      this.animator.stop();
    }
  }

  ngAfterViewInit() {
    let el = this.ref.nativeElement;
    if(el && el.offsetHeight && el.offsetWidth) {
      this.chartRatio = el.offsetWidth / Math.max(el.offsetHeight, CHART_HEIGHT);
      //console.log('chart.ngAfterViewInit, ratio', this.chartRatio, 
      //  el.offsetWidth, el.offsetHeight);
    }

    this.chartHeight = CHART_HEIGHT;
    this.chartWidth = CHART_HEIGHT * this.chartRatio;
  }

  get viewBox() {
    return `0 0 ${ this.chartWidth || 0 } ${ (this.chartHeight || 0) }`;
  }
 
  formatPoints(srs: LineSeries) {
    if(!srs.points)
      return '';
    
    if(srs.formatted)
      return srs.formatted;

    const bounds = this.chartBounds;

    // TODO: appy logaryphmic scale
    const scale = {
        vert: bounds.height ? this.chartHeight / bounds.height : 1,
        horz: bounds.width ? this.chartWidth / bounds.width : 1
    };

   
    let left = bounds.left || 0, 
      top = bounds.top || 0,
      bottom = bounds.bottom || 0;
    const paddingV = this.chartHeight * this.chartPadding;  
    const paddingH = this.chartWidth * this.chartPadding;  
    
    const chartAreaScale = 1 - this.chartPadding * 2;
    
    return srs.formatted = srs.points.map(
      p =>  {
        let l = ((p[0]  - left) * scale.horz * chartAreaScale + paddingH);
        let t = ((this.chartHeight - (p[1] - bottom) * scale.vert) * chartAreaScale + paddingV);
        return `${ l.toFixed(2) } ${ t.toFixed(2) }`
      }).join(',');
  }

  private loadSeries(data: Array<LineSeries>) {
    let maxBounds = new Bounds();
    for(let line of data) 
    {
      let bounds = new Bounds();
  
      for(let p of line.points) {
        if(bounds.top === null || bounds.top < p[1])
          bounds.top = p[1];
        if(bounds.bottom === null || bounds.bottom > p[1])
          bounds.bottom = p[1];
        if(bounds.left === null || p[0] < bounds.left )
          bounds.left = p[0];
        if(bounds.right === null || p[0] > bounds.right )
          bounds.right = p[0];
      }
     
      let points = [...line.points];
      if(this.timeline) {
        if(this.minRange && bounds.width < this.minRange) {
          let endTime = line.points.length 
            ? line.points[line.points.length - 1][0]
            : Date.now();
          let startTime = line.points.length 
            ? line.points[0][0]
            : Date.now();

          let value = line.points.length ? line.points[0][1] : 0;

          bounds.left = endTime - this.minRange;
          line.points.unshift([startTime - 1, value]);
          line.points.unshift([bounds.left, value]);
        }
      }

      maxBounds.extend(bounds);
      line.bounds = bounds;
    }
   
    this.chartBounds = maxBounds;
    return data;
  }
}
