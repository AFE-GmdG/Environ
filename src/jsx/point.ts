export class Point {

	public readonly x: number;
	public readonly y: number;

	constructor();
	constructor(x: number, y: number);
	constructor(x: number = 0, y: number = 0) {
		if (isNaN(x) || isNaN(y) || !isFinite(x) || !isFinite(y)) {
			throw new Error("X and Y must be a number");
		}
		this.x = x;
		this.y = y;
	}

}
