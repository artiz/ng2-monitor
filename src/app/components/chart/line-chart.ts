import { Component, OnInit, OnDestroy, Input, Inject, ElementRef } from '@angular/core';

import { LineSeries, Bounds } from './structures';

const CHART_HEIGHT = 100;
const DEFAULT_CHART_RATIO = 2;

const CHART_PADDING = 0.1;



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
        stroke="#cccccc" />
      
        <polyline *ngFor="let srs of series; let ndx = index"
          fill="none"
          stroke-width="0.5"
          [attr.stroke]="srs.color || '#cc0000'" 
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
  xAxis: number | null;

  @Input()
  yAxis: number | null;


  @Input()
  set series (data: Array<LineSeries>) {
    this.seriesList = this.loadSeries(data);
  }

  get series() {
    return this.seriesList;
  }

  
  /** Used to enable animation in browser */  
  isBrowser: boolean;

  protected seriesList: Array<LineSeries> = [];
  
  protected chartWidth: number;
  protected chartHeight: number;

  constructor (@Inject('isBrowser') isBrowser: boolean, protected ref: ElementRef) {
    this.isBrowser = isBrowser;

    // TODO: inject Renderer and get real ratio

  }

  ngOnInit() {
    if(this.isBrowser) {
      // TODO: run animation    
    }
  }
  
  ngOnDestroy() {
    // TODO: stop animation
  }


  get viewBox() {
    return `0 0 ${ this.chartWidth || 0 } ${ (this.chartHeight || 0) }`;
  }
 
  formatPoints(srs: LineSeries) {
    if(!srs.points)
      return '';
    const scale = srs.scale || {
      horz: 1, vert: 1
    };
   
    let left = srs.bounds.left, 
      top = srs.bounds.top,
      bottom = srs.bounds.bottom;
    const paddingV = this.chartHeight * CHART_PADDING;  
    const paddingH = this.chartWidth * CHART_PADDING;  
    
    const chartAreaScale = 1 - CHART_PADDING * 2;
    
    return srs.points.map(
      p => `${ ((p[0]  - left) * scale.horz * chartAreaScale + paddingH).toFixed(2) } `
        + `${ ((this.chartHeight - (p[1] - bottom) * scale.vert) * chartAreaScale + paddingV).toFixed(2) }`).join(',');
  }

  private loadSeries(data: Array<LineSeries>) {
    let maxBounds = new Bounds();
 
    this.chartHeight = CHART_HEIGHT;
    this.chartWidth = CHART_HEIGHT * DEFAULT_CHART_RATIO;

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

      maxBounds.extend(bounds);
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

      line.scale = {
        vert: bounds.height ? this.chartHeight / bounds.height : 1,
        horz: bounds.width ? this.chartWidth / bounds.width : 1
      };

      line.bounds = bounds;
    }
   
    return data;
  }
}
