import { Circle } from "../../../common/shapes/Circle.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Shape } from "../../../common/shapes/Shape.ts";
import { CWCanvas } from "../canvas/CWCanvas.ts";

export class CWDynamicLayer {
	private readonly canvas: CWCanvas;
	readonly frontend: CWDynamicLayerFrontend
	private readonly dynamicCircles: Shape<Circle>[];

	constructor(canvas: CWCanvas) {
		this.canvas = canvas;
		this.frontend = new CWDynamicLayerFrontend(this);
		this.dynamicCircles = [];
	}

	renderFirst(camera: Rect): void {
		this.canvas.setSize(camera);
		this.canvas.clearAll();

		for (const circle of this.dynamicCircles) {
			const transposed = circle.geo.subtract(camera.leftTop);
			this.canvas.fillCircle({geo: transposed, color: circle.color});
		}
	}

	renderStill(camera: Rect): void {
		// Do some stuff
	}

	renderCameraDelta(prev: Rect, next: Rect): void {
		for (const circle of this.dynamicCircles) {
			this.renderCircleDelta(prev, next, circle)
		}
	}

	// Not sure how to optimize this
	renderCircleDelta(prevCamera: Rect, nextCamera: Rect, toRender: Shape<Circle>): void {
		const prevTransposed = toRender.geo.subtract(prevCamera.leftTop);
		const nextTransposed = toRender.geo.subtract(nextCamera.leftTop);

		this.canvas.clearRect(prevTransposed.enclosingRect());
		this.canvas.fillCircle({geo: nextTransposed, color: toRender.color});
	}

	addCircle(toAdd: Shape<Circle>): void {
		this.dynamicCircles.push(toAdd);
	}
}

// Make only some methods accessible to the user
export class CWDynamicLayerFrontend {
	private readonly backend: CWDynamicLayer;

	constructor(backend: CWDynamicLayer) {
		this.backend = backend;
	}

	addCircle(toAdd: Shape<Circle>): void {
		this.backend.addCircle(toAdd);
	}
}
