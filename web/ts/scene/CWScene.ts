import { Deferred } from "../../../common/data-structures/Deferred.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { CWCanvas } from "../canvas/CWCanvas.ts";
import { CWStaticLayer, CWStaticLayerFrontend } from "./CWStaticLayer.ts";

export class CWScene {
	private readonly cameraStore: Deferred<Rect | null>;
	private readonly layers: CWStaticLayer[];
	private readonly sceneRoot: HTMLDivElement;

	constructor(sceneRoot: HTMLDivElement) {
		this.sceneRoot = sceneRoot;
		this.layers = [];
		this.cameraStore = new Deferred(null);
	}

	staticLayer(): CWStaticLayerFrontend {
		const htmlCanvas = document.createElement("canvas");
		this.sceneRoot.appendChild(htmlCanvas);

		const cwCanvas = new CWCanvas(htmlCanvas);
		const newLayer = new CWStaticLayer(cwCanvas);
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
			} else {
				if (cameraMove.current.sameSize(cameraMove.pending)) {
					// A normal delta
					this.renderDelta(cameraMove.current, cameraMove.pending);
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

	private renderDelta(prev: Rect, next: Rect): void {
		for (const layer of this.layers) {
			layer.renderDelta(prev, next);
		}
	}

	setCamera(newCamera: Rect) {
		this.cameraStore.set(newCamera.floor());
	}
}
