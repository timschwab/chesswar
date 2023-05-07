import { Circle, Point, Rect, Shape } from "../data-types/structures.ts";

export function isPoint(shape: Shape): shape is Point {
	if ("x" in shape && "y" in shape) {
		return true;
	}

	return false;
}

export function isRect(shape: Shape): shape is Rect {
	if ("topLeft" in shape && "bottomRight" in shape) {
		return true;
	}

	return false;
}

export function isCircle(shape: Shape): shape is Circle {
	if ("center" in shape && "radius" in shape) {
		return true;
	}

	return false;
}
