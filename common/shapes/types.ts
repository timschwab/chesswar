export interface Vector {
	readonly mag: number;
	readonly dir: number;
}
export function Vector(mag: number, dir: number): Vector {
	return {mag, dir};
}

export interface Point {
	readonly x: number;
	readonly y: number;
}
export function Point(x: number, y: number): Point {
	return {x, y};
}

// Note that topLeft and bottomRight are named correctly by convention, and this is not enforced
export interface Rect {
	readonly topLeft: Point;
	readonly bottomRight: Point;
	readonly width: number;
	readonly height: number;
	readonly center: Point;
	readonly left: number;
	readonly right: number;
	readonly top: number;
	readonly bottom: number;
}
export function Rect(topLeft: Point, bottomRight: Point): Rect {
	return {
		topLeft,
		bottomRight,
		left: topLeft.x,
		right: bottomRight.x,
		top: topLeft.y,
		bottom: bottomRight.y,
		width: bottomRight.x - topLeft.x,
		height: bottomRight.y - topLeft.y,
		center: Point((topLeft.x+bottomRight.x)/2, (topLeft.y+bottomRight.y)/2)
	};
}

export interface Circle {
	readonly center: Point;
	readonly radius: number;
}
export function Circle(center: Point, radius: number): Circle {
	return {center, radius};
}

export type Shape = Point | Rect | Circle;
