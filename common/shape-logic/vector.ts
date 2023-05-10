import { Point, Vector } from "../data-types/shapes.ts";
import { transposePoint } from "./transpose.ts";

export const TAU = Math.PI*2;
export const TAU_HALF = TAU/2;
export const TAU_EIGHTH = TAU/8;

export function vectorToPoint(vector: Vector): Point {
	const x = Math.cos(vector.dir)*vector.mag;
	const y = Math.sin(vector.dir)*vector.mag;
	return Point(x, y);
}

export function pointToVector(point: Point): Vector {
	const mag = Math.sqrt(point.x*point.x + point.y*point.y);
	const dir = Math.atan2(point.y, point.x);
	return Vector(mag, dir);
}

export function add(vector1: Vector, vector2: Vector): Vector {
	const point1 = vectorToPoint(vector1);
	const point2 = vectorToPoint(vector2);
	const resultant = transposePoint(point1, point2);

	return pointToVector(resultant);
}

export function multiply(vector: Vector, scalar: number): Vector {
	return Vector(vector.mag*scalar, vector.dir);
}
