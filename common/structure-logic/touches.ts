import { Circle, Point, Rect, Shape } from "../data-types/structures.ts";
import equals from "./equals.ts";
import { inside } from "./inside.ts";
import { isCircle, isPoint, isRect } from "./is.ts";

function pointPoint(first: Point, second: Point): boolean {
	return equals(first, second);
}

function pointRect(point: Point, rect: Rect): boolean {
	return inside(point, rect);
}

function pointCircle(point: Point, circle: Circle): boolean {
	return inside(point, circle);
}

function rectRect(first: Rect, second: Rect): boolean {
	if (first.topLeft.x > second.bottomRight.x) {
		return false;
	} else if (second.topLeft.x > first.bottomRight.x) {
		return false;
	} else if (first.topLeft.y > second.bottomRight.y) {
		return false;
	} else if (second.topLeft.y > first.bottomRight.y) {
		return false;
	}

	return true;
}

function rectCircle(rect: Rect, circle: Circle): boolean {
	// Useful values
	const rectLeft = rect.topLeft.x;
	const rectRight = rect.bottomRight.x;
	const rectTop = rect.topLeft.y;
	const rectBottom = rect.bottomRight.y;
	
	// Find the x/y of the closest point to the circle inside the rect
	const closestX = clamp(circle.center.x, rectLeft, rectRight);
	const closestY = clamp(circle.center.y, rectTop, rectBottom);

	// See if that point is inside the circle
	return inside(Point(closestX, closestY), circle);
}

function clamp(val: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, val));
}

// Expand the first circle to be the sum of the two radii, then shrink the second circle down to a point, then test that the point is inside the new circle
function circleCircle(first: Circle, second: Circle): boolean {
	const newCircle = Circle(first.center, first.radius + second.radius);
	return inside(second.center, newCircle);
}


export function touches(main: Shape, other: Shape): boolean {
	if (isPoint(main)) {
		if (isPoint(other)) {
			return pointPoint(main, other);
		} else if (isRect(other)) {
			return pointRect(main, other);
		} else if (isCircle(other)) {
			return pointCircle(main, other);
		}
	} else if (isRect(main)) {
		if (isPoint(other)) {
			return pointRect(other, main);
		} else if (isRect(other)) {
			return rectRect(main, other);
		} else if (isCircle(other)) {
			return rectCircle(main, other);
		}
	} else if (isCircle(main)) {
		if (isPoint(other)) {
			return pointCircle(other, main);
		} else if (isRect(other)) {
			return rectCircle(other, main);
		} else if (isCircle(other)) {
			return circleCircle(main, other);
		}
	}

	throw "Can never get here";
}
