import { Deferred } from "../../../common/data-structures/Deferred.ts";
import { Circle } from "../../../common/shapes/Circle.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Shape } from "../../../common/shapes/Shape.ts";
import { CWCanvas } from "../canvas/CWCanvas.ts";

export class CWDynamicLayer {
	private readonly canvas: CWCanvas;
	readonly frontend: CWDynamicLayerFrontend
	private readonly shapes: Deferred<Shape<Circle>[]>;

	constructor(canvas: CWCanvas) {
		this.canvas = canvas;
		this.frontend = new CWDynamicLayerFrontend(this);
		this.shapes = new Deferred([]);
	}

	// For now only support circles, cause that's all we need
	setShapes(shapes: Shape<Circle>[]): void {
		this.shapes.set(shapes);
	}

	renderFirst(camera: Rect): void {
		this.canvas.setSize(camera);
		this.canvas.clearAll();

		const shapesDelta = this.shapes.get();
		const shapes = shapesDelta.latest; // This is the first draw, so we don't care about previous

		for (const shape of shapes) {
			const transposed = shape.subtract(camera.leftTop);
			this.canvas.fillCircle(transposed);
		}
	}

	// Just redraw every time. Probably a slightly better way, but not worth it.
	renderStill(camera: Rect): void {
		const shapesDelta = this.shapes.get();

		if (!shapesDelta.dirty) {
			// Do nothing
			return
		}

		// Clear the old shapes
		for (const shape of shapesDelta.previous) {
			const transposed = shape.subtract(camera.leftTop);
			this.canvas.clearRect(transposed.geo.enclosingRect().expand(1));
		}

		// Draw the new shapes
		for (const shape of shapesDelta.latest) {
			const transposed = shape.subtract(camera.leftTop);
			this.canvas.fillCircle(transposed);
		}
	}

	// Just redraw every time. Probably a slightly better way, but not worth it.
	renderCameraDelta(previousCamera: Rect, latestCamera: Rect): void {
		const shapesDelta = this.shapes.get();

		// If there are no pending changes, previous and latest will be equal. This is fine.

		// Clear old shapes
		for (const shape of shapesDelta.previous) {
			const transposed = shape.subtract(previousCamera.leftTop);
			this.canvas.clearRect(transposed.geo.enclosingRect().expand(1));
		}

		// Fill new shapes
		for (const shape of shapesDelta.latest) {
			const transposed = shape.subtract(latestCamera.leftTop);
			this.canvas.fillCircle(transposed);
		}
	}
}

// Make only some methods accessible to the user
export class CWDynamicLayerFrontend {
	private readonly backend: CWDynamicLayer;

	constructor(backend: CWDynamicLayer) {
		this.backend = backend;
	}

	setShapes(shapes: Shape<Circle>[]): void {
		this.backend.setShapes(shapes);
	}
}
