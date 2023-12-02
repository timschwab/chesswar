import { ComparableDeferred } from "../../../common/data-structures/Deferred.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { ZeroRect } from "../../../common/shapes/Zero.ts";
import { CWCanvas } from "../canvas/CWCanvas.ts";
import { createHtmlCanvas } from "../canvas/dom.ts";
import { CWDynamicLayer, CWDynamicLayerFrontend } from "./CWDynamicLayer.ts";
import { CWStaticLayer, CWStaticLayerFrontend } from "./CWStaticLayer.ts";

export class CWScene {
	private readonly cameraStore: ComparableDeferred<Rect>;
	private readonly layers: (CWStaticLayer | CWDynamicLayer)[];

	constructor() {
		this.layers = [];
		this.cameraStore = new ComparableDeferred(ZeroRect);
	}

	staticLayer(): CWStaticLayerFrontend {
		const htmlCanvas = createHtmlCanvas(0);
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
		const cameraDiff = this.cameraStore.get();

		if (cameraDiff.latest == ZeroRect) {
			return;
		}

		if (cameraDiff.dirty) {
			if (cameraDiff.latest.sameSize(cameraDiff.previous)) {
				// A normal delta
				this.renderCameraDelta(cameraDiff.previous, cameraDiff.latest);
			} else {
				// Screen resize, which means the canvas got erased
				this.renderFirst(cameraDiff.latest);
			}
		} else {
			this.renderStill(cameraDiff.latest);
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

	private renderCameraDelta(previous: Rect, latest: Rect): void {
		for (const layer of this.layers) {
			layer.renderCameraDelta(previous, latest);
		}
	}

	setCamera(newCamera: Rect) {
		this.cameraStore.set(newCamera.floor());
	}
}
