import { Color } from "../colors.ts";
import { Geometry } from "./Geometry.ts";

export class Shape<T extends Geometry> {
	readonly geo: T
	readonly color: Color

	constructor(geo: T, color: Color) {
		this.geo = geo;
		this.color = color;
	}
}
