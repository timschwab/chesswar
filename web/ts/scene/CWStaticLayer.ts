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
		// Clear prev circles. Not sure how to optimize circles better.
		for (const circle of this.staticCircles) {
			const prevTransposed = circle.subtract(prev.leftTop);
			this.canvas.clearRect(prevTransposed.geo.enclosingRect());
		}

		// Compute rect overlaps
		const overlaps = this.staticRects.map(rect => {
			const prevTransposed = rect.geo.subtract(prev.leftTop);
			const nextTransposed = rect.geo.subtract(next.leftTop);
			const overlap = prevTransposed.overlap(nextTransposed);
			return {
				color: rect.color,
				overlap
			};
		});

		// Clear prev overlaps
		for (const overlap of overlaps) {
			overlap.overlap.first.left && this.canvas.clearRect(overlap.overlap.first.left);
			overlap.overlap.first.right && this.canvas.clearRect(overlap.overlap.first.right);
			overlap.overlap.first.top && this.canvas.clearRect(overlap.overlap.first.top);
			overlap.overlap.first.bottom && this.canvas.clearRect(overlap.overlap.first.bottom);
		}

		// Draw next overlaps
		for (const overlap of overlaps) {
			overlap.overlap.second.left && this.canvas.fillRect(new Shape(overlap.overlap.second.left, overlap.color));
			overlap.overlap.second.right && this.canvas.fillRect(new Shape(overlap.overlap.second.right, overlap.color));
			overlap.overlap.second.top && this.canvas.fillRect(new Shape(overlap.overlap.second.top, overlap.color));
			overlap.overlap.second.bottom && this.canvas.fillRect(new Shape(overlap.overlap.second.bottom, overlap.color));
		}

		// Draw next circles
		for (const circle of this.staticCircles) {
			const nextTransposed = circle.subtract(next.leftTop);
			this.canvas.fillCircle(nextTransposed);
		}
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
