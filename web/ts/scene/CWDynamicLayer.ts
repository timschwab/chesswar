import { Deferred } from "../../../common/data-structures/Deferred.ts";
import { Circle } from "../../../common/shapes/Circle.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Shape } from "../../../common/shapes/Shape.ts";
import { Text } from "../../../common/shapes/Text.ts";
import { CWCanvas } from "../canvas/CWCanvas.ts";

interface ShapeList {
	circles: Shape<Circle>[],
	texts: Text[]
}

export class CWDynamicLayer {
	private readonly canvas: CWCanvas;
	readonly frontend: CWDynamicLayerFrontend
	private readonly shapes: Deferred<ShapeList>;

	constructor(canvas: CWCanvas) {
		this.canvas = canvas;
		this.frontend = new CWDynamicLayerFrontend(this);
		this.shapes = new Deferred({
			circles: [],
			texts: []
		});
	}

	setShapes(shapes: ShapeList): void {
		this.shapes.set(shapes);
	}

	renderFirst(camera: Rect): void {
		this.canvas.setSize(camera);
		this.canvas.clearAll();

		const shapesDelta = this.shapes.get();
		const shapes = shapesDelta.latest; // This is the first draw, so we don't care about previous

		for (const circle of shapes.circles) {
			const transposed = circle.subtract(camera.leftTop);
			this.canvas.fillCircle(transposed);
		}

		for (const text of shapes.texts) {
			const transposed = text.subtract(camera.leftTop);
			this.canvas.text(transposed);
		}
	}

	renderStill(camera: Rect): void {
		const shapesDelta = this.shapes.get();

		if (!shapesDelta.dirty) {
			// Do nothing
			return
		}

		this.renderInternal(camera, camera, shapesDelta.previous, shapesDelta.previous);
	}

	renderCameraDelta(previousCamera: Rect, latestCamera: Rect): void {
		const shapesDelta = this.shapes.get();

		// If there are no pending changes, previous and latest shapes will be equal.
		// This is okay because camera has still changed.

		this.renderInternal(previousCamera, latestCamera, shapesDelta.previous, shapesDelta.previous);
	}

	renderInternal(previousCamera: Rect, latestCamera: Rect, previousShapes: ShapeList, latestShapes: ShapeList) {
		// Just redraw every time. Probably a slightly better way, but not worth it until it is needed.

		// Clear the old shapes
		for (const circle of previousShapes.circles) {
			const transposed = circle.subtract(previousCamera.leftTop);
			this.canvas.clearRect(transposed.geo.enclosingRect().expand(1));
		}

		for (const text of previousShapes.texts) {
			const transposed = text.subtract(previousCamera.leftTop);
			this.canvas.clearRect(transposed.geo);
		}

		// Fill new shapes
		for (const circle of latestShapes.circles) {
			const transposed = circle.subtract(latestCamera.leftTop);
			this.canvas.fillCircle(transposed);
		}

		for (const text of latestShapes.texts) {
			const transposed = text.subtract(latestCamera.leftTop);
			this.canvas.text(transposed);
		}
	}
}

// Make only some methods accessible to the user
export class CWDynamicLayerFrontend {
	private readonly backend: CWDynamicLayer;

	constructor(backend: CWDynamicLayer) {
		this.backend = backend;
	}

	setShapes(shapes: ShapeList): void {
		this.backend.setShapes(shapes);
	}
}
