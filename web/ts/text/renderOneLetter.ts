import { Point } from "../../../common/shapes/Point.ts";
import { TriangleVertices, TriangleVerticesArray } from "../../../common/shapes/Triangle.ts";
import { letterMappingsLowercase } from "./letterMappingsLowercase.ts";
import { letterMappingsUppercase } from "./letterMappingsUppercase.ts";
import { numberMappings } from "./numberMappings.ts";
import { symbolMappings } from "./symbolMappings.ts";
import { unknownMapping } from "./unknownMapping.ts";

const letterMap = new Map<string, TriangleVertices[]>();
loadMappings(letterMappingsLowercase);
loadMappings(letterMappingsUppercase);
loadMappings(numberMappings);
loadMappings(symbolMappings);


function loadMappings(mappings: Record<string, TriangleVerticesArray[]>) {
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
}

export function renderOneLetter(letter: string): TriangleVertices[] {
	const vertices = letterMap.get(letter);
	if (vertices) {
		return vertices;
	} else {
		return unknownMapping;
	}
}