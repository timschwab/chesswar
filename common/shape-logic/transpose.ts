import { Circle, Point, Rect } from "../data-types/shapes.ts";

export function transposePoint(original: Point, move: Point): Point {
	return Point(original.x-move.x, original.y-move.y);
}

export function transposeRect(original: Rect, move: Point) {
	return Rect(transposePoint(original.topLeft, move), transposePoint(original.bottomRight, move));
}

export function transposeCircle(original: Circle, move: Point) {
	return Circle(transposePoint(original.center, move), original.radius);
}
