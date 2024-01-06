import { Point } from "../../../common/shapes/Point.ts";
import { TriangleVertices, TriangleVerticesArray } from "../../../common/shapes/Triangle.ts";

const letterMap = new Map<string, TriangleVertices[]>();
const unknownMapping: TriangleVertices[] = [];

const mappings: Record<string, TriangleVerticesArray[]> = {
	"A": [
		[0.5,   0, 0.1,   1, 0.25,   1],
		[0.5,   0, 0.9,   1, 0.75,   1],
		[0.5, 0.4, 0.3, 0.5,  0.7, 0.5]
	],
	"B": [
		[0.3,   0, 0.3,   1, 0.4, 0.5],
		[0.3, 0.6, 0.7, 0.3, 0.7, 0.2],
		[0.3,   0, 0.7, 0.3, 0.7, 0.2],
		[0.3, 0.4, 0.7, 0.7, 0.7, 0.8],
		[0.3,   1, 0.7, 0.7, 0.7, 0.8]
	],
	"C": [
		[0.3, 0, 0.8, 0.1, 0.8, 0.2],
		[0.2, 0.6, 0.3, 0, 0.4, 0],
		[0.2, 0.4, 0.3, 1, 0.4, 1],
		[0.3, 1, 0.8, 0.9, 0.8, 0.8]
	]
};

const entries = Object.entries(mappings);
const vertices = entries.map(entry => {
	const letter = entry[0];
	const vertexArrays = entry[1];
	const vertices = vertexArrays.map(arr => new TriangleVertices(
		new Point(arr[0], arr[1]),
		new Point(arr[2], arr[3]),
		new Point(arr[4], arr[5])
	));
	return [letter, vertices] as [string, TriangleVertices[]];
});
vertices.forEach(vert => letterMap.set(vert[0], vert[1]));

export function renderOneLetter(letter: string): TriangleVertices[] {
	const vertices = letterMap.get(letter);
	if (vertices) {
		return vertices;
	} else {
		return unknownMapping;
	}
}