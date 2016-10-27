

export class Point {
  x: number;
  y: number;
}

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

  }
}


export class LineSeries {
  name: string;
  points: Array<Point> = [];
  color?: string;
};
