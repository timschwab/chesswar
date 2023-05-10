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
export function Point(x: number, y: number) {
	return {x, y};
}

// Note that topLeft and bottomRight are named correctly by convention, and this is not enforced
export interface Rect {
	readonly topLeft: Point;
	readonly bottomRight: Point;
	readonly width: number;
	readonly height: number;
}
export function Rect(topLeft: Point, bottomRight: Point) {
	return {
		topLeft,
		bottomRight,
		width: bottomRight.x - topLeft.x,
		height: bottomRight.y - topLeft.y
	};
}

export interface Circle {
	readonly center: Point;
	readonly radius: number;
}
export function Circle(center: Point, radius: number) {
	return {center, radius};
}

export type Shape = Point | Rect | Circle;
