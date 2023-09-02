import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Shape } from "../../../common/shapes/Shape.ts";
import { CWCanvas } from "../canvas/CWCanvas.ts";

export class CWScene {
	private canvas: CWCanvas;
	private camera: Rect | null;
	private staticRects: Shape<Rect>[];

	constructor(canvas: CWCanvas) {
		this.canvas = canvas;
		this.camera = null;

		this.staticRects = [];
	}

	render(): void {
		this.canvas.clearAll();

		for (const rect of this.staticRects) {
			this.canvas.fillRect(rect.geo, rect.color);
		}
	}

	setCameraCenter(center: Point) {
		if (this.camera == null) {
			// Do nothing
		} else {
			this.camera = this.camera.moveTo(center);
		}
	}

	addStaticRect(toAdd: Shape<Rect>): void {
		this.staticRects.push(toAdd);
	}
}
