import { Point } from "./Point.ts";
import { Triangle } from "./Triangle.ts";

export class Structure {
	readonly triangles: Triangle[];
	readonly center: Point;
	readonly scale: number;

	constructor(triangles: Triangle[], center: Point, scale?: number) {
		this.triangles = triangles;
		this.center = center;
		this.scale = scale || 1;
	}

	scaleArray(): number[] {
		const result = Array<number>(this.triangles.length*3).fill(this.scale);
		return result;
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
