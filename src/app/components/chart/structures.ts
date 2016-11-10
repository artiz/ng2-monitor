

export class Bounds {
  top?: number = null;
  left?: number = null;
  bottom?: number = null;
  right?: number = null;

  get width() {
    return Math.round(this.right - this.left) || 0;
  }

  get height() {
    return Math.round(this.top - this.bottom) || 0;
  }

  expand(ratio: number) {
    let w = this.width || 0;
    let h = this.height || 0;

    this.top += h * ratio;
    this.bottom -= h * ratio;
    this.right += w * ratio;
    this.left -= w * ratio;
  }

  extend(other: Bounds) {
    if(this.top === null || other.top > this.top)
      this.top = other.top;
    if(this.bottom === null || other.bottom < this.bottom)
      this.bottom = other.bottom;
    if(this.right === null || other.right > this.right)
      this.right = other.right;
    if(this.left === null || other.left < this.left)
      this.left = other.left;
  }
}

export class LineSeries {
  name: string;
  points: Array<Array<number>> = [];
  color?: string;
  width?: number;

  // calculated
  bounds?: Bounds = null;
  formatted?: string = null;
};

export class ChartTheme {
  colors: Array<string> = [];
  borderColor = '#ccc';

  static default: ChartTheme = new ChartTheme({
    colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
      '#55BF3B', '#DF5353', '#7798BF', '#aaeeee']
  });

  constructor(args?: any) {
    Object.assign(<any> this,
      {  id: '', name: '' },
      args);
  }

  getColor(ndx: number) {
    return this.colors[ndx % this.colors.length];
  }

};


