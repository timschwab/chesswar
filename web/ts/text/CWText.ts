import { Color } from "../../../common/Color.ts";
import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Structure } from "../../../common/shapes/Structure.ts";
import { Triangle } from "../../../common/shapes/Triangle.ts";
import { renderOneLetter } from "./renderOneLetter.ts";

export enum CWTextAlign {
	LEFT = "left",
	CENTER = "center",
	RIGHT = "right"
}

export class CWText {
	readonly box: Rect;
	readonly size: number;
	readonly color: Color;
	readonly message: string;
	readonly align: CWTextAlign;

	constructor(box: Rect, size: number, color: Color, align: CWTextAlign, message: string) {
		this.box = box;
		this.size = size;
		this.color = color;
		this.message = message.toUpperCase();
		this.align = align;
	}

	toStructures(): Structure[] {
		const letters = Array.from(this.message);
		return letters.map(this.renderOneLetter, this);
	}

	private renderOneLetter(letter: string, index: number): Structure {
		const vertices = renderOneLetter(letter);
		const triangles = vertices.map(v => new Triangle(v, this.color));
		const offset = index*this.size;
		return new Structure(triangles, new Point(offset, 0), this.size);
	}
}
