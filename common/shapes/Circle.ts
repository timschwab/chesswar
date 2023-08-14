import { Point, SerializedPoint } from "./Point.ts";
import { Rect } from "./Rect.ts";
import { SerializedShape, Shape } from "./Shape.ts";
import { ShapeName } from "./ShapeName.ts";

export interface SerializedCircle extends SerializedShape {
	type: ShapeName.CIRCLE,
	center: SerializedPoint,
	radius: number
}

export class Circle extends Shape {
	readonly center: Point;
	readonly radius: number;

	readonly left: number;
	readonly right: number;
	readonly top: number;
	readonly bottom: number;

	static isCircle(maybeCircle: Shape): maybeCircle is Circle {
		return maybeCircle.type == ShapeName.CIRCLE;
	}

	static isSerializedCircle(maybeSerializedCircle: SerializedShape): maybeSerializedCircle is SerializedCircle {
		return maybeSerializedCircle.type == ShapeName.CIRCLE;
	}

	static deserialize(data: SerializedCircle): Circle {
		const center = Point.deserialize(data.center);
		return new Circle(center, data.radius);
	}

	constructor(center: Point, radius: number) {
		super(ShapeName.CIRCLE);
		this.center = center;
		this.radius = radius;

		this.left = center.x - radius;
		this.right = center.x + radius;
		this.top = center.y - radius;
		this.bottom = center.y + radius;
	}

	serialize(): SerializedCircle {
		return {
			type: ShapeName.CIRCLE,
			center: this.center.serialize(),
			radius: this.radius
		};
	}

	equals(other: Circle): boolean {
		return this.center.equals(other.center) && (this.radius == other.radius);
	}

	inside(other: Shape): boolean {
		if (Point.isPoint(other)) {
			return this.insidePoint(other);
		} else if (Rect.isRect(other)) {
			return this.insideRect(other);
		} else if (Circle.isCircle(other)) {
			return this.insideCircle(other);
		}

		throw "Can't get here";
	}

	touches(other: Shape): boolean {
		if (Point.isPoint(other)) {
			return this.touchesPoint(other);
		} else if (Rect.isRect(other)) {
			return this.touchesRect(other);
		} else if (Circle.isCircle(other)) {
			return this.touchesCircle(other);
		}

		throw "Can't get here";
	}

	add(operand: Point): Circle {
		return new Circle(this.center.add(operand), this.radius);
	}

	subtract(operand: Point): Circle {
		return new Circle(this.center.subtract(operand), this.radius);
	}

	floor(): Circle {
		return new Circle(this.center.floor(), this.radius);
	}

	clampCenter(rect: Rect): Circle {
		return new Circle(this.center.clamp(rect), this.radius);
	}

	clampInside(rect: Rect): Circle {
		const interiorRect = rect.shrink(this.radius);
		return this.clampCenter(interiorRect);
	}

	enclosingRect(): Rect {
		return new Rect(new Point(this.left, this.top), new Point(this.right, this.bottom));
	}

	insidePoint(other: Point): boolean {
		if (this.radius > 0) {
			return false;
		}

		return this.center.equals(other);
	}

	insideRect(other: Rect): boolean {
		const interiorRect = other.shrink(this.radius);
		return this.center.insideRect(interiorRect);
	}

	insideCircle(other: Circle): boolean {
		const radiusDist = other.radius - this.radius;

		// Short-circuit
		if (radiusDist < 0) {
			return false;
		}

		// Get diffs
		const leftDist = this.center.x - other.center.x;
		const rightDist = other.center.x - this.center.x;
		const topDist = this.center.y - other.center.y;
		const bottomDist = other.center.y - this.center.y;

		// Make sure they are all less than the radius diff
		if (leftDist > radiusDist) {
			return false;
		} else if (rightDist > radiusDist) {
			return false;
		} else if (topDist > radiusDist) {
			return false;
		} else if (bottomDist > radiusDist) {
			return false;
		}

		// Yay!
		return true;
	}

	touchesPoint(other: Point): boolean {
		return other.touchesCircle(this);
	}

	touchesRect(other: Rect): boolean {
		return other.touchesCircle(this);
	}

	// Expand the first circle to be the sum of the two radii,
	// then shrink the second circle down to a point,
	// then test that the point is inside the new circle
	touchesCircle(other: Circle): boolean {
		const newCircle = new Circle(this.center, this.radius + other.radius);
		return other.center.insideCircle(newCircle);
	}
}
