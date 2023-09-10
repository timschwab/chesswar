import { GeometryName } from "./GeometryName.ts";
import { Point } from "./Point.ts";

export interface SerializedGeometry {
	type: GeometryName;
}

export abstract class Geometry<T = void> {
	abstract subtract(operand: Point): T;
}
