import { clampNumber } from "../math-utils.ts";
import { Vector } from "./Vector.ts";
import { Circle } from "./Circle.ts";
import { Rect } from "./Rect.ts";
import { Shape, SerializedShape } from "./Shape.ts";
import { ShapeName } from "./ShapeName.ts";

export interface SerializedPoint extends SerializedShape {
	type: ShapeName.POINT,
	x: number,
	y: number
}

export class Point extends Shape {
	readonly x: number;
	readonly y: number;

	static isPoint(maybePoint: Shape): maybePoint is Point {
		return maybePoint.type == ShapeName.POINT;
	}

	static isPointData(maybeSerializedPoint: SerializedShape): maybeSerializedPoint is SerializedPoint {
		return maybeSerializedPoint.type == ShapeName.POINT;
	}

	static deserialize(data: SerializedPoint): Point {
		return new Point(data.x, data.y);
	}

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

	equals(other: Point): boolean {
		return (this.x == other.x) && (this.y == other.y);
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
