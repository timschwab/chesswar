import { clampNumber } from "../math-utils.ts";
import { Vector } from "./Vector.ts";
import { Circle } from "./Circle.ts";
import { Rect } from "./Rect.ts";
import { Geometry, SerializedGeometry } from "./Geometry.ts";
import { GeometryName } from "./GeometryName.ts";

export interface SerializedPoint extends SerializedGeometry {
	type: GeometryName.POINT,
	x: number,
	y: number
}

export class Point extends Geometry<Point> {
	readonly x: number;
	readonly y: number;

	static isSerializedPoint(maybeSerializedPoint: SerializedGeometry): maybeSerializedPoint is SerializedPoint {
		return maybeSerializedPoint.type == GeometryName.POINT;
	}

	static deserialize(data: SerializedPoint): Point {
		return new Point(data.x, data.y);
	}

	serialize(): SerializedPoint {
		return {
			type: GeometryName.POINT,
			x: this.x,
			y: this.y
		};
	}

	constructor(x: number, y: number) {
		super();
		this.x = x;
		this.y = y;
	}

	equals(other: Point): boolean {
		return (this.x == other.x) && (this.y == other.y);
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

	add(operand: Point): Point {
		return new Point(this.x + operand.x, this.y + operand.y);
	}

	addVector(operand: Vector): Point {
		return this.add(operand.toPoint());
	}

	subtract(operand: Point): Point {
		return new Point(this.x - operand.x, this.y - operand.y);
	}

	floor(): Point {
		return new Point(Math.floor(this.x), Math.floor(this.y));
	}

	clamp(rect: Rect): Point {
		const clampedX = clampNumber(this.x, rect.left, rect.right);
		const clampedY = clampNumber(this.y, rect.top, rect.bottom);
		return new Point(clampedX, clampedY);
	}

	distanceSquared(other: Point): number {
		const xDiff = this.x - other.x;
		const yDiff = this.y - other.y;
		return xDiff*xDiff + yDiff*yDiff;
	}

	insidePoint(other: Point): boolean {
		return this.equals(other);
	}

	insideRect(other: Rect): boolean {
		if (this.x < other.left) {
			return false;
		} else if (this.y < other.top) {
			return false;
		} else if (this.x > other.right) {
			return false;
		} else if (this.y > other.bottom) {
			return false;
		}

		return true;
	}

	insideCircle(other: Circle): boolean {
		// Distance formula while avoiding sqrt()
		const radiusSquared = other.radius*other.radius;
		if (radiusSquared > this.distanceSquared(other.center)) {
			return true;
		} else {
			return false;
		}
	}

	touchesPoint(other: Point): boolean {
		return this.insidePoint(other);
	}

	touchesRect(other: Rect): boolean {
		return this.insideRect(other);
	}

	touchesCircle(other: Circle): boolean {
		return this.insideCircle(other);
	}
}
