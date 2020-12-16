export class Size {
  readonly width: number;

  readonly height: number;

  static readonly empty: Size = new Size();

  static readonly infinite: Size = new Size(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);

  get isEmpty(): boolean {
    return this.width === 0 && this.height === 0;
  }

  get isFinite(): boolean {
    return Number.isFinite(this.width) && Number.isFinite(this.height);
  }

  constructor();
  constructor(width: number, height: number);
  constructor(width: number = 0, height: number = 0) {
    if (Number.isNaN(width) || Number.isNaN(height)) {
      throw new Error("Width and Height must be a number or +Infinity");
    }
    if (width < 0 || height < 0) {
      throw new Error("A Size cannot have a negative width or height.");
    }
    // eslint-disable-next-line no-bitwise
    this.width = Number.isFinite(width) ? width | 0 : width;
    // eslint-disable-next-line no-bitwise
    this.height = Number.isFinite(height) ? height | 0 : height;
  }
}
