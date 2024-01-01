import { Comparable } from "../Comparable.ts";
import { GeometryName } from "./GeometryName.ts";
import { Point } from "./Point.ts";
import { Rect } from "./Rect.ts";
import { TriangleVertices } from "./Triangle.ts";

export interface SerializedGeometry {
	type: GeometryName;
}

export abstract class Geometry<T = void> extends Comparable<Geometry<T>> {
	// Add methods as needed
	abstract toTriangleVertices(): TriangleVertices[];
	abstract subtract(operand: Point): T;
	abstract clampInside(rect: Rect): T;
}
