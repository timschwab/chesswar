import { Point } from "./Point.ts";
import { Triangle } from "./Triangle.ts";

export class Structure {
	readonly triangles: Triangle[];
	readonly center: Point;

	constructor(triangles: Triangle[], center: Point) {
		this.triangles = triangles;
		this.center = center;
	}

	structureArray(): number[] {
		const result = Array<number[]>(this.triangles.length*3).fill([this.center.x, this.center.y]).flat();
		return result;
	}

	verticesArray(): number[] {
		const result = this.triangles.flatMap(tri => tri.verticesArray());
		return result;
	}

	colorArray(): number[] {
		const result = this.triangles.flatMap(tri => tri.colorArray());
		return result;
	}
}
