import { Deferred } from "../../../common/data-structures/Deferred.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { CWCanvas } from "../canvas/CWCanvas.ts";
import { createHtmlCanvas } from "../canvas/dom.ts";
import { CWDynamicLayer, CWDynamicLayerFrontend } from "./CWDynamicLayer.ts";
import { CWStaticLayer, CWStaticLayerFrontend } from "./CWStaticLayer.ts";

export class CWScene {
	private readonly cameraStore: Deferred<Rect | null>;
	private readonly layers: (CWStaticLayer | CWDynamicLayer)[];

	constructor() {
		this.layers = [];
		this.cameraStore = new Deferred(null);
	}

	staticLayer(): CWStaticLayerFrontend {
		const htmlCanvas = createHtmlCanvas();
		const cwCanvas = new CWCanvas(htmlCanvas);
		const newLayer = new CWStaticLayer(cwCanvas);
		this.layers.push(newLayer);

		return newLayer.frontend;
	}

	dynamicLayer(): CWDynamicLayerFrontend {
		const htmlCanvas = createHtmlCanvas();
		const cwCanvas = new CWCanvas(htmlCanvas);
		const newLayer = new CWDynamicLayer(cwCanvas);
		this.layers.push(newLayer);

		return newLayer.frontend;
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
				this.renderStill(cameraMove.current);
			} else {
				if (cameraMove.current.sameSize(cameraMove.pending)) {
					// A normal delta
					this.renderCameraDelta(cameraMove.current, cameraMove.pending);
				} else {
					// Screen resize, which means the canvas got erased
					this.renderFirst(cameraMove.pending);
				}
			}
		}
	}

	private renderFirst(camera: Rect): void {
		for (const layer of this.layers) {
			layer.renderFirst(camera);
		}
	}

	private renderStill(camera: Rect): void {
		for (const layer of this.layers) {
			layer.renderStill(camera);
		}
	}

	private renderCameraDelta(prev: Rect, next: Rect): void {
		for (const layer of this.layers) {
			layer.renderCameraDelta(prev, next);
		}
	}

	setCamera(newCamera: Rect) {
		this.cameraStore.set(newCamera.floor());
	}
}
