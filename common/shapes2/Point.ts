import { Shape, SerializedShape } from "./Shape.ts";
import { ShapeName } from "./ShapeName.ts";

interface SerializedPoint extends SerializedShape {
	type: ShapeName.POINT,
	x: number,
	y: number
}

export class Point extends Shape {
	static isPoint(maybePoint: Shape): maybePoint is Point {
		return maybePoint.type == ShapeName.POINT;
	}

	static isPointData(maybeSerializedPoint: SerializedShape): maybeSerializedPoint is SerializedPoint {
		return maybeSerializedPoint.type == ShapeName.POINT;
	}

	static deserialize(data: SerializedPoint): Point {
		return new Point(data.x, data.y);
	}

	readonly x: number;
	readonly y: number;

	constructor(x: number, y: number) {
		super(ShapeName.POINT);
		this.x = x;
		this.y = y;
	}

	serialize(): SerializedPoint {
		return {
			type: ShapeName.POINT,
			x: this.x,
			y: this.y
		};
	}
}
