import { Circle, Point, Rect } from "./types.ts";

export function clamp(min: number, max: number, val: number) {
	if (min > max) {
		const temp = min;
		min = max;
		max = temp;
	}

	if (val < min) {
		return min;
	} else if (val > max) {
		return max;
	} else {
		return val;
	}
}

export function clampPointToRect(rect: Rect, point: Point): Point {
	const x = clamp(rect.topLeft.x, rect.bottomRight.x, point.x);
	const y = clamp(rect.topLeft.y, rect.bottomRight.y, point.y);

	return Point(x, y);
}

export function clampCircleCenterToRect(rect: Rect, circle: Circle): Circle {
	return Circle(clampPointToRect(rect, circle.center), circle.radius);
}

export function clampCircleInsideRect(rect: Rect, circle: Circle): Circle {
	const innerTopLeft = Point(rect.topLeft.x + circle.radius, rect.topLeft.y + circle.radius);
	const innerBottomRight = Point(rect.bottomRight.x - circle.radius, rect.bottomRight.y - circle.radius);
	const innerRect = Rect(innerTopLeft, innerBottomRight);

	return clampCircleCenterToRect(innerRect, circle);
}
