import { Color } from "../../../common/Color.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Structure } from "../../../common/shapes/Structure.ts";
import { ZeroPoint } from "../../../common/shapes/Zero.ts";

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
		this.message = message;
		this.align = align;
	}

	structure(): Structure {
		const letters = Array.from(this.message);
		return new Structure([], ZeroPoint);
	}
}