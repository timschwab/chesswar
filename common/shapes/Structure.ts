import { Color } from "../Color.ts";
import { Triangle } from "./Triangle.ts";

export class Structure {
	readonly triangles: Triangle[];
	readonly color: Color;

	constructor(triangles: Triangle[], color: Color) {
		this.triangles = triangles;
		this.color = color;
	}
}
