// Basically same structure of Point but very different semantic meaning
export class Vector {
	readonly x: number;
	readonly y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}

export class Point {
	readonly x: number;
	readonly y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	copy(): Point {
		return new Point(this.x, this.y);
	}

	transpose(dir: Vector): Point {
		return new Point(this.x - dir.x, this.y - dir.y);
	}
}

export class Rect {
	readonly topLeft: Point;
	readonly bottomRight: Point;
	readonly width: number;
	readonly height: number;

	constructor(topLeft: Point, bottomRight: Point) {
		this.topLeft = topLeft;
		this.bottomRight = bottomRight;

		this.width = bottomRight.x - topLeft.x;
		this.height = bottomRight.y - topLeft.y;
	}

	transpose(dir: Vector) {
		return new Rect(this.topLeft.transpose(dir), this.bottomRight.transpose(dir));
	}
}

export class Circle {
	readonly center: Point;
	readonly radius: number;

	constructor(center: Point, radius: number) {
		this.center = center;
		this.radius = radius;
	}

	transpose(dir: Vector) {
		return new Circle(this.center.transpose(dir), this.radius);
	}
}
