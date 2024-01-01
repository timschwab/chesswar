import { Color } from "../Color.ts";
import { Point } from "./Point.ts";
import { Rect } from "./Rect.ts";
import { Shape } from "./Shape.ts";

export enum TextAlign {
	LEFT = "left",
	CENTER = "center",
	RIGHT = "right"
}

export class Text extends Shape<Rect> {
	readonly message: string;
	readonly align: TextAlign;
	readonly font: string;

	constructor(position: Rect, message: string, align: TextAlign, font: string, color: Color) {
		super(position, {color, clampToScreen: false});
		this.message = message;
		this.align = align;
		this.font = font;
	}

	subtract(operand: Point): Text {
		return new Text(this.geo.subtract(operand), this.message, this.align, this.font, this.settings.color);
	}
}