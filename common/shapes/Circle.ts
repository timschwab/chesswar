import { Point, SerializedPoint } from "./Point.ts";
import { Rect } from "./Rect.ts";
import { SerializedGeometry, Geometry } from "./Geometry.ts";
import { GeometryName } from "./GeometryName.ts";
import { TriangleVertices } from "./Triangle.ts";

export interface SerializedCircle extends SerializedGeometry {
	type: GeometryName.CIRCLE,
	center: SerializedPoint,
	radius: number
}

export class Circle extends Geometry<Circle> {
	readonly center: Point;
	readonly radius: number;

	readonly left: number;
	readonly right: number;
	readonly top: number;
	readonly bottom: number;

	static isSerializedCircle(maybeSerializedCircle: SerializedGeometry): maybeSerializedCircle is SerializedCircle {
		return maybeSerializedCircle.type == GeometryName.CIRCLE;
	}

	static deserialize(data: SerializedCircle): Circle {
		const center = Point.deserialize(data.center);
		return new Circle(center, data.radius);
	}

	serialize(): SerializedCircle {
		return {
			type: GeometryName.CIRCLE,
			center: this.center.serialize(),
			radius: this.radius
		};
	}

	constructor(center: Point, radius: number) {
		super();
		this.center = center;
		this.radius = radius;

		this.left = center.x - radius;
		this.right = center.x + radius;
		this.top = center.y - radius;
		this.bottom = center.y + radius;
	}

	equals(other: Circle): boolean {
		return this.center.equals(other.center) && (this.radius == other.radius);
	}

	inside(other: Geometry): boolean {
		if (other instanceof Point) {
			return this.insidePoint(other);
		} else if (other instanceof Rect) {
			return this.insideRect(other);
		} else if (other instanceof Circle) {
			return this.insideCircle(other);
		}

		throw "Can't get here";
	}

	touches(other: Geometry): boolean {
		if (other instanceof Point) {
			return this.touchesPoint(other);
		} else if (other instanceof Rect) {
			return this.touchesRect(other);
		} else if (other instanceof Circle) {
			return this.touchesCircle(other);
		}

		throw "Can't get here";
	}

	toTriangleVertices(): TriangleVertices[] {
		return [];
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
		return new Circle(this.center.clampInside(rect), this.radius);
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
