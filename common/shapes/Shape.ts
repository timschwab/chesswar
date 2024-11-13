import { Color } from "../Color.ts";
import { Geometry, UnknownGeometry } from "./Geometry.ts";
import { Point } from "./Point.ts";
import { Rect } from "./Rect.ts";
import { Structure } from "./Structure.ts";

interface RenderSettings {
	color: Color,
	clampToScreen: boolean
}

export class Shape<T extends Geometry<T>> {
	readonly geo: T
	readonly settings: RenderSettings

	static from<T extends Geometry<T>>(geo: T, color: Color, clampToScreen?: boolean): Shape<T> {
		const settings = {
			color,
			clampToScreen: clampToScreen == undefined ? false : clampToScreen
		};
		return new Shape(geo, settings);
	}

	constructor(geo: T, settings: RenderSettings) {
		this.geo = geo;
		this.settings = settings;
	}

	// Add methods as needed
	subtract(operand: Point): Shape<T> {
		return new Shape<T>(this.geo.subtract(operand), this.settings);
	}

	reflectAcrossVertical(x: number): Shape<T> {
		return new Shape<T>(this.geo.reflectAcrossVertical(x), this.settings);
	}

	clampInside(rect: Rect): Shape<T> {
		return new Shape<T>(this.geo.clampInside(rect), this.settings);
	}

	toStructure(): Structure {
		return new Structure(this.geo.toTriangles(), this.settings.color);
	}
}

export type UnknownShape = Shape<UnknownGeometry>;
