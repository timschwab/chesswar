import { GeometryName } from "./GeometryName.ts";

export interface SerializedGeometry {
	type: GeometryName;
}

export class Geometry {
	readonly type: GeometryName;

	constructor(type: GeometryName) {
		this.type = type;
	}
}
