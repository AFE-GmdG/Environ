export class Size {

	readonly width: number;
	readonly height: number;

	get isEmpty(): boolean {
		return this.width === 0 && this.height === 0;
	}

	constructor();
	constructor(width: number, height: number);
	constructor(width: number = 0, height: number = 0) {
		if (isNaN(width) || isNaN(height)) {
			throw new Error("Width and Height must be a number or +Infinity");
		}
		if (width < 0 || height < 0) {
			throw new Error("A Size cannot have a negative width or height.");
		}
		this.width = isFinite(width) ? width | 0 : width;
		this.height = isFinite(height) ? height | 0 : height;
	}

}
