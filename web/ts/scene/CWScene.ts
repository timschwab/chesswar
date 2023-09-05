import { Deferred } from "../../../common/data-structures/Deferred.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { Shape } from "../../../common/shapes/Shape.ts";
import { CWCanvas } from "../canvas/CWCanvas.ts";

export class CWScene {
	private canvas: CWCanvas;
	private cameraStore: Deferred<Rect | null>;
	private staticRects: Shape<Rect>[];

	constructor(canvas: CWCanvas) {
		this.canvas = canvas;
		this.cameraStore = new Deferred(null);

		this.staticRects = [];
	}

	render(): void {
		const cameraMove = this.cameraStore.get();

		if (cameraMove.current == null) {
			if (cameraMove.pending == null) {
				// No camera yet
			} else {
				// First render
				this.renderFirst(cameraMove.pending);
			}
		} else {
			if (cameraMove.pending == null) {
				// No camera changes
			} else {
				// A delta
			this.renderDelta(cameraMove.current, cameraMove.pending);
			}
		}
	}

	private renderFirst(camera: Rect): void {
		this.canvas.clearAll();

		for (const rect of this.staticRects) {
			const transposed = rect.geo.subtract(camera.leftTop);
			this.canvas.fillRect({geo: transposed, color: rect.color});
		}
	}

	private renderDelta(prev: Rect, next: Rect): void {
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

	setCamera(newCamera: Rect) {
		this.cameraStore.set(newCamera);
	}

	addStaticRect(toAdd: Shape<Rect>): void {
		this.staticRects.push(toAdd);
	}
}
