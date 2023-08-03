import { Circle } from "./Circle.ts";
import { Point, SerializedPoint } from "./Point.ts";
import { SerializedShape, Shape } from "./Shape.ts";
import { ShapeName } from "./ShapeName.ts";

interface SerializedRect extends SerializedShape {
	type: ShapeName.RECT,
	leftTop: SerializedPoint,
	rightBottom: SerializedPoint
}

export class Rect extends Shape {
	readonly leftTop: Point;
	readonly rightBottom: Point;

	readonly left: number;
	readonly right: number;
	readonly top: number;
	readonly bottom: number;

	readonly leftBottom: Point;
	readonly rightTop: Point;

	readonly width: number;
	readonly height: number;
	readonly center: Point;

	static isRect(maybeRect: Shape): maybeRect is Rect {
		return maybeRect.type == ShapeName.RECT;
	}

	static isSerializedRect(maybeSerializedRect: SerializedShape): maybeSerializedRect is SerializedRect {
		return maybeSerializedRect.type == ShapeName.CIRCLE;
	}

	static deserialize(data: SerializedRect): Rect {
		const lt = Point.deserialize(data.leftTop);
		const rb = Point.deserialize(data.rightBottom);
		return new Rect(lt, rb);
	}

	constructor(leftTop: Point, rightBottom: Point) {
		super(ShapeName.CIRCLE);
		this.leftTop = leftTop;
		this.rightBottom = rightBottom;

		this.left = leftTop.x;
		this.right = rightBottom.x;
		this.top = leftTop.y;
		this.bottom = rightBottom.y;

		this.leftBottom = new Point(this.left, this.bottom);
		this.rightTop = new Point(this.right, this.top);

		this.width = this.right - this.left;
		this.height = this.bottom - this.top;
		this.center = new Point((this.left+this.right)/2, (this.top+this.bottom)/2);
	}

	serialize(): SerializedRect {
		return {
			type: ShapeName.RECT,
			leftTop: this.leftTop.serialize(),
			rightBottom: this.rightBottom.serialize()
		};
	}

	equals(other: Rect): boolean {
		return this.leftTop.equals(other.leftTop) && this.rightBottom.equals(other.rightBottom);
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

	add(operand: Point): Rect {
		return new Rect(this.leftTop.add(operand), this.rightBottom.add(operand));
	}

	subtract(operand: Point): Rect {
		return new Rect(this.leftTop.subtract(operand), this.rightBottom.subtract(operand));
	}

	// Move all four walls in a certain amount
	shrink(amount: number): Rect {
		const shrinkPoint = new Point(amount, amount);
		const shrunkenTopLeft = this.leftTop.add(shrinkPoint);
		const shrunkenBottomRight = this.rightBottom.subtract(shrinkPoint);
		return new Rect(shrunkenTopLeft, shrunkenBottomRight);
	}

	// A kinda dumb algo but it works
	overlap(other: Rect) {
		const bothLeft = Math.max(this.left, other.left);
		const bothRight = Math.min(this.right, other.right);
		const bothTop = Math.max(this.top, other.top);
		const bothBottom = Math.min(this.bottom, other.bottom);
	
		// No overlap
		if ((bothLeft > bothRight) || (bothTop > bothBottom)) {
			return {
				first: {
					left: this,
					right: null,
					top: null,
					bottom: null
				},
				second: {
					left: other,
					right: null,
					top: null,
					bottom: null
				},
				both: null
			};
		}
	
		const bothTL = new Point(bothLeft, bothTop);
		const bothBR = new Point(bothRight, bothBottom);
	
		const both = new Rect(bothTL, bothBR);
	
		const firstLeft = this.left < other.left ? new Rect(this.leftTop, new Point(other.left, this.bottom)) : null;
		const firstRight = this.right > other.right ? new Rect(new Point(other.right, this.top), this.rightBottom) : null;
		const firstTop = this.top < other.top ? new Rect(this.leftTop, new Point(this.right, other.top)) : null;
		const firstBottom = this.bottom > other.bottom ? new Rect(new Point(this.left, other.bottom), this.rightBottom) : null;
	
		const secondLeft = other.left < this.left ? new Rect(other.leftTop, new Point(this.left, other.bottom)) : null;
		const secondRight = other.right > this.right ? new Rect(new Point(this.right, other.top), other.rightBottom) : null;
		const secondTop = other.top < this.top ? new Rect(other.leftTop, new Point(other.right, this.top)) : null;
		const secondBottom = other.bottom > this.bottom ? new Rect(new Point(other.left, this.bottom), other.rightBottom) : null;
	
		return {
			first: {
				left: firstLeft,
				right: firstRight,
				top: firstTop,
				bottom: firstBottom
			},
			second: {
				left: secondLeft,
				right: secondRight,
				top: secondTop,
				bottom: secondBottom
			},
			both: both
		};
	}

	insidePoint(other: Point): boolean {
		return this.leftTop.equals(other) && this.rightBottom.equals(other);
	}

	insideRect(other: Rect): boolean {
		return this.leftTop.insideRect(other) && this.rightBottom.insideRect(other);
	}

	insideCircle(other: Circle): boolean {
		// Short circuit common failures
		if (this.left < other.left) {
			return false;
		} else if (this.right > other.right) {
			return false;
		} else if (this.top < other.top) {
			return false;
		} else if (this.bottom > other.bottom) {
			return false;
		}

		// Verify each corner. Probably we could figure out another short-circuiting step in here but meh.
		if (!this.leftTop.insideCircle(other)) {
			return false;
		} else if (!this.leftBottom.insideCircle(other)) {
			return false;
		} else if (!this.rightTop.insideCircle(other)) {
			return false;
		} else if (!this.rightBottom.insideCircle(other)) {
			return false;
		}

		// Yay!
		return true;
	}

	touchesPoint(other: Point): boolean {
		return other.touchesRect(this);
	}

	touchesRect(other: Rect): boolean {
		if (this.left > other.right) {
			return false;
		} else if (this.right < other.left) {
			return false;
		} else if (this.top > other.bottom) {
			return false;
		} else if (this.bottom < other.top) {
			return false;
		}
	
		return true;
	}

	touchesCircle(other: Circle): boolean {		
		// Find the x/y of the closest point to the circle's center inside the rect
		const closestPoint = other.center.clamp(this);

		// See if that point is inside the circle
		return closestPoint.inside(other);
	}
}
