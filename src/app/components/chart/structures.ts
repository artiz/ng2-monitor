

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
    if(other.top > this.top)
      this.top = other.top;
    if(other.bottom < this.bottom)
      this.bottom = other.bottom;
    if(other.right > this.right)
      this.right = other.right;
    if(other.left < this.left)
      this.left = other.left;
            


  }

}

export class LineSeries {
  name: string;
  points: Array<Array<number>> = [];
  color?: string;

  // calculated
  scale?: { vert: number, horz: number };
  bounds?: Bounds = null;
};
