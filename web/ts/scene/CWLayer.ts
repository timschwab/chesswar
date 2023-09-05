import { Circle } from "../../../common/shapes/Circle.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Shape } from "../../../common/shapes/Shape.ts";
import { CWCanvas } from "../canvas/CWCanvas.ts";

export class CWLayer {
	private readonly canvas: CWCanvas;
	readonly frontend: CWLayerFrontend
	private readonly staticRects: Shape<Rect>[];
	private readonly staticCircles: Shape<Circle>[];

	constructor(canvas: CWCanvas) {
		this.canvas = canvas;
		this.frontend = new CWLayerFrontend(this);
		this.staticRects = [];
		this.staticCircles = [];
	}

	renderFirst(camera: Rect): void {
		this.canvas.setSize(camera);
		this.canvas.clearAll();

		for (const rect of this.staticRects) {
			const transposed = rect.geo.subtract(camera.leftTop);
			this.canvas.fillRect({geo: transposed, color: rect.color});
		}

		for (const circle of this.staticCircles) {
			const transposed = circle.geo.subtract(camera.leftTop);
			this.canvas.fillCircle({geo: transposed, color: circle.color});
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

		// Not sure how to optimize this
		for (const circle of this.staticCircles) {
			const prevTransposed = circle.geo.subtract(prev.leftTop);
			const nextTransposed = circle.geo.subtract(next.leftTop);

			this.canvas.clearRect(prevTransposed.enclosingRect());
			this.canvas.fillCircle({geo: nextTransposed, color: circle.color});
		}
	}

	addStaticRect(toAdd: Shape<Rect>): void {
		this.staticRects.push(toAdd);
	}

	addStaticCircle(toAdd: Shape<Circle>): void {
		this.staticCircles.push(toAdd);
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

	addStaticCircle(toAdd: Shape<Circle>): void {
		this.backend.addStaticCircle(toAdd);
	}
}
