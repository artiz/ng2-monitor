import { Component, OnInit, OnDestroy, Input, Inject } from '@angular/core';

import { LineSeries, Bounds } from './structures';

/*

      <g fill="none" stroke="none">
        <path d="M 200 100 L 221.65063509461098 112.5 L 221.65063509461098 137.5 L 200 150 L 178.34936490538905 137.5 L 178.34936490538902 112.50000000000001 Z " stroke="#777">
        </path>
        <path d="M 200 75 L 243.30127018922192 100 L 243.30127018922195 150 L 200 175 L 156.69872981077808 150.00000000000003 L 156.69872981077805 100.00000000000003 Z " stroke="#777" >
        </path>
        <path d="M 200 50 L 264.9519052838329 87.5 L 264.9519052838329 162.5 L 200 200 L 135.0480947161671 162.50000000000003 L 135.04809471616707 87.50000000000006 Z " stroke="#777" >
        </path>
        <path d="M 200 25 L 286.60254037844385 74.99999999999999 L 286.6025403784439 174.99999999999997 L 200 225 L 113.39745962155615 175.00000000000006 L 113.3974596215561 75.00000000000006 Z " stroke="#777" >
        </path>
        <path d="M 200 0 L 308.25317547305485 62.499999999999986 L 308.25317547305485 187.49999999999997 L 200.00000000000003 250 L 91.74682452694519 187.50000000000006 L 91.74682452694512 62.500000000000085 Z " stroke="#777" >
        </path>
        <g opacity="0.6" >
          <path d="M 200 50 L 286.60254037844385 74.99999999999999 L 248.71392896287466 153.125 L 200 200 L 129.6354359425144 165.62500000000003 L 151.2860710371253 96.87500000000004 Z " fill="#0D95BC" >
          </path>
        </g>
      </g>

*/
/*
<rect 
        [attr.x]="0" 
        [attr.y]="0" 
        [attr.width]="bounds.width" 
        [attr.height]="bounds.height"
        fill="url(#bg)" 
        stroke="#cccccc" />
*/



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
        [attr.width]="bounds.width" 
        [attr.height]="bounds.height"
        fill="url(#bg)" 
        stroke="#cccccc" />
      
        <polyline *ngFor="let srs of series; let ndx = index"
          fill="none"
          stroke-width="1"
          [attr.stroke]="srs.color || '#cc0000'" 
          [attr.points]="loadPoints(srs)"/>
      
     </svg>
  `
})
export class LineChart implements OnInit, OnDestroy {
  private _series: Array<LineSeries> = [];

  @Input()
  height: string = '100px';

  @Input()
  width: string = '100%';

  @Input()
  set series (data: Array<LineSeries>) {
    let bounds = new Bounds();
    
    for(let line of data) {
      for(let p of line.points) {
        if(bounds.top === null || bounds.top < p.y)
          bounds.top = p.y;
        if(bounds.bottom === null || bounds.bottom > p.y)
          bounds.bottom = p.y;
        if(bounds.left === null || p.x < bounds.left )
          bounds.left = p.x;
        if(bounds.right === null || p.x > bounds.right )
          bounds.right = p.x;
      }
    }

    this.bounds = bounds;
    this._series = data;
    
  }

  get series() {
    return this._series;
  }

  bounds: Bounds;

  /** Used to enable animation in browser */  
  isBrowser: boolean;

  constructor (@Inject('isBrowser') isBrowser: boolean) {
    this.isBrowser = isBrowser;
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
    let b = this.bounds;
    return `0 0 ${ b.width || 0 } ${ (b.height || 0) }`;
  }
  
  loadPoints(srs: LineSeries) {
    if(!srs.points)
      return '';
    let { left, top, bottom, height } = this.bounds;
    let padding = height * 0.25;    
    return srs.points.map(
      p => `${ (p.x-left).toFixed(2) } ${ ((height-p.y+bottom)*0.5 + padding).toFixed(2) }`).join(', ');
  }
  
}
