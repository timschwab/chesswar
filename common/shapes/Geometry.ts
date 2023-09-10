import { GeometryName } from "./GeometryName.ts";

export interface SerializedGeometry {
	type: GeometryName;
}

export abstract class Geometry {}
