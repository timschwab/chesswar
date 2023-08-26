import { Rect } from "../../common/shapes/Rect.ts";
import { CWCanvas } from "./canvas/CWCanvas.ts";

export class CWCamera {
	readonly can: CWCanvas;

	constructor(can: CWCanvas) {
		this.can = can;
	}

	addRect(toAdd: Rect) {
		//
	}
}
