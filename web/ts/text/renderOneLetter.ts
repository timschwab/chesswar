import { Point } from "../../../common/shapes/Point.ts";
import { TriangleVertices } from "../../../common/shapes/Triangle.ts";

const mappings = new Map<string, TriangleVertices[]>();
const unknownMapping: TriangleVertices[] = [];

mappings.set("A", [
	new TriangleVertices(
		new Point(0, 0),
		new Point(1, 0),
		new Point(0, 1)
	)
]);

export function renderOneLetter(letter: string): TriangleVertices[] {
	const vertices = mappings.get(letter);
	if (vertices) {
		return vertices;
	} else {
		return unknownMapping;
	}
}