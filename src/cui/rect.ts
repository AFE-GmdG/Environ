import { Size } from "./size";
import { Point } from "./point";

export class Rect {

	readonly x: number;
	readonly y: number;
	readonly width: number;
	readonly height: number;

	get isEmpty(): boolean {
		return this.x === 0 && this.y === 0 && this.width === 0 && this.height === 0;
	}

	get left(): number {
		return this.x;
	}

	get top(): number {
		return this.y;
	}

	get right(): number {
		return isFinite(this.width) ? this.x + this.width : Infinity;
	}

	get bottom(): number {
		return isFinite(this.height) ? this.y + this.height : Infinity;
	}

	get location(): Point {
		return new Point(this.x, this.y);
	}

	get size(): Size {
		return new Size(this.width, this.height);
	}

	get topLeft(): Point {
		return new Point(this.x, this.y);
	}

	get topRight(): Point {
		if (!isFinite(this.width)) {
			throw new Error("The rect has an infinite width.");
		}
		return new Point(this.x + this.width, this.y);
	}

	get bottomLeft(): Point {
		if (!isFinite(this.height)) {
			throw new Error("The rect has an infinite height.");
		}
		return new Point(this.x, this.y + this.height);
	}

	get bottomRight(): Point {
		if (!isFinite(this.width) || !isFinite(this.height)) {
			throw new Error("The recht has an infinite size.");
		}
		return new Point(this.x + this.width, this.y + this.height);
	}

	constructor();
	constructor(size: Size);
	constructor(p1: Point, p2: Point);
	constructor(p: Point, size: Size);
	constructor(x: number, y: number, width: number, height: number);
	constructor(x: number | Point | Size = 0, y: number | Point | Size = 0, width: number = 0, height: number = 0) {
		if (x instanceof Size) {
			this.x = 0;
			this.y = 0;
			this.width = x.width;
			this.height = x.height;
		} else if (x instanceof Point) {
			if (y instanceof Size) {
				this.x = x.x;
				this.y = x.y;
				this.width = y.width;
				this.height = y.height;
			} else {
				this.x = Math.min(x.x, (y as Point).x);
				this.y = Math.min(x.y, (y as Point).y);
				this.width = Math.abs(x.x - (y as Point).x);
				this.height = Math.abs(x.y - (y as Point).y);
			}
		} else {
			if (isNaN(x) || typeof y !== "number" || isNaN(y) || !isFinite(x) || !isFinite(y)) {
				throw new Error("X and Y must be a number");
			}
			if (isNaN(width) || isNaN(height)) {
				throw new Error("Width and Height must be a number or +Infinity");
			}
			if (width < 0 || height < 0) {
				throw new Error("Width and Height cannot be negative.");
			}
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
		}
	}

	contains(p: Point): boolean;
	contains(r: Rect): boolean;
	contains(x: number, y: number): boolean;
	contains(_x: Point | Rect | number, _y?: number): boolean {
		throw new Error("Not implemented.");
	}

	intersectsWith(_r: Rect): boolean {
		throw new Error("Not implemented.");
	}

}
