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
		if (this.camera == null) {
			return;
		}

		this.canvas.clearAll();

		for (const rect of this.staticRects) {
			this.canvas.fillRect({geo: rect.geo.subtract(this.camera.leftTop), color: rect.color});
		}
	}

	setCamera(camera: Rect) {
		this.camera = camera;
	}

	addStaticRect(toAdd: Shape<Rect>): void {
		this.staticRects.push(toAdd);
	}
}
