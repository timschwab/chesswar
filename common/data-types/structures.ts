export class Point {
	readonly x: number;
	readonly y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
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
}

export class Circle {
	readonly center: Point;
	readonly radius: number;

	constructor(center: Point, radius: number) {
		this.center = center;
		this.radius = radius;
	}
}
