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

	addRect(toAdd: Shape<Rect>): void {
		this.staticRects.push(toAdd);
	}

	addCircle(toAdd: Shape<Circle>): void {
		this.staticCircles.push(toAdd);
	}

	renderFirst(camera: Rect): void {
		this.canvas.setSize(camera);
		this.canvas.clearAll();

		for (const rect of this.staticRects) {
			const transposed = rect.subtract(camera.leftTop);
			this.canvas.fillRect(transposed);
		}

		for (const circle of this.staticCircles) {
			const transposed = circle.subtract(camera.leftTop);
			this.canvas.fillCircle(transposed);
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

		overlap.second.left && this.canvas.fillRect(new Shape(overlap.second.left, toRender.color));
		overlap.second.right && this.canvas.fillRect(new Shape(overlap.second.right, toRender.color));
		overlap.second.top && this.canvas.fillRect(new Shape(overlap.second.top, toRender.color));
		overlap.second.bottom && this.canvas.fillRect(new Shape(overlap.second.bottom, toRender.color));
	}

	// Not sure how to optimize this
	renderCircleDelta(prevCamera: Rect, nextCamera: Rect, toRender: Shape<Circle>): void {
		const prevTransposed = toRender.subtract(prevCamera.leftTop);
		const nextTransposed = toRender.subtract(nextCamera.leftTop);

		this.canvas.clearRect(prevTransposed.geo.enclosingRect());
		this.canvas.fillCircle(nextTransposed);
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
