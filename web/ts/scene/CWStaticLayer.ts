import { Circle } from "../../../common/shapes/Circle.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Shape } from "../../../common/shapes/Shape.ts";
import { CWCanvas } from "../canvas/CWCanvas.ts";

export class CWStaticLayer {
	private readonly canvas: CWCanvas;
	readonly frontend: CWStaticLayerFrontend
	private readonly staticRects: Shape<Rect>[];
	private readonly staticCircles: Shape<Circle>[];

	constructor(canvas: CWCanvas) {
		this.canvas = canvas;
		this.frontend = new CWStaticLayerFrontend(this);
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

	renderStill(_camera: Rect): void {
		// Do nothing
	}

	renderCameraDelta(prev: Rect, next: Rect): void {
		for (const rect of this.staticRects) {
			this.renderRectDelta(prev, next, rect);
		}

		for (const circle of this.staticCircles) {
			this.renderCircleDelta(prev, next, circle)
		}
	}

	renderRectDelta(prevCamera: Rect, nextCamera: Rect, toRender: Shape<Rect>): void {
		const prevTransposed = toRender.geo.subtract(prevCamera.leftTop);
		const nextTransposed = toRender.geo.subtract(nextCamera.leftTop);
		const overlap = prevTransposed.overlap(nextTransposed);

		overlap.first.left && this.canvas.clearRect(overlap.first.left);
		overlap.first.right && this.canvas.clearRect(overlap.first.right);
		overlap.first.top && this.canvas.clearRect(overlap.first.top);
		overlap.first.bottom && this.canvas.clearRect(overlap.first.bottom);

		overlap.second.left && this.canvas.fillRect({geo: overlap.second.left, color: toRender.color});
		overlap.second.right && this.canvas.fillRect({geo: overlap.second.right, color: toRender.color});
		overlap.second.top && this.canvas.fillRect({geo: overlap.second.top, color: toRender.color});
		overlap.second.bottom && this.canvas.fillRect({geo: overlap.second.bottom, color: toRender.color});
	}

	// Not sure how to optimize this
	renderCircleDelta(prevCamera: Rect, nextCamera: Rect, toRender: Shape<Circle>): void {
		const prevTransposed = toRender.geo.subtract(prevCamera.leftTop);
		const nextTransposed = toRender.geo.subtract(nextCamera.leftTop);

		this.canvas.clearRect(prevTransposed.enclosingRect());
		this.canvas.fillCircle({geo: nextTransposed, color: toRender.color});
	}

	addRect(toAdd: Shape<Rect>): void {
		this.staticRects.push(toAdd);
	}

	addCircle(toAdd: Shape<Circle>): void {
		this.staticCircles.push(toAdd);
	}
}

// Make only some methods accessible to the user
export class CWStaticLayerFrontend {
	private readonly backend: CWStaticLayer;

	constructor(backend: CWStaticLayer) {
		this.backend = backend;
	}

	addRect(toAdd: Shape<Rect>): void {
		this.backend.addRect(toAdd);
	}

	addCircle(toAdd: Shape<Circle>): void {
		this.backend.addCircle(toAdd);
	}
}
