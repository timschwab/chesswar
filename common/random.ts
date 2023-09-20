import { Point } from "./shapes/Point.ts";

export function randomChoose<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

export function randomRange(lower: number, upper: number): number {
	const range = upper-lower;
	return (Math.random()*range) + lower;
}

export function randomClump(center: number, maxDiff: number): number {
	const lower = center-maxDiff;
	const upper = center+maxDiff;
	return randomRange(lower, upper);
}

export function randomPointClump(center: Point, maxDiff: number): Point {
	const newX = randomClump(center.x, maxDiff);
	const newY = randomClump(center.y, maxDiff);
	return new Point(newX, newY);
}
