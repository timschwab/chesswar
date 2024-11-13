import { Comparable } from "../Comparable.ts";
import { Circle } from "./Circle.ts";
import { GeometryName } from "./GeometryName.ts";
import { Point } from "./Point.ts";
import { Rect } from "./Rect.ts";
import { TriangleVertices } from "./Triangle.ts";

export interface SerializedGeometry {
	type: GeometryName;
}

export abstract class Geometry<T = void> extends Comparable<Geometry<T>> {
	// Add methods as needed
	abstract subtract(operand: Point): T;
	abstract reflectAcrossVertical(x: number): T;
	abstract clampInside(rect: Rect): T;
	abstract toTriangleVertices(): TriangleVertices[];
}

export type UnknownGeometry = Geometry<Point | Circle | Rect>;
