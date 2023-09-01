import { Point } from "../../common/shapes/Point.ts";
import { Rect } from "../../common/shapes/Rect.ts";
import { ZeroPoint } from "../../common/shapes/Zero.ts";
import { camera } from "./camera/camera.ts";
import dom from "./canvas/dom.ts";
import state from "./state.ts";

export function initScreen() {
	setScreen();
	globalThis.addEventListener("resize", setScreen);
}

function setScreen() {
	// Get the window dimensions
	const width = globalThis.innerWidth;
	const height = globalThis.innerHeight;

	// Record them in the state
	const screenRect = new Rect(ZeroPoint, new Point(width, height));
	camera.setScreen(screenRect);
	state.screen = screenRect;

	// Set them in the dom
	for (const canvas of Object.values(dom)) {
		canvas.width = width;
		canvas.height = height;
	}
}
