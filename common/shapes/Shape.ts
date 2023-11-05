import { Color } from "../colors.ts";
import { Geometry } from "./Geometry.ts";
import { Point } from "./Point.ts";

export class Shape<T extends Geometry<T>> {
	readonly geo: T
	readonly color: Color

	constructor(geo: T, color: Color) {
		this.geo = geo;
		this.color = color;
	}

	// Add methods as needed
	subtract(operand: Point): Shape<T> {
		return new Shape<T>(this.geo.subtract(operand), this.color);
	}
}
