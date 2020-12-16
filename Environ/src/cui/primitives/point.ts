export class Point {
  readonly x: number;

  readonly y: number;

  constructor();
  constructor(x: number, y: number);
  constructor(x: number = 0, y: number = 0) {
    if (Number.isNaN(x) || Number.isNaN(y) || !Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error("X and Y must be a number");
    }
    this.x = x;
    this.y = y;
  }
}
