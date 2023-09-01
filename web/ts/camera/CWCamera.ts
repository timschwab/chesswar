import { Point } from "../../../common/shapes/Point.ts";
import { Rect } from "../../../common/shapes/Rect.ts";
import { CWCanvas } from "../canvas/CWCanvas.ts";

export class CWCamera {
	private canvas: CWCanvas;
	private screen: Rect | null;
	private boxCenter: Point | null;

	constructor(canvas: CWCanvas) {
		this.canvas = canvas;
		this.screen = null;
		this.boxCenter = null;
	}

	setScreen(newScreen: Rect): void {
		this.screen = newScreen;
	}

	setBoxCenter(center: Point): void {
		this.boxCenter = center;
	}

	// What the camera is looking at right now
	private box(): Rect {
		const cameraTL = center.subtract(this.screen.center).floor();
		const cameraRect = new Rect(cameraTL, cameraTL.add(state.screen.rightBottom));
		return cameraRect;
	}

	render(): void {
		//
	}

	addStaticRect(toAdd: Rect) {
		//
	}
}
