import { Color } from "../../../common/Color.ts";
import { Point } from "../../../common/shapes/Point.ts";

export class CWText {
	readonly message: string;
	readonly topLeft: Point;
	readonly scale: number;
	readonly color: Color;

	constructor(message: string, topLeft: Point, scale: number, color: Color) {
		this.message = message;
		this.topLeft = topLeft;
		this.scale = scale;
		this.color = color;
	}
}
