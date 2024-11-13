import { Point } from "./Point.ts";

export class Triangle {
	readonly v1: Point;
	readonly v2: Point;
	readonly v3: Point;
	readonly scale: number;
	readonly reference: Point;

	constructor(v1: Point, v2: Point, v3: Point, scale: number, reference: Point) {
		this.v1 = v1;
		this.v2 = v2;
		this.v3 = v3;
		this.scale = scale;
		this.reference = reference;
	}
}
