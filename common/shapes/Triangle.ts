import { Color } from "../Color.ts";
import { Point } from "./Point.ts";

export type TriangleVerticesArray = [
	number, number,
	number, number,
	number, number
];

// Need one rgb per vertex
export type TriangleColorArray = [
	number, number, number,
	number, number, number,
	number, number, number
];

export class TriangleVertices {
	readonly v1: Point;
	readonly v2: Point;
	readonly v3: Point;

	constructor(v1: Point, v2: Point, v3: Point) {
		this.v1 = v1;
		this.v2 = v2;
		this.v3 = v3;
	}

	asArray(): TriangleVerticesArray {
		return [
			this.v1.x, this.v1.y,
			this.v2.x, this.v2.y,
			this.v3.x, this.v3.y
		];
	}
}

export class Triangle {
	readonly vertices: TriangleVertices;
	readonly color: Color;

	constructor(vertices: TriangleVertices, color: Color) {
		this.vertices = vertices;
		this.color = color;
	}

	verticesArray(): TriangleVerticesArray {
		return this.vertices.asArray();
	}

	colorArray(): TriangleColorArray {
		return [
			...this.color.asArray(),
			...this.color.asArray(),
			...this.color.asArray()
		]
	}
}
