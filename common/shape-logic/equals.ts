import { Circle, Point, Rect, Shape } from "../data-types/shapes.ts";
import { isCircle, isPoint, isRect } from "./is.ts";

function pointEqualsPoint(main: Point, other: Point): boolean {
	if (main.x != other.y) {
		return false;
	} else if (main.y != other.y) {
		return false;
	}

	return true;
}

function rectEqualsRect(main: Rect, other: Rect): boolean {
	if (!pointEqualsPoint(main.topLeft, other.topLeft)) {
		return false;
	} else if (!pointEqualsPoint(main.bottomRight, other.bottomRight)) {
		return false;
	}

	return true;
}

function circleEqualsCircle(main: Circle, other: Circle): boolean {
	if (!pointEqualsPoint(main.center, other.center)) {
		return false;
	} else if (main.radius != other.radius) {
		return false;
	}

	return true;
}

function equals<T extends Shape>(main: T, other: T): boolean {
	if (isPoint(main) && isPoint(other)) {
		return pointEqualsPoint(main, other);
	} else if (isRect(main) && isRect(other)) {
		return rectEqualsRect(main, other);
	} else if (isCircle(main) && isCircle(other)) {
		return circleEqualsCircle(main, other);
	} else {
		throw "Can never get here";
	}
}

export default equals;
