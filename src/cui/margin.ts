import { Length } from "./length";

export class Margin {
  readonly top: Length;

  readonly right: Length;

  readonly bottom: Length;

  readonly left: Length;

  constructor();
  constructor(all: number | Length);
  constructor(top: number | Length, right: number | Length, bottom: number | Length, left: number | Length);
  constructor(top?: number | Length, right?: number | Length, bottom?: number | Length, left?: number | Length) {
    if (top === undefined) {
      // eslint-disable-next-line no-multi-assign
      this.top = this.right = this.bottom = this.left = new Length();
      return;
    }
    if (right === undefined) {
      const length = typeof top === "number" ? new Length(top) : top;
      // eslint-disable-next-line no-multi-assign
      this.top = this.right = this.bottom = this.left = length;
      return;
    }
    if (bottom === undefined || left === undefined) {
      throw new Error("Invalid Arguments: bottom or left");
    }
    this.top = typeof top === "number" ? new Length(top) : top;
    this.right = typeof right === "number" ? new Length(right) : right;
    this.bottom = typeof bottom === "number" ? new Length(bottom) : bottom;
    this.left = typeof left === "number" ? new Length(left) : left;
  }
}
