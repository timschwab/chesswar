import { Color } from "../../../../common/Color.ts";
import { Point } from "../../../../common/shapes/Point.ts";
import { Rect } from "../../../../common/shapes/Rect.ts";

export class CWText {
	readonly message: string;
	readonly leftTop: Point;
	readonly scale: number;
	readonly color: Color;

	readonly graphemes: string[];

	constructor(message: string, leftTop: Point, scale: number, color: Color) {
		this.message = message;
		this.leftTop = leftTop;
		this.scale = scale;
		this.color = color;

		this.graphemes = message.split("");
	}

	getRect(glyphBoundingBox: Rect) {
		const rightBottom = this.leftTop.add(
			new Point(
				glyphBoundingBox.right*this.message.length*this.scale,
				glyphBoundingBox.bottom*this.scale)
		);

		return new Rect(this.leftTop, rightBottom);
	}
}
