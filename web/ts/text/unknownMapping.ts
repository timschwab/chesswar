import { Point } from "../../../common/shapes/Point.ts";
import { TriangleVertices, TriangleVerticesArray } from "../../../common/shapes/Triangle.ts";

export const mapping: TriangleVerticesArray[] = [
	[0.2, 0.1, 0.8, 0.9, 0.2, 0.9],
	[0.2, 0.1, 0.8, 0.9, 0.8, 0.1]
];

export const unknownMapping = mapping.map(arr => new TriangleVertices(
	new Point(arr[0], arr[1]),
	new Point(arr[2], arr[3]),
	new Point(arr[4], arr[5])
));
