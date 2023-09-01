import { Rect } from "../../../common/shapes/Rect.ts";
import { CWCanvas } from "../canvas/CWCanvas.ts";

export class CWScene {
	private canvas: CWCanvas;
	private camera: Rect;

	constructor(canvas: CWCanvas, camera: Rect) {
		this.canvas = canvas;
		this.camera = camera;
	}

	setCamera(newCamera: Rect): void {
		this.camera = newCamera;
	}

	render(): void {
		//
	}

	addStaticRect(toAdd: Rect) {
		//
	}
}
