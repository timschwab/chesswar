import { Circle, Point, Rect, Shape } from "./types.ts";
import equals from "./equals.ts";
import { isCircle, isPoint, isRect } from "./is.ts";

// Not sure when this would be useful
function pointInsidePoint(main: Point, other: Point): boolean {
	return equals(main, other);
}

function pointInsideRect(main: Point, other: Rect): boolean {
	if (main.x < other.topLeft.x) {
		return false;
	} else if (main.y < other.topLeft.y) {
		return false;
	} else if (main.x > other.bottomRight.x) {
		return false;
	} else if (main.y > other.bottomRight.y) {
		return false;
	}

	return true;
}

function pointInsideCircle(main: Point, other: Circle): boolean {
	// Distance formula while avoiding sqrt()
	const xDiff = main.x - other.center.x;
	const yDiff = main.y - other.center.y;
	const radiusSquared = other.radius * other.radius;
	const distanceSquared = xDiff*xDiff + yDiff*yDiff;

	if (radiusSquared > distanceSquared) {
		return true;
	} else {
		return false;
	}
}

// Not sure when this would be useful
function rectInsidePoint(main: Rect, other: Point): boolean {
	return equals(main.topLeft, other) && equals(main.bottomRight, other);
}

function rectInsideRect(main: Rect, other: Rect): boolean {
	return pointInsideRect(main.topLeft, other) && pointInsideRect(main.bottomRight, other);
}

function rectInsideCircle(main: Rect, other: Circle) {
	// Extract useful values
	const rectLeft = main.topLeft.x;
	const rectRight = main.bottomRight.x;
	const rectTop = main.topLeft.y;
	const rectBottom = main.bottomRight.y;

	const circleLeft = other.center.x - other.radius;
	const circleRight = other.center.x + other.radius;
	const circleTop = other.center.y - other.radius;
	const circleBottom = other.center.y + other.radius;

	// Short circuit common failures
	if (rectLeft < circleLeft) {
		return false;
	} else if (rectRight > circleRight) {
		return false;
	} else if (rectTop < circleTop) {
		return false;
	} else if (rectBottom > circleBottom) {
		return false;
	}

	// Verify each corner. Probably we could figure out another short-circuiting step in here but meh.
	if (!pointInsideCircle(Point(rectLeft, rectTop), other)) {
		return false;
	} else if (!pointInsideCircle(Point(rectRight, rectTop), other)) {
		return false;
	} else if (!pointInsideCircle(Point(rectLeft, rectBottom), other)) {
		return false;
	} else if (!pointInsideCircle(Point(rectRight, rectBottom), other)) {
		return false;
	}

	// Yay!
	return true;
}

// Not sure when this would be useful
function circleInsidePoint(main: Circle, other: Point) {
	if (main.radius > 0) {
		return false;
	}

	return equals(main.center, other);
}

function circleInsideRect(main: Circle, other: Rect): boolean {
	const interiorRectTopLeft = Point(other.topLeft.x+main.radius, other.topLeft.y+main.radius);
	const interiorRectBottomRight = Point(other.bottomRight.x-main.radius, other.bottomRight.y-main.radius);
	const interiorRect = Rect(interiorRectTopLeft, interiorRectBottomRight);

	return pointInsideRect(main.center, interiorRect);
}

function circleInsideCircle(main: Circle, other: Circle): boolean {
	const radiusDist = other.radius - main.radius;

	// Short-circuit
	if (radiusDist < 0) {
		return false;
	}

	// Get diffs
	const leftDist = main.center.x - other.center.x;
	const rightDist = other.center.x - main.center.x;
	const topDist = main.center.y - other.center.y;
	const bottomDist = other.center.y - main.center.y;

	// Make sure they are all less than the radius diff
	if (leftDist > radiusDist) {
		return false;
	} else if (rightDist > radiusDist) {
		return false;
	} else if (topDist > radiusDist) {
		return false;
	} else if (bottomDist > radiusDist) {
		return false;
	}

	// Yay!
	return true;
}

export function inside(main: Shape, other: Shape): boolean {
	if (isPoint(main)) {
		if (isPoint(other)) {
			return pointInsidePoint(main, other);
		} else if (isRect(other)) {
			return pointInsideRect(main, other);
		} else if (isCircle(other)) {
			return pointInsideCircle(main, other);
		}
	} else if (isRect(main)) {
		if (isPoint(other)) {
			return rectInsidePoint(main, other);
		} else if (isRect(other)) {
			return rectInsideRect(main, other);
		} else if (isCircle(other)) {
			return rectInsideCircle(main, other);
		}
	} else if (isCircle(main)) {
		if (isPoint(other)) {
			return circleInsidePoint(main, other);
		} else if (isRect(other)) {
			return circleInsideRect(main, other);
		} else if (isCircle(other)) {
			return circleInsideCircle(main, other);
		}
	}

	throw "Can never get here";
}
