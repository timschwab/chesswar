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

	constructor(topLeft: Point, bottomRight: Point) {
		this.topLeft = topLeft;
		this.bottomRight = bottomRight;
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
