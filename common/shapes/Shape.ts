import { Color } from "../colors.ts";
import { Geometry } from "./Geometry.ts";
import { Point } from "./Point.ts";
import { Rect } from "./Rect.ts";

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

	clampInside(rect: Rect): Shape<T> {
		return new Shape<T>(this.geo.clampInside(rect), this.settings);
	}
}
