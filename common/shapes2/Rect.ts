import { Point } from "./Point.ts";
import { SerializedShape, Shape } from "./Shape.ts";
import { ShapeName } from "./ShapeName.ts";

interface SerializedRect extends SerializedShape {
	type: ShapeName.RECT,
	topLeft: Point,
	bottomRight: Point
}

export class Rect extends Shape {
	static isRect(maybeRect: Shape): maybeRect is Rect {
		return maybeRect.type == ShapeName.RECT;
	}

	static isSerializedRect(maybeSerializedRect: SerializedShape): maybeSerializedRect is SerializedRect {
		return maybeSerializedRect.type == ShapeName.CIRCLE;
	}

	static deserialize(data: SerializedRect): Rect {
		return new Rect(data.topLeft, data.bottomRight);
	}

	readonly topLeft: Point;
	readonly bottomRight: Point;

	constructor(topLeft: Point, bottomRight: Point) {
		super(ShapeName.CIRCLE);
		this.topLeft = topLeft;
		this.bottomRight = bottomRight;
	}

	serialize(): SerializedRect {
		return {
			type: ShapeName.RECT,
			topLeft: this.topLeft,
			bottomRight: this.bottomRight
		};
	}
}
