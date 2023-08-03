import { ShapeName } from "./ShapeName.ts";

export interface SerializedShape {
	type: ShapeName;
}

export class Shape {
	readonly type: ShapeName;

	constructor(type: ShapeName) {
		this.type = type;
	}
}
