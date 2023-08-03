import { Point } from "./Point.ts";
import { SerializedShape, Shape } from "./Shape.ts";
import { ShapeName } from "./ShapeName.ts";

interface SerializedCircle extends SerializedShape {
	type: ShapeName.CIRCLE,
	center: Point,
	radius: number
}

export class Circle extends Shape {
	static isCircle(maybeCircle: Shape): maybeCircle is Circle {
		return maybeCircle.type == ShapeName.CIRCLE;
	}

	static isSerializedCircle(maybeSerializedCircle: SerializedShape): maybeSerializedCircle is SerializedCircle {
		return maybeSerializedCircle.type == ShapeName.CIRCLE;
	}

	static deserialize(data: SerializedCircle): Circle {
		return new Circle(data.center, data.radius);
	}

	readonly center: Point;
	readonly radius: number;

	constructor(center: Point, radius: number) {
		super(ShapeName.CIRCLE);
		this.center = center;
		this.radius = radius;
	}

	serialize(): SerializedCircle {
		return {
			type: ShapeName.CIRCLE,
			center: this.center,
			radius: this.radius
		};
	}
}
