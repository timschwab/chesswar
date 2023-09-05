import { Rect } from "../../../common/shapes/Rect.ts";
import { Shape } from "../../../common/shapes/Shape.ts";
import { CWCanvas } from "../canvas/CWCanvas.ts";

export class CWLayer {
	private readonly canvas: CWCanvas;
	private readonly staticRects: Shape<Rect>[];
	readonly frontend: CWLayerFrontend

	constructor(canvas: CWCanvas) {
		this.canvas = canvas;
		this.staticRects = [];
		this.frontend = new CWLayerFrontend(this);
	}

	renderFirst(camera: Rect): void {
		this.canvas.setSize(camera);
		this.canvas.clearAll();

		for (const rect of this.staticRects) {
			const transposed = rect.geo.subtract(camera.leftTop);
			this.canvas.fillRect({geo: transposed, color: rect.color});
		}
	}

	renderDelta(prev: Rect, next: Rect): void {
		for (const rect of this.staticRects) {
			const prevTransposed = rect.geo.subtract(prev.leftTop);
			const nextTransposed = rect.geo.subtract(next.leftTop);
			const overlap = prevTransposed.overlap(nextTransposed);

			overlap.first.left && this.canvas.clearRect(overlap.first.left);
			overlap.first.right && this.canvas.clearRect(overlap.first.right);
			overlap.first.top && this.canvas.clearRect(overlap.first.top);
			overlap.first.bottom && this.canvas.clearRect(overlap.first.bottom);

			overlap.second.left && this.canvas.fillRect({geo: overlap.second.left, color: rect.color});
			overlap.second.right && this.canvas.fillRect({geo: overlap.second.right, color: rect.color});
			overlap.second.top && this.canvas.fillRect({geo: overlap.second.top, color: rect.color});
			overlap.second.bottom && this.canvas.fillRect({geo: overlap.second.bottom, color: rect.color});
		}
	}

	addStaticRect(toAdd: Shape<Rect>): void {
		this.staticRects.push(toAdd);
	}
}

// Make only some methods accessible to the user
export class CWLayerFrontend {
	private readonly backend: CWLayer;

	constructor(backend: CWLayer) {
		this.backend = backend;
	}

	addStaticRect(toAdd: Shape<Rect>): void {
		this.backend.addStaticRect(toAdd);
	}
}
